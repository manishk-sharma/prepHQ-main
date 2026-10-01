import { useQuery } from '@tanstack/react-query';
import api from "./api"

const getAllJobs = async () => {
    console.log("getAllJobs API called");
    try {
        const response = await api.get('/jobs/get-all-jobs');
        console.log("getAllJobs API response new:", response.data.data);

        if (response?.status === 200 && response?.data?.success === true) {
            
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch jobs");
        }
    } catch (error) {
        console.log(error, "error");
    }

};

const getJob = async ({ queryKey }) => {
    const [_key, id] = queryKey;
    try {
        const response = await api.get(`/jobs/get-job?id=${id}`);
        console.log("getJob API response:", response);
        if (response.data.status === true) {
            return response.data;
        } else {
            throw new Error(response.data.error || "Failed to fetch brands.");
        }
    } catch (error) {
        console.log(error, "error");
    }
};

export const useJob = (id) => {
    return useQuery({
        queryKey: ['job', id],
        queryFn: getJob,
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useJobList = () => {
    return useQuery({
        queryKey: ["jobList"],
        queryFn: getAllJobs,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};