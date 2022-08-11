import MyAlgoConnect from "@randlabs/myalgo-connect";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { ASSET_ID, CHAINS_TYPE, CONTRACT_ADDRESS } from "../utils/consts";

const { default: algosdk } = require("algosdk");
const {
  erc20MultiBridge,
  scVerifyRepo,
  exchangeRateRepo,
  evNotifier,
  ChainNonce,
  ChainInfo,
} = require("xpjs-erc20");
const { prov } = require("./provider");

export const bridge = erc20MultiBridge(
  {
    2: {
      provider: prov,
      bridgeAddr: "0x91105e661C500e6651f04CF76787297e534b97a5",
    },
    5: {
      algod: new algosdk.Algodv2("", "https://mainnet-api.algonode.cloud", 443),
      indexer: new algosdk.Indexer(
        "",
        "https://mainnet-idx.algonode.cloud",
        443
      ),
      bridgeId: 832979940,
    },
  },
  {
    scVerify: scVerifyRepo("https://token-sc-verify.xp.network"),
    exchangeRate: exchangeRateRepo(
      "https://testing-bridge.xp.network/exchange"
    ),
    notifier: evNotifier("https://token-notifier.xp.network"),
  }
);

export const preTransfer = async (fromChain, amount, address) => {
  let nonceSender =
    fromChain === CHAINS_TYPE.BSC ? ChainNonce.BSC : ChainNonce.Algorand;
  let signer;

  if (fromChain === CHAINS_TYPE.BSC) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    signer = await getMyAlgoConnect(address);
  }

  console.log("signer", signer);
  let divideBy = ChainInfo[nonceSender].decimals;
  let amBigNum = new BigNumber(amount);
  let amountBigNumber = amBigNum.multipliedBy(divideBy).integerValue();
  console.log("amount bignumber", amountBigNumber);
  //console.log("bigNum", BigNumber.from(amount).toNumber());
  let preTransfer = await bridge.preTransfer(
    nonceSender,
    signer,
    fromChain === CHAINS_TYPE.BSC ? CONTRACT_ADDRESS : ASSET_ID,
    amountBigNumber
  );
  console.log("pretransfer", preTransfer);
};

//console.log("signer",signer);
//preTransfer();

export const transfer = async (
  fromChain,
  toChain,
  amount,
  destAddress,
  address
) => {
  console.log("fromChain", fromChain);
  console.log("toChain", toChain);
  console.log("amount", amount);
  console.log("destAddress", destAddress);
  console.log("address", address);
  //console.log("amount bignumber", BigNumber(amount));

  let nonceReciever =
    toChain === CHAINS_TYPE.BSC ? ChainNonce.BSC : ChainNonce.Algorand;
  let nonceSender =
    fromChain === CHAINS_TYPE.BSC ? ChainNonce.BSC : ChainNonce.Algorand;
  let signer;

  if (fromChain === CHAINS_TYPE.BSC) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    signer = await getMyAlgoConnect(address);
  }

  let fee = await bridge.estimateFees(
    nonceSender,
    fromChain === CHAINS_TYPE.BSC ? CONTRACT_ADDRESS : ASSET_ID,
    nonceReciever
  );
  let divideBy = ChainInfo[nonceSender].decimals;
  let amBigNum = new BigNumber(amount);
  // console.log("am bignumber", amBigNum);
  let amountBigNumber = amBigNum.multipliedBy(divideBy).integerValue();
  // console.log("amount bignumber", amountBigNumber);
  // console.log("fee", fee);
  let transfer = await bridge.transferTokens(
    nonceSender,
    signer,
    fromChain === CHAINS_TYPE.BSC ? CONTRACT_ADDRESS : ASSET_ID,
    nonceReciever,
    amountBigNumber,
    destAddress,
    fee
  );
  console.log("Transfer -------->", transfer);
};

export const getFeeBscToAlgo = async () => {
  let fee = await bridge.estimateFees(
    ChainNonce.BSC,
    CONTRACT_ADDRESS,
    ChainNonce.Algorand
  );
  //console.log(fee);
  let divideBy = ChainInfo[ChainNonce.BSC].decimals;
  //console.log("FeeBscToAlgo", fee.toNumber() / divideBy);
  return (fee.toNumber() / divideBy).toFixed(10);
};

export const getFeeAlgoToBsc = async () => {
  let fee = await bridge.estimateFees(
    ChainNonce.Algorand,
    ASSET_ID,
    ChainNonce.BSC
  );
  let divideBy = ChainInfo[ChainNonce.Algorand].decimals;
  //console.log("FeeAlgoToBsc", fee.toNumber() / divideBy);
  return fee.toNumber() / divideBy;
};

// getFeeBscToAlgo();
// getFeeAlgoToBsc();

// export const preTransfer = () => {};

// const hi = () => {
//   console.log("hi lihi", BigNumber.from(2));

//   //console.log(fee);
// };
// hi();

export const getMyAlgoConnect = async (address) => {
  const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });
  const settings = {
    shouldSelectOneAccount: false,
    openManager: true,
  };

  const accounts = await myAlgoConnect.connect(settings);
  console.log("algo connected address", accounts);

  const algo = await bridge.inner(ChainNonce.Algorand);
  return algo.myAlgoSignerWrapper(myAlgoConnect, address);
};

export const getAccountBalance = async (account, fromChain) => {
  let nonceSender =
    fromChain === CHAINS_TYPE.BSC ? ChainNonce.BSC : ChainNonce.Algorand;
  let balance = await bridge.tokenBalance(
    nonceSender,
    fromChain === CHAINS_TYPE.BSC ? CONTRACT_ADDRESS : ASSET_ID,
    account
  );
  let divideBy = ChainInfo[nonceSender].decimals;
  console.log("balance", balance / divideBy);
  return balance / divideBy;
};
