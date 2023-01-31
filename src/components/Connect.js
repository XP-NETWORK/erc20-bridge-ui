import React, { useEffect, useState } from "react";
import metaIcon from "../img/wallets/metamask.svg";
import MyAlgoIcon from "../img/myalgo-logo.svg";
import algoSigner from "../img/wallets/Algo Signer.png";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import {
    connectedAccount,
    updateTransactionDetails,
    iniTransactionDetails,
    setSigner,
    setError,
} from "../store/accountSlice";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { InjectedMetaMask } from "../utils/connectors";
import { useNavigate } from "react-router-dom";

import Error from "./errors/Error";
import { CHAINS_TYPE } from "../utils/consts";
import { useLocation } from "react-router";
import { ethers } from "ethers";
import { getMyAlgoSigner } from "../erc20/erc20Utils";

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

export const connectMM = async () => {
    debugger;
    if (!window.ethereum) {
        alert("Install metaMask");
        return;
    }
    try {
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [
                {
                    eth_accounts: {},
                },
            ],
        });
        const chainId = window.ethereum.chainId;
        if (chainId !== 56) {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: "0x38",
                    },
                ],
            });
        }
        const [currentChain, accounts] = await Promise.all([
            window.ethereum.request({ method: "eth_chainId" }),
            window.ethereum.request({ method: "eth_requestAccounts" }),
        ]);
        let provider = new ethers.providers.Web3Provider(window.ethereum);

        return {
            signer: provider.getSigner(),
            chainId: currentChain,
            address: accounts[0],
        };
    } catch (e) {
        throw e;
    }
};

export function connectAlgoSigner(address, dispatch) {
    const signer = {
        address,
        algoSigner: window.AlgoSigner,
        ledger: "MainNet",
    };

    dispatch(connectedAccount(address));
    dispatch(setSigner(signer));
    dispatch(
        updateTransactionDetails({
            ...iniTransactionDetails,
            fromChain: CHAINS_TYPE.Algorand,
            toChain: CHAINS_TYPE.BSC,
        })
    );
}

export default function Connect({
    onConnect,
    cb,
    wallets = {
        metaMask: true,
        myAlgo: true,
        algoSigner: true,
    },
}) {
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const dispatch = useDispatch();

    const { fromChain } = useSelector((state) => ({
        fromChain: state.account.transactionDetails.fromChain,
    }));

    const connectMetaMaskWalletHandler = async () => {
        try {
            if (!window.ethereum && window.innerWidth <= 600) {
                const link = `https://metamask.app.link/dapp/${window.location.host}/`;
                window.open(link);
                return;
            }

            const { signer, address } = await connectMM();

            dispatch(connectedAccount(address));
            dispatch(setSigner(signer));
            dispatch(
                updateTransactionDetails({
                    ...iniTransactionDetails,
                    fromChain: CHAINS_TYPE.BSC,
                    toChain: CHAINS_TYPE.Algorand,
                })
            );

            onConnect();
            // handleCloseWallet();
        } catch (err) {
            console.log(err, "err");
            dispatch(
                setError({
                    data: "Connection to wallet failed, please try again",
                })
            );
        }
    };

    const connectMyAlgoHandler = async () => {
        //const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });
        try {
            const accountsSharedByUser = await connectAlgo();
            const address = accountsSharedByUser[0]?.address;
            if (address) {
                const signer = await getMyAlgoSigner(address);

                dispatch(connectedAccount(accountsSharedByUser[0].address));
                dispatch(setSigner(signer));
                dispatch(
                    updateTransactionDetails({
                        ...iniTransactionDetails,
                        fromChain: CHAINS_TYPE.Algorand,
                        toChain: CHAINS_TYPE.BSC,
                    })
                );
            }
            onConnect();
            //heckIfOptIn(accountsSharedByUser[0].address);
        } catch (e) {
            dispatch(
                setError({
                    data: "Connection to wallet failed, please try again",
                })
            );
        }
        // handleCloseWallet();
    };

    const connectAlgoSigner = async (testnet) => {
        if (typeof window.AlgoSigner !== undefined) {
            try {
                await window.AlgoSigner.connect();

                const algo = await window.AlgoSigner.accounts({
                    ledger: "MainNet",
                });

                if (algo.length > 1) {
                    return dispatch(
                        setError({
                            type: "selectWallet",
                            data: algo,
                        })
                    );
                }
                const { address } = algo[0];
                connectAlgoSigner(address, dispatch);
                dispatch(
                    updateTransactionDetails({
                        ...iniTransactionDetails,
                        fromChain: CHAINS_TYPE.Algorand,
                        toChain: CHAINS_TYPE.BSC,
                    })
                );
                onConnect();
            } catch (e) {
                console.error(e);
                return JSON.stringify(e, null, 2);
            }
        } else {
            console.log("Algo Signer not installed.");
            return false;
        }
    };

    // const handleCloseWallet = () => {
    //   props.isOpen(false);
    // };

    /*const activateAccount = async (accountToActivate) => {
    await activate(accountToActivate);
  };*/

    return (
        <div className="flexColumn">
            <div className="transferBox connect-modal">
                <div className="connect__wrapper">
                    <h1 className="transferBoxTitle">Connect Wallet</h1>
                    <div className="walletsWrapper">
                        {wallets.metaMask && (
                            <div
                                className="walletItem"
                                onClick={() => {
                                    cb && cb();
                                    connectMetaMaskWalletHandler();
                                }}
                            >
                                <img src={metaIcon} className="btnWallet" />
                                <span>MetaMask</span>
                            </div>
                        )}
                        {wallets.myAlgo &&
                            fromChain !== CHAINS_TYPE.Algorand && (
                                <div
                                    className="walletItem"
                                    onClick={() => {
                                        cb && cb();
                                        connectMyAlgoHandler();
                                    }}
                                >
                                    <img
                                        src={MyAlgoIcon}
                                        className="btnWallet"
                                    />
                                    <span>MyAlgo</span>
                                </div>
                            )}
                        {wallets.algoSigner &&
                            fromChain !== CHAINS_TYPE.Algorand && (
                                <div
                                    className="walletItem"
                                    onClick={() => {
                                        cb && cb();
                                        connectAlgoSigner();
                                    }}
                                >
                                    <img
                                        src={algoSigner}
                                        className="btnWallet"
                                    />
                                    <span>AlgoSigner</span>
                                </div>
                            )}
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
