export const BSC_NODE = "https://bscrpc.com";
export const CONTRACT_ADDRESS = "0x8cf8238abf7b933Bf8BB5Ea2C7E4Be101c11de2A";
export const MAX_CHAR_ADDRESS = 17;
export const ASSET_ID = "855071472"; //"855071472"; //"853784314";
export const APPLICATION_ID = "855067391"; //853776429"; //"832979940";

export const CHAINS_TYPE = {
  BSC: "BSC",
  Algorand: "Algorand",
};

export const CHAINS_EXPLORERS = {
  BSC: "https://bscscan.com/address/",
  Algorand: "https://algoexplorer.io/address/",
};

export const CHAINS_EXPLORERS_TX = {
  BSC: "https://bscscan.com/tx/",
  Algorand: "https://algoexplorer.io/tx/",
};

export const CHAINS_TOKENS = {
  BSC: "BNB",
  Algorand: "Algos",
};

const bscNodes = [
  "https://bsc-dataseed1.binance.org/",
  "https://bsc-dataseed2.binance.org/",
  "https://bsc-dataseed3.binance.org/",
  "https://bsc-dataseed4.binance.org/",
  "https://bsc-dataseed1.defibit.io/",
  "https://bsc-dataseed2.defibit.io/",
  "https://bsc-dataseed3.defibit.io/",
  "https://bsc-dataseed4.defibit.io/",
  "https://bsc-dataseed1.ninicoin.io/",
  "https://bsc-dataseed2.ninicoin.io/",
  "https://bsc-dataseed3.ninicoin.io/",
  "https://bsc-dataseed4.ninicoin.io/",
];

export function randomRpcUrl() {
  return bscNodes[Math.floor(Math.random() * bscNodes.length)];
}
