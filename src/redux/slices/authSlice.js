import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

const authSlice = createSlice({
    name: "auth",
    initialState: {
        admin:{
            token: null, 
            user: {},
        },
       user:{
            token: null, 
            user: {},
       }
    },
    reducers: {
       adminLoginSuccess: (state, action) => {
            state.admin.token = action.payload.token;
            state.admin.user = action.payload.user;
        },
        adminLogout: (state) => {
            state.admin.token = null;
            state.admin.user = {};
        },
        userLoginSuccess: (state, action) => {
            state.user.token = action.payload?.token;
            state.user.user = action.payload?.user;
        },
        userLogout: (state) => {
            state.user.token = null;
            state.user.user = {};
        },
        updateUser: (state, action) => {
            state.user.user = { ...state.user.user, ...action.payload };
        },
    },
});

export const { adminLoginSuccess, adminLogout, userLoginSuccess, userLogout,  updateUser } = authSlice.actions;

const persistConfig = { key: "auth", storage };
export const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);