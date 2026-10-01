
import NextTopLoader from "nextjs-toploader";
import { createContext, useContext, useEffect, useState } from "react";
import NProgress from "nprogress";
import { setupInterceptors } from "../services/api";
import { setupAdminInterceptors } from "../services/adminApi";
import { setupPublicInterceptors } from "../services/publicApi";


const LoaderContext = createContext(null);

export const LoaderProvider = ({ children }) => {
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setupInterceptors(setLoading);
        setupAdminInterceptors(setLoading);
        setupPublicInterceptors(setLoading);
    }, []);


    useEffect(() => {
        if (loading) {
            NProgress.start();
        } else {
            NProgress.done();
        }
    }, [loading]);


    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            <NextTopLoader color="#57cc99" showSpinner={false} showAtTop={loading} />
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);