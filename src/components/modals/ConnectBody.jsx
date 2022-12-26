import React from "react";
import metaIcon from "../../img/wallets/metamask.svg";
import MyAlgoIcon from "../../img/myAlgo.png";
import { useWeb3React } from "@web3-react/core";
import { InjectedMetaMask } from "../../utils/connectors";
import { connectAlgo, connectMM } from "./ConnectModfalHelper";
import { useDispatch } from "react-redux";
import {
    iniTransactionDetails,
    connectedAccount,
    updateTransactionDetails,
} from "../../store/accountSlice";
// import { iniTransactionDetails } from "../../store/accountSlice";
import { CHAINS_TYPE } from "../../utils/consts";

export default function ConnectBody() {
    const { activate, account, chainId, library, active } = useWeb3React();
    const dispatch = useDispatch();

    const connectMetaMaskWalletHandler = async () => {
        try {
            if (!window.ethereum && window.innerWidth <= 600) {
                const link = `https://metamask.app.link/dapp/${window.location.host}/`;
                window.open(link);
                return;
            }

            await connectMM(activate, InjectedMetaMask);

            // handleCloseWallet();
        } catch (err) {
            console.log(err);
            //   setErrorMsg("connection to wallet failed, please try again");
            //   setShowError(true);
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
            }

            //heckIfOptIn(accountsSharedByUser[0].address);
        } catch (e) {
            console.log(e);
            // setErrorMsg("connection to wallet failed, please try again");
            // setShowError(true);
        }
        // handleCloseWallet();
    };

    return (
        <div
            style={{
                position: "fixed",
                left: "0px",
                display: "grid",
                placeItems: "center",
                height: "90%",
                width: "100%",
                backdropFilter: "blur(15px)",
                zIndex: 99,
            }}
        >
            <div className="connect-body-modal">
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
    );
}
