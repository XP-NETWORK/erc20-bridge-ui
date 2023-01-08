import React from "react";
import { Modal } from "react-bootstrap";
import "../../style/transferLoadersStyle.css";

export default function TransferLoader() {
  return (
    <>
      <div className="blured"></div>
      <div className="wraperPopup ">
        <div className="transfer-loader__animation">
          <Animation />
        </div>

        <div className="transfer-loader__title">Transaction Processing</div>
        <div className="transfer-loader__text">
          The transaction time is unpredictably long due to the congestion on
          the blockchain.
        </div>
        <div className="transfer-loader__sub">💙 Please be patient</div>
      </div>
    </>
  );
}

function Animation() {
  return (
    <div className="center scale">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  );
}
