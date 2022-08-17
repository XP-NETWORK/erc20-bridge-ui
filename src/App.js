import "./App.css";
import Confirmation from "./components/Confirmation";
import ConnectWallet from "./components/ConnectWallet";
import Footer from "./components/Footer";
import Report from "./components/Report";
import Transfer from "./components/Transfer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { connectedAccount } from "./store/accountSlice";
import Connect from "./components/Connect";
import OptInPopup from "./components/errors/OptInPopup";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const dispatch = useDispatch();
  const { account } = useWeb3React();

  useEffect(() => {
    dispatch(connectedAccount(account));
  }, [account]);

  useEffect(() => {
    const from = urlParams.get("from");
    setFrom(from);
    const to = urlParams.get("to");
    setTo(to);
  }, [urlParams]);

  return (
    <BrowserRouter>
      <div className="App">
        <div className="flexColumn">
          <Routes>
            <Route path="/" element={<Connect />} />
            {/* <Route path="/" element={<OptInPopup />} /> */}
            <Route
              path="/Transfer"
              element={<Transfer from={from} to={to} />}
            />
            <Route path="/BridgingConfirmation" element={<Confirmation />} />
            <Route path="/BridgingReport" element={<Report />} />
          </Routes>

          {/* <Confirmation/>  */}
          {/* <Report/> */}
          <Footer />
        </div>

        {/* <ConnectWallet /> */}
        {/* <Confirmation/> */}
        {/* <Report/> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
