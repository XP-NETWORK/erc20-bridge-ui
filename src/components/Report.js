import React, { useEffect, useState, useRef } from "react";
import cancelBtn from "../img/close popup.svg";
import auditedLogo from "../img/audited.svg";
import poweredByLogo from "../img/powered by xp.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import copyIcon from "../img/copy/default.svg";
import failed from "../img/icon/failed.svg";
import secureIcon from "../img/secure tx.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateTransactionDetails, updateHash } from "../store/accountSlice";
import { cutDigitAfterDot } from "../utils/utilsFunc";
import {
  CHAINS_TYPE,
  CHAINS_EXPLORERS_TX,
  CHAINS_TOKENS,
} from "../utils/consts";

import TrxWatcher from "../service/transactions";
import { Loader } from "./loaders/Loader";

const tw = TrxWatcher();

export default function Report() {
  const MAX_CHAR_ADDRESS = 15;
  const transaction = useSelector((state) => ({
    ...state.account.transactionDetails,
    //toChain: CHAINS_TYPE.BSC,
    //fromChain: CHAINS_TYPE.Algorand,
  }));

  const refInt = useRef(null);

  const sourceHash = useSelector((state) => state.account.sourceHash);
  const [destHash, setDesthash] = useState("");
  const [failedTrx, setFailedTrx] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      //dispatch(updateHash('0xc1fc4c0dc9885fcdb30fd06f7a28460fe2a328c5c57b2ba9c07db6bc4231b3d0'))
      //setFailedTrx(true);
    }, 2000);
  }, []);

  //const desthash = ""; //"4FYIXFPO5XC45WNF47I53EIZX7J3ST5VOM6RZELB4LWEZWELBZ5A";

  const address = useSelector((state) => state.account.address);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    sourceHash &&
      (async () => {
        if (transaction.fromChain === CHAINS_TYPE.BSC) {
          const tx = await tw
            .findAlgoTrx(sourceHash)
            .catch(() => setFailedTrx(true));
          tx && setDesthash(tx);
          return;
        }

        if (transaction.fromChain === CHAINS_TYPE.Algorand) {
          const tx = await tw
            .findEvmTrx(
              sourceHash,
              transaction.destinationAddress,
              (interval) => {
                refInt.current = interval;
              }
            )
            .catch(() => setFailedTrx(true));
          tx && setDesthash(tx);

          return;
        }
      })();
  }, [sourceHash]);

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

    refInt.current && clearInterval(refInt.current);
    navigate("/");
    //restart redux
  };

  return (
    <>
      <div className="flexColumn">
        <div className="transferBox report">
          <div className="wraperConfirm">
            <div className="connectWalletRow noMargin">
              <button
                className="navBtn"
                style={{ margin: "0px" }}
                onClick={handleCloseReport}
              >
                <img src={cancelBtn} />
              </button>
              <label className="connectWalletLabel">Bridging Report</label>
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
                {cutDigitAfterDot(transaction.xpnetAmount, 3)}
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
              {/*<label className="confirmTitle mobileOnly">
                  Transaction ID
              </label>*/}
              <div className="flexRow mobileColumn">
                <label className="confirmTitle" style={{ width: "177px" }}>
                  Destination Hash
                </label>
                <div className="greyBox greyBoxMobileConfirmation">
                  {transaction.toChain === CHAINS_TYPE.BSC ? (
                    <img src={bscIcon} />
                  ) : (
                    <img src={algorandIcon} />
                  )}

                  {failedTrx ? (
                    <div className="failedTrx">
                      {" "}
                      <span>Fail</span> <img src={failed} alt="failed" />
                    </div>
                  ) : destHash ? (
                    <a
                      className="accountAddressLabel"
                      href={`${
                        CHAINS_EXPLORERS_TX[transaction.toChain]
                      }${destHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {destHash.slice(0, 13) + "..." + destHash.slice(-4)}
                    </a>
                  ) : (
                    <Loader />
                  )}
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

                  <a
                    className="accountAddressLabel"
                    href={`${
                      CHAINS_EXPLORERS_TX[transaction.fromChain]
                    }${sourceHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {sourceHash.slice(0, 12) + "..." + sourceHash.slice(-4)}
                  </a>
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
              <div className="flexRow fees">
                <label className="confirmTitle">Fee</label>
                <label>
                  {cutDigitAfterDot(transaction.fee, 10)}{" "}
                  {CHAINS_TOKENS[transaction.fromChain]}
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
