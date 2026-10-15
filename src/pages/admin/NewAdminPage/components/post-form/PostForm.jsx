import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline, IoSaveOutline } from "react-icons/io5";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import PreviewIcon from "@mui/icons-material/Preview";

import { categoryList, processImage, formatSlug } from "../../../../../utils/helper";
import { AUTHORS } from "../../commons/commons";

import DraftsMenu from "../DraftsMenu";
import { PreviewModal } from "../PreviewModal";
import { useNotification } from "../../../../../context/useNotificationContext";

/**
 * PostForm — Reusable form UI for Add Tutorial / Add Blog / Add Interview / Add Project
 */
const PostForm = ({
  pageTitle = "Add Tutorial",
  submitLabel = "Publish Tutorial",
  isLoading = false,
  onSubmit,
  formMethods,
  draft,
  previewOpen = false,
  setPreviewOpen = () => {},
}) => {
  const { showNotification } = useNotification();
  const { register, control, setValue, watch, getValues, errors } = formMethods;

  const featureImage = watch("feature_image");
  const formValues = watch();

  // ─── Alt-label fix for TinyMCE image dialog ──────────────────────────────
  useEffect(() => {
    const changeAltLabel = () => {
      document.querySelectorAll(".tox-label").forEach((label) => {
        if (label.innerText === "Alternative description")
          label.innerText = "Alt Name";
      });
    };
    const observer = new MutationObserver(changeAltLabel);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // ─── Dropzone (shared config) ─────────────────────────────────────────────
  const dropzoneConfig = {
    accept: { "image/*": [] },
    multiple: false,
    onDrop: async (files) => {
      if (!files[0]) return;
      const processed = await processImage(
        files[0],
        { maxSizeMB: 0.8, format: "webp" },
        showNotification,
      );
      if (processed)
        setValue("feature_image", processed, { shouldValidate: true });
    },
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig);
  const { getRootProps: getReplaceProps, getInputProps: getReplaceInputProps } =
    useDropzone(dropzoneConfig);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* ── Page Header & Top Actions ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{pageTitle}</h1>
          <p className="admin-page-desc">
            Create, edit, and publish learning content with rich media and SEO.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center flex-wrap gap-2">
          {draft && (
            <DraftsMenu
              drafts={draft.drafts}
              draftsMenuAnchor={draft.draftsMenuAnchor}
              setDraftsMenuAnchor={draft.setDraftsMenuAnchor}
              loadDraft={draft.loadDraft}
              deleteDraft={draft.deleteDraft}
            />
          )}

          {draft && (
            <Button
              type="button"
              variant="outlined"
              startIcon={<IoSaveOutline />}
              onClick={() => draft.saveAsDraft(false)}
              className="admin-btn-secondary"
            >
              Save Draft
            </Button>
          )}

          <Button
            type="button"
            variant="contained"
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{
              backgroundColor: "var(--admin-accent, #35B779) !important",
              color: "#FFFFFF !important",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "8px 18px",
              boxShadow: "0 2px 4px rgba(53, 183, 121, 0.25)",
              "&:hover": {
                backgroundColor: "var(--admin-accent-hover, #2da169) !important",
              },
            }}
          >
            Preview
          </Button>
        </div>
      </div>

      {/* ── Auto-save Status Row ── */}
      {draft && (
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: draft.autoSaveEnabled ? "var(--admin-accent, #35B779)" : "#94A3B8",
              }}
            />
            <span style={{ fontSize: "13px", color: "var(--admin-text-secondary, #64748B)" }}>
              {draft.autoSaveEnabled ? "Auto-save active (every 60s)" : "Auto-save paused"}
            </span>
          </div>

          <div className="admin-autosave-pill">
            <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="autoSaveToggle"
                checked={draft.autoSaveEnabled}
                onChange={(e) => draft.setAutoSaveEnabled(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label
                className="form-check-label mb-0"
                htmlFor="autoSaveToggle"
                style={{ cursor: "pointer", fontSize: "13px" }}
              >
                Auto-save every 60 seconds
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Form ── */}
      <form onSubmit={onSubmit}>
        <div className="d-flex flex-column gap-4">

          {/* ── Card 1: Core Content Information ── */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">General Information</h3>
                <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                  Basic identity and classification for this content item.
                </div>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="row g-3">
                {/* Row 1: Post Title */}
                <div className="col-12 col-md-6">
                  <TextField
                    label="Post Title"
                    fullWidth
                    placeholder="e.g. Introduction to Embedded C"
                    {...register("post_title")}
                    error={!!errors.post_title}
                    helperText={errors.post_title?.message}
                    InputLabelProps={{ shrink: !!watch("post_title") }}
                  />
                </div>

                {/* Row 1: Post Slug */}
                <div className="col-12 col-md-6">
                  <TextField
                    label="Post Slug (post_name)"
                    fullWidth
                    placeholder="e.g. introduction-to-embedded-c"
                    inputProps={{
                      onKeyDown: (e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                          const { selectionStart: s, selectionEnd: en, value } = e.target;
                          if (value[s - 1] === "-") return;
                          const next = value.slice(0, s) + "-" + value.slice(en);
                          e.target.value = next;
                          e.target.setSelectionRange(s + 1, s + 1);
                          setValue("post_name", next, { shouldValidate: true });
                        }
                      },
                      onChange: (e) => {
                        const formatted = formatSlug(e.target.value);
                        e.target.value = formatted;
                        setValue("post_name", formatted, { shouldValidate: true });
                      },
                    }}
                    {...register("post_name")}
                    error={!!errors.post_name}
                    helperText={errors.post_name?.message || "URL path identifier for the post"}
                    InputLabelProps={{ shrink: !!watch("post_name") }}
                  />
                </div>

                {/* Row 2: Category Name */}
                <div className="col-12 col-md-6">
                  <Controller
                    name="category_name"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        freeSolo
                        options={categoryList}
                        value={field.value || ""}
                        onChange={(_, v) => {
                          field.onChange(v || "");
                          setValue("category_slug", formatSlug(v || ""));
                        }}
                        onInputChange={(_, v) => {
                          field.onChange(v);
                          setValue("category_slug", formatSlug(v));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category Name"
                            placeholder="Select or type category"
                            error={!!errors.category_name}
                            helperText={errors.category_name?.message}
                            InputLabelProps={{ shrink: !!field.value }}
                          />
                        )}
                      />
                    )}
                  />
                  <input type="hidden" {...register("category_slug")} />
                </div>

                {/* Row 2: Author */}
                <div className="col-12 col-md-6">
                  <Controller
                    name="author_id"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <Autocomplete
                        options={AUTHORS}
                        getOptionLabel={(o) => o.name}
                        value={AUTHORS.find((a) => a.id === field.value) || null}
                        onChange={(_, v) => field.onChange(v?.id || null)}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} display="flex" alignItems="center" gap={1.5} py={1}>
                            <Avatar src={option.image} alt={option.name} sx={{ width: 30, height: 30 }} />
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 600 }}>{option.name}</div>
                              <div style={{ fontSize: "11px", color: "#64748B" }}>Author / Mentor</div>
                            </div>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Author"
                            placeholder="Choose author profile"
                            error={!!errors?.author_id}
                            helperText={errors?.author_id?.message}
                            InputLabelProps={{ shrink: !!field.value }}
                          />
                        )}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 2: Feature Image Upload ── */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Feature Image</h3>
                <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                  Card thumbnail and banner image (WebP, PNG, or JPG recommended).
                </div>
              </div>
            </div>

            <div className="admin-card-body">
              {featureImage ? (
                <div className="admin-upload-preview-box">
                  <img
                    src={
                      featureImage instanceof File
                        ? URL.createObjectURL(featureImage)
                        : (featureImage?.data ?? featureImage)
                    }
                    alt="Feature preview"
                    className="admin-upload-preview-img"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                  <p style={{ margin: "12px 0 10px", fontSize: "13px", fontWeight: 500, color: "var(--admin-text)" }}>
                    {featureImage instanceof File ? featureImage.name : "Saved Feature Image"}
                  </p>

                  <div className="d-flex align-items-center gap-2">
                    <div {...getReplaceProps()} style={{ display: "inline-block" }}>
                      <input {...getReplaceInputProps()} />
                      <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        startIcon={<CachedIcon />}
                        className="admin-btn-secondary"
                      >
                        Replace Image
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => setValue("feature_image", null, { shouldValidate: true })}
                      sx={{ textTransform: "none", borderRadius: "8px" }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`admin-upload-card ${isDragActive ? "active" : ""} ${
                    errors.feature_image ? "error" : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="admin-upload-icon-wrap">
                    <IoCloudUploadOutline size={30} />
                  </div>
                  <div className="admin-upload-primary-text">Upload feature image</div>
                  <div className="admin-upload-subtext">
                    Drag and drop an image here, or click to browse files
                  </div>
                  <button type="button" className="admin-upload-browse-btn">
                    Browse Files
                  </button>
                </div>
              )}

              {errors.feature_image && (
                <div className="text-danger small mt-2">{errors.feature_image.message}</div>
              )}
            </div>
          </div>

          {/* ── Card 3: Post Content Editor ── */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Post Content</h3>
                <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                  Write and format article content with code blocks, tables, and media.
                </div>
              </div>
            </div>

            <div className="admin-card-body p-2 p-sm-3">
              <Controller
                name="post_content"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: errors.post_content
                        ? "1px solid #EF4444"
                        : "1px solid var(--admin-border, #E2E8F0)",
                    }}
                  >
                    <Editor
                      apiKey="9upr0hixy7g4w8g9mazmhkqgyl0m4kjvz623rjwvekg4l86k"
                      value={field.value}
                      onEditorChange={(content) => field.onChange(content)}
                      init={{
                        height: 480,
                        menubar: true,
                        language: "en",
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "help",
                          "wordcount",
                          "emoticons",
                          "codesample",
                        ],
                        automatic_uploads: false,
                        file_picker_types: "image",
                        file_picker_callback: (cb, _value, meta) => {
                          if (meta.filetype !== "image") return;
                          const input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*");
                          input.addEventListener("change", (e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.addEventListener("load", () =>
                              cb(reader.result, { title: file.name })
                            );
                            reader.readAsDataURL(file);
                          });
                          input.click();
                        },
                        toolbar:
                          "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | " +
                          "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                          "table tableprops tablecellprops tablerowprops | link image media table codesample | " +
                          "removeformat code fullscreen | help",
                        table_toolbar:
                          "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | " +
                          "tableinsertcolbefore tableinsertcolafter tabledeletecol | " +
                          "tablecellprops tablerowprops tablemergecells tablesplitcells",
                        table_appearance_options: true,
                        table_advtab: true,
                        table_default_attributes: { border: "1" },
                        table_header_type: "section",
                        table_style_by_css: true,
                        table_resize_bars: true,
                        table_cell_advtab: true,
                        image_advtab: true,
                        image_caption: true,
                        media_live_embeds: true,
                        codesample_languages: [
                          { text: "HTML/XML", value: "markup" },
                          { text: "JavaScript", value: "javascript" },
                          { text: "CSS", value: "css" },
                          { text: "Python", value: "python" },
                          { text: "Java", value: "java" },
                          { text: "C/C++", value: "c" },
                          { text: "PHP", value: "php" },
                          { text: "SQL", value: "sql" },
                          { text: "Bash", value: "bash" },
                        ],
                        content_style: `
                          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.7; color: #172B3A; padding: 16px; }
                          table { border-collapse: collapse; width: 100%; border: 1px solid #E2E8F0; }
                          table td, table th { border: 1px solid #E2E8F0; padding: 8px 12px; }
                          table th { background-color: #0B4565; color: #fff; font-weight: 600; }
                          pre { background: #0F172A; color: #E2E8F0; padding: 12px; border-radius: 6px; overflow-x: auto; }
                        `,
                      }}
                    />
                  </Box>
                )}
              />
              {errors.post_content && (
                <div className="text-danger small mt-2">{errors.post_content.message}</div>
              )}
            </div>
          </div>

          {/* ── Card 4: SEO Optimization ── */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Search Engine Optimization (SEO)</h3>
                <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                  Configure metadata tags, search titles, and keywords for ranking.
                </div>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="row g-3">
                {/* SEO Title */}
                <div className="col-12 col-md-6">
                  <TextField
                    label="SEO Title"
                    fullWidth
                    placeholder="Search engine title tag"
                    {...register("seo_title")}
                    error={!!errors.seo_title}
                    helperText={
                      errors.seo_title?.message || `${watch("seo_title")?.length || 0}/60 characters`
                    }
                    inputProps={{ maxLength: 60 }}
                    InputLabelProps={{ shrink: !!watch("seo_title") }}
                  />
                </div>

                {/* SEO Focus Keyword */}
                <div className="col-12 col-md-6">
                  <TextField
                    label="SEO Focus Keyword"
                    fullWidth
                    placeholder="e.g. Embedded systems tutorial"
                    {...register("seo_focus_keyword")}
                    error={!!errors.seo_focus_keyword}
                    helperText={errors.seo_focus_keyword?.message || "Primary target search keyword"}
                    InputLabelProps={{ shrink: !!watch("seo_focus_keyword") }}
                  />
                </div>

                {/* SEO Tags */}
                <div className="col-12 col-md-6">
                  <Controller
                    name="seo_tags"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={field.value || []}
                        onChange={(_, v) => field.onChange(v)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="SEO Tags"
                            placeholder="Add tag and press Enter"
                            InputLabelProps={{ shrink: !!field.value?.length }}
                          />
                        )}
                      />
                    )}
                  />
                </div>

                {/* SEO Description */}
                <div className="col-12 col-md-6">
                  <TextField
                    label="SEO Description"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Brief summary displayed in Google search results"
                    {...register("seo_desc")}
                    error={!!errors.seo_desc}
                    helperText={
                      errors.seo_desc?.message || `${watch("seo_desc")?.length || 0}/160 characters`
                    }
                    inputProps={{ maxLength: 160 }}
                    InputLabelProps={{ shrink: !!watch("seo_desc") }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Form Action Bar ── */}
          <div
            className="admin-card p-3 d-flex align-items-center justify-content-between flex-wrap gap-3"
            style={{ position: "sticky", bottom: 16, zIndex: 100 }}
          >
            <div className="d-flex align-items-center gap-2">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={
                  isLoading ? <CircularProgress size={18} color="inherit" /> : <PublishIcon />
                }
                className="admin-btn-primary"
              >
                {submitLabel}
              </Button>

              {draft && (
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  startIcon={<IoSaveOutline />}
                  onClick={() => draft.saveAsDraft(false)}
                  className="admin-btn-secondary"
                >
                  Save as Draft
                </Button>
              )}
            </div>

            <Button
              type="button"
              variant="text"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewOpen(true)}
              sx={{ color: "var(--admin-text-secondary)", textTransform: "none" }}
            >
              Preview Content
            </Button>
          </div>

        </div>
      </form>

      {/* ── Preview Modal ── */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        previewData={{
          ...getValues(),
          featured_image:
            featureImage instanceof File ? URL.createObjectURL(featureImage) : null,
          post_date: new Date().toISOString(),
          author_id: getValues().author_id,
        }}
        formValues={formValues}
      />
    </div>
  );
};

export default PostForm;