const { ethers } = require("ethers");

export const prov = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);
