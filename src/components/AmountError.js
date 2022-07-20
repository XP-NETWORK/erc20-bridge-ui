import React, { useEffect, useState } from "react";
import closeIcon from "../img/close white.svg";

export default function AmountError(props) {
  const closeAmountError = () => {
    props.showAmountError(false);
  };

  return (
    <div className="addressError amountError">
      <label className="addressErrorLabel">
        Amount is greater than wallet balance
      </label>
      <button onClick={closeAmountError} style={{ cursor: "pointer" }}>
        <img src={closeIcon} />
      </button>
    </div>
  );
}
