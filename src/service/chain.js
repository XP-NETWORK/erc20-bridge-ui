import { bridge } from "./bridge";

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
      case 4:
        return new BSC({ bridge });
      case 5:
        return new Algorand({ bridge });
      default: {
        throw new Error("Unsupported chain");
      }
    }
  };
}

class AbstractChain {
  constructor({ bridge }) {
    this.bridge = bridge;
  }

  async preTransfer() {
    throw new Error("uninplemented preTransfer");
  }

  async transfer() {
    throw new Error("uninplemented send");
  }

  async getBalance(nonce, account) {
    const res = await this.bridge.balance(nonce, account);

    return res.dividedBy(1e6).toString();
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
  }

  //async getBalance() {
  //console.log("getBalance");
  // }
  async preTransfer() {
    //console.log("preTransfer1");
  }
}

class Algorand extends AbstractChain {
  constructor(params) {
    super(params);
  }

  async getBalance() {
    //console.log("getBalance2");
  }
  //async preTransfer() {}
}

false &&
  (async () => {
    const cf = new ChainFabric();

    const chain = cf.init(bridge).getChain(2);

    const bal = await chain.getBalance(
      0x2,
      "0x47Bf0dae6e92e49a3c95e5b0c71422891D5cd4FE"
    );

    console.log(bal);
  })();

export default () => new ChainFabric();
