import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import pageReducer from "../slices/pageSlice";


const rootReducer= combineReducers({
    auth: authReducer,
    page: pageReducer,
})

export default rootReducer;