import "./App.css";
import Confirmation from "./components/Confirmation";
import ConnectWallet from "./components/ConnectWallet";
import Footer from "./components/Footer";
import Report from "./components/Report";
import Transfer from "./components/Transfer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { connectedAccount } from "./store/accountSlice";

function App() {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  useEffect(() => {
    dispatch(connectedAccount(account));
  }, [account]);
  return (
    <BrowserRouter>
      <div className="App">
        <div className="flexColumn">
          <Routes>
            <Route path="/" element={<Transfer />} />
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
