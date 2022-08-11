import React, { useEffect, useState } from "react";
import metaIcon from "../img/wallets/metamask.svg";
import MyAlgoIcon from "../img/myalgo-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { connectedAccount } from "../store/accountSlice";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { InjectedMetaMask } from "../utils/connectors";
import { useNavigate } from "react-router-dom";
import {
  bridge,
  checkIfOptIn,
  getFees,
  getMyAlgoConnect,
} from "../erc20/erc20Utils";
import { ChainNonce } from "xpjs-erc20";

export default function OptInPopup(props) {
  //const { ethereum } = window;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transaction = useSelector((state) => state.account.transactionDetails);

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
      }
    }
  };

  // const handleCloseWallet = () => {
  //   props.isOpen(false);
  // };

  return (
    <div className="wraperPopup">
      <h1 className="transferBoxTitle">Opt In Error</h1>
      The reciever must opted in token to his account
      <img
        src={MyAlgoIcon}
        className="btnWallet"
        onClick={connectMyAlgoHandler}
      />
    </div>
  );
}
