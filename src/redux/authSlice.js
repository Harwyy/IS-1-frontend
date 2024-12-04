import {createSlice} from '@reduxjs/toolkit';

const isAuthValid = () => {
    const timestamp = localStorage.getItem("authTimestamp");
    if (!timestamp) return false;
    const now = Date.now();
    const authDuration = 3 * 60 * 60 * 1000;
    return now - parseInt(timestamp, 10) < authDuration;
}

const initialState = {
    isAuthenticated: isAuthValid(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthenticated: (state) => {
            state.isAuthenticated = true;
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("authTimestamp", Date.now().toString());
        },
        setUnauthenticated: (state) => {
            state.isAuthenticated = false;
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("authTimestamp");
            localStorage.removeItem("Authorization");
            localStorage.removeItem("Role");
            localStorage.removeItem("Name");
        }
    }
});

export const { setAuthenticated, setUnauthenticated } = authSlice.actions;

export default authSlice.reducer;


