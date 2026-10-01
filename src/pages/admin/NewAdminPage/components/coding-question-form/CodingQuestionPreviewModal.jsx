import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Badge,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TbWindowMinimize } from "react-icons/tb";
import { VscChromeMaximize } from "react-icons/vsc";

const DIFF_COLOR = {
  Easy:   { color: "#2cbb5d", bg: "rgba(44,187,93,0.1)"  },
  Medium: { color: "#ffb007", bg: "rgba(255,176,7,0.1)"  },
  Hard:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
};

export const CodingQuestionPreviewModal = React.memo(({ open, onClose, previewData }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!previewData) return null;

  const diff = DIFF_COLOR[previewData.difficulty] || {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isFullScreen}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: isFullScreen ? 0 : 2,
          height: isFullScreen ? "100vh" : "90vh",
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          bgcolor: "#f8f9fa",
          py: 2,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <VisibilityIcon sx={{ color: "#074568" }} />
          <span>Question Preview</span>
          <Badge
            badgeContent="Draft Preview"
            color="warning"
            sx={{ ml: 5 }}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <IconButton
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullScreen ? <TbWindowMinimize /> : <VscChromeMaximize />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent sx={{ p: 0, overflowY: "auto" }}>
        <div style={{ display: "flex", height: "100%" }}>

          {/* ── Left: Problem Panel ── */}
          <div
            style={{
              flex: 1,
              padding: "24px 28px",
              borderRight: "1px solid #e5e7eb",
              overflowY: "auto",
            }}
          >
            {/* Title + difficulty */}
            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
              <h4 style={{ fontWeight: 700, color: "#111", margin: 0 }}>
                {previewData.title || "Untitled Question"}
              </h4>
              {previewData.difficulty && (
                <span
                  style={{
                    background: diff.bg,
                    color: diff.color,
                    fontWeight: 600,
                    fontSize: "12px",
                    padding: "3px 12px",
                    borderRadius: "12px",
                  }}
                >
                  {previewData.difficulty}
                </span>
              )}
            </div>

            {/* Domain + Topics */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {previewData.domain && (
                <Chip
                  label={previewData.domain}
                  size="small"
                  sx={{ background: "#e0f2fe", color: "#0369a1", fontWeight: 600 }}
                />
              )}
              {previewData.topics?.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "11px", color: "#374151", borderColor: "#d1d5db" }}
                />
              ))}
            </div>

            {/* Slug */}
            {previewData.slug && (
              <div style={{ marginBottom: "16px" }}>
                <code style={{ fontSize: "12px", color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: "4px" }}>
                  {previewData.slug}
                </code>
              </div>
            )}

            {/* Description */}
            {previewData.description && (
              <div style={{ marginBottom: "24px" }}>
                <p style={{ lineHeight: 1.75, color: "#374151", whiteSpace: "pre-wrap" }}>
                  {previewData.description}
                </p>
              </div>
            )}

            {/* Examples */}
            {previewData.examples?.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h6 style={{ fontWeight: 700, color: "#111", marginBottom: "12px" }}>
                  Examples
                </h6>
                {previewData.examples.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "14px 16px",
                      marginBottom: "12px",
                      fontFamily: "monospace",
                      fontSize: "13px",
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: "6px", color: "#374151", fontFamily: "inherit" }}>
                      Example {i + 1}:
                    </div>
                    {ex.input && (
                      <div><span style={{ color: "#6b7280" }}>Input:</span> {ex.input}</div>
                    )}
                    {ex.output && (
                      <div><span style={{ color: "#6b7280" }}>Output:</span> {ex.output}</div>
                    )}
                    {ex.explanation && (
                      <div style={{ marginTop: "6px", fontFamily: "inherit", fontSize: "12px", color: "#6b7280" }}>
                        <span style={{ fontWeight: 600 }}>Explanation:</span> {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {previewData.constraints?.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h6 style={{ fontWeight: 700, color: "#111", marginBottom: "10px" }}>
                  Constraints
                </h6>
                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                  {previewData.constraints.map((c, i) => (
                    <li
                      key={i}
                      style={{ fontFamily: "monospace", fontSize: "13px", color: "#374151", marginBottom: "4px" }}
                    >
                      {c.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Right: Meta Panel ── */}
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              padding: "24px 20px",
              overflowY: "auto",
              background: "#fafafa",
            }}
          >
            <div className="alert alert-info mb-4" style={{ fontSize: "13px" }}>
              <strong>Preview Mode</strong>
              <p className="mb-0 small mt-1">
                This is how the problem description will appear to students.
              </p>
            </div>

            {/* Missing fields warning */}
            {(!previewData.title || !previewData.difficulty || !previewData.description) && (
              <div className="alert alert-warning mb-4" style={{ fontSize: "13px" }}>
                <strong>Missing Fields:</strong>
                <ul className="mb-0 mt-1 ps-3">
                  {!previewData.title       && <li>Question Title</li>}
                  {!previewData.difficulty  && <li>Difficulty</li>}
                  {!previewData.description && <li>Description</li>}
                </ul>
              </div>
            )}

            {/* Stats */}
            <div style={{ fontSize: "13px", color: "#374151" }}>
              <div className="mb-2">
                <span style={{ fontWeight: 600 }}>Examples:</span> {previewData.examples?.filter(e => e.input).length || 0}
              </div>
              <div className="mb-2">
                <span style={{ fontWeight: 600 }}>Constraints:</span> {previewData.constraints?.filter(c => c.value).length || 0}
              </div>
              <div className="mb-2">
                <span style={{ fontWeight: 600 }}>Test Cases:</span> {previewData.testcases?.length || 0}
              </div>
              <div className="mb-2">
                <span style={{ fontWeight: 600 }}>Entry Point:</span>{" "}
                <code style={{ fontSize: "12px" }}>{previewData.entry_point || "—"}</code>
              </div>
              <div className="mb-2">
                <span style={{ fontWeight: 600 }}>Param Order:</span>{" "}
                <code style={{ fontSize: "12px" }}>{previewData.param_order?.join(", ") || "—"}</code>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
});
