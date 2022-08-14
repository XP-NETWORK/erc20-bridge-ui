import React from "react";
import error from "../../img/ERROR.svg";
import closeBtn from "../../img/close popup.svg";

export default function Error(props) {
  const handleCloseError = () => {
    props.closeError(true);
  };

  return (
    <>
      <div className="errorBackground">
        <div className="wraperPopup error" style={{ height: "auto" }}>
          <button
            className="closeError"
            onClick={handleCloseError}
            style={{ alignSelf: "flex-end" }}
          >
            <img src={closeBtn}></img>
          </button>
          <h1 className="transferBoxTitle">Error</h1>
          <img src={error} />
          {props.errorMsg}
        </div>
      </div>
    </>
  );
}
