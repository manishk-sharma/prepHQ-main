import React, { useState, useEffect } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Editor from "@monaco-editor/react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import PreviewIcon from "@mui/icons-material/Preview";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IoSaveOutline } from "react-icons/io5";

import { formatSlug } from "../../../../../utils/helper";
import CodingQuestionDraftsMenu from "./CodingQuestionDraftsMenu";
import { CodingQuestionPreviewModal } from "./CodingQuestionPreviewModal";

/* ── Constants ──────────────────────────────────────────────────────────── */
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const TOPIC_OPTIONS = [
  "Array", "String", "Hash Table", "Dynamic Programming", "Math",
  "Sorting", "Greedy", "Tree", "Graph", "Binary Search", "Stack",
  "Queue", "Linked List", "Two Pointers", "Recursion", "Backtracking",
  "Bit Manipulation", "Sliding Window", "Divide and Conquer",
];

const LANG_TABS = [
  { key: "javascript", label: "JavaScript" },
  { key: "python",     label: "Python"     },
  { key: "java",       label: "Java"       },
  { key: "cpp",        label: "C++"        },
];

const MONACO_LANG_MAP = { javascript: "javascript", python: "python", java: "java", cpp: "cpp" };

/* ── Section Header ─────────────────────────────────────────────────────── */
function SectionHeader({ title }) {
  return (
    <div
      style={{
        borderBottom: "2px solid #57cc99",
        paddingBottom: "6px",
        marginBottom: "20px",
        marginTop: "28px",
      }}
    >
      <h6 style={{ fontWeight: 700, color: "#074568", margin: 0, fontSize: "15px" }}>
        {title}
      </h6>
    </div>
  );
}

