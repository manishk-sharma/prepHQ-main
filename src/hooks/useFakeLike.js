import { useState } from "react";
import { generateBaseLikes } from "../utils/helper";


export const useFakeLikes = (postId, type) => {
  const key = `${type}-${postId}-liked`;

  const [liked, setLiked] = useState(
    localStorage.getItem(key) === "true"
  );

  const baseLikes = generateBaseLikes(postId, type);

  const likes = liked ? baseLikes + 1 : baseLikes;

  const toggleLike = () => {
    if (liked) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, "true");
    }
    setLiked(!liked);
  };

  return { likes, liked, toggleLike };
};