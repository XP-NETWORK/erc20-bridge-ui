import "./App.css";
import Confirmation from "./components/Confirmation";
import ConnectWallet from "./components/ConnectWallet";
import Footer from "./components/Footer";
import { useRef } from "react";
import Report from "./components/Report";
import Transfer from "./components/Transfer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { connectedAccount } from "./store/accountSlice";
import Connect from "./components/Connect";
import { io } from "socket.io-client";
import ErrorPopup from "./components/errors/ErrorPopup";
import { ethers } from "ethers";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import transactions from "./service/transactions";

import ChainFabric from "./service/chain";

const tw = transactions();

function App() {
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const dispatch = useDispatch();

  const loc = useLocation();
  const navigate = useNavigate();

  const { account } = useWeb3React();

  const state = useSelector((state) => state);

  const parentAccountChange = async (event) => {
    if (event.data?.type === "ethAddress" && window.ethereum) {
      const parentAddress = event.data.address;
      console.log(parentAddress);
      if (!parentAddress) return;
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      if (parentAddress.toLowerCase() !== account.toLowerCase()) {
        window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
      }
    }
  };

  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  useEffect(() => {
    inIframe() && window.addEventListener("message", parentAccountChange);
    navigate("/");

    return () => window.removeEventListener("message", parentAccountChange);
  }, []);

  useEffect(() => {
    console.log(account);
    account && dispatch(connectedAccount(account));
  }, [account]);

  return (
    <div className="App">
      <div className="flexColumn">
        <Routes>
          <Route path="/" element={<Connect />} />
          {/* <Route path="/" element={<OptInPopup />} /> */}
          <Route path="/Transfer" element={<Transfer from={from} to={to} />} />
          <Route path="/BridgingConfirmation" element={<Confirmation />} />
          <Route path="/BridgingReport" element={<Report />} />
        </Routes>

        {/* <Confirmation/>  */}
        {/* <Report/> */}
        {state.account.error && <ErrorPopup errorMgs={state.account.error} />}
        <Footer />
      </div>

      {/* <ConnectWallet /> */}
      {/* <Confirmation/> */}
      {/* <Report/> */}
    </div>
  );
}

export default App;
