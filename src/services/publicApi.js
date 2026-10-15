import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://backend.prephq.theiotacademy.co";

const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

export const setupPublicInterceptors = (setLoading) => {
  publicApi.interceptors.request.use((config) => {
    setLoading(true);
    return config;
  });

  publicApi.interceptors.response.use(
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

export default publicApi;
