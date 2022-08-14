import MyAlgoIcon from "../../img/myalgo-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bridge, getMyAlgoConnect } from "../../erc20/erc20Utils";
import { ChainNonce } from "xpjs-erc20";
import { useState } from "react";
import Error from "./Error";

export default function OptInPopup(props) {
  const transaction = useSelector((state) => state.account.transactionDetails);

  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const connectMyAlgoHandler = async () => {
    const signer = await getMyAlgoConnect(transaction.destinationAddress);
    console.log("signer", signer);
    const algo = await bridge.inner(ChainNonce.Algorand);
    if (props.assetId !== "") {
      console.log("in");
      try {
        await algo.optInAsa(signer, props.assetId);
        props.closeOptin(false);
      } catch (e) {
        console.log("cannot opt in", e);
        setErrorMsg("opt in failed");
        setShowError(true);
      }
    }
  };

  // const handleCloseWallet = () => {
  //   props.isOpen(false);
  // };

  return (
    <>
      <div className="wraperPopup">
        <h1 className="transferBoxTitle">Opt In Error</h1>
        The reciever must opted in token to his account
        <img
          src={MyAlgoIcon}
          className="btnWallet"
          onClick={connectMyAlgoHandler}
        />
      </div>

      {showError && (
        <Error
          errorMsg={errorMsg}
          closeError={() => {
            setShowError(false);
          }}
        />
      )}
    </>
  );
}
