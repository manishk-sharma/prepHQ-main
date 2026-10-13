import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store/store";
import { LoaderProvider } from "../context/useLoaderContext";
import { NotificationProvider } from "../context/useNotificationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TOCProvider } from "../context/useTOCContext";

const queryClient = new QueryClient();
export function AppProvidersWrapper({ children }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
            <div className="spinner-border text-success" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
        persistor={persistor}
      >
        <HelmetProvider>
          <NotificationProvider>
            <LoaderProvider>
              <QueryClientProvider client={queryClient}>
                <TOCProvider>{children}</TOCProvider>
              </QueryClientProvider>
            </LoaderProvider>
          </NotificationProvider>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  );
}
