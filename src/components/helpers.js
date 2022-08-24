import { ethers } from "ethers";
import { CHAINS_TYPE } from "../utils/consts";

const verifyEVMAddress = (destinationAddress) => {
  if (ethers.utils.isAddress(destinationAddress)) {
    return true;
  } else {
    return false;
  }
};

const verifyAlgoAddress = (destinationAddress) => {
  if (destinationAddress.length === 58) {
    return true;
  } else {
    return false;
  }
};

export function format(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const verifyAddress = (address, chain) => {
  switch (chain) {
    case CHAINS_TYPE.BSC: {
      return verifyEVMAddress(address);
    }

    case CHAINS_TYPE.Algorand: {
      return verifyAlgoAddress(address);
    }

    default:
      return false;
  }
};
