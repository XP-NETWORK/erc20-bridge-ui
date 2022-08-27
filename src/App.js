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

const tw = transactions();

function App() {
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const dispatch = useDispatch();

  const loc = useLocation();
  const navigate = useNavigate();

  const { account } = useWeb3React();

  const state = useSelector((state) => state);


  useEffect(() => {
    //navigate("/BridgingReport");
    //navigate("/");
    /*const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get("from");
    const to = urlParams.get("to");
    from && setFrom(from);
    to && setTo(to);*/
  }, []);

  useEffect(() => {
    /*const algoSocket = io("https://token-notifier.xp.network");

    setTimeout(() => {
      console.log(algoSocket, "algoSocket");
      algoSocket.on("algorand:bridge_tx", async (...args) => {
        console.log(args, "hash in socket");
      });

      algoSocket.on("web3:bridge_tx", async (...args) => {
        console.log(args, "hash in socket");
      });
    }, 2000);*/
  }, []);

  useEffect(() => {
    dispatch(connectedAccount(account));
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