/* ── Testcase Item (nested field array for params) ───────────────────────── */
function TestcaseItem({ control, register, index, onRemove, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `testcases.${index}.params`,
  });

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        background: "#fafafa",
        marginBottom: "12px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span style={{ fontWeight: 600, color: "#074568", fontSize: "14px" }}>
          Test Case {index + 1}
        </span>
        <Tooltip title="Remove testcase" arrow>
          <IconButton size="small" onClick={onRemove} sx={{ color: "#ef4444" }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {fields.map((param, pIndex) => (
        <div key={param.id} className="row g-2 mb-2 align-items-center">
          <div className="col-md-5">
            <TextField
              label="Parameter name"
              fullWidth
              size="small"
              placeholder="e.g. nums"
              {...register(`testcases.${index}.params.${pIndex}.key`)}
              error={!!errors?.testcases?.[index]?.params?.[pIndex]?.key}
              helperText={errors?.testcases?.[index]?.params?.[pIndex]?.key?.message}
            />
          </div>
          <div className="col-md-5">
            <TextField
              label="Value"
              fullWidth
              size="small"
              placeholder='e.g. [2,7,11,15]'
              {...register(`testcases.${index}.params.${pIndex}.value`)}
              error={!!errors?.testcases?.[index]?.params?.[pIndex]?.value}
              helperText={errors?.testcases?.[index]?.params?.[pIndex]?.value?.message}
            />
          </div>
          <div className="col-md-2">
            {pIndex > 0 && (
              <Tooltip title="Remove parameter" arrow>
                <IconButton size="small" onClick={() => remove(pIndex)} sx={{ color: "#ef4444" }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        size="small"
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => append({ key: "", value: "" })}
        sx={{
          mt: 1,
          borderColor: "#074568",
          color: "#074568",
          textTransform: "none",
          fontSize: "12px",
          "&:hover": { borderColor: "#05364f", backgroundColor: "#f0f4f8" },
        }}
      >
        Add Parameter
      </Button>

      {/* Expected Output */}
      <div className="mt-3">
        <TextField
          label="Expected Output"
          fullWidth
          size="small"
          placeholder="e.g. [0,1]"
          {...register(`testcases.${index}.expected_output`)}
          error={!!errors?.testcases?.[index]?.expected_output}
          helperText={errors?.testcases?.[index]?.expected_output?.message}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CodingQuestionForm — reusable form UI for Add/Edit coding questions.

   Props:
    - pageTitle   : string
    - submitLabel : string
    - isLoading   : boolean
    - onSubmit    : function  (handleSubmit-wrapped handler from page)
    - formMethods : { register, control, setValue, watch, getValues, errors }
════════════════════════════════════════════════════════════════════════════ */
const CodingQuestionForm = ({
  pageTitle,
  submitLabel = "Save Question",
  isLoading,
  onSubmit,
  formMethods,
  draft,
  previewOpen,
  setPreviewOpen,
}) => {
  const { register, control, setValue, watch, getValues, errors } = formMethods;

  const [activeCodeLang, setActiveCodeLang] = useState("javascript");

  /* ── Field arrays ─────────────────────────────────────────────────────── */
  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({ control, name: "examples" });

  const {
    fields: constraintFields,
    append: appendConstraint,
    remove: removeConstraint,
  } = useFieldArray({ control, name: "constraints" });

  const {
    fields: testcaseFields,
    append: appendTestcase,
    remove: removeTestcase,
  } = useFieldArray({ control, name: "testcases" });

  /* ── Auto-generate slug from title ───────────────────────────────────── */
  const titleValue = watch("title");
  useEffect(() => {
    if (titleValue) {
      setValue("slug", formatSlug(titleValue), { shouldValidate: false });
    }
  }, [titleValue, setValue]);

  return (
    <div className="container-fluid">

      {/* ── Page Header ── */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="fw-semibold mb-0">{pageTitle}</h4>

        <div className="d-flex gap-2 flex-wrap">
          {draft && (
            <CodingQuestionDraftsMenu
              drafts={draft.drafts}
              draftsMenuAnchor={draft.draftsMenuAnchor}
              setDraftsMenuAnchor={draft.setDraftsMenuAnchor}
              loadDraft={draft.loadDraft}
              deleteDraft={draft.deleteDraft}
            />
          )}

          {draft && (
            <Button
              variant="outlined"
              startIcon={<IoSaveOutline />}
              onClick={() => draft.saveAsDraft(false)}
              sx={{
                borderColor: "#6c757d",
                color: "#6c757d",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { borderColor: "#5a6268", backgroundColor: "#f8f9fa" },
              }}
            >
              Save Draft
            </Button>
          )}

          {setPreviewOpen && (
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewOpen(true)}
              sx={{
                borderColor: "#17a2b8",
                color: "#17a2b8",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { borderColor: "#138496", backgroundColor: "#e0f7fa" },
              }}
            >
              Preview
            </Button>
          )}

          <Button
            type="button"
            variant="contained"
            size="medium"
            startIcon={
              isLoading
                ? <CircularProgress size={16} color="inherit" />
                : <PublishIcon />
            }
            onClick={onSubmit}
            disabled={isLoading}
            sx={{
              backgroundColor: "#074568",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#05364f" },
            }}
          >
            {submitLabel}
          </Button>
        </div>
      </div>

      {/* ── Auto-save toggle ── */}
      {draft && (
        <div className="mb-3 d-flex justify-content-end">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="cqAutoSaveToggle"
              checked={draft.autoSaveEnabled}
              onChange={(e) => draft.setAutoSaveEnabled(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="cqAutoSaveToggle">
              Auto-save every 60 seconds
            </label>
          </div>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={onSubmit}>
        <div className="row g-3">

          {/* ════════════════════════════
              SECTION 1 — Basic Info
          ════════════════════════════ */}
          <div className="col-12">
            <SectionHeader title="Basic Information" />
          </div>

          {/* Title */}
          <div className="col-md-6">
            <TextField
              label="Question Title"
              fullWidth
              placeholder="e.g. Two Sum"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              InputLabelProps={{ shrink: !!watch("title") }}
            />
          </div>

          {/* Slug */}
          <div className="col-md-6">
            <TextField
              label="Slug"
              fullWidth
              placeholder="e.g. two-sum"
              inputProps={{
                onChange: (e) => {
                  const formatted = formatSlug(e.target.value);
                  e.target.value = formatted;
                  setValue("slug", formatted, { shouldValidate: true });
                },
              }}
              {...register("slug")}
              error={!!errors.slug}
              helperText={errors.slug?.message || "Auto-generated from title, editable"}
              InputLabelProps={{ shrink: !!watch("slug") }}
            />
          </div>

          {/* Difficulty */}
          <div className="col-md-4">
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={DIFFICULTIES}
                  value={field.value || null}
                  onChange={(_, v) => field.onChange(v || "")}
                  renderOption={(props, option) => {
                    const colors = {
                      Easy:   { color: "#2cbb5d", bg: "rgba(44,187,93,0.1)"  },
                      Medium: { color: "#ffb007", bg: "rgba(255,176,7,0.1)"  },
                      Hard:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
                    };
                    const s = colors[option];
                    return (
                      <Box
                        component="li"
                        {...props}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span
                          style={{
                            background: s.bg,
                            color: s.color,
                            fontWeight: 600,
                            fontSize: "12px",
                            padding: "2px 10px",
                            borderRadius: "12px",
                          }}
                        >
                          {option}
                        </span>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Difficulty"
                      error={!!errors.difficulty}
                      helperText={errors.difficulty?.message}
                      InputLabelProps={{ shrink: !!field.value }}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* Domain */}
          <div className="col-md-4">
            <TextField
              label="Domain"
              fullWidth
              placeholder="e.g. Array, String, Graph"
              {...register("domain")}
              error={!!errors.domain}
              helperText={errors.domain?.message}
              InputLabelProps={{ shrink: !!watch("domain") }}
            />
          </div>

          {/* Topics */}
          <div className="col-md-4">
            <Controller
              name="topics"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={TOPIC_OPTIONS}
                  value={field.value || []}
                  onChange={(_, v) => field.onChange(v)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Topics"
                      placeholder="Add topic, press Enter"
                      error={!!errors.topics}
                      helperText={errors.topics?.message}
                      InputLabelProps={{ shrink: !!field.value?.length }}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* ════════════════════════════
              SECTION 2 — Description
          ════════════════════════════ */}
          <div className="col-12">
            <SectionHeader title="Problem Description" />
          </div>

          <div className="col-12">
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={6}
              placeholder="Describe the problem clearly. Include context, input format, output format, and any constraints that help understand the problem..."
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              InputLabelProps={{ shrink: !!watch("description") }}
            />
          </div>

          {/* ════════════════════════════
              SECTION 3 — Examples
          ════════════════════════════ */}
          <div className="col-12">
            <SectionHeader title="Examples" />
          </div>

          <div className="col-12">
            {exampleFields.map((example, i) => (
              <div
                key={example.id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#fafafa",
                  marginBottom: "12px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontWeight: 600, color: "#074568", fontSize: "14px" }}>
                    Example {i + 1}
                  </span>
                  {exampleFields.length > 1 && (
                    <Tooltip title="Remove example" arrow>
                      <IconButton
                        size="small"
                        onClick={() => removeExample(i)}
                        sx={{ color: "#ef4444" }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>

                <div className="row g-2">
                  <div className="col-md-6">
                    <TextField
                      label="Input"
                      fullWidth
                      size="small"
                      placeholder='e.g. nums = [2,7,11,15], target = 9'
                      {...register(`examples.${i}.input`)}
                      error={!!errors?.examples?.[i]?.input}
                      helperText={errors?.examples?.[i]?.input?.message}
                    />
                  </div>
                  <div className="col-md-6">
                    <TextField
                      label="Output"
                      fullWidth
                      size="small"
                      placeholder="e.g. [0,1]"
                      {...register(`examples.${i}.output`)}
                      error={!!errors?.examples?.[i]?.output}
                      helperText={errors?.examples?.[i]?.output?.message}
                    />
                  </div>
                  <div className="col-12">
                    <TextField
                      label="Explanation (optional)"
                      fullWidth
                      size="small"
                      placeholder="e.g. Because nums[0] + nums[1] == 9, we return [0, 1]."
                      {...register(`examples.${i}.explanation`)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => appendExample({ input: "", output: "", explanation: "" })}
              sx={{
                borderColor: "#074568",
                color: "#074568",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { borderColor: "#05364f", backgroundColor: "#f0f4f8" },
              }}
            >
              Add Example
            </Button>

            {errors.examples && typeof errors.examples?.message === "string" && (
              <div className="text-danger small mt-2">{errors.examples.message}</div>
            )}
          </div>

          {/* ════════════════════════════
              SECTION 4 — Constraints
          ════════════════════════════ */}
          <div className="col-12">
            <SectionHeader title="Constraints" />
          </div>

          <div className="col-12">
            {constraintFields.map((constraint, i) => (
              <div key={constraint.id} className="d-flex gap-2 align-items-center mb-2">
                <TextField
                  label={`Constraint ${i + 1}`}
                  fullWidth
                  size="small"
                  placeholder="e.g. 1 ≤ nums.length ≤ 10⁴"
                  {...register(`constraints.${i}.value`)}
                  error={!!errors?.constraints?.[i]?.value}
                  helperText={errors?.constraints?.[i]?.value?.message}
                />
                {constraintFields.length > 1 && (
                  <Tooltip title="Remove constraint" arrow>
                    <IconButton
                      size="small"
                      onClick={() => removeConstraint(i)}
                      sx={{ color: "#ef4444", flexShrink: 0 }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => appendConstraint({ value: "" })}
              sx={{
                mt: 1,
                borderColor: "#074568",
                color: "#074568",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { borderColor: "#05364f", backgroundColor: "#f0f4f8" },
              }}
            >
              Add Constraint
            </Button>

            {errors.constraints && typeof errors.constraints?.message === "string" && (
              <div className="text-danger small mt-2">{errors.constraints.message}</div>
            )}
          </div>

          {/* ════════════════════════════
              SECTION 5 — Starter Code
          ════════════════════════════ */}
          <div className="col-12">
            <SectionHeader title="Starter Code" />
          </div>

          <div className="col-12">
            {/* Language Tab Bar */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #e0e0e0",
                marginBottom: "0",
              }}
            >
              {LANG_TABS.map((lang) => (
                <button
                  key={lang.key}
                  type="button"
                  onClick={() => setActiveCodeLang(lang.key)}
                  style={{
                    padding: "8px 18px",
                    border: "none",
                    borderBottom: activeCodeLang === lang.key ? "2px solid #074568" : "2px solid transparent",
                    background: "transparent",
                    color: activeCodeLang === lang.key ? "#074568" : "#6b7280",
                    fontWeight: activeCodeLang === lang.key ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Monaco Editor */}
            <div
              style={{
                border: "1px solid #c4c4c4",
                borderTop: "none",
                borderRadius: "0 0 4px 4px",
                overflow: "hidden",
              }}
            >
              <Controller
                key={activeCodeLang}
                name={`starterCode.${activeCodeLang}`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Editor
                    height="220px"
                    theme="light"
                    language={MONACO_LANG_MAP[activeCodeLang]}
                    value={field.value || ""}
                    onChange={(val) => field.onChange(val || "")}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: "on",
                      lineNumbers: "on",
                      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                      padding: { top: 10 },
                    }}
                  />
                )}
              />
            </div>

            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
              Provide starter code for each language. Switch tabs to edit.
            </p>
          </div>

          {/* ════════════════════════════
              SECTION 5.5 — Execution Config (Run)
          ════════════════════════════ */}
          <div className="col-12">
            <SectionHeader title="Execution Config (Run)" />
          </div>

          {/* Entry Point */}
          <div className="col-md-6">
            <TextField
              label="Entry Point (function name)"
              fullWidth
              placeholder="e.g. reverse"
              {...register("entry_point")}
              error={!!errors.entry_point}
              helperText={
                errors.entry_point?.message ||
                "The function the runner will call (e.g. reverse, twoSum)"
              }
              InputLabelProps={{ shrink: !!watch("entry_point") }}
            />
          </div>

          {/* Parameter Order */}
          <div className="col-md-6">
            <Controller
              name="param_order"
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
                      label="Parameter Order"
                      placeholder="Type a param name, press Enter"
                      error={!!errors.param_order}
                      helperText={
                        errors.param_order?.message ||
                        "Argument order — must match the test case parameter names"
                      }
                      InputLabelProps={{ shrink: !!field.value?.length }}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* ════════════════════════════
              SECTION 6 — Test Cases
          ════════════════════════════ */}
          <div className="col-12">
            <SectionHeader title="Test Cases" />
          </div>

          <div className="col-12">
            {testcaseFields.map((tc, i) => (
              <TestcaseItem
                key={tc.id}
                control={control}
                register={register}
                index={i}
                onRemove={() => removeTestcase(i)}
                errors={errors}
              />
            ))}

            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                appendTestcase({ params: [{ key: "", value: "" }] })
              }
              sx={{
                borderColor: "#074568",
                color: "#074568",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { borderColor: "#05364f", backgroundColor: "#f0f4f8" },
              }}
            >
              Add Test Case
            </Button>

            {errors.testcases && typeof errors.testcases?.message === "string" && (
              <div className="text-danger small mt-2">{errors.testcases.message}</div>
            )}
          </div>

          {/* ════════════════════════════
              Submit
          ════════════════════════════ */}
          <div className="col-12 mt-2 mb-4">
            <div className="d-flex gap-3">
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={
                  isLoading
                    ? <CircularProgress size={18} color="inherit" />
                    : <PublishIcon />
                }
                disabled={isLoading}
                sx={{
                  backgroundColor: "#074568",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#05364f" },
                }}
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
                  sx={{
                    borderColor: "#6c757d",
                    color: "#6c757d",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Save as Draft
                </Button>
              )}
            </div>
          </div>

        </div>
      </form>

      {/* ── Preview Modal ── */}
      {setPreviewOpen && (
        <CodingQuestionPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          previewData={getValues()}
        />
      )}
    </div>
  );
};

export default CodingQuestionForm;
