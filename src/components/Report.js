import React, { useEffect } from "react";
import cancelBtn from "../img/close popup.svg";
import auditedLogo from "../img/audited.svg";
import poweredByLogo from "../img/powered by xp.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import copyIcon from "../img/copy/default.svg";
import secureIcon from "../img/secure tx.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateTransactionDetails } from "../store/accountSlice";
import { cutDigitAfterDot } from "../utils/utilsFunc";
import { CHAINS_TYPE } from "../utils/consts";

export default function Report() {
  const MAX_CHAR_ADDRESS = 15;
  const transaction = useSelector((state) => state.account.transactionDetails);
  const sourceHash = useSelector((state) => state.account.sourceHash);
  console.log("source hasg report comp", sourceHash);

  const address = useSelector((state) => state.account.address);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseReport = () => {
    dispatch(
      updateTransactionDetails({
        xpnetAmount: 0,
        destinationAddress: "",
        fromChain: CHAINS_TYPE.BSC,
        toChain: CHAINS_TYPE.Algorand,
        fee: 0,
      })
    );
    navigate("/");
    //restart redux
  };

  return (
    <>
      <div className="flexColumn">
        <div className="transferBox">
          <div className="wraperConfirm">
            <div className="connectWalletRow noMargin">
              <label className="connectWalletLabel selfCenter">
                Bridging Report
              </label>
              <button
                className="navBtn"
                style={{ margin: "0px" }}
                onClick={handleCloseReport}
              >
                <img src={cancelBtn} />
              </button>
            </div>

            <div className="flexColumn center" style={{ gap: "2px" }}>
              {transaction.toChain === CHAINS_TYPE.BSC ? (
                <img src={bscIcon} className="blockchainImg" />
              ) : (
                <img src={algorandIcon} className="blockchainImg" />
              )}
              <label
                className="recievingAmountLabel"
                style={{ alignSelf: "center" }}
              >
                {cutDigitAfterDot(transaction.xpnetAmount - transaction.fee, 3)}
                <span className="confirmTextLabel">
                  &nbsp;{transaction.tokenSymbol}
                </span>
              </label>
              <label
                className="xpnetValueDollar center"
                style={{ justifyContent: "center" }}
              >
                ${cutDigitAfterDot(transaction.recievingValueInDollar, 4)}
              </label>
            </div>
            <div className="flexColumn">
              <div className="mobileColumn">
                <label className="confirmTitle mobileOnly">
                  Transaction ID
                </label>
                <div className="flexRow mobileColumn">
                  <label className="confirmTitle" style={{ width: "177px" }}>
                    Destination hash
                  </label>
                  <div className="greyBox greyBoxMobileConfirmation">
                    {transaction.toChain === CHAINS_TYPE.BSC ? (
                      <img src={bscIcon} />
                    ) : (
                      <img src={algorandIcon} />
                    )}

                    {/* <label className="accountAddressLabel">
                    {address.slice(0, MAX_CHAR_ADDRESS) +
                      "..." +
                      address.slice(-4)}
                  </label> */}
                    <button>
                      <img
                        src={copyIcon}
                        className="copyImgIcon"
                        onClick={() => navigator.clipboard.writeText(address)}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <label className="line" />
              <div className="flexRow mobileColumn">
                <label className="confirmTitle" style={{ width: "190px" }}>
                  Departure Hash
                </label>
                <div className="greyBox greyBoxMobileConfirmation">
                  {transaction.fromChain === CHAINS_TYPE.BSC ? (
                    <img src={bscIcon} />
                  ) : (
                    <img src={algorandIcon} />
                  )}

                  <label className="accountAddressLabel">
                    {sourceHash.slice(0, MAX_CHAR_ADDRESS) +
                      "..." +
                      sourceHash.slice(-4)}
                  </label>
                  <button>
                    <img
                      src={copyIcon}
                      className="copyImgIcon"
                      onClick={() => navigator.clipboard.writeText(sourceHash)}
                    />
                  </button>
                </div>
              </div>
              <label className="line" />
              <div className="flexRow ">
                <label className="confirmTitle">Fee</label>
                <label>
                  {cutDigitAfterDot(transaction.fee, 10)}{" "}
                  {transaction.fromChain}
                </label>
              </div>
            </div>
            {/* <button className="connectYourWalletBtn">Bridge explorer</button> */}
            <div className="secureLabel">
              {/* <img src={secureIcon} />
              <label>Secure transaction</label> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
