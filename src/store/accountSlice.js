import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  signature: "",
  transactionDetails: {
    xpnetTokenPrice: 0,
    xpnetAmount: 0,
    destinationAddress: "",
    fromChain: "BSC",
    toChain: "Algorand",
    fee: 0,
    recievingValueInDollar: 0,
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    connectedAccount: (state, action) => {
      state.address = action.payload;
      console.log("REDUX", action.payload);
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
    },
    updateTransactionDetails: (state, action) => {
      console.log("transaction", action.payload);
      state.transactionDetails = action.payload;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { connectedAccount, updateTransactionDetails, incrementByAmount } =
  accountSlice.actions;

export default accountSlice.reducer;
