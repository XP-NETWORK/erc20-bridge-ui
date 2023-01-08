import React from "react";
import Connect from "./Connect";

import close from "../img/close popup.svg";
import { useDispatch } from "react-redux";
import { setPopup } from "../store/accountSlice";

export const Popup = (popup) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="blured"></div>
      <div className="wraperPopup walletList">
        <img
          src={close}
          alt="close"
          className="closePopup"
          onClick={() => dispatch(setPopup(null))}
        />
        <Connect cb={popup.cb} onConnect={() => dispatch(setPopup(null))} />
      </div>
    </>
  );
};
