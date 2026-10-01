import imageCompression from "browser-image-compression";


export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


// utils/groupByCategory.js

export function groupByCategoryWithCount(data = []) {
  const map = {};

  data.forEach((item) => {
    const category = item?.category_name;
    const slug = item?.category_slug;

    if (!category) return;

    if (!map[category]) {
      map[category] = {
        category_name: category,
        category_slug: slug,
        count: 1,
      };
    } else {
      map[category].count += 1;
    }
  });

  return Object.values(map);
}

export const getReadingTime = (html = "") => {
  if (!html) return 0;

  const text = html
    .replace(/<[^>]*>/g, " ")  
    .replace(/\s+/g, " ")
    .trim();

  const words = text ? text.split(" ").length : 0;

  const wordsPerMinute = 500; // standard
  return Math.ceil(words / wordsPerMinute);
};

 export const findTitleFromMenu = (menus, pathname, fallback = "Admin Panel") => {
  for (const item of menus) {

    // main item (dashboard)
    if (item.to && pathname === item.to) {
      return item.label;
    }

    // children
    if (item.children) {
      for (const child of item.children) {

        // exact OR future proof for /edit/123 etc
        if (
          pathname === child.to ||
          pathname.startsWith(child.to + "/")
        ) {
          return `${item.label} / ${child.label}`;
        }
      }
    }
  }

  return fallback;
};

const rawCategories = [
  "Blockchain",
  "Cybersecurity",
  "Extended Reality",
  "Quantum Computing",
  "System Design",
  "IoT & Embedded",
  "Data Analytics,Python",
  "Artificial Intelligence",
  "Python",
  "Data Science",
  "Artificial Intelligence,Python",
  "Machine Learning",
  "Data Analytics",
  "Artificial Intelligence,Generative AI",
  "SQL",
  "Edge Computing",
  "AI/Generative AI/Agentic AI,Machine Learning",
  "AI/Generative AI/Agentic AI"
];

export const categoryList = [
  ...new Set(
    rawCategories.flatMap((item) =>
      item.split(",").map((c) => c.trim())
    )
  )
];



export const processImage = async (file, options = {}, showNotification) => {

  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    format = "webp",
  } = options;

  // size validation
  if (file.size > 5 * 1024 * 1024) {
    showNotification?.("Image must be under 5MB", "warning");
    return null;
  }

  const compressionOptions = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: `image/${format}`,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);

    const processedFile = new File(
      [compressedFile],
      file.name.replace(/\.[^/.]+$/, `.${format}`),
      {
        type: `image/${format}`,
      }
    );

    return processedFile;

  } catch (error) {
    console.log(error);
    showNotification?.("Image processing failed", "danger");
    return null;
  }
};

export const parseSeoTags = (seoTags) => {
  if (!seoTags) return [];

  try {
    return typeof seoTags === "string"
      ? JSON.parse(seoTags)
      : seoTags;
  } catch {
    return [];
  }
};

export const buildSeoKeywords = (focusKeyword, seoTags) => {
  const tags = parseSeoTags(seoTags);

  return [focusKeyword, ...tags]
    .map((item) => item?.trim())
    .filter(Boolean)
    .join(", ");
};

export const generateSeoMeta = (post) => {

  const seoTitle =
    post?.seo_title || post?.post_title || "PrepHQ";

  const seoDescription =
    post?.seo_desc ||
    post?.description ||
    post?.excerpt ||
    "";

  const seoImage =
    post?.featured_image || "https://prephq.theiotacademy.co/uploads/tutorial/2025/12/20-NumPy-Tutorial-in-Python-01-2.webp";

  const seoUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  const keywords = buildSeoKeywords(
    post?.seo_focus_keyword,
    post?.seo_tags
  );

  return {
    title: seoTitle,
    description: seoDescription,
    image: seoImage,
    url: seoUrl,
    keywords,
  };
};

import { useEffect, useState } from "react";

export const useFakeLikes = (id, type) => {
  const storageKey = `likes_${type}_${id}`;
  const likedKey = `liked_${type}_${id}`;

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id || !type) return;

    //  load from localStorage
    const storedLikes = localStorage.getItem(storageKey);
    const storedLiked = localStorage.getItem(likedKey);

    if (storedLikes) {
      setLikes(Number(storedLikes));
    } else {
      //  random initial likes (1000–1500)
      const randomLikes = Math.floor(1000 + Math.random() * 500);
      setLikes(randomLikes);
      localStorage.setItem(storageKey, randomLikes);
    }

    if (storedLiked) {
      setLiked(JSON.parse(storedLiked));
    }
  }, [id, type]);

  const toggleLike = () => {
    let updatedLikes = likes;

    if (liked) {
      updatedLikes = likes - 1;
    } else {
      updatedLikes = likes + 1;
    }

    setLikes(updatedLikes);
    setLiked(!liked);

    //  save to localStorage
    localStorage.setItem(storageKey, updatedLikes);
    localStorage.setItem(likedKey, JSON.stringify(!liked));
  };

  return { likes, liked, toggleLike };
};

 const ACCEPTANCE_RANGES = {
  Easy:   [80, 90],
  Medium: [70, 80],
  Hard:   [50, 70],
};

export const generateAcceptance = (difficulty) => {
  const [min, max] = ACCEPTANCE_RANGES[difficulty] ?? [60, 75];
  const value = (Math.random() * (max - min) + min).toFixed(1);
  return `${value}%`;
};

const BACKEND_BASE = "https://backend.prephq.theiotacademy.co";

export const getProfileImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  console.log("getProfileImageUrl called with path:", path);
  return `${BACKEND_BASE}/${path.replace(/^\//, "")}`;
};

export const formatSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };
