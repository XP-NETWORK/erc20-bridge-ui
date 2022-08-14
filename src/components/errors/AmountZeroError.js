import React, { useEffect, useState } from "react";
import closeIcon from "../../img/close white.svg";
export default function AmountZeroError(props) {
  // const [showAddressError, setShowAddressError] = useState(true);

  const closeAmountZeroError = () => {
    props.showAmountZeroError(false);
  };

  return (
    <div className="addressError">
      <label className="addressErrorLabel">Enter amount to continue</label>
      <button onClick={closeAmountZeroError} style={{ cursor: "pointer" }}>
        <img src={closeIcon} />
      </button>
    </div>
  );
}
