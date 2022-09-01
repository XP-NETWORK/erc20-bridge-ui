import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./accountSlice";
import errorsSlice from "./errorsSlice";

export const store = configureStore({
  reducer: {
    account: accountSlice,
    errors: errorsSlice,
  },
});
