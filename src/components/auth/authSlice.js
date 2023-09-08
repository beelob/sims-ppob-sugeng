import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        currentUser: null, // null atau object berisi data user
        isGuest: null,
    },
    reducers: {
        setIsGuest: (state, action) => {
            state.isGuest = action.payload.isGuest;
            if (action.payload.isGuest) {
                state.currentUser = null;
            }
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload.currentUser;
            if (action.payload.currentUser === null) {
                state.isGuest = true;
            }
        },
    }
});

export const { setCurrentUser, setIsGuest } = authSlice.actions;

export default authSlice.reducer;