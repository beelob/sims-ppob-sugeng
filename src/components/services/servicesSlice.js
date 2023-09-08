import { createSlice } from "@reduxjs/toolkit";

export const servicesSlice = createSlice({
  name: "services",
  initialState: {
    data: [],
  },
  reducers: {
    setServicesData: (state, action) => {
      state.data = action.payload.services;
    },
  },
});

export const { setServicesData } = servicesSlice.actions;

export default servicesSlice.reducer;
