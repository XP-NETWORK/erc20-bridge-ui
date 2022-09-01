import { bridge } from "../bridge";
import { ChainInfo } from "xpjs-erc20";
import BigNumber from "bignumber.js";

class AbstractChain {
  tokenParams = {};
  signer = undefined;

  constructor({ bridge, nonce, signer }) {
    this.bridge = bridge;
    this.nonce = nonce;
    this.signer = signer;
  }

  async preTransfer(amount) {
    try {
      amount = new BigNumber(amount)
        .multipliedBy(ChainInfo[this.nonce].decimals)
        .integerValue();
      return await bridge.preTransfer(
        this.nonce,
        this.signer,
        ChainInfo[this.nonce].xpnetToken,
        amount
      );
    } catch (e) {
      console.log(e.message || e, "in preTransfer");
    }
  }

  async transfer(toChain, toAddress, amount, fees) {
    try {
      amount = new BigNumber(amount)
        .multipliedBy(ChainInfo[this.nonce].decimals)
        .integerValue();

      if (!fees) {
        fees = await this.getFees(toChain);
      }

      const tx = await bridge.transferTokens(
        this.nonce,
        this.signer,
        ChainInfo[this.nonce].xpnetToken,
        toChain,
        amount,
        toAddress,
        fees
      );

      return tx;
    } catch (e) {
      console.log(e.message || e, "in transfer");
      throw e;
    }
  }

  async getBalance(account) {
    console.log(this.nonce);
    try {
      const res = await this.bridge.balance(this.nonce, account);
      return res.dividedBy(ChainInfo[this.nonce].decimals).toNumber();
    } catch (e) {
      console.log(e.message || e, "error in getBalance");
    }
    //throw new Error("uninplemented getBalance");
  }

  async getTokens(account) {
    console.log(ChainInfo[this.nonce].xpnetToken);
    try {
      const res = await bridge.tokenBalance(
        this.nonce,
        ChainInfo[this.nonce].xpnetToken,
        account
      );

      return res.dividedBy(ChainInfo[this.nonce].decimals).toNumber();
    } catch (e) {
      console.log(e.message || e, "error in getTokens");
    }
    //throw new Error("uninplemented getTokens");
  }

  async getParams() {
    try {
      const tokenPrams = this.tokenParams[this.nonce];
      if (tokenPrams) return tokenPrams;
      const res = await bridge.tokenParams(
        this.nonce,
        ChainInfo[this.nonce].xpnetToken
      );
      this.tokenParams[this.nonce] = res;
      return res;
    } catch (e) {
      throw e;
    }
  }

  async getFees(toChain) {
    let fee = await bridge.estimateFees(
      this.nonce,
      ChainInfo[this.nonce].xpnetToken,
      toChain
    );

    return fee.dividedBy(ChainInfo[this.nonce].decimals).toNumber();
  }
}
export default AbstractChain;
