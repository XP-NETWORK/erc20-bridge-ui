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

import { Algodv2, Indexer } from "algosdk";

import { Bridge__factory } from "web3-erc20-contracts-types";

function App() {
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const dispatch = useDispatch();

  const loc = useLocation();
  const navigate = useNavigate();

  const { account } = useWeb3React();

  const state = useSelector((state) => state);

  console.log(state, "state");

  useEffect(() => {
    setTimeout(async () => {
      /*let provider = new ethers.providers.Web3Provider(window.ethereum);
      const res = await provider.waitForTransaction(
        "0x009611f3f2735beb72b70a70a44d0c6cac80796e2abcc3fd14bc2f2941d9a28a"
      );

      const contract = Bridge__factory.connect(
        "0x91105e661C500e6651f04CF76787297e534b97a5",
        provider
      );

      let actionId 

      for (const log of res.logs) {
        if (log.address != "0x91105e661C500e6651f04CF76787297e534b97a5")
          continue;

        const parsed = contract.interface.parseLog(log);

        actionId = parsed?.args?.actionId;
      }*/
      /* const x = new Indexer(
        {
          "x-api-key": "jNExV5Bud64raKqGiUBBQ2smiLuphGB48PdPqh3N",
        },
        "https://algoindexer.algoexplorerapi.io",
        ""
      );
      const v = await x
        .lookupAccountTransactions(
          "NZQXP6BDGJ2HTLPNDRDJK74Z7UR26RKNYHOX3YQLBFEOTLIRK3HGRJ4TKU"
        )
        .do();

      console.log(v);*/
    }, 1000);
  }, []);

  useEffect(() => {
    //navigate("/BridgingReport");
    navigate("/");
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get("from");
    const to = urlParams.get("to");
    from && setFrom(from);
    to && setTo(to);
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
