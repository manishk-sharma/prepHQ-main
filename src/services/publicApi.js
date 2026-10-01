import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
