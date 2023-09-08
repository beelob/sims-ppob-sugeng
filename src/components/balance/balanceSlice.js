import { createSlice } from "@reduxjs/toolkit";

export const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    amount: 0,
    show: false,
    refresh: false,
  },
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload.amount;
    },
    setShow: (state, action) => {
      state.show = action.payload.show;
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload.refresh;
    },
  },
});

export const { setAmount, setShow, setRefresh } = balanceSlice.actions;

export default balanceSlice.reducer;
