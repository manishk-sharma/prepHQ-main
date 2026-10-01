import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { useProject, useUpdateProject } from "../../../../services/projectsServices";
import { useNotification } from "../../../../context/useNotificationContext";
import { AUTHORS } from "../commons/commons";
import { EditSchema } from "../schema/schema";
import EditForm from "../components/post-form/EditForm";


const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { mutateAsync: updateProject, isPending } = useUpdateProject();
  const { data: projectData, isLoading, isError } = useProject(id);
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
    if (!projectData) return;
    reset({
      post_title: projectData.post_title || "",
      post_name: projectData.post_name || "",
      category_name: projectData.category_name || "",
      category_slug: projectData.category_slug || "",
      post_content: projectData.post_content || "",
      seo_title: projectData.seo_title || "",
      seo_desc: projectData.seo_desc || "",
      seo_focus_keyword: projectData.seo_focus_keyword || "",
      seo_tags: projectData.seo_tags ? JSON.parse(projectData.seo_tags) : [],
      author_id: AUTHORS.find((a) => a.name === projectData.author_name)?.id || null,
      feature_image: null,
    });
  }, [projectData, reset]);

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
      formData.append("post_date", projectData?.post_date || new Date().toISOString());
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

      await updateProject({ id, data: formData });
      navigate("/admin/projects/list");
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
        Failed to load project data. Please try again.
      </div>
    );
  }

  return (
    <EditForm
      pageTitle="Edit Project"
      submitLabel="Update Project"
      isLoading={isPending}
      onSubmit={onSubmit}
      formMethods={{ register, control, setValue, watch, getValues, errors }}
      existingImageUrl={projectData?.featured_image || null}
      previewOpen={previewOpen}
      setPreviewOpen={setPreviewOpen}
    />
  );
};

export default EditProject;