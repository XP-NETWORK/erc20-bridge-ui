import React, { useEffect, useState } from "react";
import closeIcon from "../../img/close white.svg";
export default function AddressError(props) {
  // const [showAddressError, setShowAddressError] = useState(true);

  const closeAddressError = () => {
    props.showAddressError(false);
  };

  return (
    <div className="addressError">
      <label className="addressErrorLabel">Paste destination address</label>
      <button onClick={closeAddressError} style={{ cursor: "pointer" }}>
        <img src={closeIcon} />
      </button>
    </div>
  );
}
