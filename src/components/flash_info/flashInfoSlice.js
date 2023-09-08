import { createSlice } from "@reduxjs/toolkit";

export const flashInfoSlice = createSlice({
  name: "flashInfo",
  initialState: {
    open: false,
    text: "",
    type: "success", // error|info|success|warning
  },
  reducers: {
    setOpen: (state, action) => {
      const { open, text, type } = {
        open: true,
        text: "",
        type: "success",
        ...action.payload,
      };
      state.open = open;
      state.text = text;
      state.type = type;
    },
  },
});

export const { setOpen } = flashInfoSlice.actions;

export default flashInfoSlice.reducer;
