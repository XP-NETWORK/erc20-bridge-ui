import { bridge } from "./bridge";
import { provider } from "../erc20/provider";
import { ethers } from "ethers";
import { ChainInfo } from "xpjs-erc20";
import { WXPNET__factory } from "web3-erc20-contracts-types";

import transactions from "./transactions";

const tw = transactions();

class ChainFabric {
  chains = {};
  bridge;

  init(bridge) {
    this.bridge = bridge;
    return this;
  }

  getChain(nonce) {
    if (!this.bridge) {
      throw new Error("Bridge is not implemented");
    }

    if (this.chains[nonce]) {
      return this.chains[nonce];
    }

    this.chains[nonce] = this.createChain(this.bridge)(nonce);
    return this.chains[nonce];
  }

  createChain = (bridge) => (nonce) => {
    switch (nonce) {
      case 2:
        return new BSC({ bridge, nonce: 2 });
      case 5:
        return new Algorand({ bridge, nonce: 5 });
      default: {
        throw new Error("Unsupported chain");
      }
    }
  };
}

class AbstractChain {
  constructor({ bridge, nonce }) {
    this.bridge = bridge;
    this.nonce = nonce;
  }

  async preTransfer() {
    throw new Error("uninplemented preTransfer");
  }

  async transfer() {
    throw new Error("uninplemented send");
  }

  async getBalance(account) {
    console.log(this.nonce);
    const res = await this.bridge.balance(this.nonce, account);
    const decimals = ChainInfo[this.nonce].decimals;
    return res.dividedBy(decimals).toString();
    //throw new Error("uninplemented getBalance");
  }

  async getTokens() {
    throw new Error("uninplemented getTokens");
  }

  async getFees() {
    throw new Error("uninplemented getFees");
  }
}

class BSC extends AbstractChain {
  constructor(params) {
    super(params);

    WXPNET__factory.connect();
  }

  async getTokens(address) {}

  async preTransfer() {
    //console.log("preTransfer1");
  }
}

class Algorand extends AbstractChain {
  constructor(params) {
    super(params);
  }
}

false &&
  (async () => {
    /* const cf = new ChainFabric();

    const chain = cf.init(bridge).getChain(5);

    const bal = await chain.getBalance(
      "NZQXP6BDGJ2HTLPNDRDJK74Z7UR26RKNYHOX3YQLBFEOTLIRK3HGRJ4TKU"
    );

    console.log(bal);*/

    const x = await tw.getEvmTrxData(
      "0xc08b84618b3b8ee7533aa4c996811525fd91da1cb44cd902027119dc1d656b12"
    );

    console.log(x);
  })();

export default () => new ChainFabric();

/**
 * 
 * 
 * {
    "blockNumber": 20918194,
    "blockHash": "0x7e45e9a7584f3fe152f5f4c7b013dceb0345e756eda4eac8a0cd4ab5656ef87a",
    "transactionIndex": 147,
    "removed": false,
    "address": "0x8cf8238abf7b933Bf8BB5Ea2C7E4Be101c11de2A",
    "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
    "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000091105e661c500e6651f04cf76787297e534b97a5",
        "0x00000000000000000000000047bf0dae6e92e49a3c95e5b0c71422891d5cd4fe"
    ],
    "transactionHash": "0x9f493a27004c1e1fe0c2015d481e6be90161e9d847e437f808b7aa4df61da250",
    "logIndex": 465
}
 */
