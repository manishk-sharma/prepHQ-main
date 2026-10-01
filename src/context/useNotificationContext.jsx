import { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationContext = createContext(null);

const VARIANT_MAP = {
  success: toast.success,
  danger: toast.error,
  error: toast.error,
  info: toast.info,
  warning: toast.warning,
};

export const NotificationProvider = ({ children }) => {
  const showNotification = (message, variant = "info", options = {}) => {
    const toastFn = VARIANT_MAP[variant] || toast.info;
    toastFn(message, options);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        pauseOnHover
        newestOnTop
        closeOnClick
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }
  return context;
};
