const { ethers } = require("ethers");

export const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);
