import React, { useEffect, useState } from "react";
import closeIcon from "../../img/close white.svg";

export default function WrongAddressError(props) {
  const closeWrongAddressError = () => {
    props.showWrongAddressError(false);
  };

  return (
    <div className="addressError amountError">
      <label className="addressErrorLabel">
        The address you entered is not in the correct format. Please check.
      </label>
      <button onClick={closeWrongAddressError} style={{ cursor: "pointer" }}>
        <img src={closeIcon} />
      </button>
    </div>
  );
}
