import { useQuery } from "@tanstack/react-query";
import api from "./api";


const getAllData = async () => {
  try {
    const response = await api.get("/get-all-data");
    console.log("getAllData response:", response?.data);

    if (response?.status === 200 && response?.data?.status === 1 && response?.data?.data) {
      return response?.data?.data;
    } else {
      throw new Error("Server Error Data Not fetch");
    }
  } catch (error) {
    console.log("getAllData error:", error?.response?.data || error);
    throw error;
  }
};


export const useAllData = (options = {}) => {
  return useQuery({
    queryKey: ["adminAllData"],
    queryFn: getAllData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};
