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
  console.log("here", numberToFixed);
  return parseFloat(numberToFixed).toFixed(digitNumber);
}

const getImages = async () => {
  fetch("/src/utils/images.json")
    .then((Response) => Response.json())
    .then((data) => {
      console.log("data", data);
    });
};

getImages();

// const getImages = async () => {
//   try {
//     let data = await fetch("/src/utils/images.json");
//     console.log("data", data);
//   } catch (e) {
//     console.log(e);
//   }
// };
