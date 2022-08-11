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
  return parseFloat(numberToFixed).toFixed(digitNumber);
}
