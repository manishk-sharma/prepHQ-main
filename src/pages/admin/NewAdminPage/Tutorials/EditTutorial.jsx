import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { useTutorial, useUpdateTutorial } from "../../../../services/tutorialServices";
import { useNotification } from "../../../../context/useNotificationContext";
import { AUTHORS } from "../commons/commons";
import { EditSchema } from "../schema/schema";
import EditForm from "../components/post-form/EditForm";


const EditTutorial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { mutateAsync: updateTutorial, isPending } = useUpdateTutorial();
  const { data: tutorialData, isLoading, isError } = useTutorial(id);
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    register, handleSubmit, control, setValue, watch, reset, getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditSchema),
    defaultValues: { post_content: "", feature_image: null, seo_tags: [] },
  });

  // ─── API data aane ke baad form fill karo ────────────────────────────────
  useEffect(() => {
    if (!tutorialData) return;
    reset({
      post_title: tutorialData.post_title || "",
      post_name: tutorialData.post_name || "",
      category_name: tutorialData.category_name || "",
      category_slug: tutorialData.category_slug || "",
      post_content: tutorialData.post_content || "",
      seo_title: tutorialData.seo_title || "",
      seo_desc: tutorialData.seo_desc || "",
      seo_focus_keyword: tutorialData.seo_focus_keyword || "",
      seo_tags: tutorialData.seo_tags ? JSON.parse(tutorialData.seo_tags) : [],
      author_id: AUTHORS.find((a) => a.name === tutorialData.author_name)?.id || null,
      feature_image: null,
    });
  }, [tutorialData, reset]);

  // ─── Submit ───────────────────────────────────────────────────────────────
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
      formData.append("post_date", tutorialData?.post_date || new Date().toISOString());
      formData.append("post_content", cleanHtml);
      formData.append("seo_title", data.seo_title || "");
      formData.append("seo_desc", data.seo_desc || "");
      formData.append("seo_focus_keyword", data.seo_focus_keyword || "");
      formData.append("seo_tags", JSON.stringify(data.seo_tags || []));
      formData.append("author_name", selectedAuthor?.name || "");
      formData.append("author_image", selectedAuthor?.image || "");
      formData.append("author_quote", selectedAuthor?.quote || "");
      formData.append("author_linkedin", selectedAuthor?.author_linkedin || "");
      if (data.feature_image instanceof File)
        formData.append("featured_image", data.feature_image);

      await updateTutorial({ id, data: formData });
      navigate("/admin/tutorials/list");
    } catch (error) {
      showNotification(error?.message || "Something went wrong", "danger");
    }
  });

  // ─── Loading / Error ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <CircularProgress sx={{ color: "#074568" }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger text-center mt-5">
        Failed to load tutorial data. Please try again.
      </div>
    );
  }

  return (
    <EditForm
      pageTitle="Edit Tutorial"
      submitLabel="Update Tutorial"
      isLoading={isPending}
      onSubmit={onSubmit}
      formMethods={{ register, control, setValue, watch, getValues, errors }}
      existingImageUrl={tutorialData?.featured_image || null}
      previewOpen={previewOpen}
      setPreviewOpen={setPreviewOpen}
    />
  );
};

export default EditTutorial;