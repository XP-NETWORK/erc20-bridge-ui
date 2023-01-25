import React, { useEffect, useState, useRef } from "react";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import copyIcon from "../img/copy/default.svg";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { cutDigitAfterDot } from "../utils/utilsFunc";
import {
    CHAINS_TYPE,
    CHAINS_EXPLORERS_TX,
    CHAINS_TOKENS,
} from "../utils/consts";

import TrxWatcher from "../service/transactions";
import { Loader } from "./loaders/Loader";
import TxnStatus from "./TxReports/TxnStatus";

const tw = TrxWatcher();

export default function Report() {
    const transaction = useSelector((state) => ({
        ...state.account.transactionDetails,
    }));

    const refInt = useRef(null);

    const sourceHash = useSelector((state) => state.account.sourceHash);

    const [destHash, setDesthash] = useState("");
    const [failedTrx, setFailedTrx] = useState(undefined);

    useEffect(() => {
        setTimeout(() => {}, 2000);
    }, []);

    const address = useSelector((state) => state.account.address);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        sourceHash &&
            (async () => {
                // debugger;
                if (transaction.fromChain === CHAINS_TYPE.BSC) {
                    const tx = await tw
                        .findAlgoTrx(sourceHash)
                        .catch(() => setFailedTrx(true));
                    if (tx) {
                        setFailedTrx(true);
                        setDesthash(tx);
                    }
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
                    if (tx) {
                        setFailedTrx(true);
                        setDesthash(tx);
                    }
                    return;
                }
            })();
    }, [sourceHash]);

    const handleCloseReport = () => {
        /* dispatch(
      updateTransactionDetails({
        xpnetAmount: 0,
        destinationAddress: "",
        fromChain: CHAINS_TYPE.BSC,
        toChain: CHAINS_TYPE.Algorand,
        fee: 0,
      })
    );*/

        refInt.current && clearInterval(refInt.current);
        //dispatch(reset());
        //navigate("/");
        window.open("/", "_self");
        //restart redux
    };

    return (
        <>
            <div className="flexColumn">
                <div className="transferBox report">
                    <div className="wraperConfirm">
                        <div className="connectWalletRow noMargin">
                            {/* <button
                                className="navBtn"
                                style={{ margin: "0px" }}
                                onClick={handleCloseReport}
                            >
                                <img src={cancelBtn} />
                            </button> */}
                            <label className="connectWalletLabel">
                                Bridging Report
                            </label>
                        </div>

                        <div
                            className="flexColumn center"
                            style={{ gap: "2px" }}
                        >
                            {transaction.toChain === CHAINS_TYPE.BSC ? (
                                <img
                                    src={bscIcon}
                                    className="blockchainImg"
                                    alt="#"
                                />
                            ) : (
                                <img
                                    src={algorandIcon}
                                    className="blockchainImg"
                                    alt="#"
                                />
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
                                $
                                {cutDigitAfterDot(
                                    transaction.recievingValueInDollar,
                                    4
                                )}
                            </label>
                        </div>
                        <div className="flexColumn">
                            {failedTrx !== undefined && (
                                <>
                                    <TxnStatus hash={sourceHash} />
                                    <div className="line"></div>
                                </>
                            )}
                            <div className="flexRow mobileColumn">
                                <label
                                    className="confirmTitle"
                                    style={{ width: "190px" }}
                                >
                                    Departure Hash
                                </label>
                                <div
                                    className={`greyBox greyBoxMobileConfirmation ${
                                        sourceHash ? "reportAddres" : ""
                                    }`}
                                >
                                    {transaction.fromChain ===
                                    CHAINS_TYPE.BSC ? (
                                        <img src={bscIcon} />
                                    ) : (
                                        <img src={algorandIcon} />
                                    )}

                                    <a
                                        className="accountAddressLabel"
                                        href={`${
                                            CHAINS_EXPLORERS_TX[
                                                transaction.fromChain
                                            ]
                                        }${sourceHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {sourceHash
                                            .slice(0, 12)
                                            ?.toUpperCase() +
                                            "..." +
                                            sourceHash.slice(-4)?.toUpperCase()}
                                    </a>
                                    <button>
                                        <img
                                            src={copyIcon}
                                            className="copyImgIcon"
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    sourceHash
                                                )
                                            }
                                            alt="#"
                                        />
                                    </button>
                                </div>
                            </div>
                            <label className="line" />
                            <div className="flexRow mobileColumn">
                                <label
                                    className="confirmTitle"
                                    style={{ width: "177px" }}
                                >
                                    Destination Hash
                                </label>
                                <div
                                    className={`greyBox greyBoxMobileConfirmation ${
                                        destHash ? "reportAddres" : ""
                                    }`}
                                >
                                    {transaction.toChain === CHAINS_TYPE.BSC ? (
                                        <img src={bscIcon} />
                                    ) : (
                                        <img src={algorandIcon} />
                                    )}
                                    {destHash ? (
                                        <a
                                            className="accountAddressLabel"
                                            href={`${
                                                CHAINS_EXPLORERS_TX[
                                                    transaction.toChain
                                                ]
                                            }${destHash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {destHash
                                                ?.slice(0, 10)
                                                ?.toUpperCase() +
                                                "..." +
                                                destHash
                                                    ?.slice(-4)
                                                    ?.toUpperCase()}
                                        </a>
                                    ) : (
                                        <Loader />
                                    )}
                                    <button>
                                        <img
                                            src={copyIcon}
                                            className="copyImgIcon"
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    address
                                                )
                                            }
                                            alt="#"
                                        />
                                    </button>
                                </div>
                            </div>

                            <label className="line" />
                            <div className="flexRow fees">
                                <label className="confirmTitle">
                                    XP Bridge Fee
                                </label>
                                <label>
                                    {cutDigitAfterDot(transaction.fee, 10)}{" "}
                                    {CHAINS_TOKENS[transaction.fromChain]}
                                </label>
                            </div>
                        </div>
                        {sourceHash && (
                            <button
                                onClick={() =>
                                    window.open(
                                        "https://stake-testing.xp.network/",
                                        "_top"
                                    )
                                }
                                className="connectYourWalletBtn"
                            >
                                Stake $XPNET
                            </button>
                        )}
                        {/* <div className="secureLabel">
                            <img src={secureIcon} />
                            <label>Secure transaction</label>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}
