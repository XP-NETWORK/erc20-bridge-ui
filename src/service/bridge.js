import {
  erc20MultiBridge,
  scVerifyRepo,
  exchangeRateRepo,
  evNotifier,
} from "xpjs-erc20";
import { prov } from "../erc20/provider";
import algosdk from "algosdk";
import { APPLICATION_ID } from "../utils/consts";

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
