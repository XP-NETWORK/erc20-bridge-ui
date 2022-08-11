import { createSlice } from "@reduxjs/toolkit";
import { CHAINS_TYPE } from "../utils/consts";

const initialState = {
  address: "",
  signature: "",
  transactionDetails: {
    tokenSymbol: "",
    xpnetTokenPrice: 0,
    xpnetAmount: 0,
    destinationAddress: "",
    fromChain: CHAINS_TYPE.BSC,
    toChain: CHAINS_TYPE.Algorand,
    fee: 0,
    recievingValueInDollar: 0,
  },
  sourceHash: "",
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
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
  },
});

// Action creators are generated for each case reducer function
export const {
  connectedAccount,
  updateTransactionDetails,
  incrementByAmount,
  updateHash,
} = accountSlice.actions;

export default accountSlice.reducer;
