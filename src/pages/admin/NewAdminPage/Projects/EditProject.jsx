import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { useProject, useUpdateProject } from "../../../../services/projectsServices";
import { useNotification } from "../../../../context/useNotificationContext";
import { AUTHORS } from "../commons/commons";
import { EditProjectSchema } from "../schema/schema";
import EditForm from "../components/post-form/EditForm";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { mutateAsync: updateProject, isPending } = useUpdateProject();
  const { data: projectData, isLoading, isError } = useProject(id);
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
    resolver: yupResolver(EditProjectSchema),
    defaultValues: {
      post_title: "",
      post_name: "",
      category_name: "",
      category_slug: "",
      post_content: "",
      seo_title: "",
      seo_desc: "",
      seo_focus_keyword: "",
      seo_tags: [],
      author_id: 1,
      feature_image: null,
      post_excerpt: "",
      description: "",
      difficulty_level: "Intermediate",
      domain: "Data Science",
      project_type: "Machine Learning",
      tech_stack: "",
      project_duration: "",
      github_url: "",
      live_demo_url: "",
    },
  });

  // ─── API data aane ke baad form fill karo ────────────────────────────────
  useEffect(() => {
    if (!projectData) return;

    const matchedAuthor = AUTHORS.find((a) => a.name === projectData.author_name);
    const authorId = matchedAuthor?.id || AUTHORS[0]?.id || 1;
    const existingExcerpt =
      projectData.post_excerpt ||
      projectData.description ||
      projectData.project_description ||
      "";

    reset({
      post_title: projectData.post_title || "",
      post_name: projectData.post_name || "",
      category_name: projectData.category_name || "",
      category_slug: projectData.category_slug || "",
      post_excerpt: existingExcerpt,
      description: existingExcerpt,
      post_content: projectData.post_content || "",
      seo_title: projectData.seo_title || "",
      seo_desc: projectData.seo_desc || "",
      seo_focus_keyword: projectData.seo_focus_keyword || "",
      seo_tags: projectData.seo_tags
        ? typeof projectData.seo_tags === "string"
          ? (() => {
              try {
                return JSON.parse(projectData.seo_tags);
              } catch {
                return [];
              }
            })()
          : projectData.seo_tags
        : [],
      author_id: authorId,
      feature_image: null,
      difficulty_level:
        projectData.difficulty_level || projectData.level || "Intermediate",
      domain: projectData.domain || "Data Science",
      project_type: projectData.project_type || "Machine Learning",
      tech_stack: projectData.tech_stack || projectData.technologies || "",
      project_duration:
        projectData.project_duration || projectData.duration || "",
      github_url: projectData.github_url || "",
      live_demo_url: projectData.live_demo_url || "",
    });
  }, [projectData, reset]);

  // ─── Validation Error Feedback ───────────────────────────────────────────
  const onInvalid = (validationErrors) => {
    console.warn("Validation errors on project update:", validationErrors);
    const firstKey = Object.keys(validationErrors)[0];
    const message =
      validationErrors[firstKey]?.message ||
      `Please check the ${firstKey} field.`;
    showNotification(message, "warning");
  };

  // ─── Submit Handler ───────────────────────────────────────────────────────
  const onSubmit = handleSubmit(async (data) => {
    const selectedAuthor = AUTHORS.find((a) => a.id === Number(data.author_id));
    const cleanHtml = (data.post_content || "")
      .replace(/\\n/g, "")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
    const cleanExcerptHtml = (data.post_excerpt || data.description || "")
      .replace(/\\n/g, "")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");

    try {
      const formData = new FormData();
      formData.append("post_title", data.post_title);
      formData.append("post_name", data.post_name);
      formData.append("category_name", data.category_name);
      formData.append("category_slug", data.category_slug || "");
      formData.append(
        "post_date",
        projectData?.post_date || new Date().toISOString()
      );
      formData.append("post_excerpt", cleanExcerptHtml);
      formData.append("description", cleanExcerptHtml);
      formData.append("project_description", cleanExcerptHtml);
      formData.append("post_content", cleanHtml);
      formData.append("seo_title", data.seo_title || "");
      formData.append("seo_desc", data.seo_desc || "");
      formData.append("seo_focus_keyword", data.seo_focus_keyword || "");
      formData.append("seo_tags", JSON.stringify(data.seo_tags || []));
      formData.append(
        "author_name",
        selectedAuthor?.name || projectData?.author_name || "Ashwini Kumar"
      );
      formData.append(
        "author_image",
        selectedAuthor?.image || projectData?.author_image || ""
      );
      formData.append(
        "author_quote",
        selectedAuthor?.quote || projectData?.author_quote || ""
      );
      formData.append(
        "author_linkedin",
        selectedAuthor?.author_linkedin || projectData?.author_linkedin || ""
      );
      formData.append("difficulty_level", data.difficulty_level || "Intermediate");
      formData.append("domain", data.domain || "Data Science");
      formData.append("project_type", data.project_type || "Machine Learning");
      formData.append("tech_stack", data.tech_stack || "");
      formData.append("project_duration", data.project_duration || "");
      formData.append("github_url", data.github_url || "");
      formData.append("live_demo_url", data.live_demo_url || "");

      if (data.feature_image instanceof File) {
        formData.append("featured_image", data.feature_image);
      } else if (data.remove_image) {
        formData.append("remove_image", "true");
      }

      await updateProject({ id, data: formData });
      navigate("/admin/projects/list");
    } catch (error) {
      showNotification(error?.message || "Something went wrong", "danger");
    }
  }, onInvalid);

  // ─── Loading / Error ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 300 }}
      >
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
      isProject={true}
    />
  );
};

export default EditProject;