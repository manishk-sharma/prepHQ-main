import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "./api";
import adminApi from "./adminApi";
import publicApi from "./publicApi";
import { useNotification } from '../context/useNotificationContext';


const getAllProjects = async () => {
    console.log("getAllProjects API called");
    try {
        const response = await publicApi.get('/project');
        console.log("getAll Projects API response:", response?.data?.data);
        console.log(response?.data?.data?.length,"  size of Projects");
        if (response?.status === 200 && response?.data?.status === 1 ) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch Projects");
        }
    } catch (error) {
        console.log(error, "error");
    }

};

const getProject = async ({ queryKey }) => {
    const [_key, id] = queryKey;
    try {
        const response = await publicApi.get(`/project/${id}`);
        console.log("getProject API response:", response);
        console.log(response?.data?.data?.length,"size of getProject");
         if (response?.status === 200 && response?.data?.status === 1 ) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error|| "Failed to fetch Project.");
        }
    } catch (error) {
        console.log(error, "error");
    }
};

const getProjectByCategory = async ({ queryKey }) => {
    const [_key, category] = queryKey;
    try {
        const response = await publicApi.get(`/project/category/${category}`);
        console.log("getProjectByCategory API response:", response);
        console.log(response?.data?.data?.length,"size of getProjectByCategory");
         if (response?.status === 200 && response?.data?.status === 1 ) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error|| "Failed to fetch Project By Category.");
        }
    } catch (error) {
        console.log(error, "error");
    }
}

// Upload Calls
const createProject = async (data) => {
    try{
         const response = await adminApi.post("/project", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (response?.status === 201 && response?.data?.status === 1) {
        return response?.data;
    } else {
        throw new Error(response?.data?.message || "Failed to create project");
    }
    }catch(error){
        console.log(error);
        throw error;
    }
   
};

// Update Calls
const updateProject = async ({ id, data }) => {
    try{

        const response = await adminApi.put(`/project/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    
        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to update project");
        }
    }catch(error){
        console.log(error);
        throw error;
    }
};


const deleteProject = async (id) => {
    try{
         const response = await adminApi.delete(`/project/${id}`);

    if (response?.status === 200 && response?.data?.status === 1) {
        return response?.data;
    } else {
        throw new Error(response?.data?.message || "Failed to delete project");
    }
    }catch(error){
        console.log(error);
        throw error;
    }
   
};

export const useProjectByCategory = (category) => {
    return useQuery({
        queryKey: ['projectCat', category],
        queryFn: getProjectByCategory,
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export const useProject = (id) => {
    return useQuery({
        queryKey: ['project', id],
        queryFn: getProject,
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useProjectList = (options = {}) => {
  return useQuery({
    queryKey: ["projectList"],
    queryFn: getAllProjects,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};



export const useAddProject = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: createProject,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: ["projectList"],
            });

            queryClient.invalidateQueries({
                queryKey: ["projectCat"],
            });

            showNotification(data?.message || "Project added", "success");
        },

        onError: (error) => {
            showNotification(error?.message || "Something went wrong", "danger");
        },
    });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: updateProject,

    onSuccess: (data, variables) => {

      // list refetch
      queryClient.invalidateQueries({
        queryKey: ["projectList"],
      });

      // category refetch
      queryClient.invalidateQueries({
        queryKey: ["projectCat"],
      });

      // single refetch
      queryClient.invalidateQueries({
        queryKey: ["project", variables.id],
      });

      showNotification(data?.message || "Project updated", "success");
    },

    onError: (error) => {
      showNotification(error?.message || "Something went wrong", "danger");
    },
  });
};


export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: deleteProject,

        // optimistic update
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["projectList"] });

            const previousProjects =
                queryClient.getQueryData(["projectList"]);

            queryClient.setQueryData(["projectList"], (old = []) =>
                old.filter((item) => item.ID !== id)
            );

            return { previousProjects };
        },

        onError: (error, id, context) => {
            queryClient.setQueryData(
                ["projectList"],
                context.previousProjects
            );

            showNotification(
                error?.message || "Delete failed",
                "danger"
            );
        },

        onSuccess: (data) => {
            showNotification(
                data?.message || "Project deleted",
                "success"
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["projectList"],
            });

            queryClient.invalidateQueries({
                queryKey: ["projectCat"],
            });
        },
    });
};
