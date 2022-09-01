import MyAlgoConnect from "@randlabs/myalgo-connect";
import { bridge } from "../../erc20/erc20Utils";
import AbstractChain from "./chain";

import { ChainNonce } from "xpjs-erc20";

export const getMyAlgoSigner = async (address) => {
  const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });
  const algo = await bridge.inner(ChainNonce.Algorand);
  return algo.myAlgoSignerWrapper(myAlgoConnect, address);
};

class Algorand extends AbstractChain {
  constructor(params) {
    super(params);
  }
}

export default Algorand;
