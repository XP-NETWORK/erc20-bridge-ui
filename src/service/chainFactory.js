import { bridge } from "./bridge";
import { ChainNonce } from "xpjs-erc20";

import EVM from "./chains/evm";
import Algorand, { getMyAlgoSigner } from "./chains/algorand";

import { ethers } from "ethers";

class ChainFabric {
  chains = {};
  bridge;

  init(bridge) {
    this.bridge = bridge;
    return this;
  }

  async getChain(nonce) {
    if (!this.bridge) {
      throw new Error("Bridge is not implemented");
    }

    if (this.chains[nonce]) {
      return this.chains[nonce];
    }

    this.chains[nonce] = await this.createChain(this.bridge)(nonce);
    return this.chains[nonce];
  }

  createChain = (bridge) => async (nonce) => {
    switch (nonce) {
      case ChainNonce.BSC:
        return new EVM({
          bridge,
          nonce: ChainNonce.BSC,
          signer: new ethers.providers.Web3Provider(
            window.ethereum
          ).getSigner(),
        });
      case ChainNonce.Algorand:
        return new Algorand({
          bridge,
          nonce: ChainNonce.Algorand,
          signer: await getMyAlgoSigner(),
        });
      default: {
        throw new Error("Unsupported chain");
      }
    }
  };
}

(async () => {
  const cf = new ChainFabric();

  const chain = await cf.init(bridge).getChain(5);

  const fees = await chain.preTransfer(1);

  console.log(fees);
})();

export default () => new ChainFabric();
