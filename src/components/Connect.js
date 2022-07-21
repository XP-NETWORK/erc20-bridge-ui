import React, { useEffect, useState } from "react";
import metaIcon from "../img/wallets/metamask.svg";
// import images from "../utils/imges";
import MyAlgoIcon from "../img/myalgo-logo.svg";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { connectedAccount } from "../store/accountSlice";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { InjectedMetaMask } from "../utils/connectors";
import { useNavigate } from "react-router-dom";

export default function Connect() {
  const { ethereum } = window;
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const { activate, account, chainId, library, active } = useWeb3React();
  const [showMetaWallet, setShowMetaWallet] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMetaConnected) {
      const requestAccount = async () => {
        await window.ethereum.send("eth_requestAccounts");
      };
      requestAccount().catch(console.error);
    }
    dispatch(connectedAccount(account));
  }, [account]);

  useEffect(() => {
    if (!ethereum) {
      console.log("please install MetaMask");
      setShowMetaWallet(false);
    }
  }, []);

  const connectMetaMaskWalletHandler = async () => {
    try {
      await activateAccount(InjectedMetaMask);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }], // chainId must be in hexadecimal numbers
      });
      // handleCloseWallet();
      navigate("/Transfer");
    } catch (err) {
      console.log(err);
    }
  };

  const connectMyAlgoHandler = async () => {
    const myAlgoConnect = new MyAlgoConnect();
    try {
      const accountsSharedByUser = await myAlgoConnect.connect();
      console.log("algo connect", accountsSharedByUser);
      dispatch(connectedAccount(accountsSharedByUser[0].address));
    } catch (e) {
      console.log(e);
    }
    // handleCloseWallet();
    navigate("/Transfer");
  };

  // const handleCloseWallet = () => {
  //   props.isOpen(false);
  // };

  const activateAccount = async (accountToActivate) => {
    await activate(accountToActivate);
  };

  return (
    <div className="flexColumn">
      <div className="transferBox">
        <div className="wraper">
          <h1 className="transferBoxTitle">
            Transfer asset <br />
            between blockchains
          </h1>
          <img
            src={metaIcon}
            className="btnWallet"
            onClick={connectMetaMaskWalletHandler}
          />
          <img
            src={MyAlgoIcon}
            className="btnWallet"
            onClick={connectMyAlgoHandler}
          />
        </div>
      </div>
    </div>
  );
}
