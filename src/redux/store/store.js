import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistedAuthReducer } from "../slices/authSlice";
import prepCodeReducer from "../slices/prepCodeSlice";
import workspaceReducer from "../slices/workspaceSlice";



// Auto-heal any corrupted redux-persist entries left in localStorage
if (typeof window !== "undefined" && window.localStorage) {
    try {
        for (let i = window.localStorage.length - 1; i >= 0; i--) {
            const k = window.localStorage.key(i);
            if (k && k.startsWith("persist:")) {
                const val = window.localStorage.getItem(k);
                if (!val || val === "[object Object]" || !val.trim().startsWith("{")) {
                    window.localStorage.removeItem(k);
                } else {
                    try {
                        const parsed = JSON.parse(val);
                        if (typeof parsed !== "object" || parsed === null) {
                            window.localStorage.removeItem(k);
                        }
                    } catch {
                        window.localStorage.removeItem(k);
                    }
                }
            }
        }
    } catch {
        // ignore storage errors
    }
}

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["workspace"],  // auth is already persisted via persistedAuthReducer
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