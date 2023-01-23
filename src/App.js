import "./App.css";
import Confirmation from "./components/Confirmation";

import Footer from "./components/Footer";
import { createPortal } from "react-dom";

import Report from "./components/Report";
import Transfer from "./components/Transfer";
import { Routes, Route } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { connectedAccount, setError } from "./store/accountSlice";
import Connect from "./components/Connect";

import NavBar from "./components/views/NavBar";
import { BotFooter } from "./components/views/Footer";
import ErrorPopup from "./components/errors/ErrorPopup";

import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { parentAccountChange, inIframe } from "./utils/utilsFunc";

import factory from "./service/chainFactory";

import { TransferContainer } from "./components/containers/Transfer";

import { Popup } from "./components/popup";

const Test = (props) => {
    console.log(props);
    return <div>1</div>;
};

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const popup = useSelector((state) => state.account.popup);

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

    const isMob = window.innerWidth <= 800;

    return (
        <div className="container">
            <div className="row">
                <div className="App">
                    <NavBar />
                    <div className="flexColumn">
                        <Routes>
                            <Route path="/test" element={<Comp />} />
                            <Route
                                path="/"
                                element={<Transfer from={""} to={""} />}
                            />
                            <Route
                                path="/BridgingConfirmation"
                                element={<Confirmation />}
                            />
                            <Route
                                path="/BridgingReport"
                                element={<Report />}
                            />
                        </Routes>
                        {error && <ErrorPopup errorObject={error} />}
                        {popup && <Popup popup={popup} />}
                        {!isMob && <Footer />}
                    </div>
                    <BotFooter />
                </div>
            </div>
        </div>
    );
}

export default App;
