import MyAlgoConnect from "@randlabs/myalgo-connect";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import {
  ASSET_ID,
  CHAINS_TYPE,
  CONTRACT_ADDRESS,
  BSC,
  APPLICATION_ID,
} from "../utils/consts";

import abi from "../utils/ABI.json";
import Web3 from "web3";
import axios from "axios";

import TransactionWratcher from "../service/transactions";

const tw = TransactionWratcher();

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
      bridgeId: Number(APPLICATION_ID),
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
    signer = await getMyAlgoSigner(address);
  }

  console.log("signer", signer);
  let divideBy = ChainInfo[nonceSender].decimals;
  let amBigNum = new BigNumber(amount);
  let amountBigNumber = amBigNum.multipliedBy(divideBy).integerValue();
  console.log("amount bignumber", amountBigNumber);
  //console.log("bigNum", BigNumber.from(amount).toNumber());
  try {
    let preTransfer = await bridge.preTransfer(
      nonceSender,
      signer,
      fromChain === CHAINS_TYPE.BSC ? CONTRACT_ADDRESS : ASSET_ID,
      amountBigNumber
    );
    console.log("pretransfer", preTransfer);
  } catch (e) {
    console.log(e, "e");
    throw e;
  }
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
    signer = await getMyAlgoSigner(address);
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
  ).catch(e => {
    throw e
  })
  console.log(transfer, "transfer");


  return transfer;
};

export const getFeeBscToAlgo = async () => {
  let fee = await bridge.estimateFees(
    ChainNonce.BSC,
    CONTRACT_ADDRESS,
    ChainNonce.Algorand
  );


  let divideBy = ChainInfo[ChainNonce.BSC].decimals;

  return (fee.toNumber() / divideBy).toFixed(10);
};

export const getFeeAlgoToBsc = async () => {
  let fee = await bridge.estimateFees(
    ChainNonce.Algorand,
    ASSET_ID,
    ChainNonce.BSC
  );
  let divideBy = ChainInfo[ChainNonce.Algorand].decimals;
  console.log("FeeAlgoToBsc", fee);
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

export const getMyAlgoSigner = async (address) => {
  const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });
  const algo = await bridge.inner(ChainNonce.Algorand);
  return algo.myAlgoSignerWrapper(myAlgoConnect, address);
};

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

let algoSymbol = "";

export const getAlgoData = async (account, fromChain) => {
  try {
    let nonceSender = ChainNonce.Algorand;

    const [tokenBalance, symbol, balance] = await Promise.all([
      (async () => {
        return await bridge.tokenBalance(
          nonceSender,
          fromChain === CHAINS_TYPE.BSC ? CONTRACT_ADDRESS : ASSET_ID,
          account
        );
      })(),
      (async () => {
        if (algoSymbol) return algoSymbol;
        const res = await bridge.tokenParams(nonceSender, ASSET_ID);

        algoSymbol = res.name;
        return res.name;
      })(),

      (async () => {
        const res = await bridge.balance(nonceSender, account);

        return res.dividedBy(1e6).toString();
      })(),
    ]);

    let divideBy = ChainInfo[nonceSender].decimals;
    console.log("token Balance", tokenBalance / divideBy);

    return {
      tokenBalance: tokenBalance / divideBy,
      symbol: algoSymbol,
      balance,
    };
  } catch (e) {
    throw e;
  }
};

const Web3Client = new Web3(
  new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/")
);

export const getBalance = async (acc) => {
  const contract = new Web3Client.eth.Contract(abi, CONTRACT_ADDRESS);

  const result = await contract.methods.balanceOf(acc).call(); // 29803630997051883414242659
  const tokenSymbol = await contract.methods.symbol().call();

  const format = Web3Client.utils.fromWei(result); // 29803630.997051883414242659
  const xpnet = Number(format).toFixed(1);

  return {
    tokenSymbol,
    xpnet,
  };
};

export const getChainBalance = async (acc) => {
  const x = await Web3Client.eth.getBalance(acc);
  return Web3Client.utils.fromWei(x).slice(0, 7);
};

export const getXpnetTokenValue = async () => {
  try {
    const api = "https://api.xp.network/xpnet";
    let xpnetToken = (await axios.get(api))?.data;
    return xpnetToken?.price;
  } catch (e) {
    console.log(e, "getXpnetTokenValue");
    return 0;
  }
  //setXpnetTokenPrice(xpnetToken.price);
};
