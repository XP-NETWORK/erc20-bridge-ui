import axios from "axios";
import { ethers } from "ethers";
import { Bridge__factory } from "web3-erc20-contracts-types";
import BigNumber from "bignumber.js";

import { APPLICATION_ID } from "../utils/consts";

const b64Decode = (raw) => Buffer.from(raw, "base64");

const bigIntFromBe = (buf) => new BigNumber(`0x${buf.toString("hex")}`, 16);

class TransactionWatcher {
  constructor() {
    this.axios = axios.create();
    this.axios.defaults.headers = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
  }

  decode = (log) => log && bigIntFromBe(b64Decode(log));

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
          if (evmId) return evmId;
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

      if (actionId) evmId = actionId;

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

      setTimeout(() => clearInterval(interval), 10 * 60000);
    });
  }

  async getEvmActionId(hash) {
    if (!window.ethereum) return;
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const res = await provider.waitForTransaction(hash);

    const contract = Bridge__factory.connect(
      "0x91105e661C500e6651f04CF76787297e534b97a5",
      provider
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
}

export default () => new TransactionWatcher();
