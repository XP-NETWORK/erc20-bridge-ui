import MyAlgoIcon from "../../img/myalgo-logo.svg";
import { useNavigate } from "react-router-dom";
import { bridge, getMyAlgoConnect } from "../../erc20/erc20Utils";
import { ChainNonce } from "xpjs-erc20";
import { useState } from "react";
import copyIcon from "./../../img/copy/default.svg";

import {
    setError,
    connectedAccount,
    updateTransactionDetails,
    setSigner,
    setPopup,
    setOptinTimeOut,
} from "../../store/accountSlice";
import Error from "./Error";
import { useDispatch, useSelector } from "react-redux";
import ERROR from "../../img/icon/ERROR.svg";
import close from "../../img/close popup.svg";

import { truncate } from "../../utils/utilsFunc";
import { connectAlgoSigner } from "../Connect";
import { getMyAlgoSigner } from "../../erc20/erc20Utils";

import Button from "@restart/ui/esm/Button";

import Connect from "../Connect";

export default function ErrorPopup({ errorObject }) {
    const [fetching, setFetching] = useState(false);
    const address = useSelector(
        (state) => state.account.transactionDetails.destinationAddress
    );

    const navigate = useNavigate();
    const storedSigner = useSelector((state) => state.account.signer);
    //const transaction = useSelector((state) => state.account.transactionDetails);

    // const [showError, setShowError] = useState(false);
    //const [errorMsg, setErrorMsg] = useState("");

    // const handleCloseWallet = () => {
    //   props.isOpen(false);
    // };

    // const optIn = async (id) => {
    //     setFetching(true);
    //     const signer = storedSigner || (await getMyAlgoSigner(address));
    //     console.log("signer", signer);
    //     const algo = await bridge.inner(ChainNonce.Algorand);
    //     if (id !== "") {
    //         try {
    //             const tx = await algo.optInAsa(signer, Number(id));
    //             if (tx) {
    //                 return dispatch(setError(""));
    //             }
    //         } catch (e) {
    //             console.log("cannot opt in", e);
    //         }
    //         setFetching(false);
    //     }
    // };

    const dispatch = useDispatch();

    const handleRefreshClick = () => {
        debugger;
        dispatch(setOptinTimeOut(true));
        dispatch(setError(""));
    };

    let content;

    switch (errorObject.type) {
        case "selectWallet": {
            content = (
                <>
                    <h1>Please select your Algorand wallet</h1>
                    <ul className="algoWalletList walletsWrapper">
                        {errorObject.data.map((w, index) => {
                            return (
                                <li
                                    className="walletItem"
                                    key={`wallet-${index}`}
                                    onClick={() => {
                                        connectAlgoSigner(w.address, dispatch);
                                        dispatch(setError(""));
                                        dispatch(setPopup(null));
                                    }}
                                >
                                    {truncate(w.address, 30)}
                                </li>
                            );
                        })}
                    </ul>
                </>
            );
            break;
        }
        case "optin": {
            content = (
                <>
                    <div className="opt-in-action__container">
                        <div className="opt-in-action-text">
                            To complete the transaction please opt-in the
                            following Asset ID in you Algorand wallet
                        </div>
                        <div className="asset-id__container">
                            {`${errorObject.data.replace(/[^0-9]/g, "")}`}
                            <button>
                                <img
                                    src={copyIcon}
                                    className="copyImgIcon"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            errorObject.data.replace(
                                                /[^0-9]/g,
                                                ""
                                            )
                                        )
                                    }
                                    alt="#"
                                />
                            </button>
                        </div>
                    </div>
                    {/* <div
                        onClick={handleRefreshClick}
                        className="opt-in-refresh"
                    >
                        Refresh
                    </div> */}
                </>
            );
            break;
        }
        default:
            content = <h1>{errorObject.data}</h1>;
    }

    return (
        <>
            <div className="blured"></div>
            <div className="wraperPopup errorPopup">
                <img
                    src={close}
                    alt="close"
                    className="closePopup"
                    onClick={() => {
                        dispatch(setOptinTimeOut(true));
                        dispatch(setError(""));
                    }}
                />
                <img src={ERROR} alt="error" />
                {content}
            </div>
        </>
    );
}

/**
 * 
 *  <button
            className="connectYourWalletBtn sendTranBtn optInBtn"
            onClick={() => !fetching && optIn(errorMgs.replace(/[^0-9]/g, ""))}
          >
            Opt in
          </button>
 */
