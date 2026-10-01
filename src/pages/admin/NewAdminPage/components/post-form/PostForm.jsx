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
 * PostForm — reusable form UI for Tutorial / Blog / Interview / Projects etc.
 *
 * Props:
 *  - pageTitle      : string           — e.g. "Add Tutorial"
 *  - submitLabel    : string           — e.g. "Publish Tutorial"
 *  - isLoading      : boolean          — submit button loader
 *  - onSubmit       : function         — form submit handler (already wrapped in handleSubmit)
 *  - formMethods    : object           — { register, control, setValue, watch, getValues, errors }
 *  - draft          : object           — useDraft() return value
 *  - previewOpen    : boolean
 *  - setPreviewOpen : function
 */
const PostForm = ({
  pageTitle,
  submitLabel = "Publish",
  isLoading,
  onSubmit,
  formMethods,
  draft,
  previewOpen,
  setPreviewOpen,
  
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
    <div className="container-fluid">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="fw-semibold mb-0">{pageTitle}</h4>
        <div className="d-flex gap-2">
          
          <DraftsMenu
            drafts={draft.drafts}
            draftsMenuAnchor={draft.draftsMenuAnchor}
            setDraftsMenuAnchor={draft.setDraftsMenuAnchor}
            loadDraft={draft.loadDraft}
            deleteDraft={draft.deleteDraft}
          />
         
         

          <Button
            variant="outlined"
            startIcon={<IoSaveOutline />}
            onClick={() => draft.saveAsDraft(false)}
            sx={{
              borderColor: "#6c757d", color: "#6c757d",
              textTransform: "none", fontWeight: 500,
              "&:hover": { borderColor: "#5a6268", backgroundColor: "#f8f9fa" },
            }}
          >
            Save Draft
          </Button>
         
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{
              borderColor: "#17a2b8", color: "#17a2b8",
              textTransform: "none", fontWeight: 500,
              "&:hover": { borderColor: "#138496", backgroundColor: "#e0f7fa" },
            }}
          >
            Preview
          </Button>
        </div>
      </div>

      {/* ── Auto-save toggle ── */}
     
      <div className="mb-3 d-flex justify-content-end">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="autoSaveToggle"
            checked={draft.autoSaveEnabled}
            onChange={(e) => draft.setAutoSaveEnabled(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="autoSaveToggle">
            Auto-save every 60 seconds
          </label>
        </div>
      </div>
      

      {/* ── Form ── */}
      <form onSubmit={onSubmit}>
        <div className="row g-3">

          {/* Post Title */}
          <div className="col-md-6">
            <TextField
              label="Post Title" fullWidth
              {...register("post_title")}
              error={!!errors.post_title}
              helperText={errors.post_title?.message}
              InputLabelProps={{ shrink: !!watch("post_title") }}
            />
          </div>

          {/* Post Slug */}
          <div className="col-md-6">
            <TextField
              label="Post Slug (post_name)" fullWidth
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
              helperText={errors.post_name?.message}
              InputLabelProps={{ shrink: !!watch("post_name") }}
            />
          </div>

          {/* Category */}
          <div className="col-md-6">
            <Controller
              name="category_name" control={control}
              render={({ field }) => (
                <Autocomplete
                  freeSolo options={categoryList}
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
                      {...params} label="Category Name"
                      error={!!errors.category_name}
                      helperText={errors.category_name?.message}
                      InputLabelProps={{ shrink: !!field.value }}
                    />
                  )}
                />
              )}
            />
          </div>
          <input type="hidden" {...register("category_slug")} />

          {/* Feature Image */}
          <div className="col-12">
            <label className="form-label fw-medium">Feature Image</label>
            {featureImage ? (
              <div className="upload-dropzone" style={{ cursor: "default", padding: "16px" }}>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={
                      featureImage instanceof File
                        ? URL.createObjectURL(featureImage)
                        : (featureImage?.data ?? featureImage)
                    }
                    alt="Feature preview"
                    style={{
                      maxHeight: 220, maxWidth: "100%", borderRadius: 8,
                      objectFit: "cover", display: "block", margin: "0 auto 12px",
                    }}
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                  <p style={{ margin: "8px 0 12px", fontSize: 13, color: "#555" }}>
                    {featureImage instanceof File ? featureImage.name : "Draft Image"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <div {...getReplaceProps()} style={{ display: "inline-block" }}>
                      <input {...getReplaceInputProps()} />
                      <Button type="button" variant="outlined" size="small"
                        startIcon={<CachedIcon />}
                        sx={{ borderColor: "#074568", color: "#074568", textTransform: "none" }}>
                        Replace Image
                      </Button>
                    </div>
                    <Button type="button" variant="outlined" size="small" color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => setValue("feature_image", null, { shouldValidate: true })}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`upload-dropzone ${isDragActive ? "active" : ""} ${errors.feature_image ? "error" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="upload-inner">
                  <IoCloudUploadOutline className="upload-icon" size={50} />
                  <div className="upload-text">
                    <span>Drag and Drop here</span>
                    <span className="or-text">or</span>
                    <button type="button" className="browse-btn">Browse files</button>
                  </div>
                </div>
              </div>
            )}
            {errors.feature_image && (
              <div className="text-danger small mt-1">{errors.feature_image.message}</div>
            )}
          </div>

          {/* Post Content */}
          <div className="col-12">
            <label className="form-label fw-medium">Post Content</label>
            <Controller
              name="post_content" control={control}
              render={({ field }) => (
                <Box className={errors.post_content ? "border border-danger rounded" : ""}>
                  <Editor
                    apiKey="9upr0hixy7g4w8g9mazmhkqgyl0m4kjvz623rjwvekg4l86k"
                    value={field.value}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 450, menubar: true, language: "en",
                      plugins: ["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount","emoticons","codesample"],
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
                          reader.addEventListener("load", () => cb(reader.result, { title: file.name }));
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
                      table_appearance_options: true, table_advtab: true,
                      table_default_attributes: { border: "1" },
                      table_header_type: "section",
                      table_style_by_css: true, table_resize_bars: true,
                      table_cell_advtab: true, image_advtab: true, image_caption: true,
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
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.7; color: #333; padding: 12px; }
                        table { border-collapse: collapse; width: 100%; border: 1px solid #333; }
                        table td, table th { border: 1px solid #333; padding: 8px 12px; }
                        table th { background-color: #113563; color: #fff; font-weight: 600; }
                        pre { background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 4px; overflow-x: auto; }
                      `,
                    }}
                  />
                </Box>
              )}
            />
            {errors.post_content && (
              <div className="text-danger small mt-1">{errors.post_content.message}</div>
            )}
          </div>

          {/* Author */}
          <div className="col-md-6">
            <Controller
              name="author_id" control={control} defaultValue={null}
              render={({ field }) => (
                <Autocomplete
                  options={AUTHORS} getOptionLabel={(o) => o.name}
                  value={AUTHORS.find((a) => a.id === field.value) || null}
                  onChange={(_, v) => field.onChange(v?.id || null)}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} display="flex" alignItems="center" gap={1}>
                      <Avatar src={option.image} alt={option.name} sx={{ width: 28, height: 28 }} />
                      {option.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Author"
                      error={!!errors?.author_id} helperText={errors?.author_id?.message}
                      InputLabelProps={{ shrink: !!field.value }}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* SEO Title */}
          <div className="col-md-6">
            <TextField label="SEO Title" fullWidth
              {...register("seo_title")} error={!!errors.seo_title}
              helperText={errors.seo_title?.message || `${watch("seo_title")?.length || 0}/60`}
              inputProps={{ maxLength: 60 }}
              InputLabelProps={{ shrink: !!watch("seo_title") }}
            />
          </div>

          {/* SEO Focus Keyword */}
          <div className="col-md-6">
            <TextField label="SEO Focus Keyword" fullWidth
              {...register("seo_focus_keyword")} error={!!errors.seo_focus_keyword}
              helperText={errors.seo_focus_keyword?.message}
              InputLabelProps={{ shrink: !!watch("seo_focus_keyword") }}
            />
          </div>

          {/* SEO Tags */}
          <div className="col-md-6">
            <Controller
              name="seo_tags" control={control}
              render={({ field }) => (
                <Autocomplete multiple freeSolo options={[]}
                  value={field.value}
                  onChange={(_, v) => field.onChange(v)}
                  renderInput={(params) => (
                    <TextField {...params} label="SEO Tags"
                      placeholder="Add tag (press enter to add multiple)"
                      InputLabelProps={{ shrink: !!field.value?.length }}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* SEO Description */}
          <div className="col-md-6">
            <TextField label="SEO Description" fullWidth multiline rows={3}
              {...register("seo_desc")} error={!!errors.seo_desc}
              helperText={errors.seo_desc?.message || `${watch("seo_desc")?.length || 0}/160`}
              inputProps={{ maxLength: 160 }}
              InputLabelProps={{ shrink: !!watch("seo_desc") }}
            />
          </div>

          {/* Submit Buttons */}
          <div className="col-12">
            <div className="d-flex gap-3">
              <Button
                type="submit" variant="contained" size="large"
                startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <PublishIcon />}
                sx={{
                  backgroundColor: "#074568", textTransform: "none", fontWeight: 600,
                  "&:hover": { backgroundColor: "#05364f" },
                }}
              >
                {submitLabel}
              </Button>         
              <Button
                type="button" variant="outlined" size="large"
                startIcon={<IoSaveOutline />}
                onClick={() => draft.saveAsDraft(false)}
                sx={{ borderColor: "#6c757d", color: "#6c757d", textTransform: "none", fontWeight: 600 }}
              >
                Save as Draft
              </Button>            
            </div>
          </div>

        </div>
      </form>

      {/* Preview Modal */}
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