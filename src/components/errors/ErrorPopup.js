import MyAlgoIcon from "../../img/myalgo-logo.svg";
import { useNavigate } from "react-router-dom";
import { bridge, getMyAlgoConnect } from "../../erc20/erc20Utils";
import { ChainNonce } from "xpjs-erc20";
import { useState } from "react";

import { setError } from "../../store/accountSlice";
import Error from "./Error";
import { useDispatch } from "react-redux";
import ERROR from "../../img/icon/ERROR.svg";
import close from "../../img/close popup.svg";

export default function ErrorPopup({ errorMgs }) {
  //const transaction = useSelector((state) => state.account.transactionDetails);

  // const [showError, setShowError] = useState(false);
  //const [errorMsg, setErrorMsg] = useState("");

  // const handleCloseWallet = () => {
  //   props.isOpen(false);
  // };

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
      </div>
    </>
  );
}
