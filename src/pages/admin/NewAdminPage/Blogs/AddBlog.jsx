import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import { useAddBlog } from "../../../../services/blogServices";
import { useNotification } from "../../../../context/useNotificationContext";
import { AUTHORS } from "../commons/commons";
import { PostSchema } from "../schema/schema";
import { useDraft } from "../../../../hooks/useDraft";
import PostForm from "../components/post-form/PostForm";


const BLOG_DRAFTS_KEY = "blog_drafts";

const AddBlog = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
 const { mutateAsync: addBlog, isLoading } = useAddBlog();
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PostSchema),
    defaultValues: { post_content: "", feature_image: null, seo_tags: [] },
  });

  const draft = useDraft(BLOG_DRAFTS_KEY, {
    getFormValues: getValues,
    resetForm: reset,
    setFeatureImage: (file) => setValue("feature_image", file),
  });

  const onSubmit = handleSubmit(async (data) => {
    const selectedAuthor = AUTHORS.find((a) => a.id === Number(data.author_id));
    const cleanHtml = data.post_content
      .replace(/\\n/g, "")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");

    try {
      const formData = new FormData();
      formData.append("post_title", data.post_title);
      formData.append("post_name", data.post_name);
      formData.append("category_name", data.category_name);
      formData.append("category_slug", data.category_slug);
      formData.append("post_date", new Date().toISOString());
      formData.append("post_content", cleanHtml);
      formData.append("seo_title", data.seo_title || "");
      formData.append("seo_desc", data.seo_desc || "");
      formData.append("seo_focus_keyword", data.seo_focus_keyword || "");
      formData.append("seo_tags", JSON.stringify(data.seo_tags || []));
      formData.append("author_name", selectedAuthor?.name || "");
      formData.append("author_image", selectedAuthor?.image || "");
      formData.append("author_quote", selectedAuthor?.quote || "");
      formData.append("author_linkedin", selectedAuthor?.author_linkedin || "");
      if (data.feature_image) formData.append("featured_image", data.feature_image);

      await addBlog(formData);
      draft.clearCurrentDraft();
      reset();
      navigate("/admin/blogs/list");
    } catch (error) {
      showNotification(error?.message || "Something went wrong", "danger");
    }
  });

  return (
    <PostForm
      pageTitle="Add Blog"
      submitLabel="Publish Blog"
      isLoading={isLoading}
      onSubmit={onSubmit}
      formMethods={{ register, control, setValue, watch, getValues, errors }}
      draft={draft}
      previewOpen={previewOpen}
      setPreviewOpen={setPreviewOpen}
    />
  );
};

export default AddBlog;