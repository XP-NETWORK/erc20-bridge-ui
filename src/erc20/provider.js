const { ethers } = require("ethers");

export const prov = new ethers.providers.JsonRpcProvider(
  "https://speedy-nodes-nyc.moralis.io/3749d19c2c6dbb6264f47871/bsc/mainnet"
);
