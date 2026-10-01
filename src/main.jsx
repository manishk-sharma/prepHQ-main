import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import "./index.css";
import App from "./App";
import "../src/pages/home/home.css";
import { AppProvidersWrapper } from "./providers/provider";
import 'bootstrap/dist/css/bootstrap.min.css';



createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <AppProvidersWrapper>
        <AuthProvider>
          
          <App />
          
        </AuthProvider>
      </AppProvidersWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
