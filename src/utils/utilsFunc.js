import axios from "axios";

const getFeeValue = async () => {
  const api = "https://api.xp.network/xpnet";
  let fee = (await axios.get(api)).data;
  console.log("fee", fee.price);
  return fee.price;
};

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function cutDigitAfterDot(numberToFixed,digitNumber) {
  console.log("here", numberToFixed);
  return parseFloat(numberToFixed).toFixed(digitNumber);
}
