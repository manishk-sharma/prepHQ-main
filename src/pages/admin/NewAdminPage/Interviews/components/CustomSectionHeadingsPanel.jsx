import React from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const DEFAULT_FIELDS = [
  {
    key: "simple_explanation_label",
    label: "Simple Explanation Heading",
    placeholder: "Simple explanation",
    helperText: "Heading for section A",
  },
  {
    key: "technical_explanation_label",
    label: "Technical Explanation Heading",
    placeholder: "Technical explanation",
    helperText: "Heading for section B",
  },
  {
    key: "interview_ready_label",
    label: "Interview Answer Callout Heading",
    placeholder: "Interview-ready answer",
    helperText: "Heading for section C",
  },
  {
    key: "example_label",
    label: "Example Heading",
    placeholder: "Example",
    helperText: "Heading for section D",
  },
  {
    key: "follow_up_label",
    label: "Follow-up Questions Heading",
    placeholder: "Interviewer may ask",
    helperText: "Heading for section E",
  },
];

export default function CustomSectionHeadingsPanel({
  item,
  fields = DEFAULT_FIELDS,
  onUpdate,
  onReset,
  isExpanded,
  onToggle,
  title,
}) {
  const customCount = fields.filter((f) => Boolean(item[f.key])).length;
  const hasCustomHeadings = customCount > 0;
  const panelTitle =
    title ||
    (fields.length === 4
      ? "Custom Section Headings (A – D)"
      : "Custom Section Headings (A – E)");

  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: hasCustomHeadings ? "#f0fdf4" : "#f8fafc",
        borderColor: hasCustomHeadings ? "#86efac" : "#e2e8f0",
        borderRadius: 2,
        p: 1.5,
        transition: "all 0.2s ease",
      }}
    >
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TuneIcon
            sx={{
              fontSize: 18,
              color: hasCustomHeadings ? "#16a34a" : "#075174",
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: "0.82rem",
              color: "#075174",
            }}
          >
            {panelTitle}
          </Typography>
          {hasCustomHeadings ? (
            <Chip
              label={`${customCount} customized`}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                fontWeight: 700,
                backgroundColor: "#DEF7EC",
                color: "#03543F",
              }}
            />
          ) : (
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", fontSize: "0.75rem" }}
            >
              (Optional — click to customize headings)
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton size="small" sx={{ p: 0.25, color: "#64748b" }}>
            {isExpanded ? (
              <ExpandLessIcon sx={{ fontSize: 20 }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Box>
      </Box>

      {isExpanded && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed #cbd5e1" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
              Edit section headings for this item. Leave any field empty to use the default label.
            </Typography>
            <Button
              size="small"
              startIcon={<RestartAltIcon fontSize="small" />}
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              disabled={!hasCustomHeadings}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#64748b",
                "&:hover": { color: "#ef4444", backgroundColor: "#fee2e2" },
              }}
            >
              Reset to Defaults
            </Button>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: fields.length >= 5 ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
              },
              gap: 1.25,
            }}
          >
            {fields.map((f) => (
              <TextField
                key={f.key}
                size="small"
                label={f.label}
                placeholder={f.placeholder}
                value={item[f.key] || ""}
                onChange={(e) => onUpdate(f.key, e.target.value)}
                sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                helperText={f.helperText}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
