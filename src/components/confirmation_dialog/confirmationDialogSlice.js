import { createSlice } from "@reduxjs/toolkit";

export const TOP_UP = "topUp";
export const TRANSACTION = "transaction";

export const confirmationDialogSlice = createSlice({
  name: "confirmationDialog",
  initialState: {
    open: false,
    title: "",
    description: "",
    confirmFor: "", // contoh isinya 'deleteBanner'|'deleteProduct'
    isLoading: false,
    // jenis-jenis actions
    topUp: false,
    transaction: false,
    status: "idle", // idle | success | failed
    confirmBtnText: "Ya",
  },
  reducers: {
    setOpen: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.open = true;
    },
    setClose: (state) => {
      state.open = false;
      state.confirmFor = "";
      state.isLoading = false;
      state.topUp = false;
      state.transaction = false;
      state.status = "idle";
      state.confirmBtnText = "Ya";
    },
    setTitle: (state, action) => {
      state.title = action.payload.title;
    },
    setDescription: (state, action) => {
      state.description = action.payload.description;
    },
    setConfirmFor: (state, action) => {
      state.confirmFor = action.payload.confirmFor; // contoh isinya payload.confirmFor: 'deleteBanner'|'deleteProduct'
    },
    setConfirmed: (state, action) => {
      state[action.payload.confirmFor] = true;
    },
    setLoading: (state, action) => {
      // confirmFor contoh isinya 'deleteBanner'|'deleteProduct'
      state.isLoading = action.payload.isLoading;
    },
    setStatus: (state, action) => {
      state.status = action.payload.status;
    },
    setConfirmBtnText: (state, action) => {
      state.confirmBtnText = action.payload.text;
    },
  },
});

export const {
  setOpen,
  setClose,
  setTitle,
  setDescription,
  setConfirmFor,
  setConfirmed,
  setLoading,
  setStatus,
  setConfirmBtnText,
} = confirmationDialogSlice.actions;

export default confirmationDialogSlice.reducer;
