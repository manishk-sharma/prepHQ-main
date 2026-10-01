import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import api from "./api";
import publicApi from "./publicApi";
import { userLoginSuccess, userLogout, adminLogout } from "../redux/slices/authSlice";


const RESEND_CODE_URL = "https://prephq.theiotacademy.co/api/resend-code";


export const loginAdmin = async (credentials) => {
  try {
    const response = await publicApi.post("/admin-login", credentials);
    if (response?.status === 200) {
      return response?.data;
    } else {
      throw new Error(response.data.error || "Failed to fetch admin data.");
    }
  } catch (error) {
    throw error;
  }
};



const loginUser = async (credentials) => {
  try {
    const response = await publicApi.post("/loginUser", credentials);
    console.log("User login response:", response?.data);

    if (response?.status === 200 && response?.data?.token) {
      return response?.data;
    } else {
      throw new Error(response?.data?.message || "Login failed");
    }
  } catch (error) {
    // Surface the backend body so the component can show specific messages
    // (e.g. "user not found" / "invalid password").
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


const registerUser = async (regData) => {
  try {
    const response = await publicApi.post("/register", regData);
    console.log("Register response:", response?.data);
    return response?.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


const confirmAccount = async ({ otp, user, confirmToken }) => {
  try {
    const response = await api.post(
      "/confirm",
      { otp, user },
      { headers: { Authorization: `Bearer ${confirmToken}` } }
    );
    console.log("Confirm response:", response?.data);
    return response?.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


const resendCode = async (confirmToken) => {
  try {
    const response = await api.post(RESEND_CODE_URL, null, {
      headers: { Authorization: `Bearer ${confirmToken}` },
    });
    console.log("Resend code response:", response?.data);
    return response?.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


const requestReset = async (username) => {
  try {
    const response = await publicApi.post("/request_reset", { username });
    console.log("Request reset response:", response?.data);
    return response?.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


const verifyResetCode = async ({ code, resetToken }) => {
  try {
    const response = await api.post(
      "/verify_code",
      { code },
      { headers: { Authorization: `Bearer ${resetToken}` } }
    );
    console.log("Verify code response:", response?.data);
    return response?.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


const resetPassword = async ({ username, new_password, resetToken }) => {
  try {
    const response = await api.post(
      "/reset_password",
      { username, new_password },
      { headers: { Authorization: `Bearer ${resetToken}` } }
    );
    console.log("Reset password response:", response?.data);
    return response?.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


const logoutAdmin = async (adminToken) => {
  try {
    const response = await api.post(
      "/admin-logout",
      null,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (response?.status === 200) {
      return response?.data;
    } else {
      throw new Error(response?.data?.error || "Failed to logout admin.");
    }
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to logout admin.");
  }
};


const logoutUser = async () => {
  try{
    const response = await api.post("/logout");
    console.log("Logout response:", response);

    if (response?.status === 200) {
      return response?.data;
    } else {
      throw new Error(response.data.error || "Failed to logout.");
    }
  }catch(error){
    throw new Error("Failed to logout.");
  }
};


export const useUserLogin = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data?.token) {
        dispatch(userLoginSuccess({ token: data.token, user: data.user }));
      }
    },
  });
};

export const useRegister = () => useMutation({ mutationFn: registerUser });

export const useConfirmAccount = () =>
  useMutation({ mutationFn: confirmAccount });

export const useResendCode = () => useMutation({ mutationFn: resendCode });

export const useRequestReset = () => useMutation({ mutationFn: requestReset });

export const useVerifyResetCode = () =>
  useMutation({ mutationFn: verifyResetCode });

export const useResetPassword = () =>
  useMutation({ mutationFn: resetPassword });


export const useUserLogout = () => {
  const dispatch = useDispatch();
  return async () => {
    await logoutUser();
    dispatch(userLogout());
    localStorage.removeItem("token");
  };
};


export const useAdminLogout = () => {
  const dispatch = useDispatch();
  const adminToken = useSelector((state) => state.auth.admin.token);
  return async () => {
    await logoutAdmin(adminToken);
    dispatch(adminLogout());
    localStorage.removeItem("adminToken");
  };
};
