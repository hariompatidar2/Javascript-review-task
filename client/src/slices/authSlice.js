import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    loading: false,
    token: document.cookie ? document.cookie.split("=")[1] : null,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    allUsers:[]
}

const authSlice= createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem("user");
        }
    }
})

export const {setLoading, setToken, setUser,logout,setAllUsers}= authSlice.actions;

export default authSlice.reducer;