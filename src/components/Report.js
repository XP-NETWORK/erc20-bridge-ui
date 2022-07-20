import React from "react";
import cancelBtn from "../img/close popup.svg";
import auditedLogo from "../img/audited.svg";
import poweredByLogo from "../img/powered by xp.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import copyIcon from "../img/copy/default.svg";
import secureIcon from "../img/secure tx.svg";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateTransactionDetails } from "../store/accountSlice";
import { cutDigitAfterDot } from "../utils/utilsFunc";

export default function Report() {
  const MAX_CHAR_ADDRESS = 15;
  const transaction = useSelector((state) => state.account.transactionDetails);
  const address = useSelector((state) => state.account.address);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseReport = () => {
    dispatch(
      updateTransactionDetails({
        xpnetAmount: 0,
        destinationAddress: "",
        fromChain: "BSC",
        toChain: "Algorand",
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
              {transaction.toChain === "BSC" ? (
                <img src={bscIcon} className="blockchainImg" />
              ) : (
                <img src={algorandIcon} className="blockchainImg" />
              )}
              <label
                className="recievingAmountLabel"
                style={{ alignSelf: "center" }}
              >
                {transaction.xpnetAmount - transaction.fee}
                <span className="confirmTextLabel">&nbsp;XPNET</span>
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
                <div className="greyBox greyBoxMobileConfirmation">
                  <label className="accountAddressLabel">
                    1e10991a2f9d6ff36a5872bcd67d43aa9...4d72
                  </label>
                  <button>
                    <img
                      src={copyIcon}
                      className="copyImgIcon"
                      onClick={() => navigator.clipboard.writeText("copied")}
                    />
                  </button>
                </div>
              </div>
              <label className="line" />
              <div className="flexRow mobileColumn">
                <label className="confirmTitle">Departure Hash</label>
                <div className="greyBox greyBoxMobileConfirmation">
                  {transaction.fromChain === "BSC" ? (
                    <img src={bscIcon} />
                  ) : (
                    <img src={algorandIcon} />
                  )}

                  <label className="accountAddressLabel">
                    {address.slice(0, MAX_CHAR_ADDRESS) +
                      "..." +
                      address.slice(-4)}
                  </label>
                  <button>
                    <img
                      src={copyIcon}
                      className="copyImgIcon"
                      onClick={() => navigator.clipboard.writeText(address)}
                    />
                  </button>
                </div>
              </div>
              <label className="line" />
              <div className="flexRow ">
                <label className="confirmTitle">Fee</label>
                <label>
                  {transaction.fee} {transaction.fromChain}
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
