import { configureStore } from "@reduxjs/toolkit";
import confirmationDialogReducer from "../components/confirmation_dialog/confirmationDialogSlice";
import authReducer from "../components/auth/authSlice";
import flashInfoReducer from "../components/flash_info/flashInfoSlice";
import { balanceSlice } from "../components/balance/balanceSlice";
import { servicesSlice } from "../components/services/servicesSlice";

export default configureStore({
  reducer: {
    confirmationDialog: confirmationDialogReducer,
    auth: authReducer,
    flashInfo: flashInfoReducer,
    [balanceSlice.name]: balanceSlice.reducer,
    [servicesSlice.name]: servicesSlice.reducer,
  },
});
