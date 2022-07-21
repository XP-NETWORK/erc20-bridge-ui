import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import walletIcon from "../img/wallet.svg";
import xpnetIcon from "../img/XPNET.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import secureIcon from "../img/secure tx.svg";
import swapIcon from "../img/swap  default.svg";
import abi from "../utils/ABI.json";
import AddressError from "./AddressError";
// import ConnectWallet from "./ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTransactionDetails } from "../store/accountSlice";
import Web3 from "web3";
import { BSC, CONTRACT_ADDRESS } from "../utils/consts";
import {
  cutDigitAfterDot,
  getFeeValue,
  getNumberType,
  numberWithCommas,
  numberWithCommasTyping,
} from "../utils/utilsFunc";
import axios from "axios";
import AmountError from "./AmountError";
import WrongAddressError from "./WrongAddressError";
import AmountZeroError from "./AmountZeroError";

export default function Transfer(props) {
  const web3 = new Web3();
  const [recievingValueInDollar, setRecievingValueInDollar] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [xpnetTokenAmount, setXpnetTokenAmount] = useState(0);
  const [xpnetTokenPrice, setXpnetTokenPrice] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [fromChain, setFromChain] = useState("BSC");
  const [toChain, setToChain] = useState("Algorand");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [feePrice, setFeePrice] = useState(0.2);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const currentAccount = useSelector((state) => state.account.address);
  const [isConnected, setIsConnected] = useState(false);
  const [showAddressPasted, setShowAddressPasted] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [wrongAddressError, setWrongAddressError] = useState(false);
  const [amountZero, setAmountZero] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("to", props.to?.toUpperCase());
    if (props.from?.toUpperCase() === "ALGORAND") {
      setFromChain("Algorand");
      setToChain("BSC");
    }
    if (props.to?.toUpperCase() === "BSC") {
      setFromChain("Algorand");
      setToChain("BSC");
    }
    if (props.from?.toUpperCase() === "BSC") {
      setFromChain("BSC");
      setToChain("Algorand");
    }
    if (props.to?.toUpperCase() === "ALGORAND") {
      setFromChain("BSC");
      setToChain("Algorand");
    }
  }, [props.from, props.to]);

  useEffect(() => {
    let valueInDollar =
      (getNumberType(xpnetTokenAmount) - calculatedFee) * xpnetTokenPrice;
    setRecievingValueInDollar(valueInDollar);
  }, [xpnetTokenAmount, calculatedFee, xpnetTokenPrice]);

  useEffect(() => {
    console.log(xpnetTokenAmount);
    console.log(calculatedFee);
    console.log(accountBalance);
    console.log(xpnetTokenAmount + calculatedFee, "total");
    if (
      getNumberType(xpnetTokenAmount) + Number(calculatedFee) >
      accountBalance
    ) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
  }, [xpnetTokenAmount, accountBalance, calculatedFee]);

  useEffect(() => {
    const getXpnetTokenValue = async () => {
      const api = "https://api.xp.network/xpnet";
      let xpnetToken = (await axios.get(api)).data;
      setXpnetTokenPrice(xpnetToken.price);
    };
    getXpnetTokenValue().catch(console.error);
    // setFee(feeXp);
  }, []);

  useEffect(() => {
    setCalculatedFee(getNumberType(xpnetTokenAmount) * feePrice);
  }, [xpnetTokenAmount, feePrice]);

  useEffect(() => {
    const Web3Client = new Web3(new Web3.providers.HttpProvider(BSC));
    const contract = new Web3Client.eth.Contract(abi, CONTRACT_ADDRESS);
    async function getBalance() {
      const result = await contract.methods.balanceOf(currentAccount).call(); // 29803630997051883414242659
      const tokenSymbol = await contract.methods.symbol().call();
      console.log("tokenSymbol", tokenSymbol);
      setTokenSymbol(tokenSymbol);
      const format = Web3Client.utils.fromWei(result); // 29803630.997051883414242659
      const xpnet = Math.floor(format);
      console.log("format", Math.floor(format));
      setAccountBalance(xpnet);
    }
    getBalance().catch(console.error);
  }, [currentAccount]);

  const swapChains = () => {
    let temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
    //isAddressSuitableDestChain();
  };

  const handleMaxAmount = () => {
    setXpnetTokenAmount(getNumberType(accountBalance));
  };

  useEffect(() => {
    if (
      currentAccount !== undefined &&
      currentAccount !== null &&
      currentAccount !== ""
    ) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [currentAccount]);

  const handleBtnClick = () => {
    let transaction = {};
    // if (!isConnected) {
    //   setShowConnectWallet(true);
    // } else {
    //   console.log("destinationAddress", destinationAddress);
    if (destinationAddress === "") {
      setShowAddressPasted(true);
    }
    if (getNumberType(xpnetTokenAmount) === 0 || xpnetTokenAmount === "") {
      setAmountZero(true);
    }
    if (
      getNumberType(xpnetTokenAmount) > 0 &&
      destinationAddress !== "" &&
      isAddressSuitableDestChain() &&
      getNumberType(xpnetTokenAmount) + calculatedFee <= accountBalance
    ) {
      transaction = {
        tokenSymbol: tokenSymbol,
        xpnetTokenPrice: xpnetTokenPrice,
        xpnetAmount: getNumberType(xpnetTokenAmount),
        destinationAddress: destinationAddress,
        fromChain: fromChain,
        toChain: toChain,
        fee: calculatedFee,
        recievingValueInDollar: recievingValueInDollar,
      };
      dispatch(updateTransactionDetails(transaction));
      navigate("/BridgingConfirmation");
    }
    // }
  };

  const verifyEVMAddress = () => {
    console.log("dest", destinationAddress);
    if (ethers.utils.isAddress(destinationAddress)) {
      return true;
    } else {
      return false;
    }
  };

  const verifyAlgoAddress = () => {
    if (destinationAddress.length === 58) {
      console.log("its algo address", destinationAddress);
      return true;
    } else {
      return false;
    }
  };

  const isAddressSuitableDestChain = () => {
    if (verifyEVMAddress() && toChain === "BSC") {
      console.log("its bsc address", destinationAddress);
      console.log("to chain", toChain);
      setWrongAddressError(false);
      return true;
    }
    if (verifyAlgoAddress() && toChain === "Algorand") {
      setWrongAddressError(false);
      return true;
    } else {
      setWrongAddressError(true);
      return false;
    }
  };

  const handleAddressChanged = (e) => {
    if (e.target.value !== "") {
      setDestinationAddress(e.target.value);
      setShowAddressPasted(false);
    }
  };

  const handleTokenAmountChange = (e) => {
    let numAsString = e.target.value.toString();
    console.log("string number", numAsString);
    if (e.target.value !== 0) {
      setAmountZero(false);
    }
    if (numAsString[0] === "0" || numAsString.match(/[a-z]/i)) {
      console.log("zero is zero");
      setAmountZero(true);
    }
    console.log("----------", numberWithCommas(e.target.value));
    setXpnetTokenAmount(e.target.value);

    // setXpnetTokenAmount(
    //   numberWithCommas(e.target.value)
    // );
  };

  useEffect(() => {
    if (destinationAddress !== "") {
      isAddressSuitableDestChain();
    }
  }, [destinationAddress, fromChain, toChain]);

  // const handleOpenConnectComp = () => {
  //   setShowConnectWallet(true);
  // };

  const handleCloseConnectComp = () => {
    setShowConnectWallet(false);
  };
  const handleAmountZeroError = (isShow) => {
    setAmountZero(isShow);
  };

  const handleAddressError = (isShow) => {
    setShowAddressPasted(isShow);
  };

  const handleWrongAddressError = (isShow) => {
    setWrongAddressError(isShow);
  };

  const handleAmountError = (isShow) => {
    setAmountError(isShow);
  };

  return (
    <>
      <div className="flexColumn">
        <div className="transferBox">
          <div className="wraper">
            <h1 className="transferBoxTitle">
              Transfer asset <br />
              between blockchains
            </h1>
            <div className="Divgap">
              <div className="flexRow">
                <label className="amountLabel">Amount</label>
                <label
                  className="flexRow"
                  style={{ width: "auto", gap: "5px" }}
                >
                  <img src={walletIcon} />
                  <label className="xpnetAmount">
                    {numberWithCommas(accountBalance)} {tokenSymbol}
                  </label>
                  <button className="maxLabel" onClick={handleMaxAmount}>
                    MAX
                  </button>
                </label>
              </div>
              <div
                className={
                  amountError ? "fieldBox fieldBoxError" : "fieldBox inputText"
                }
              >
                <input
                  className={
                    amountError
                      ? "textXpAmount textXpAmountError"
                      : "textXpAmount"
                  }
                  type="text"
                  placeholder={xpnetTokenAmount}
                  // min={0}
                  // max={10000000000}
                  onFocus={() =>
                    xpnetTokenAmount == 0 ? setXpnetTokenAmount("") : null
                  }
                  onChange={handleTokenAmountChange}
                  value={numberWithCommasTyping(xpnetTokenAmount)}
                />
                <label className="icontext">
                  <img src={xpnetIcon} />
                  {tokenSymbol}
                </label>
              </div>

              <div className="flexRow">
                <button className="selfCenter" onClick={swapChains}>
                  <img src={swapIcon} className="swapBtn" />
                </button>
                <div className="fieldBox blockchain">
                  <label className="icontext">
                    <img src={fromChain === "BSC" ? bscIcon : algorandIcon} />
                    {fromChain}
                  </label>
                </div>
                <div className="fieldBox blockchain">
                  <label className="icontext">
                    <img src={toChain === "BSC" ? bscIcon : algorandIcon} />
                    {toChain}
                  </label>
                </div>
              </div>
              <div
                className={
                  wrongAddressError
                    ? "fieldBox fieldBoxError"
                    : "fieldBox inputText"
                }
              >
                <input
                  className={
                    wrongAddressError
                      ? "textDestAddress textXpAmountError"
                      : "textDestAddress"
                  }
                  type="text"
                  placeholder="Paste destination address"
                  onInput={handleAddressChanged}
                  onChange={handleAddressChanged}
                />
              </div>
              <div className="flexRow">
                <label className="amountLabel">Fee:</label>
                <label className="amountLabel flexRow">
                  {calculatedFee === 0 ? 0 : cutDigitAfterDot(calculatedFee, 2)}{" "}
                  {fromChain}
                </label>
              </div>
            </div>
            <button className="connectYourWalletBtn" onClick={handleBtnClick}>
              {/* {isConnected ? "Next" : "Connect your wallet"} */}
              Next
            </button>
            <div className="secureLabel">
              <img src={secureIcon} />
              <label>Secure transaction</label>
            </div>
          </div>
        </div>
        {/* {showConnectWallet && <ConnectWallet isOpen={handleCloseConnectComp} />} */}
      </div>
      {amountZero && (
        <AmountZeroError showAmountZeroError={handleAmountZeroError} />
      )}
      {showAddressPasted && (
        <AddressError showAddressError={handleAddressError} />
      )}
      {amountError && <AmountError showAmountError={handleAmountError} />}
      {wrongAddressError && (
        <WrongAddressError showWrongAddressError={handleWrongAddressError} />
      )}
    </>
  );
}
