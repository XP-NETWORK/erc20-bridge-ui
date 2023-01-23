import { createSlice } from "@reduxjs/toolkit";
import { CHAINS_TYPE } from "../utils/consts";

export const iniTransactionDetails = {
    tokenSymbol: "",
    xpnetTokenPrice: 0,
    xpnetAmount: 0,
    destinationAddress: "",
    fromChain: CHAINS_TYPE.BSC,
    toChain: CHAINS_TYPE.Algorand,
    fee: 0,
    recievingValueInDollar: 0,
};

const initialState = {
    address: "",
    signature: "",
    error: "",
    transactionDetails: iniTransactionDetails,
    sourceHash: "",
    connectModal: false,
    signer: undefined,
    popup: null,
    optinTimeOut: false,
};

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setOptinTimeOut(state, action) {
            state.optinTimeOut = action.payload;
        },
        setConnectModal(state, action) {
            state.connectModal = action.payload;
        },
        connectedAccount: (state, action) => {
            state.address = action.payload;
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
        },
        updateTransactionDetails: (state, action) => {
            state.transactionDetails = action.payload;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
        updateHash: (state, action) => {
            console.log("source hash store", action.payload);
            state.sourceHash = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSigner: (state, action) => {
            state.signer = action.payload;
        },
        setPopup: (state, action) => {
            state.popup = action.payload;
        },
        reset: () => {
            return {
                ...initialState,
            };
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setOptinTimeOut,
    setConnectModal,
    connectedAccount,
    updateTransactionDetails,
    incrementByAmount,
    updateHash,
    setError,
    reset,
    setSigner,
    setPopup,
} = accountSlice.actions;

export default accountSlice.reducer;
