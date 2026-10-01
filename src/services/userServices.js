import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "./api";
import { updateUser } from "../redux/slices/authSlice";

// The bearer token is attached automatically by the request interceptor in
// api.js (it reads state.auth.user.token), so none of these calls pass it
// manually — that also fixes the old localStorage-token mismatch.

// ── GET Current User ──────────────────────────────────────────────────────────
// Success shape: { status: true, user: {...} }
const getUser = async () => {
  try {
    const response = await api.get("/user");
    console.log("getUser API response:", response?.data);

    if (response?.status === 200 && response?.data?.status && response?.data?.user) {
      return response?.data?.user;
    } else {
      throw new Error(response?.data?.error || "Failed to fetch user");
    }
  } catch (error) {
    console.log("getUser error:", error?.response?.data || error);
    throw error;
  }
};

// ── POST Update Profile ───────────────────────────────────────────────────────
// Success shape: { status: 1, user: {...} }
const updateProfile = async (data) => {
  try {
    const response = await api.post("/profileupdate", data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("updateProfile response:", response?.data);

    if (response?.status === 200 && response?.data?.status) {
      return response?.data;
    } else {
      throw new Error(response?.data?.error || "Failed to update profile");
    }
  } catch (error) {
    const resp = error?.response?.data;
    if (resp) throw new Error(resp.error || "Failed to update profile");
    throw error;
  }
};

// ── POST Upload Profile Image ─────────────────────────────────────────────────
// multipart — do NOT set Content-Type, axios adds the boundary for FormData.
// Success shape: { status: "success", image: "<path or url>" }
const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profile_image", file);
  try {
    const response = await api.post("/upload-profile-image", formData);
    console.log("uploadProfileImage response:", response?.data);

    if (response?.data?.status === "success" && response?.data?.image) {
      return response?.data;
    } else {
      throw new Error(response?.data?.error || "Failed to upload image");
    }
  } catch (error) {
    const resp = error?.response?.data;
    if (resp) throw new Error(resp.error || "Failed to upload image");
    throw error;
  }
};

// ── POST Upload Resume ────────────────────────────────────────────────────────
// Success shape: { status: "success", resume, resume_url, resume_date, ... }
const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  try {
    const response = await api.post("/upload-resume", formData);
    console.log("uploadResume response:", response?.data);

    if (response?.data?.status === "success") {
      return response?.data;
    } else {
      throw new Error(response?.data?.error || "Upload failed");
    }
  } catch (error) {
    const resp = error?.response?.data;
    if (resp) throw new Error(resp.error || "Upload failed");
    throw error;
  }
};

// ── DELETE Resume ─────────────────────────────────────────────────────────────
const deleteResume = async () => {
  try {
    const response = await api.delete("/delete-resume", {
      data: { action: "delete-resume" },
    });
    console.log("deleteResume response:", response?.data);

    if (response?.data?.status === "success") {
      return response?.data;
    } else {
      throw new Error(response?.data?.error || "Failed to delete resume");
    }
  } catch (error) {
    const resp = error?.response?.data;
    if (resp) throw new Error(resp.error || "Failed to delete resume");
    throw error;
  }
};

// ── Query / Mutation Hooks ────────────────────────────────────────────────────
export const useUserProfile = (options = {}) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    ...options,
  });
};

export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data?.user) dispatch(updateUser(data.user));
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
