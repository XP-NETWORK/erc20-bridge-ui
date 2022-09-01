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

import factory from "./service/chainFactory";

import { TransferContainer } from "./components/containers/Transfer";

const Test = (props) => {
  console.log(props);
  return <div>1</div>;
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account } = useWeb3React();

  const { error } = useSelector((state) => ({ error: state.account.error }));

  useEffect(() => {
    if (inIframe()) {
      window.addEventListener("message", parentAccountChange);
      document.body.style.background = "#f7f7f9";
    }

    //navigate("/");

    return () => window.removeEventListener("message", parentAccountChange);
  }, []);

  useEffect(() => {
    account && dispatch(connectedAccount(account));
  }, [account]);

  const Comp = TransferContainer(Test);

  return (
    <div className="App">
      <div className="flexColumn">
        <Routes>
          <Route path="/" element={<Connect />} />
          <Route path="/test" element={<Comp />} />
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
