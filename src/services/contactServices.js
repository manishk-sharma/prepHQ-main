import { useMutation } from "@tanstack/react-query";
import api from "./api";


const sendContactMessage = async (formData) => {
  try {
    const response = await api.post("/contactus", formData);
    console.log("contactus response:", response?.data);
    return response?.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


const subscribeNewsletter = async (email) => {
  try {
    const response = await api.post("/newsletterSubscribe", { email });
    console.log("newsletterSubscribe response:", response?.data);
    return response?.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data) return data;
    throw error;
  }
};


export const useContactUs = () =>
  useMutation({ mutationFn: sendContactMessage });

export const useNewsletterSubscribe = () =>
  useMutation({ mutationFn: subscribeNewsletter });
