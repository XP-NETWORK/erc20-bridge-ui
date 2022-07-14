import React, { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { InjectedMetaMask } from "../utils/connectors";
import cancelBtn from "../img/close popup.svg";
import metaIcon from "../img/wallets/metamask.svg";
import MyAlgoIcon from "../img/myAlgo.png";
import trustWalletIcon from "../img/wallets/trust.svg";
import maiarIcon from "../img/wallets/maiar.svg";
import trezorIcon from "../img/wallets/trezor.svg";
import walletConnectIcon from "../img/wallets/WalletConnect.svg";

import MyAlgoConnect from "@randlabs/myalgo-connect";

export default function ConnectWallet(props) {
  const { ethereum } = window;
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const { activate, account, chainId, library, active } = useWeb3React();
  const [showMetaWallet, setShowMetaWallet] = useState(true);

  // console.log("account from wallet connect", account);
  // console.log("chainID from wallet connect", chainId);

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (isMetaConnected) {
      const requestAccount = async () => {
        await window.ethereum.send("eth_requestAccounts");
      };
      requestAccount().catch(console.error);
      // const signMessage = async () => {
      //   let signature = await sign(account);
      //   console.log("the signature now is:", signature);
      //   if (signature !== null || signature !== undefined || signature !== "") {
      //     dispatch(updateSignature(signature));
      //     // navigate("/MyWidgets");
      //   }
      // };
      // signMessage().catch(console.error);
    }
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
        params: [{ chainId: "0x4" }], // chainId must be in hexadecimal numbers
      });
      // handleCloseWallet();
    } catch (err) {
      console.log(err);
    }
  };

  const connectMyAlgoHandler = async () => {
    const myAlgoConnect = new MyAlgoConnect();
    try {
      const accountsSharedByUser = await myAlgoConnect.connect();
    } catch (e) {
      console.log(e);
    }
    // handleCloseWallet();
  };
  const handleCloseWallet = () => {
    console.log("close");
  };

  const activateAccount = async (accountToActivate) => {
    await activate(accountToActivate);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x4" }],
      });
    } catch (switchError) {
      console.log(switchError);
    }
  };

  return (
    <div className="connectWalletCompDiv">
      <div className="connectWalletRow">
        <label className="connectWalletLabel selfCenter">Connect Wallet</label>
        <button className="navBtn" onClick={handleCloseWallet}>
          <img src={cancelBtn}></img>
        </button>
      </div>
      <button
        className="WalletBtn"
        onClick={connectMetaMaskWalletHandler}
        disabled={!showMetaWallet}
      >
        <img src={metaIcon} className="walletIcon"></img>
        <label className="selfCenter">MetaMask</label>
      </button>
      {/* <button className="WalletBtn" onClick={connectMyAlgoHandler}>
        <img src={MyAlgoIcon} className="myAlgoIcon"></img>
        MyAlgo
      </button> */}
      <button className="WalletBtn" onClick={connectMyAlgoHandler}>
        <img src={trustWalletIcon}></img>
        <label className="selfCenter">Trust Wallet</label>
      </button>
      <button className="WalletBtn" onClick={connectMyAlgoHandler}>
        <img src={maiarIcon}></img>
        <label className="selfCenter">Maiar</label>
      </button>
      <button className="WalletBtn" onClick={connectMyAlgoHandler}>
        <img src={trezorIcon}></img>
        <label className="selfCenter">Trezor</label>
      </button>{" "}
      <button className="WalletBtn" onClick={connectMyAlgoHandler}>
        <img src={walletConnectIcon}></img>
        <label className="selfCenter">WalletConnect</label>
      </button>
    </div>
  );
}
