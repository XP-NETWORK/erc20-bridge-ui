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
import { MAX_CHAR_ADDRESS } from "../utils/consts";
import { cutDigitAfterDot, numberWithCommas } from "../utils/utilsFunc";

export default function Confirmation() {
  const [approveTransaction, setApproveTransaction] = useState(false);
  const [recievingValueInDollar, setRecievingValueInDollar] = useState(0);
  const transaction = useSelector((state) => state.account.transactionDetails);
  const address = useSelector((state) => state.account.address);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let valueInDollar =
      (transaction.xpnetAmount - transaction.fee) * transaction.xpnetTokenPrice;
    setRecievingValueInDollar(valueInDollar);
  }, [transaction.xpnetAmount, transaction.fee, transaction.xpnetTokenPrice]);

  const handleChangeApprove = (e) => {
    setApproveTransaction(e.checked);
  };

  const editXpnetTokenAmount = () => {};

  const sendTransaction = () => {
    // TO DO : send transaction
    if (approveTransaction) {
      navigate("/BridgingReport");
    }
  };
  return (
    <>
      <div className="flexColumn">
        <div className="transferBox">
          <div className="wraperConfirm">
            <div
              className="connectWalletRow noMargin"
              style={{ justifyContent: "flex-start" }}
            >
              <label className="connectWalletLabel selfCenter">
                Bridging confirmation
              </label>
              <Link to="/" className="navBtn" style={{ margin: "0px" }}>
                <img src={backIcon}></img>
              </Link>
            </div>

            <div className="flexColumn" style={{ gap: "15px" }}>
              <div className="flexColumn" style={{ gap: "2px" }}>
                <div className="flexRow">
                  <label className="confirmTitle">Receiving</label>
                  <label className="recievingAmountLabel">
                    {numberWithCommas(
                      transaction.xpnetAmount - transaction.fee
                    )}
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
                  {numberWithCommas(transaction.xpnetAmount)}
                  <label style={{ color: "#62718A" }}>
                  {transaction.tokenSymbol}
                    {/* <img src={editIcon} className="editBtn" onClick={editXpnetTokenAmount}/> */}
                  </label>
                </div>
              </div>
              <div className="flexRow mobileColumn">
                <label className="confirmTitle">Destination address</label>
                <div
                  className="greyBox greyBoxMobileConfirmation"
                  style={{ width: "207px" }}
                >
                  <label className="accountAddressLabel">
                    {transaction.destinationAddress.slice(0, MAX_CHAR_ADDRESS) +
                      "..." +
                      transaction.destinationAddress.slice(-4)}
                  </label>
                  {/* <img src={copyIcon} /> */}
                </div>
              </div>
              <div className="flexRow mobileColumn">
                <label className="confirmTitle">Destination chain</label>
                <div className="greyBoxMobileConfirmation">
                  <label className="icontext centerMobile">
                    {transaction.toChain === "BSC" ? (
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
                    {transaction.fromChain === "BSC" ? (
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
                <div
                  className="greyBox greyBoxMobileConfirmation"
                  style={{ width: "207px" }}
                >
                  <label className="accountAddressLabel">
                    {address.slice(0, MAX_CHAR_ADDRESS) +
                      "..." +
                      address.slice(-4)}
                  </label>
                  {/* <img src={copyIcon} /> */}
                </div>
              </div>
              <label className="line" />
              <div className="flexRow">
                <label className="confirmTitle marginTop">Fee</label>
                <label>
                  {cutDigitAfterDot(transaction.fee, 2)} {transaction.fromChain}
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
                  onToggle={(value) => {
                    setApproveTransaction(!approveTransaction);
                  }}
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
    </>
  );
}
