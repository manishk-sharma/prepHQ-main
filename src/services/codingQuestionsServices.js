import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "./api";
import adminApi from "./adminApi";
import publicApi from "./publicApi";
import { useNotification } from '../context/useNotificationContext';
import { generateAcceptance } from '../utils/helper';


const getAllCodingQuestions = async () => {
    console.log("getAllCodingQuestions API called");
    try {
        const response = await publicApi.get('/questions');
        console.log("getAllCodingQuestions API response:", response?.data?.data);
        console.log(response?.data?.data?.length, " size of CodingQuestions");

        if (response?.status === 200 && response?.data?.status === 1) {
            const questions = response?.data?.data;
            return questions.map((q) => ({
                ...q,
                acceptance: q.acceptance ?? generateAcceptance(q.difficulty),
            }));
        } else {
            throw new Error(response?.error || "Failed to fetch coding questions");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const getCodingQuestionBySlug = async ({ queryKey }) => {
    const [_key, slug] = queryKey;

    try {
        const response = await publicApi.get(`/questions/${slug}`);
        console.log("getCodingQuestionBySlug API response:", response);

        if (response?.status === 200 && response?.data?.status === 1) {
            return response?.data?.data;
        } else {
            throw new Error(response?.error || "Failed to fetch coding question.");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const createCodingQuestion = async (data) => {
    try {
        const response = await adminApi.post('/questions', data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response?.status === 200 || response?.status === 201) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to create coding question");
        }
    } catch (error) {
        console.log("createCodingQuestion error — status:", error?.response?.status);
        console.log("createCodingQuestion error — backend says:", error?.response?.data);
        throw error;
    }
};


const submitCode = async (payload) => {

    try {
        const response = await api.post('/submit', payload, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("submitCode API response:", response?.data);

        if (response?.status === 200 || response?.status === 202) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to submit code");
        }
    } catch (error) {
        console.log("submitCode error — status:", error?.response?.status);
        console.log("submitCode error — backend says:", error?.response?.data);

        // Surface structured judge responses even on non-2xx (same pattern as runCode)
        const data = error?.response?.data;
        if (data && typeof data.status === "string") {
            return data;
        }

        throw error;
    }
};


// ── GET Admin — All Submissions ───────────────────────────────────────────────
// Success shape: { status: 1, data: [...] }
const getAdminSubmissions = async () => {
    try {
        const response = await adminApi.get("/admin/submissions");
        if (response?.status === 200 && response?.data?.status && Array.isArray(response?.data?.data)) {
            return response.data.data;
        } else {
            throw new Error(response?.data?.error || "Failed to fetch admin submissions");
        }
    } catch (error) {
        console.log("getAdminSubmissions error:", error?.response?.data || error);
        throw error;
    }
};

export const useAdminSubmissions = (options = {}) => {
    return useQuery({
        queryKey: ["adminSubmissions"],
        queryFn: getAdminSubmissions,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: false,
        ...options,
    });
};


// ── GET All User Submissions ──────────────────────────────────────────────────
// Success shape: { status: 1, data: [...] }
const getSubmissions = async () => {
    try {
        const response = await api.get("/submissions");
        if (response?.status === 200 && response?.data?.status && Array.isArray(response?.data?.data)) {
            return response.data.data;
        } else {
            throw new Error(response?.data?.error || "Failed to fetch submissions");
        }
    } catch (error) {
        console.log("getSubmissions error:", error?.response?.data || error);
        throw error;
    }
};

export const useUserSubmissions = (options = {}) => {
    return useQuery({
        queryKey: ["userSubmissions"],
        queryFn: getSubmissions,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        ...options,
    });
};


export const getSubmissionResult = async (submissionId) => {
    try {
        const response = await api.get(`/submit/${submissionId}`);
        if (response?.status === 200) {
            return response?.data;
        }
        throw new Error(response?.data?.message || "Failed to fetch submission result");
    } catch (error) {
        console.log("getSubmissionResult error — status:", error?.response?.status);
        throw error;
    }
};


const runCode = async (payload) => {
    try {
        const response = await api.post('/run', payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("runCode API response:", response?.data);

        if (response?.status === 200) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to run code");
        }
    } catch (error) {
        console.log("runCode error — status:", error?.response?.status);
        console.log("runCode error — backend says:", error?.response?.data);

        // Backend sends structured run results (runtime_error / timeout) with a
        // non-2xx HTTP status (e.g. 500). That is a valid judge response, not a
        // transport failure — surface the body to the UI instead of throwing.
        const data = error?.response?.data;
        if (data && typeof data.status === "string") {
            return data;
        }

        throw error;
    }
};


export const useCodingQuestionList = (options = {}) => {
    return useQuery({
        queryKey: ['codingQuestionList'],
        queryFn: getAllCodingQuestions,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        ...options,
    });
};

export const useCodingQuestionBySlug = (slug) => {
    return useQuery({
        queryKey: ['codingQuestion', slug],
        queryFn: getCodingQuestionBySlug,
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};


const updateCodingQuestion = async ({ id, data }) => {
    console.log("updateCodingQuestion — id:", id);
    console.log("updateCodingQuestion — payload:", JSON.stringify(data, null, 2));
    try {
        const response = await adminApi.put(`/questions/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
      
        if (response?.status === 200) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to update coding question");
        }
    } catch (error) {
        throw error;
    }
};


const deleteCodingQuestion = async (id) => {
    console.log("deleteCodingQuestion — id:", id);
    console.log("deleteCodingQuestion — endpoint:", `/questions/${id}`);
    try {
        const response = await adminApi.delete(`/questions/${id}`);
        console.log("deleteCodingQuestion response:", response?.data);
        if (response?.status === 200) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Failed to delete coding question");
        }
    } catch (error) {
        console.log("deleteCodingQuestion error — status:", error?.response?.status);
        console.log("deleteCodingQuestion error — backend says:", error?.response?.data);
        throw error;
    }
};


export const useRunCode = () => {
    return useMutation({
        mutationFn: runCode,
    });
};

export const useSubmitCode = () => {
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: submitCode,

        onSuccess: (data) => {
            showNotification(data?.message || "Code submitted successfully!", "success");
        },

        onError: (error) => {
            showNotification(error?.message || "Failed to submit code", "danger");
        },
    });
};

export const useAddCodingQuestion = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: createCodingQuestion,

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["codingQuestionList"],
            });

            showNotification(data?.message || "Question added successfully", "success");
        },

        onError: (error) => {
            showNotification(error?.message || "Something went wrong", "danger");
        },
    });
};

export const useUpdateCodingQuestion = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: updateCodingQuestion,

        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["codingQuestionList"] });
            queryClient.invalidateQueries({ queryKey: ["codingQuestion", variables.id] });
            showNotification(data?.message || "Question updated successfully", "success");
        },

        onError: (error) => {
            showNotification(error?.message || "Something went wrong", "danger");
        },
    });
};

export const useDeleteCodingQuestion = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: deleteCodingQuestion,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["codingQuestionList"] });
            const previousQuestions = queryClient.getQueryData(["codingQuestionList"]);
            queryClient.setQueryData(["codingQuestionList"], (old = []) =>
                old.filter((item) => item.id !== id)
            );
            return { previousQuestions };
        },

        onError: (error, id, context) => {
            queryClient.setQueryData(["codingQuestionList"], context.previousQuestions);
            showNotification(error?.message || "Delete failed", "danger");
        },

        onSuccess: (data) => {
            showNotification(data?.message || "Question deleted", "success");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["codingQuestionList"] });
        },
    });
};
