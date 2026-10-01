import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistedAuthReducer } from "../slices/authSlice";
import prepCodeReducer from "../slices/prepCodeSlice";
import workspaceReducer from "../slices/workspaceSlice";



const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "workspace"],  // workspace persists theme preference
    serialize: false
};


const rootReducer = combineReducers({
    auth:      persistedAuthReducer,
    prepCode:  prepCodeReducer,
    workspace: workspaceReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, 
        }),
});

export const persistor = persistStore(store);
export default store;