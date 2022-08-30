import React, { useEffect, useState } from "react";
import metaIcon from "../img/wallets/metamask.svg";
import MyAlgoIcon from "../img/myalgo-logo.svg";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import {
  connectedAccount,
  updateTransactionDetails,
  iniTransactionDetails,
} from "../store/accountSlice";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { InjectedMetaMask } from "../utils/connectors";
import { useNavigate } from "react-router-dom";
import { checkIfOptIn, getFees } from "../erc20/erc20Utils";
import OptInPopup from "./errors/OptInPopup";
import Error from "./errors/Error";
import { CHAINS_TYPE } from "../utils/consts";
import { useLocation } from "react-router";
export const connectAlgo = async () => {
  const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });

  const settings = {
    shouldSelectOneAccount: false,
    openManager: true,
  };
  const accountsSharedByUser = await myAlgoConnect
    .connect(settings)
    .catch((e) => {
      throw e;
    });

  return accountsSharedByUser;
};

export const connectMM = async (activate, acc) => {
  console.log("grisha boris");
  if (!window.ethereum) {
    alert("Install metaMask");
    return;
  }
  try {
    await activate(acc);
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }], // chainId must be in hexadecimal numbers
    });
  } catch (e) {
    throw e;
  }
};

export default function Connect() {
  const { ethereum } = window;
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const { activate, account, chainId, library, active } = useWeb3React();
  const [showMetaWallet, setShowMetaWallet] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loc = useLocation();

  useEffect(() => {
    if (isMetaConnected) {
      const requestAccount = async () => {
        await window.ethereum.send("eth_requestAccounts");
      };
      requestAccount().catch(console.error);
    }

    loc.pathname !== "/" && dispatch(connectedAccount(account));
  }, [account]);

  useEffect(() => {
    if (!ethereum && window.innerWidth > 600) {
      console.log("please install MetaMask");
      setShowMetaWallet(false);
    }
  }, []);

  const connectMetaMaskWalletHandler = async () => {
    try {
      if (!window.ethereum && window.innerWidth <= 600) {
        const link = `https://metamask.app.link/dapp/${window.location.host}/`;
        window.open(link);
        return;
      }

      await connectMM(activate, InjectedMetaMask);

      // handleCloseWallet();
      navigate("/Transfer");
    } catch (err) {
      console.log(err);
      setErrorMsg("connection to wallet failed, please try again");
      setShowError(true);
    }
  };

  const connectMyAlgoHandler = async () => {
    //const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });
    try {
      const accountsSharedByUser = await connectAlgo();

      if (accountsSharedByUser[0]?.address) {
        dispatch(connectedAccount(accountsSharedByUser[0].address));
        dispatch(
          updateTransactionDetails({
            ...iniTransactionDetails,
            fromChain: CHAINS_TYPE.Algorand,
            toChain: CHAINS_TYPE.BSC,
          })
        );
        navigate("/Transfer");
      }

      //heckIfOptIn(accountsSharedByUser[0].address);
    } catch (e) {
      console.log(e);
      setErrorMsg("connection to wallet failed, please try again");
      setShowError(true);
    }
    // handleCloseWallet();
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
          <div className="walletsWrapper">
            <div className="walletItem">
              <img
                src={metaIcon}
                className="btnWallet"
                onClick={connectMetaMaskWalletHandler}
              />
              <span>MetaMask</span>
            </div>
            <div className="walletItem">
              <img
                src={MyAlgoIcon}
                className="btnWallet"
                onClick={connectMyAlgoHandler}
              />
              <span>MyAlgo</span>
            </div>
          </div>
        </div>
      </div>

      {showError && (
        <Error
          errorMsg={errorMsg}
          closeError={() => {
            setShowError(false);
          }}
        />
      )}
    </div>
  );
}
