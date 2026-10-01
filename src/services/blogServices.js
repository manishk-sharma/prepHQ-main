import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "./api";
import adminApi from "./adminApi";
import publicApi from "./publicApi";
import { useNotification } from '../context/useNotificationContext';

const getAllBlogs = async () => {
    
    console.log("getAllBlogs API called");
    try {
        const response = await publicApi.get('/blog');
        console.log("getAll Blogs API response:", response?.data?.data);
        console.log(response?.data?.data?.length, " size of Blogs");

        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch Blogs");
        }
    } catch (error) {
        console.log(error, "error");
    }
};

const getBlog = async ({ queryKey }) => {
    const [_key, id] = queryKey;

    try {
        const response = await publicApi.get(`/blog/${id}`);
        console.log("getBlog API response:", response);
        console.log(response?.data?.data?.length, "size of getBlog");

        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch Blog.");
        }
    } catch (error) {
        console.log(error, "error");
    }
};

const getBlogByCategory = async ({ queryKey }) => {
    const [_key, category] = queryKey;

    try {
        const response = await publicApi.get(`/blog/category/${category}`);
        console.log("getBlogByCategory API response:", response);
        console.log(response?.data?.data?.length, "size of getBlogByCategory");

        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch Blog By Category.");
        }
    } catch (error) {
        console.log(error, "error");
    }
};


const createBlog = async (data) => {
    try{
         const response = await adminApi.post("/blog", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (response?.status === 201 && response?.data?.status === 1) {
        return response?.data;
    } else {
        throw new Error(response?.data?.message || "Failed to create blog");
    }
    }catch(error){
        console.log(error);
        throw error;
    }
   
};


const updateBlog = async ({ id, data }) => {
    try{

        const response = await adminApi.put(`/blog/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    
        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to update blog");
        }
    }catch(error){
        console.log(error);
        throw error;
    }
};


const deleteBlog = async (id) => {
    try{
         const response = await adminApi.delete(`/blog/${id}`);

    if (response?.status === 200 && response?.data?.status === 1) {
        return response?.data;
    } else {
        throw new Error(response?.data?.message || "Failed to delete blog");
    }
    }catch(error){
        console.log(error);
        throw error;
    }
   
};

const postLikeBlog = async (id) => {
    try{
        const response = await api.post(`/blog/${id}/like`);
        console.log("blog like api response", response);

        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data;
        }
    }catch(error){
        console.log(error);
        throw error;
    }
};

export const useLikeBlog = (id) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postLikeBlog,

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["blog", id],
            });
        }
    });
};

export const useBlogByCategory = (category) => {
    return useQuery({
        queryKey: ['blogCat', category],
        queryFn: getBlogByCategory,
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useBlog = (id) => {
    return useQuery({
        queryKey: ['blog', id],
        queryFn: getBlog,
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useBlogList = (options = {}) => {
    return useQuery({
        queryKey: ['blogList'],
        queryFn: getAllBlogs,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        ...options,
    });
};


export const useAddBlog = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: createBlog,

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: ["blogList"],
            });

            queryClient.invalidateQueries({
                queryKey: ["blogCat"],
            });

            showNotification(data?.message || "Blog added", "success");
        },

        onError: (error) => {
            showNotification(error?.message || "Something went wrong", "danger");
        },
    });
};
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: updateBlog,

    onSuccess: (data, variables) => {

      // list refetch
      queryClient.invalidateQueries({
        queryKey: ["blogList"],
      });

      // category refetch
      queryClient.invalidateQueries({
        queryKey: ["blogCat"],
      });

      // single refetch
      queryClient.invalidateQueries({
        queryKey: ["blog", variables.id],
      });

      showNotification(data?.message || "Blog updated", "success");
    },

    onError: (error) => {
      showNotification(error?.message || "Something went wrong", "danger");
    },
  });
};



export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: deleteBlog,

        // optimistic update
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["blogList"] });

            const previousBlogs =
                queryClient.getQueryData(["blogList"]);

            queryClient.setQueryData(["blogList"], (old = []) =>
                old.filter((item) => item.ID !== id)
            );

            return { previousBlogs };
        },

        onError: (error, id, context) => {
            queryClient.setQueryData(
                ["blogList"],
                context.previousBlogs
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
                queryKey: ["blogList"],
            });

            queryClient.invalidateQueries({
                queryKey: ["blogCat"],
            });
        },
    });
};
