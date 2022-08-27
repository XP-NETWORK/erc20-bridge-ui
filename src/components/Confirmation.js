import React, { useEffect, useState } from "react";
import secureIcon from "../img/secure tx.svg";
import backIcon from "../img/icon back.svg";
import editIcon from "../img/edit/default.svg";
import copyIcon from "../img/copy/default.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import ToggleButton from "react-toggle-button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CHAINS_TYPE,
  MAX_CHAR_ADDRESS,
  CHAINS_EXPLORERS,
  CHAINS_TOKENS,
} from "../utils/consts";
import { cutDigitAfterDot, numberWithCommas } from "../utils/utilsFunc";
import { preTransfer, transfer, getXpnetTokenValue } from "../erc20/erc20Utils";
import { TransferError } from "xpjs-erc20";
import OptInPopup from "./errors/OptInPopup";
import Loader from "./loaders/Loader";
import ApprovalLoader from "./loaders/ApprovalLoader";
import TransferLoader from "./loaders/TransferLoader";
import {
  updateHash,
  setError,
  updateTransactionDetails,
} from "../store/accountSlice";
import Error from "./errors/Error";

import { format } from "./helpers";

export default function Confirmation() {
  const [approveTransaction, setApproveTransaction] = useState(false);
  const [xpnetTokenPrice, setXpnetTokenPrice] = useState(0);
  const [showOptIn, setShowOptIn] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showApprovalLoader, setShowApprovalLoader] = useState(false);
  const [showTransferLoader, setShowTransferLoader] = useState(false);

  const [assetId, setAssetId] = useState("");

  const [recievingValueInDollar, setRecievingValueInDollar] = useState(0);
  const transaction = useSelector((state) => state.account.transactionDetails);
  const address = useSelector((state) => state.account.address);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getXpnetTokenValue().then((res) => setXpnetTokenPrice(res));
    const interval = setInterval(
      () => getXpnetTokenValue().then((res) => setXpnetTokenPrice(res)),
      20000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let valueInDollar = transaction.xpnetAmount * xpnetTokenPrice;
    setRecievingValueInDollar(valueInDollar);

    dispatch(
      updateTransactionDetails({
        ...transaction,
        recievingValueInDollar: valueInDollar,
      })
    );
  }, [transaction.xpnetAmount, transaction.fee, xpnetTokenPrice]);

  const handleChangeApprove = async (e) => {
    let pretransfer;
    if (!approveTransaction) {
      setShowApprovalLoader(true);
      try {
        pretransfer = await preTransfer(
          transaction.fromChain,
          transaction.xpnetAmount,
          address
        );

        setApproveTransaction(true);
      } catch (e) {
        console.log(e, "approval");
        setApproveTransaction(false);
        dispatch(setError(e.message));
      }
      setShowApprovalLoader(false);
    }
  };

  const editXpnetTokenAmount = () => {};

  // const transfer = async () => {
  //   let sourceHash = await transfer(
  //     transaction.fromChain,
  //     transaction.toChain,
  //     transaction.xpnetAmount,
  //     transaction.destinationAddress,
  //     address
  //   );
  //   return sourceHash;
  // };

  const sendTransaction = async () => {
    // TO DO : send transaction
    if (approveTransaction) {
      setShowTransferLoader(true);
      try {
        let sourceHash = await transfer(
          transaction.fromChain,
          transaction.toChain,
          transaction.xpnetAmount,
          transaction.destinationAddress,
          address
        );
        dispatch(updateHash(sourceHash));
        navigate(`/BridgingReport`);
      } catch (e) {
        console.log(e);
        setShowTransferLoader(false);
        dispatch(setError(e.message));
        /*if (!(e instanceof TransferError)) {
          // Some other error
          console.log(e);
          setErrorMsg("tranasaction failed");
          setShowError(true);
        }
        const assetId = e.data;
        setAssetId(assetId);
        setShowOptIn(true);*/
      }

      //navigate("/BridgingReport");
    }
  };

  return (
    <>
      <div className="flexColumn">
        <div className="transferBox confirm">
          <div className="wraperConfirm">
            <div className="connectWalletRow noMargin">
              <Link to="/Transfer" className="navBtn" style={{ margin: "0px" }}>
                <img src={backIcon}></img>
              </Link>
              <span className="connectWalletLabel">Bridging confirmation</span>
            </div>

            <div className="flexColumn" style={{ gap: "15px" }}>
              <div className="flexColumn" style={{ gap: "2px" }}>
                <div className="flexRow">
                  <label className="confirmTitle">Receiving</label>
                  <label className="recievingAmountLabel">
                    {format(transaction.xpnetAmount)}
                    <span className="confirmTextLabel">
                      &nbsp;{transaction.tokenSymbol}
                    </span>
                  </label>
                </div>
                <label className="xpnetValueDollar">
                  ${cutDigitAfterDot(recievingValueInDollar, 4)}
                </label>
              </div>
              <label className="line"></label>
              <div className="flexRow mobileColumn">
                <label className="confirmTitle">Sending amount</label>
                <div className="greyBox greyBoxMobileConfirmation">
                  {format(transaction.xpnetAmount)}
                  <label style={{ color: "#62718A" }}>
                    {transaction.tokenSymbol}
                    {/* <img src={editIcon} className="editBtn" onClick={editXpnetTokenAmount}/> */}
                  </label>
                </div>
              </div>
              <div className="flexRow mobileColumn">
                <label className="confirmTitle">Destination address</label>
                <div className="greyBox greyBoxMobileConfirmation">
                  <a
                    className="accountAddressLabel"
                    href={`${CHAINS_EXPLORERS[transaction.toChain]}${
                      transaction.destinationAddress
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {transaction.destinationAddress.slice(0, MAX_CHAR_ADDRESS) +
                      "..." +
                      transaction.destinationAddress.slice(-4)}
                  </a>
                  {/* <img src={copyIcon} /> */}
                </div>
              </div>
              <div className="flexRow mobileColumn">
                <label className="confirmTitle">Destination chain</label>
                <div className="greyBoxMobileConfirmation">
                  <label className="icontext centerMobile">
                    {transaction.toChain === CHAINS_TYPE.BSC ? (
                      <img src={bscIcon} />
                    ) : (
                      <img src={algorandIcon} />
                    )}
                    {transaction.toChain}
                  </label>
                </div>
              </div>
              <div className="flexRow mobileColumn">
                <label className="confirmTitle">Departure chain</label>
                <div className="greyBoxMobileConfirmation">
                  <label className="icontext centerMobile">
                    {transaction.fromChain === CHAINS_TYPE.BSC ? (
                      <img src={bscIcon} />
                    ) : (
                      <img src={algorandIcon} />
                    )}
                    {transaction.fromChain}
                  </label>
                </div>
              </div>
              <div className="flexRow mobileColumn">
                <label className="confirmTitle">Departure address</label>
                <div className="greyBox greyBoxMobileConfirmation">
                  <a
                    className="accountAddressLabel"
                    target="_blank"
                    rel="noreferrer"
                    href={`${
                      CHAINS_EXPLORERS[transaction.fromChain]
                    }${address}`}
                  >
                    {address.slice(0, MAX_CHAR_ADDRESS) +
                      "..." +
                      address.slice(-4)}
                  </a>
                  {/* <img src={copyIcon} /> */}
                </div>
              </div>
              <label className="line" />
              <div className="flexRow">
                <label className="confirmTitle marginTop">Fee</label>
                <label>
                  {cutDigitAfterDot(transaction.fee, 10)}{" "}
                  {CHAINS_TOKENS[transaction.fromChain]}
                </label>
              </div>
              <label className="line" />
              <div className="flexRow">
                <label className="confirmTitle">Approve transaction</label>
                <ToggleButton
                  className="togglebtn"
                  inactiveLabel={""}
                  activeLabel={""}
                  thumbStyle={{ height: "24px", width: "24px" }}
                  trackStyle={{ height: "24px" }}
                  colors={{
                    activeThumb: {
                      base: "rgb(253, 253, 253, 1)",
                    },
                    inactiveThumb: {
                      base: "rgb(253, 253, 253, 1)",
                    },
                    active: {
                      base: "rgba(57, 95, 235, 1)",
                      hover: "rgba(57, 95, 235, 1)",
                    },
                    inactive: {
                      base: "rgba(212, 215, 221, 1)",
                      hover: "rgba(212, 215, 221, 1)",
                    },
                  }}
                  value={approveTransaction}
                  onToggle={handleChangeApprove}
                />
              </div>
            </div>

            <button
              className="connectYourWalletBtn sendTranBtn"
              onClick={sendTransaction}
              disabled={!approveTransaction}
            >
              Send
            </button>
            <div className="secureLabel">
              <img src={secureIcon} />
              <label>Secure transaction</label>
            </div>
          </div>
        </div>
      </div>

      {showOptIn && (
        <OptInPopup assetId={assetId} closeOptin={() => setShowOptIn(false)} />
      )}
      {showApprovalLoader && (
        <div className="backgroundLoaders">{<ApprovalLoader />}</div>
      )}
      {showTransferLoader && (
        <div className="backgroundLoaders">
          <TransferLoader />
        </div>
      )}
      {showError && (
        <div className="backgroundLoaders">
          <Error errorMsg={errorMsg} closeError={() => setShowError(false)} />
        </div>
      )}
    </>
  );
}
