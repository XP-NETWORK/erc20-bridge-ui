import { ethers } from "ethers";
import { provider } from "../../erc20/provider";
import BigNumber from "bignumber.js";
import { ChainInfo } from "xpjs-erc20";
import AbstractChain from "./chain";

class EVM extends AbstractChain {
  constructor(params) {
    super(params);
  }

  async getFees(toChain) {
    const [fees, price] = await Promise.all([
      super.getFees(toChain),
      provider.getGasPrice(),
    ]);

    const gasFees = new BigNumber(72300)
      .multipliedBy(price._hex)
      .dividedBy(ChainInfo[this.nonce].decimals)
      .toNumber();

    return fees + gasFees;
  }
}

export default EVM;
