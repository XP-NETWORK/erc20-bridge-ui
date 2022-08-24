import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import walletIcon from "../img/wallet.svg";
import xpnetIcon from "../img/XPNET.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import secureIcon from "../img/secure tx.svg";
import swapIcon from "../img/swap  default.svg";
import abi from "../utils/ABI.json";
import AddressError from "./errors/AddressError";
// import ConnectWallet from "./ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setError, updateTransactionDetails } from "../store/accountSlice";
import Web3 from "web3";
import { BSC, CHAINS_TYPE, CONTRACT_ADDRESS } from "../utils/consts";
import {
  cutDigitAfterDot,
  getFeeValue,
  getNumberType,
  numberWithCommas,
  numberWithCommasTyping,
} from "../utils/utilsFunc";
import axios from "axios";
import AmountError from "./errors/AmountError";
import WrongAddressError from "./errors/WrongAddressError";
import AmountZeroError from "./errors/AmountZeroError";
import {
  getAccountBalance,
  getFeeAlgoToBsc,
  getFeeBscToAlgo,
  getBalance,
  getChainBalance,
} from "../erc20/erc20Utils";
import { useWeb3React } from "@web3-react/core";

import { verifyAddress } from "./helpers";

export default function Transfer(props) {
  const web3 = new Web3();
  const [recievingValueInDollar, setRecievingValueInDollar] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [xpnetTokenAmount, setXpnetTokenAmount] = useState(0);

  const [accountBalance, setAccountBalance] = useState(0);
  //const [fromChain, setFromChain] = useState(CHAINS_TYPE.BSC);
  //const [toChain, setToChain] = useState(CHAINS_TYPE.Algorand);
  const [destinationAddress, setDestinationAddress] = useState(
    "" //"NZQXP6BDGJ2HTLPNDRDJK74Z7UR26RKNYHOX3YQLBFEOTLIRK3HGRJ4TKU"
  );
  const [calculatedFee, setCalculatedFee] = useState(0);
  // const [feePrice, setFeePrice] = useState(0.2);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const currentAccount = useSelector((state) => state.account.address);
  const [isConnected, setIsConnected] = useState(false);
  const [showAddressPasted, setShowAddressPasted] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [wrongAddressError, setWrongAddressError] = useState(false);
  const [amountZero, setAmountZero] = useState(false);
  const [insufficient, setInsufficient] = useState(false);
  const [blury, setBlury] = useState(true);
  const [FeeBlury, setFeeBlury] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const { active } = useWeb3React();

  const [feeBSC, setfeeBSC] = useState("0.00000");
  const [feeAlgo, setFeeAlgo] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { fromChain, toChain, transactionDetails } = useSelector((state) => ({
    fromChain: state.account.transactionDetails.fromChain,
    toChain: state.account.transactionDetails.toChain,
    transactionDetails: state.account.transactionDetails,
  }));

  const period = 10000;

  let fee = useRef("0");
  let bal = useRef("0");

  const getUserbalance = (currentAccount) =>
    getChainBalance(currentAccount)
      .then((balance) => {
        console.log(currentAccount);
        bal.current !== balance && setUserBalance(balance);
        bal.current = balance;
      })
      .catch((e) => {
        //console.log(e);
        setUserBalance("0");
      });

  const getFees = async () => {
    try {
      let feeBsc = await getFeeBscToAlgo();
      let feealgo = await getFeeAlgoToBsc();
      console.log(feeBsc);
      fee.current !== feeBsc && setfeeBSC(feeBsc);
      fee.current = feeBsc;
      setFeeAlgo(feealgo);
      setFeeBlury(false);
    } catch (e) {}
  };

  useEffect(() => {
    setBlury(true);
    setFeeBlury(true);

    getChainBalance(currentAccount).then((balance) => {
      setUserBalance(balance);
      bal.current = balance;
    });

    getFees();

    const interval = setInterval(() => getFees(), period);

    return () => clearInterval(interval);
  }, []);

  /*if (props.from?.toUpperCase() === CHAINS_TYPE.Algorand.toUpperCase()) {
    setFromChain(CHAINS_TYPE.Algorand);
    setToChain(CHAINS_TYPE.BSC);
  }
  if (props.to?.toUpperCase() === CHAINS_TYPE.BSC.toUpperCase()) {
    setFromChain(CHAINS_TYPE.Algorand);
    setToChain(CHAINS_TYPE.BSC);
  }
  if (props.from?.toUpperCase() === CHAINS_TYPE.BSC.toUpperCase()) {
    setFromChain(CHAINS_TYPE.BSC);
    setToChain(CHAINS_TYPE.Algorand);
  }
  if (props.to?.toUpperCase() === CHAINS_TYPE.Algorand.toUpperCase()) {
    setFromChain(CHAINS_TYPE.BSC);
    setToChain(CHAINS_TYPE.Algorand);
  }*/

  useEffect(() => {
    // console.log(xpnetTokenAmount + calculatedFee, "total");
    if (xpnetTokenAmount) {
      if (
        parseFloat(xpnetTokenAmount) /*+ Number(calculatedFee)*/ >
        accountBalance
      ) {
        setAmountError(true);
      } else {
        setAmountError(false);
      }
    }
  }, [xpnetTokenAmount, accountBalance]);

  useEffect(() => {
    !isNaN(feeBSC) && setCalculatedFee(feeBSC);
  }, [feeBSC]);

  useEffect(() => {
    if (calculatedFee > userBalance) {
      setInsufficient(true);
    } else {
      setInsufficient(false);
    }
  }, [calculatedFee, userBalance]);

  useEffect(() => {
    if (active) {
      console.log("yes metamask");

      getBalance(currentAccount).then(({ tokenSymbol, xpnet }) => {
        setTokenSymbol(tokenSymbol);
        setAccountBalance(xpnet);
        setBlury(false);
      });
    } else {
      try {
        async function x() {
          let balance = await getAccountBalance(
            currentAccount,
            CHAINS_TYPE.Algorand
          );
          console.log("not metamask");
          setAccountBalance(balance);
          setBlury(false);
        }
        x().catch((e) => {
          throw e;
        });
      } catch (e) {
        dispatch(setError(e.message));
      }
    }

    getUserbalance(currentAccount);
    const interval = setInterval(() => getUserbalance(currentAccount), period);
    return () => clearInterval(interval);
  }, [currentAccount]);

  const swapChains = () => {
    /*if (fromChain === CHAINS_TYPE.BSC) {
      setCalculatedFee(feeAlgo);
    } else {
      setCalculatedFee(feeBSC);
    }*/
    console.log("swapChains");

    dispatch(
      updateTransactionDetails({
        ...transactionDetails,
        fromChain: toChain,
        toChain: fromChain,
      })
    );

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

    if (insufficient || amountError || amountZero || wrongAddressError) {
      return;
    }
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
      verifyAddress(destinationAddress, toChain)
      // &&getNumberType(xpnetTokenAmount) + calculatedFee <= accountBalance
    ) {
      transaction = {
        tokenSymbol: tokenSymbol,
        xpnetAmount: xpnetTokenAmount,
        destinationAddress: destinationAddress,
        fromChain: fromChain,
        toChain: toChain,
        fee: calculatedFee,
        recievingValueInDollar: recievingValueInDollar,
      };
      console.log("inside if im about to nav");
      dispatch(updateTransactionDetails(transaction));
      navigate("/BridgingConfirmation");
    }
    // }
  };

  const handleAddressChanged = (e) => {
    if (e.target.value !== "") {
      setDestinationAddress(e.target.value);
      setShowAddressPasted(false);
    }
  };

  const handleTokenAmountChange = (e) => {
    let numAsString = e.target.value.toString();

    if (!numAsString) {
      return setXpnetTokenAmount(0);
    }

    if (numAsString.at(-1) === ".") {
      return setXpnetTokenAmount(numAsString);
    }

    setXpnetTokenAmount(parseFloat(numAsString).toString());
  };

  useEffect(() => {
    if (destinationAddress !== "") {
      if (!verifyAddress(destinationAddress, toChain)) {
        setWrongAddressError(true);
      }
    }
  }, [destinationAddress, fromChain, toChain]);

  // const handleOpenConnectComp = () => {
  //   setShowConnectWallet(true);
  // };

  const handleCloseConnectComp = () => {
    setShowConnectWallet(false);
  };

  const handleAmountZeroError = (isShow) => {
    if (parseFloat(xpnetTokenAmount) > 0) setAmountZero(isShow);
  };

  const handleAddressError = (isShow) => {
    if (destinationAddress) setShowAddressPasted(isShow);
  };

  const handleWrongAddressError = (isShow) => {
    if (verifyAddress(destinationAddress, toChain) || !destinationAddress)
      setWrongAddressError(isShow);
  };

  const handleAmountError = (isShow) => {
    if (parseFloat(xpnetTokenAmount) <= accountBalance) setAmountError(isShow);
  };

  return (
    <>
      <div className="flexColumn">
        <div className={`transferBox transfer`}>
          <div className="wraper">
            <h1 className="transferBoxTitle">
              Transfer asset <br />
              between blockchains
            </h1>
            <div className="flexRow mtT50">
              <label className="amountLabel">Amount</label>
              <label className="flexRow" style={{ width: "auto", gap: "5px" }}>
                <img src={walletIcon} />
                <label className={`xpnetAmount ${blury ? "blury" : ""}`}>
                  {numberWithCommas(accountBalance)} {tokenSymbol}
                </label>
                <button className="maxLabel" onClick={handleMaxAmount}>
                  MAX
                </button>
              </label>
            </div>
            <div className="Divgap">
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
                  value={xpnetTokenAmount}
                />
                <label className={`icontext ${blury ? "blury" : ""}`}>
                  <img src={xpnetIcon} />
                  {tokenSymbol}
                </label>
              </div>

              <div className="flexRow">
                <div className="fieldBox blockchain">
                  <label className="icontext">
                    <img
                      src={
                        fromChain === CHAINS_TYPE.BSC ? bscIcon : algorandIcon
                      }
                    />
                    {fromChain}
                  </label>
                </div>
                <button className="swapBtn1" onClick={swapChains}>
                  <img src={swapIcon} className="swapBtn" />
                </button>
                <div className="fieldBox blockchain">
                  <label className="icontext">
                    <img
                      src={toChain === CHAINS_TYPE.BSC ? bscIcon : algorandIcon}
                    />
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
                  value={destinationAddress}
                  placeholder="Paste destination address"
                  onInput={handleAddressChanged}
                  onChange={handleAddressChanged}
                />
              </div>
              <div className="flexRow mtT32">
                <label className="amountLabel">Fee:</label>
                <div className="feesContainer">
                  <span>Balance: {userBalance}</span>
                  <label
                    className={`amountLabel flexRow ${
                      FeeBlury ? "blury" : ""
                    } ${insufficient ? "insufficient" : ""}`}
                  >
                    <span className="errorNotif">Insufficient funds</span>
                    {calculatedFee === 0
                      ? 0
                      : cutDigitAfterDot(calculatedFee, 10)}{" "}
                    {fromChain === CHAINS_TYPE.BSC ? "BNB" : "Algo"}
                  </label>
                </div>
              </div>
            </div>
            <button
              className="connectYourWalletBtn mt40"
              onClick={handleBtnClick}
            >
              {/* {isConnected ? "Next" : "Connect your wallet"} */}
              Next
            </button>
            <div className="secureLabel" style={{ marginTop: "28px" }}>
              <img src={secureIcon} />
              <label>Secure transaction</label>
            </div>
          </div>
        </div>
        {/* {showConnectWallet && <ConnectWallet isOpen={handleCloseConnectComp} />} */}
      </div>
      <div className="notifsBlock">
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
      </div>
    </>
  );
}
