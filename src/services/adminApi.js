import store from "../redux/store/store";
import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Reads admin token from Redux store, falls back to persist:auth in localStorage
// during the redux-persist rehydration window on page refresh.
const getAdminToken = () => {
  const storeToken = store.getState()?.auth?.admin?.token;
  if (storeToken) return storeToken;

  try {
    const raw = localStorage.getItem("persist:auth");
    if (raw) return JSON.parse(JSON.parse(raw).admin)?.token ?? null;
  } catch {}

  return null;
};

// Always-active auth interceptor — registered at module load, not behind a function call.
adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Loading interceptor — call once from App to wire up the global spinner.
export const setupAdminInterceptors = (setLoading) => {
  adminApi.interceptors.request.use((config) => {
    setLoading(true);
    return config;
  });

  adminApi.interceptors.response.use(
    (response) => {
      setLoading(false);
      return response;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );
};

export default adminApi;
