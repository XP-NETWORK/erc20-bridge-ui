import MyAlgoIcon from "../../img/myalgo-logo.svg";
import { useNavigate } from "react-router-dom";
import { bridge, getMyAlgoConnect } from "../../erc20/erc20Utils";
import { ChainNonce } from "xpjs-erc20";
import { useState } from "react";

import { setError } from "../../store/accountSlice";
import Error from "./Error";
import { useDispatch, useSelector } from "react-redux";
import ERROR from "../../img/icon/ERROR.svg";
import close from "../../img/close popup.svg";

import { getMyAlgoSigner } from "../../erc20/erc20Utils";
import Button from "@restart/ui/esm/Button";

export default function ErrorPopup({ errorMgs }) {
  const address = useSelector(
    (state) => state.account.transactionDetails.destinationAddress
  );
  //const transaction = useSelector((state) => state.account.transactionDetails);

  // const [showError, setShowError] = useState(false);
  //const [errorMsg, setErrorMsg] = useState("");

  // const handleCloseWallet = () => {
  //   props.isOpen(false);
  // };

  const optIn = async (id) => {
    const signer = await getMyAlgoSigner(address);
    console.log("signer", signer);
    const algo = await bridge.inner(ChainNonce.Algorand);
    if (id !== "") {
      console.log("in");
      try {
        await algo.optInAsa(signer, Number(id));
      } catch (e) {
        console.log("cannot opt in", e);
      }
    }
  };

  const d = useDispatch();

  return (
    <>
      <div className="wraperPopup errorPopup">
        <img
          src={close}
          alt="close"
          className="closePopup"
          onClick={() => d(setError(""))}
        />
        <img src={ERROR} alt="error" />
        <h1>{errorMgs}</h1>
        {errorMgs?.includes("Please add asset") && (
          <button
            className="connectYourWalletBtn sendTranBtn optInBtn"
            onClick={() => optIn(errorMgs.replace(/[^0-9]/g, ""))}
          >
            Opt in
          </button>
        )}
      </div>
    </>
  );
}
