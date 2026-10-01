import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "./api";
import adminApi from "./adminApi";
import publicApi from "./publicApi";
import { useNotification } from '../context/useNotificationContext';

const getAllTutorials = async () => {
    console.log("getAllTutorials API called");
    try {
        const response = await publicApi.get('/tutorial');
        console.log("getAll Tutorials API response:", response?.data?.data);
        console.log(response?.data?.data?.length, " size of Tutorials");

        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch Tutorials");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getTutorial = async ({ queryKey }) => {
    const [_key, id] = queryKey;

    try {
        const response = await publicApi.get(`/tutorial/${id}`);
        console.log("getTutorial API response:", response);
        console.log(response?.data?.data?.length, "size of getTutorial");

        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch Tutorial.");
        }
    }  catch (error) {
        console.log(error);
        throw error;
    }
};

const getTutorialByCategory = async ({ queryKey }) => {
    const [_key, category] = queryKey;

    try {
        const response = await publicApi.get(`/tutorial/category/${category}`);
        console.log("getTutorialByCategory API response:", response);
        console.log(response?.data?.data?.length, "size of getTutorialByCategory");

        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch Tutorial By Category.");
        }
    }  catch (error) {
        console.log(error);
        throw error;
    }
};


// Upload Calls
const createTutorial = async (data) => {
    try{
         const response = await adminApi.post("/tutorial", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (response?.status === 201 && response?.data?.status === 1) {
        return response?.data;
    } else {
        throw new Error(response?.data?.message || "Failed to create tutorial");
    }
    }catch(error){
        console.log(error);
        throw error;
    }
   
};

// Update Calls
const updateTutorial = async ({ id, data }) => {
    try{

        const response = await adminApi.put(`/tutorial/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    
        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to update tutorial");
        }
    }catch(error){
        console.log(error);
        throw error;
    }
};

// Delete Calls
const deleteTutorial = async (id) => {
    try{
         const response = await adminApi.delete(`/tutorial/${id}`);

    if (response?.status === 200 && response?.data?.status === 1) {
        return response?.data;
    } else {
        throw new Error(response?.data?.message || "Failed to delete tutorial");
    }
    }catch(error){
        console.log(error);
        throw error;
    }
   
};

export const useTutorialByCategory = (category) => {
    return useQuery({
        queryKey: ['tutorialCat', category],
        queryFn: getTutorialByCategory,
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useTutorial = (id) => {
    return useQuery({
        queryKey: ['tutorial', id],
        queryFn: getTutorial,
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useTutorialList = (options = {}) => {
    return useQuery({
        queryKey: ['tutorialList'],
        queryFn: getAllTutorials,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        ...options,
    });
};


// Upload Mutations
export const useAddTutorial = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: createTutorial,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: ["tutorialList"],
            });

            queryClient.invalidateQueries({
                queryKey: ["tutorialCat"],
            });

            showNotification(data?.message || "Tutorial added", "success");
        },

        onError: (error) => {
            showNotification(error?.message || "Something went wrong", "danger");
        },
    });
};
// Update Mutations
export const useUpdateTutorial = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: updateTutorial,

    onSuccess: (data, variables) => {

      // list refetch
      queryClient.invalidateQueries({
        queryKey: ["tutorialList"],
      });

      // category refetch
      queryClient.invalidateQueries({
        queryKey: ["tutorialCat"],
      });

      // single refetch
      queryClient.invalidateQueries({
        queryKey: ["tutorial", variables.id],
      });

      showNotification(data?.message || "Tutorial updated", "success");
    },

    onError: (error) => {
      showNotification(error?.message || "Something went wrong", "danger");
    },
  });
};

// Delete Mutations
export const useDeleteTutorial = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: deleteTutorial,

        // optimistic update
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["tutorialList"] });

            const previousTutorials =
                queryClient.getQueryData(["tutorialList"]);

            queryClient.setQueryData(["tutorialList"], (old = []) =>
                old.filter((item) => item.ID !== id)
            );

            return { previousTutorials };
        },

        onError: (error, id, context) => {
            queryClient.setQueryData(
                ["tutorialList"],
                context.previousTutorials
            );

            showNotification(
                error?.message || "Delete failed",
                "danger"
            );
        },

        onSuccess: (data) => {
            showNotification(
                data?.message || "Tutorial deleted",
                "success"
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["tutorialList"],
            });

            queryClient.invalidateQueries({
                queryKey: ["tutorialCat"],
            });
        },
    });
};
