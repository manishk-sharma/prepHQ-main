import api from "./api";

const endpoints = ["/tutorial", "/interview", "/project", "/blog"];

export const getAllCategories = async () => {
  try {
    const responses = await Promise.all(endpoints.map((url) => api.get(url)));
    const allPosts = responses.flatMap((res) => res?.data?.data || []);

    const categories = allPosts
      .map((post) => post?.category_name)
      .filter(Boolean);
    const uniqueCategories = [...new Set(categories)];

    console.log(uniqueCategories);
    return uniqueCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
