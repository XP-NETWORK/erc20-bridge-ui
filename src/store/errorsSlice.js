import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  amountError: false,
  wrongAddressError: false,
  insufficient: false,
  showAddressPasted: false,
  amountZero: false,
};

export const errorSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setError: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setError } = errorSlice.actions;

export default errorSlice.reducer;
