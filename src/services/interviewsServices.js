import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "./api";
import adminApi from "./adminApi";
import publicApi from "./publicApi";
import { useNotification } from '../context/useNotificationContext';

const getAllInterviews = async () => {
    console.log("getAllJobs API called");
    try {
        const response = await publicApi.get('/interview');
        console.log("getAll Interviews API response:", response?.data?.data);
        console.log(response?.data?.data?.length,"  size of getAllInterview");
        if (response?.status === 200 && response?.data?.status === 1 ) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch Interviews");
        }
    } catch (error) {
        console.log(error, "error");
    }

};

const getInterview = async ({ queryKey }) => {
    const [_key, id] = queryKey;
    try {
        const response = await publicApi.get(`/interview/${id}`);
        console.log("getInterview API response:", response);
        console.log(response?.data?.data?.length,"size of getInterview");
         if (response?.status === 200 && response?.data?.status === 1 ) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error|| "Failed to fetch Interview.");
        }
    } catch (error) {
        console.log(error, "error");
    }
};
const getInterviewByCategory = async ({ queryKey }) => {
    const [_key, category] = queryKey;
    try {
        const response = await publicApi.get(`/interview/category/${category}`);
        console.log("getInterview API response:", response);
        console.log(response?.data?.data?.length,"size of getInterview");
         if (response?.status === 200 && response?.data?.status === 1 ) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error|| "Failed to fetch Interview.");
        }
    } catch (error) {
        console.log(error, "error");
    }
}

// Upload Calls
const createInterview = async (data) => {
    try{
         const response = await adminApi.post("/interview", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (response?.status === 201 && response?.data?.status === 1) {
        return response?.data;
    } else {
        throw new Error(response?.data?.message || "Failed to create interview");
    }
    }catch(error){
        console.log(error);
        throw error;
    }
   
};

// Update Calls
const updateInterview = async ({ id, data }) => {
    try{

        const response = await adminApi.put(`/interview/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    
        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to update interview");
        }
    }catch(error){
        console.log(error);
        throw error;
    }
};

// Delete Calls
const deleteInterview = async (id) => {
    try{
         const response = await adminApi.delete(`/interview/${id}`);

    if (response?.status === 200 && response?.data?.status === 1) {
        return response?.data;
    } else {
        throw new Error(response?.data?.message || "Failed to delete interview");
    }
    }catch(error){
        console.log(error);
        throw error;
    }
   
};

export const useInterviewByCategory = (category) => {
    return useQuery({
        queryKey: ['interviewCat', category],
        queryFn: getInterviewByCategory,
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
export const useInterview = (id) => {
    return useQuery({
        queryKey: ['interview', id],
        queryFn: getInterview,
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });1
};

export const useInterviewList = (options = {}) => {
  return useQuery({
    queryKey: ["interviewList"],
    queryFn: getAllInterviews,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};


// Upload Mutations
export const useAddInterview = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: createInterview,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: ["interviewList"],
            });

            queryClient.invalidateQueries({
                queryKey: ["interviewCat"],
            });

            showNotification(data?.message || "Interview added", "success");
        },

        onError: (error) => {
            showNotification(error?.message || "Something went wrong", "danger");
        },
    });
};

// Update Mutations
export const useUpdateInterview = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: updateInterview,

    onSuccess: (data, variables) => {

      // list refetch
      queryClient.invalidateQueries({
        queryKey: ["interviewList"],
      });

      // category refetch
      queryClient.invalidateQueries({
        queryKey: ["interviewCat"],
      });

      // single refetch
      queryClient.invalidateQueries({
        queryKey: ["interview", variables.id],
      });

      showNotification(data?.message || "Interview updated", "success");
    },

    onError: (error) => {
      showNotification(error?.message || "Something went wrong", "danger");
    },
  });
};

// Delete Mutations
export const useDeleteInterview = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: deleteInterview,

        // optimistic update
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["interviewList"] });

            const previousInterviews =
                queryClient.getQueryData(["interviewList"]);

            queryClient.setQueryData(["interviewList"], (old = []) =>
                old.filter((item) => item.ID !== id)
            );

            return { previousInterviews };
        },

        onError: (error, id, context) => {
            queryClient.setQueryData(
                ["interviewList"],
                context.previousInterviews
            );

            showNotification(
                error?.message || "Delete failed",
                "danger"
            );
        },

        onSuccess: (data) => {
            showNotification(
                data?.message || "Interview deleted",
                "success"
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["interviewList"],
            });

            queryClient.invalidateQueries({
                queryKey: ["interviewCat"],
            });
        },
    });
};
