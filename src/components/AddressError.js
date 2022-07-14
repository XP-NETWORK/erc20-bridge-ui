import React from "react";
import closeIcon from "../img/close white.svg";
export default function AddressError() {
  return (
    <div className="addressError">
      <label className="addressErrorLabel">Paste destination address</label>
      <img src={closeIcon} />
    </div>
  );
}
