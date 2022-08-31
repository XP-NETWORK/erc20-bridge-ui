import "./App.css";
import Confirmation from "./components/Confirmation";

import Footer from "./components/Footer";

import Report from "./components/Report";
import Transfer from "./components/Transfer";
import { Routes, Route } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { connectedAccount } from "./store/accountSlice";
import Connect from "./components/Connect";

import ErrorPopup from "./components/errors/ErrorPopup";

import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { parentAccountChange, inIframe } from "./utils/utilsFunc";

import chain from "./service/chain";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account } = useWeb3React();

  const { error } = useSelector((state) => ({ error: state.account.error }));

  useEffect(() => {
    inIframe() && window.addEventListener("message", parentAccountChange);
    navigate("/");

    return () => window.removeEventListener("message", parentAccountChange);
  }, []);

  useEffect(() => {
    account && dispatch(connectedAccount(account));
  }, [account]);

  return (
    <div className="App">
      <div className="flexColumn">
        <Routes>
          <Route path="/" element={<Connect />} />
          <Route path="/Transfer" element={<Transfer from={""} to={""} />} />
          <Route path="/BridgingConfirmation" element={<Confirmation />} />
          <Route path="/BridgingReport" element={<Report />} />
        </Routes>
        {error && <ErrorPopup errorMgs={error} />}
        <Footer />
      </div>
    </div>
  );
}

export default App;
