import store from "../redux/store/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Reads token from Redux store, falls back to persist:auth in localStorage
// during the redux-persist rehydration window on page refresh.
const getToken = () => {
  const storeToken = store.getState()?.auth?.user?.token;
  if (storeToken) return storeToken;

  try {
    const raw = localStorage.getItem("persist:auth");
    if (raw) return JSON.parse(JSON.parse(raw).user)?.token ?? null;
  } catch {}

  return null;
};

// Always-active auth interceptor — registered at module load, not behind a function call.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Loading interceptor — call once from App to wire up the global spinner.
export const setupInterceptors = (setLoading) => {
  api.interceptors.request.use((config) => {
    setLoading(true);
    return config;
  });

  api.interceptors.response.use(
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

export default api;
