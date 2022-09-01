import React, { useEffect, useState, useRef } from "react";

import walletIcon from "../img/wallet.svg";
import xpnetIcon from "../img/XPNET.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import secureIcon from "../img/secure tx.svg";
import swapIcon from "../img/swap  default.svg";

import AddressError from "./errors/AddressError";
// import ConnectWallet from "./ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {} from "../store/accountSlice";
import Web3 from "web3";
import { BSC, CHAINS_TYPE } from "../utils/consts";
import { cutDigitAfterDot, numberWithCommas } from "../utils/utilsFunc";

import AmountError from "./errors/AmountError";
import WrongAddressError from "./errors/WrongAddressError";
import AmountZeroError from "./errors/AmountZeroError";
import { Loader } from "./loaders/Loader";

function Transfer({ data, handlers, transaction, errors, loaders }) {
  const { balance, tokenBalance } = data;
  const {
    handleMaxAmount,
    handleTokenAmountChange,
    swapChains,
    handleAddressChanged,
    handleBtnClick,
  } = handlers;
  const {
    fromChain,
    toChain,
    destinationAddress,
    tokenSymbol: symbol,
    fee: fees,
  } = transaction;
  const { amountError, wrongAddressError, insufficient } = errors;
  const { blury, loadingFees } = loaders;

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
                  {numberWithCommas(balance)} {symbol}
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
                  placeholder={tokenBalance}
                  // min={0}
                  // max={10000000000}
                  onFocus={
                    () => {}
                    //tokenBalance == 0 ? setXpnetTokenAmount("") : null
                  }
                  onChange={handleTokenAmountChange}
                  value={tokenBalance}
                />
                <label className={`icontext ${blury ? "blury" : ""}`}>
                  <img src={xpnetIcon} />
                  {symbol}
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
                  <span>Balance: {balance}</span>
                  <div className="withLoaderContainer">
                    {!loadingFees ? (
                      <label
                        className={`amountLabel flexRow ${
                          loadingFees ? "blury" : ""
                        } ${insufficient ? "insufficient" : ""}`}
                      >
                        <span className="errorNotif">Insufficient funds</span>
                        {fees === 0 ? 0 : cutDigitAfterDot(fees, 10)}{" "}
                        {fromChain === CHAINS_TYPE.BSC ? "BNB" : "Algo"}
                      </label>
                    ) : (
                      <Loader />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="connectYourWalletBtn mt40"
              onClick={handleBtnClick}
            >
              Next
            </button>
            <div className="secureLabel" style={{ marginTop: "22px" }}>
              <img src={secureIcon} />
              <label>Secure transaction</label>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="notifsBlock">
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
        </div>*/}
    </>
  );
}
