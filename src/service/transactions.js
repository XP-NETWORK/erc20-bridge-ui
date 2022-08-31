import axios from "axios";
import { ethers } from "ethers";
import { Bridge__factory } from "web3-erc20-contracts-types";
import BigNumber from "bignumber.js";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { APPLICATION_ID, BSC_NODE } from "../utils/consts";

import { provider } from "../erc20/provider";

const b64Decode = (raw) => Buffer.from(raw, "base64");

const bigIntFromBe = (buf) => new BigNumber(`0x${buf.toString("hex")}`, 16);

class TransactionWatcher {
  constructor() {
    if (!window.ethereum && window.innerWidth > 600) {
      alert("install MetaMask");
      return;
    }
    this.axios = axios.create();
    this.provider = new JsonRpcProvider(BSC_NODE);
  }

  decode = (log) => log && bigIntFromBe(b64Decode(log)).toNumber();

  unpair = (z) => {
    var sqrtz = Math.floor(Math.sqrt(z)),
      sqz = sqrtz * sqrtz;
    return z - sqz >= sqrtz ? [sqrtz, z - sqz - sqrtz] : [z - sqz, sqrtz];
  };

  async findAlgoTrx(hash) {
    let evmId;
    let errorCtn = 0;

    const search = async () => {
      const [actionId, data] = await Promise.all([
        (async () => {
          //if (evmId) return evmId;
          return await this.getEvmActionId(hash);
        })(),
        (async () => {
          const { data } = await this.axios(
            `https://indexer.algoexplorerapi.io/rl/v1/transactions?page=1&&limit=10&&application-id=${APPLICATION_ID}`
          ).catch((e) => {
            console.log(e);
            return { data: null };
          });
          return data;
        })(),
      ]);

      // if (actionId) evmId = actionId;

      if (data?.transactions?.length) {
        for (const trx of data.transactions) {
          const appTrx = trx["application-transaction"];
          if (appTrx) {
            const args = appTrx["application-args"];
            const actionCnt = this.decode(args[1]);
            if (actionCnt) {
              const candidate = this.unpair(actionCnt)[0];

              if (candidate === actionId) {
                return trx.id;
              }
            }
          }
        }
      }
    };

    return new Promise(async (resolve, reject) => {
      /*search()
        .then((tx) => {
          if (tx) {
          clearInterval(interval);
          return resolve(tx)
          }
        })
        .catch((e) => {
         // console.log(e, " on top in algo search");
        //reject("bilbo");
        });*/

      const interval = setInterval(() => {
        search()
          .then((tx) => {
            if (tx) {
              clearInterval(interval);
              return resolve(tx);
            }
          })
          .catch((e) => {
            console.log(e, " on top in algo search");
            if (errorCtn >= 6) {
              clearInterval(interval);
              return reject("error getting algoTx");
            }
            errorCtn++;
          });
      }, 6000);

      setTimeout(() => {
        clearInterval(interval);
        return reject("timeout");
      }, 10 * 60000);
    });
  }

  async getEvmActionId(hash) {
    if (!window.ethereum) return;

    const res = await this.provider.waitForTransaction(hash);

    const contract = Bridge__factory.connect(
      "0x91105e661C500e6651f04CF76787297e534b97a5",
      this.provider
    );

    let actionId;

    for (const log of res.logs) {
      if (log.address != "0x91105e661C500e6651f04CF76787297e534b97a5") continue;

      const parsed = contract.interface.parseLog(log);

      actionId = parsed?.args?.actionId;
    }
    console.log(actionId);
    return actionId && parseInt(actionId["_hex"], 16);
  }

  async getAlgoTrx(hash) {
    try {
      const { data } = await this.axios(
        `https://indexer.algoexplorerapi.io/v2/transactions/${hash}`
      );
      return data;
    } catch (e) {
      console.log("error getting algo trx");
      await new Promise((resolve) => setTimeout(() => resolve("1"), 4000));
      return await this.getAlgoTrx(hash);
    }
  }

  async findEvmTrx(hash, destinationAddress, interavalCb) {
    //let algoActionId
    // await new Promise((resolve) => setTimeout(() => resolve("1"), 5000));
    console.log("starting ", hash);
    console.log("to ", destinationAddress);

    let data;

    while (!data) {
      await new Promise((resolve) => setTimeout(() => resolve("1"), 5000));
      const res = await this.axios(
        `https://indexer.algoexplorerapi.io/v2/transactions/${hash}`
      ).catch(() => ({ data: null }));

      data = res.data;
    }

    console.log(data);

    //const data = await this.getAlgoTrx(hash);

    if (data.transaction) {
      const logs = data.transaction?.logs;

      if (logs) {
        const actionId = this.decode(logs[1]);

        if (actionId !== undefined) {
          console.log("actionI is ", actionId);
          const tx = await this.listenEvmUnfreeze(
            actionId,
            destinationAddress,
            interavalCb
          ).catch((e) => e);

          return tx;
        }
      }
    }
  }

  async getEvmTrxData(
    hash = "0x102a7237359a69bb542affc02a62da8efb46a4eafad826cc270b8666ddaaa7e6"
  ) {
    if (!window.ethereum && window.innerWidth > 600) return;

    const res = await provider.getTransaction(hash);

    const contract = Bridge__factory.connect(
      "0x91105e661C500e6651f04CF76787297e534b97a5",
      provider
    );

    const decoded = contract.interface.parseTransaction(res);

    const id = decoded.args?.actionId;

    const actionId = id && parseInt(id._hex);

    return actionId && this.unpair(actionId)[0];
  }

  listenEvmUnfreeze(depActionId, destinationAddress, interavalCb) {
    return new Promise(async (resolve, reject) => {
      const contract = Bridge__factory.connect(
        "0x91105e661C500e6651f04CF76787297e534b97a5",
        this.provider
      );

      const fna = async () => {
        const block = await this.provider.getBlockNumber();

        const logs = await this.provider.getLogs({
          address: "0x8cf8238abf7b933bf8bb5ea2c7e4be101c11de2a",
          toBlock: block,
          fromBlock: block - 20, //block - 100,
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x00000000000000000000000091105e661c500e6651f04cf76787297e534b97a5",
            `0x000000000000000000000000${destinationAddress.substr(2)}`,
          ],
        });

        console.log(depActionId, "depActionId");
        console.log(logs);
        if (logs.length) {
          for (const log of logs) {
            const actionId = await this.getEvmTrxData(log.transactionHash);
            console.log(actionId, "actionId");

            if (+actionId === +depActionId) {
              console.log("go here");
              return log.transactionHash;
            }
          }
        }
      };

      //const logs = await fna();
      const interval = setInterval(
        () =>
          fna().then((tx) => {
            console.log(tx, "tx");
            if (tx) {
              clearInterval(interval);
              return resolve(tx);
            }
          }),
        10000
      );
      interavalCb(interval);
      fna().then((tx) => {
        console.log(tx, "tx");
        if (tx) {
          clearInterval(interval);
          return resolve(tx);
        }
      });

      setTimeout(() => {
        clearInterval(interval);
        return reject("");
      }, 30 * 60000);
      //resolve(logs);
    });
  }
}

export default () => new TransactionWatcher();
