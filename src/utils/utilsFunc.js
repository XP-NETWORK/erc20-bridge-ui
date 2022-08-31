import axios from "axios";

const getFeeValue = async () => {
  const api = "https://api.xp.network/xpnet";
  let fee = (await axios.get(api)).data;
  return fee.price;
};

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function numberWithCommasTyping(x) {
  return x
    .toString()
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getNumberType(x) {
  return Number(x.toString().replace(/\D/g, ""));
}

export function cutDigitAfterDot(numberToFixed, digitNumber) {
  return parseFloat(numberToFixed)
    .toFixed(digitNumber)
    .toString()
    .replace(/^([\d,]+)$|^([\d,]+)\.0*$|^([\d,]+\.[0-9]*?)0*$/, "$1$2$3");
}

export const parentAccountChange = async (event) => {
  if (event.data?.type === "ethAddress" && window.ethereum) {
    const parentAddress = event.data.address;
    console.log(parentAddress);
    if (!parentAddress) return;
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    if (parentAddress.toLowerCase() !== account.toLowerCase()) {
      window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    }
  }
};

export function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export const delay = (sec) =>
  new Promise((resolve) => setTimeout(() => resolve("ok"), sec * 1000));
