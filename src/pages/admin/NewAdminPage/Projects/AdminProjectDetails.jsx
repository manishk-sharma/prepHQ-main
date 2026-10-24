import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  MenuItem,
  Menu,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
  Alert,
  Tooltip,
  Radio,
  Chip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {
  useProjectDetails,
  useProjectDetailsList,
  useUpdateProjectDetails,
  useCreateProjectDetails,
  useProjectList,
} from "../../../../services/projectsServices";
import { useNotification } from "../../../../context/useNotificationContext";
import { DOMAIN_OPTIONS, PROJECT_TYPE_OPTIONS } from "../commons/commons";
import { Editor } from "@tinymce/tinymce-react";
import {
  SortableContainer,
  SortableItem,
  DragHandle,
  AccessibleReorderButtons,
  arrayMove,
  rectSortingStrategy,
} from "./components/DndSortableWrapper";
import SidebarContentManager from "./components/SidebarContentManager";

const DEFAULT_SIDEBAR_CARDS = {
  related_projects: [
    {
      id: "rel-1",
      section_type: "related_project",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/projects-details/customer-segmentation-using-k-means",
      linked_resource: "customer-segmentation-using-k-means",
      display_order: 1,
      status: "active",
      is_active: true,
    },
    {
      id: "rel-2",
      section_type: "related_project",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/projects-details/credit-card-fraud-detection",
      linked_resource: "credit-card-fraud-detection",
      display_order: 2,
      status: "active",
      is_active: true,
    },
    {
      id: "rel-3",
      section_type: "related_project",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/projects-details/stock-price-prediction",
      linked_resource: "stock-price-prediction",
      display_order: 3,
      status: "active",
      is_active: true,
    },
  ],
  tutorials: [
    {
      id: "tut-1",
      section_type: "tutorial",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/tutorials",
      linked_resource: "",
      display_order: 1,
      status: "active",
      is_active: true,
    },
    {
      id: "tut-2",
      section_type: "tutorial",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/tutorials",
      linked_resource: "",
      display_order: 2,
      status: "active",
      is_active: true,
    },
    {
      id: "tut-3",
      section_type: "tutorial",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/tutorials",
      linked_resource: "",
      display_order: 3,
      status: "active",
      is_active: true,
    },
  ],
  mini_guides: [
    {
      id: "mng-1",
      section_type: "mini_guide",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/guides",
      linked_resource: "",
      display_order: 1,
      status: "active",
      is_active: true,
    },
    {
      id: "mng-2",
      section_type: "mini_guide",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/guides",
      linked_resource: "",
      display_order: 2,
      status: "active",
      is_active: true,
    },
    {
      id: "mng-3",
      section_type: "mini_guide",
      title: "Create Amazing Color Schemes Design",
      display_date: "05 Aug, 2025",
      destination_url: "/guides",
      linked_resource: "",
      display_order: 3,
      status: "active",
      is_active: true,
    },
  ],
};

const DEFAULT_SLUG = "customer-churn-prediction-using-machine-learning";

const DEFAULT_SECTION_ORDER = [
  "about-project",
  "prerequisites",
  "project-objectives",
  "project-architecture",
  "implementation-guide",
  "technologies",
  "dataset-resources",
  "project-learnings",
  "common-mistakes",
];

const SECTION_METAS = {
  "about-project": { defaultNum: "01", name: "About the Project", label: "01 · About Project", tabIndex: 1 },
  "prerequisites": { defaultNum: "02", name: "Prerequisites", label: "02 · Prerequisites", tabIndex: 2 },
  "project-objectives": { defaultNum: "03", name: "Project Objectives", label: "03 · Objectives", tabIndex: 3 },
  "project-architecture": { defaultNum: "04", name: "Project Architecture", label: "04 · Architecture", tabIndex: 4 },
  "implementation-guide": { defaultNum: "05", name: "Step-by-Step Implementation", label: "05 · Implementation", tabIndex: 5 },
  "technologies": { defaultNum: "06", name: "Tools & Technologies Used ", label: "06 · Technologies / Tools", tabIndex: 6 },
  "dataset-resources": { defaultNum: "07", name: "Where to Get Data / Datasets", label: "07 · Dataset Resources", tabIndex: 7 },
  "project-learnings": { defaultNum: "08", name: "Project Learnings", label: "08 · Project Learnings", tabIndex: 8 },
  "common-mistakes": { defaultNum: "09", name: "Common Mistakes to Avoid", label: "09 · Common Mistakes", tabIndex: 9 },
};

const DEFAULT_PREREQ_CATEGORIES_ORDER = [
  "programming",
  "data",
  "statistics",
  "machineLearning",
];

const PREREQ_CATEGORY_LABELS = {
  programming: "Programming Prerequisites",
  data: "Data Handling Prerequisites",
  statistics: "Statistics Prerequisites",
  machineLearning: "Machine Learning Prerequisites",
};

const DEFAULT_PREREQ_CATEGORY_TITLES = PREREQ_CATEGORY_LABELS;

const DEFAULT_LEARNINGS_ORDER = [
  "technical_learnings",
  "practical_learnings",
];

const DEFAULT_LEARNING_CATEGORY_TITLES = {
  technical_learnings: "Technical Learnings",
  practical_learnings: "Practical Learnings",
};

const LEARNING_CATEGORY_CONFIG = {
  technical_learnings: {
    id: "technical_learnings",
    title: "Technical Learnings",
    subtitle: "Drag items vertically to reorder.",
    camelKey: "technicalLearnings",
  },
  practical_learnings: {
    id: "practical_learnings",
    title: "Practical Learnings",
    subtitle: "Drag items vertically to reorder.",
    camelKey: "practicalLearnings",
  },
};

const DEFAULT_SECTION_HEADERS = {
  "about-project": {
    title: "01 · About the Project",
    subtitle: "Understand what you'll build and why it matters.",
  },
  "prerequisites": {
    title: "02 · What You Should Know Before Starting",
    subtitle: "A quick checklist so you can start with confidence.",
  },
  "project-objectives": {
    title: "03 · Project Objectives",
    subtitle: "Understand what you will accomplish.",
  },
  "project-architecture": {
    title: "04 · Project Architecture",
    subtitle: "How data flows from raw records to predictions.",
  },
  "implementation-guide": {
    title: "05 · Step-by-Step Implementation",
    subtitle: "Follow these ten steps to build the project from start to finish.",
  },
  "technologies": {
    title: "06 · Tools / Technologies Used",
    subtitle: "Everything you need is free and open source.",
  },
  "dataset-resources": {
    title: "07 · Where to Get Data",
    subtitle: "Trusted places to download the dataset.",
  },
  "project-learnings": {
    title: "08 · Learnings From the Project",
    subtitle: "Skills you will take away.",
  },
  "common-mistakes": {
    title: "09 · Common Mistakes to Avoid",
    subtitle: "Save hours by knowing these pitfalls early.",
  },
  architecture_section_heading: "View Architecture Details",
};

export const combineStepDescription = (step) => {
  if (!step) return "";
  if (typeof step.description === "string" && step.description.trim()) {
    return step.description.trim();
  }
  if (typeof step.implementationDescription === "string" && step.implementationDescription.trim()) {
    return step.implementationDescription.trim();
  }
  if (typeof step.implementation_description === "string" && step.implementation_description.trim()) {
    return step.implementation_description.trim();
  }

  const rawParts = [
    step.whatYouDo || step.whatYoullDo,
    step.matters || step.whyItMatters,
    step.output || step.expectedOutput,
  ];

  const cleanParts = rawParts
    .filter((p) => typeof p === "string" && p.trim().length > 0)
    .map((p) => p.trim());

  if (cleanParts.length === 0) return "";

  return cleanParts.reduce((acc, part) => {
    if (!acc) return part;
    const endsWithPunct = /[.!?]$/.test(acc);
    return endsWithPunct ? `${acc} ${part}` : `${acc}. ${part}`;
  }, "");
};

export const combineMistakeDescription = (m) => {
  if (!m) return "";
  if (typeof m.description === "string" && m.description.trim()) {
    return m.description.trim();
  }
  if (typeof m.mistakeDescription === "string" && m.mistakeDescription.trim()) {
    return m.mistakeDescription.trim();
  }
  if (typeof m.mistake_description === "string" && m.mistake_description.trim()) {
    return m.mistake_description.trim();
  }

  const rawParts = [
    m.mistake || m.theMistake || m.theError || m.error,
    m.why || m.whyItHappens || m.rootCause,
    m.avoid || m.howToAvoid || m.solution || m.recommendedSolution,
  ];

  const cleanParts = rawParts
    .filter((p) => typeof p === "string" && p.trim().length > 0)
    .map((p) => p.trim());

  if (cleanParts.length === 0) return "";

  const joined = cleanParts.reduce((acc, part) => {
    if (!acc) return part;
    const endsWithPunct = /[.!?]$/.test(acc);
    return endsWithPunct ? `${acc} ${part}` : `${acc}. ${part}`;
  }, "");

  return joined.startsWith("<") ? joined : `<p>${joined}</p>`;
};

function SectionHeaderEditCard({
  sectionId,
  label,
  formData,
  onHeaderChange,
  onSaveDirectly,
  dragHandleProps,
  reorderProps,
  positionLabel,
}) {
  const current =
    formData?.section_headers?.[sectionId] ||
    formData?.sectionHeaders?.[sectionId] ||
    DEFAULT_SECTION_HEADERS[sectionId] || { title: "", subtitle: "" };

  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(current.title || "");
  const [subtitleInput, setSubtitleInput] = useState(current.subtitle || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setTitleInput(current.title || "");
      setSubtitleInput(current.subtitle || "");
    }
  }, [current.title, current.subtitle, isEditing]);

  const handleStartEdit = () => {
    setTitleInput(current.title || "");
    setSubtitleInput(current.subtitle || "");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTitleInput(current.title || "");
    setSubtitleInput(current.subtitle || "");
    setError("");
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const trimmedTitle = titleInput.trim();
    const trimmedSubtitle = subtitleInput.trim();

    if (!trimmedTitle) {
      setError("Section heading cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      onHeaderChange(sectionId, "title", trimmedTitle);
      onHeaderChange(sectionId, "subtitle", trimmedSubtitle);

      if (onSaveDirectly) {
        await onSaveDirectly(sectionId, trimmedTitle, trimmedSubtitle);
      }

      setIsEditing(false);
    } catch (err) {
      setError(err?.message || "Failed to save section heading.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        border: "1px solid #c7ebda",
        backgroundColor: "#fafffd",
        borderRadius: 2.5,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {dragHandleProps && (
            <DragHandle {...dragHandleProps} title="Drag to reorder section" color="#166534" />
          )}
          {reorderProps && (
            <AccessibleReorderButtons {...reorderProps} color="#166534" />
          )}
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {label} — Public Heading & Subheading {positionLabel ? `(${positionLabel})` : ""}
          </Typography>
        </Box>

        {!isEditing && (
          <Button
            size="small"
            startIcon={<EditIcon sx={{ fontSize: "15px !important" }} />}
            onClick={handleStartEdit}
            sx={{
              color: "#166534",
              backgroundColor: "#e8fbf0",
              border: "1px solid #b7ecd0",
              fontWeight: 600,
              fontSize: "0.82rem",
              textTransform: "none",
              px: 1.5,
              py: 0.35,
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "#d1f6e1",
              },
            }}
          >
            Edit
          </Button>
        )}
      </Box>

      {isEditing ? (
        <Box component="form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            label="Section Heading"
            fullWidth
            size="small"
            value={titleInput}
            onChange={(e) => {
              setTitleInput(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. 01 · About the Project"
            helperText="Edit section number and title (styling is preserved on public page)"
            error={Boolean(error)}
            autoFocus
          />

          <TextField
            label="Section Subheading"
            fullWidth
            size="small"
            multiline
            rows={2}
            value={subtitleInput}
            onChange={(e) => setSubtitleInput(e.target.value)}
            placeholder="e.g. Understand what you'll build and why it matters."
            helperText="Edit description text displayed underneath the heading badge"
          />

          {error && (
            <Typography variant="body2" sx={{ color: "#dc2626", fontWeight: 500 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 1.5, mt: 0.5 }}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
              sx={{
                backgroundColor: "#37AB79",
                "&:hover": { backgroundColor: "#2d8a62" },
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
              }}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="small"
              disabled={isSaving}
              startIcon={<CloseIcon />}
              onClick={handleCancel}
              sx={{
                borderColor: "#94a3b8",
                color: "#475569",
                textTransform: "none",
                fontWeight: 500,
                px: 2,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 0.5, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          {dragHandleProps && (
            <Box sx={{ pt: 0.35 }}>
              <DragHandle {...dragHandleProps} title="Drag to reorder section" color="#166534" />
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "#e8fbf0",
                  color: "#0f172a",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #b7ecd0",
                  lineHeight: 1.4,
                }}
              >
                {current.title || DEFAULT_SECTION_HEADERS[sectionId].title}
              </Box>
              {reorderProps && (
                <AccessibleReorderButtons {...reorderProps} color="#166534" />
              )}
              {positionLabel && (
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                  ({positionLabel})
                </Typography>
              )}
            </Box>
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: "#475569",
                mt: 1,
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              {current.subtitle || DEFAULT_SECTION_HEADERS[sectionId].subtitle}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

/**
 * Section2DesignCard
 * Admin toggle allowing users to choose between Design 1 (Grid Card Layout)
 * and Design 2 (Single Column Layout) for Section 2 (Prerequisites).
 */
function Section2DesignCard({
  value = "grid",
  savedValue = "grid",
  onChange,
  onSave,
  onReset,
  isSaving = false,
}) {
  const isDirty = value !== savedValue;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        border: "1px solid #c7ebda",
        backgroundColor: "#fafffd",
        borderRadius: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#166534" }}>
              Section 2 Display Design
            </Typography>
            <Chip
              size="small"
              label={`Active on Website: ${savedValue === "single_column" ? "Design 2 (Single Column)" : "Design 1 (Grid Card)"}`}
              sx={{
                backgroundColor: "#e8fbf0",
                color: "#166534",
                fontWeight: 600,
                fontSize: "0.75rem",
                border: "1px solid #b7ecd0",
              }}
            />
            {isDirty && (
              <Chip
                size="small"
                label="Unsaved Selection"
                sx={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                  border: "1px solid #fde68a",
                }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: "#475569", display: "block" }}>
            Choose which layout is displayed on the frontend website for Section 02 (Prerequisites). Only ONE design is rendered to visitors at a time.
          </Typography>
        </Box>

        {/* Action Buttons: Save Design and Reset to Saved */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onReset}
            disabled={isSaving || !isDirty}
            startIcon={<RestartAltIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              textTransform: "none",
              color: "#475569",
              borderColor: "#cbd5e1",
              fontWeight: 600,
              fontSize: "0.82rem",
              px: 1.5,
              py: 0.45,
              borderRadius: "6px",
              "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f1f5f9" },
            }}
          >
            Reset to Saved
          </Button>

          <Button
            size="small"
            variant="contained"
            onClick={onSave}
            disabled={isSaving}
            startIcon={
              isSaving ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <SaveIcon sx={{ fontSize: "16px !important" }} />
              )
            }
            sx={{
              backgroundColor: "#37AB79",
              "&:hover": { backgroundColor: "#2d8a62" },
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              px: 2,
              py: 0.45,
              borderRadius: "6px",
              boxShadow: "none",
            }}
          >
            {isSaving ? "Saving..." : "Save Design"}
          </Button>
        </Box>
      </Box>

      {/* Two Selectable Design Options */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        {/* OPTION 1: Design 1 — Grid Card Layout */}
        <Paper
          onClick={() => onChange("grid")}
          elevation={0}
          sx={{
            p: 2,
            cursor: "pointer",
            borderRadius: 2,
            border: value === "grid" ? "2px solid #37AB79" : "1px solid #e2e8f0",
            backgroundColor: value === "grid" ? "#f0fdf4" : "#ffffff",
            transition: "all 0.2s ease",
            position: "relative",
            "&:hover": {
              borderColor: "#37AB79",
              boxShadow: "0 2px 8px rgba(55, 171, 121, 0.15)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Radio
                checked={value === "grid"}
                onChange={() => onChange("grid")}
                value="grid"
                name="section_2_design"
                size="small"
                sx={{
                  color: "#94a3b8",
                  "&.Mui-checked": { color: "#37AB79" },
                  p: 0.5,
                }}
              />
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
                Design 1 — Grid Card Layout
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Chip
                size="small"
                label="Default"
                sx={{ fontSize: "0.7rem", height: 20, backgroundColor: "#e2e8f0", color: "#475569" }}
              />
              {savedValue === "grid" && (
                <Chip
                  size="small"
                  label="Saved"
                  sx={{
                    fontSize: "0.7rem",
                    height: 20,
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    fontWeight: 700,
                  }}
                />
              )}
            </Box>
          </Box>

          <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.82rem", mb: 1.5, pl: 3.5 }}>
            Displays prerequisite categories in separate responsive cards in a multi-column grid layout.
          </Typography>

          {/* Mini Visual Preview matching Reference Image 1 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              fontSize: "0.75rem",
            }}
          >
            {/* Header Badge */}
            <Box
              sx={{
                display: "inline-block",
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                backgroundColor: "#e8fbf0",
                color: "#166534",
                fontWeight: 700,
                fontSize: "0.7rem",
                mb: 0.5,
              }}
            >
              02 · What You Should Know Before Starting
            </Box>
            <Typography sx={{ fontSize: "0.68rem", color: "#64748b", mb: 1 }}>
              A quick checklist so you can start with confidence.
            </Typography>

            {/* 4 Cards Grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0.75 }}>
              <Box sx={{ p: 0.8, backgroundColor: "#ffffff", borderRadius: 1, border: "1px solid #e2e8f0" }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#1e293b", mb: 0.25 }}>
                  Programming
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569" }}>• Basic Python</Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569" }}>• Functions</Typography>
              </Box>
              <Box sx={{ p: 0.8, backgroundColor: "#ffffff", borderRadius: 1, border: "1px solid #e2e8f0" }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#1e293b", mb: 0.25 }}>
                  Data
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569" }}>• Pandas</Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569" }}>• NumPy</Typography>
              </Box>
              <Box sx={{ p: 0.8, backgroundColor: "#ffffff", borderRadius: 1, border: "1px solid #e2e8f0" }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#1e293b", mb: 0.25 }}>
                  Statistics
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569" }}>• Mean / Median</Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569" }}>• Correlation</Typography>
              </Box>
              <Box
                sx={{
                  p: 0.8,
                  backgroundColor: "#ffffff",
                  borderRadius: 1,
                  border: "1px solid #e2e8f0",
                  gridColumn: 1,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#1e293b", mb: 0.25 }}>
                  Machine Learning
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569" }}>• Classification</Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569" }}>• Train/test split</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* OPTION 2: Design 2 — Single Column Layout */}
        <Paper
          onClick={() => onChange("single_column")}
          elevation={0}
          sx={{
            p: 2,
            cursor: "pointer",
            borderRadius: 2,
            border: value === "single_column" ? "2px solid #37AB79" : "1px solid #e2e8f0",
            backgroundColor: value === "single_column" ? "#f0fdf4" : "#ffffff",
            transition: "all 0.2s ease",
            position: "relative",
            "&:hover": {
              borderColor: "#37AB79",
              boxShadow: "0 2px 8px rgba(55, 171, 121, 0.15)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Radio
                checked={value === "single_column"}
                onChange={() => onChange("single_column")}
                value="single_column"
                name="section_2_design"
                size="small"
                sx={{
                  color: "#94a3b8",
                  "&.Mui-checked": { color: "#37AB79" },
                  p: 0.5,
                }}
              />
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
                Design 2 — Single Column Layout
              </Typography>
            </Box>
            {savedValue === "single_column" && (
              <Chip
                size="small"
                label="Saved"
                sx={{
                  fontSize: "0.7rem",
                  height: 20,
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  fontWeight: 700,
                }}
              />
            )}
          </Box>

          <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.82rem", mb: 1.5, pl: 3.5 }}>
            Displays all prerequisite categories stacked vertically inside one large, unified light-colored container.
          </Typography>

          {/* Mini Visual Preview matching Reference Image 2 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              fontSize: "0.75rem",
            }}
          >
            {/* Header Badge */}
            <Box
              sx={{
                display: "inline-block",
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                backgroundColor: "#e8fbf0",
                color: "#166534",
                fontWeight: 700,
                fontSize: "0.7rem",
                mb: 0.5,
              }}
            >
              02 · What You Should Know Before Starting
            </Box>
            <Typography sx={{ fontSize: "0.68rem", color: "#64748b", mb: 1 }}>
              A quick checklist so you can start with confidence.
            </Typography>

            {/* Single Large Container Enclosing Categories */}
            <Box
              sx={{
                p: 1.2,
                backgroundColor: "#ffffff",
                borderRadius: 1.5,
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#1e293b" }}>
                  Programming
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569", pl: 0.5 }}>
                  • Basic Python, • Functions, • Lists and dictionaries
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#1e293b" }}>
                  Data
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569", pl: 0.5 }}>
                  • Pandas, • NumPy, • Basic data cleaning
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#1e293b" }}>
                  Statistics
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569", pl: 0.5 }}>
                  • Mean, • Median, • Correlation, • Basic distributions
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#1e293b" }}>
                  Machine Learning
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#475569", pl: 0.5 }}>
                  • Classification, • Train/test split, • Basic model evaluation
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
}

/**
 * EditableCardHeading
 * Displays a category card heading with an inline edit trigger, input validation,
 * Enter/Esc keyboard controls, and Save/Cancel buttons.
 */
function EditableCardHeading({
  title,
  subtitle,
  onSave,
  tooltip = "Click to edit title",
  color = "#074568",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setTempTitle(title || "");
    }
  }, [title, isEditing]);

  const handleStart = () => {
    setTempTitle(title || "");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempTitle(title || "");
    setError("");
    setIsEditing(false);
  };

  const handleCommit = (e) => {
    if (e) e.preventDefault();
    const trimmed = tempTitle.trim();
    if (!trimmed) {
      setError("Heading cannot be empty");
      return;
    }
    setError("");
    setIsEditing(false);
    if (trimmed !== title && onSave) {
      onSave(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommit(e);
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <TextField
            size="small"
            value={tempTitle}
            onChange={(e) => {
              setTempTitle(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            error={Boolean(error)}
            helperText={error}
            placeholder="Card heading..."
            sx={{
              minWidth: 220,
              maxWidth: 320,
              backgroundColor: "#fff",
              "& .MuiInputBase-input": {
                fontWeight: 600,
                color,
                fontSize: "0.95rem",
                py: 0.5,
                px: 1,
              },
            }}
          />
          <Tooltip title="Save heading">
            <IconButton
              size="small"
              onClick={handleCommit}
              sx={{
                color: "#166534",
                backgroundColor: "#e8fbf0",
                border: "1px solid #b7ecd0",
                "&:hover": { backgroundColor: "#d1f6e1" },
                p: 0.5,
              }}
              aria-label="Save heading"
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              size="small"
              onClick={handleCancel}
              sx={{
                color: "#64748b",
                backgroundColor: "#f1f5f9",
                border: "1px solid #e2e8f0",
                "&:hover": { backgroundColor: "#e2e8f0" },
                p: 0.5,
              }}
              aria-label="Cancel editing heading"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        {subtitle && (
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
        <Typography
          onClick={handleStart}
          title={tooltip}
          sx={{
            fontWeight: 600,
            color,
            fontSize: "0.95rem",
            cursor: "pointer",
            borderRadius: 0.5,
            px: 0.25,
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: "#f1f5f9",
              color: "#37AB79",
            },
          }}
        >
          {title}
        </Typography>
        <Tooltip title={tooltip}>
          <IconButton
            size="small"
            onClick={handleStart}
            sx={{
              color: "#94a3b8",
              p: 0.25,
              "&:hover": {
                color: "#37AB79",
                backgroundColor: "#f1f5f9",
              },
            }}
            aria-label={`Edit ${title}`}
          >
            <EditIcon sx={{ fontSize: "14px" }} />
          </IconButton>
        </Tooltip>
      </Box>
      {subtitle && (
        <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default function AdminProjectDetails() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [selectedSlug, setSelectedSlug] = useState(idOrSlug || DEFAULT_SLUG);
  const [tabIndex, setTabIndex] = useState(0);
  const [viewMode, setViewMode] = useState("tabs"); // "tabs" | "all"

  const { data: projectDetailsList = [] } = useProjectDetailsList();
  const { data: wpProjects = [] } = useProjectList();
  const { data: currentData, isLoading, isError, refetch } = useProjectDetails(selectedSlug);

  const { mutateAsync: updateDetails, isPending: isUpdating } = useUpdateProjectDetails();
  const { mutateAsync: createDetails, isPending: isCreating } = useCreateProjectDetails();

  const isSaving = isUpdating || isCreating;

  // Local editable state for form
  const [formData, setFormData] = useState(null);
  const [prereqItemKeys, setPrereqItemKeys] = useState({});
  const [addPrereqMenuAnchor, setAddPrereqMenuAnchor] = useState(null);
  const [openStepLabelEdit, setOpenStepLabelEdit] = useState(null);
  const [openMistakeLabelEdit, setOpenMistakeLabelEdit] = useState(null);

  const domainOptionsList = React.useMemo(() => {
    const current = formData?.domain?.trim();
    if (current && !DOMAIN_OPTIONS.includes(current)) {
      return [current, ...DOMAIN_OPTIONS];
    }
    return DOMAIN_OPTIONS;
  }, [formData?.domain]);

  const projectTypeOptionsList = React.useMemo(() => {
    const current = formData?.project_type?.trim();
    if (current && !PROJECT_TYPE_OPTIONS.includes(current)) {
      return [current, ...PROJECT_TYPE_OPTIONS];
    }
    return PROJECT_TYPE_OPTIONS;
  }, [formData?.project_type]);

  useEffect(() => {
    if (idOrSlug && idOrSlug !== selectedSlug) {
      setSelectedSlug(idOrSlug);
    }
  }, [idOrSlug]);

  useEffect(() => {
    if (currentData) {
      const cloned = JSON.parse(JSON.stringify(currentData));

      // ── Normalize Section Headers & Section Order ──
      const rawHeaders = cloned.section_headers || cloned.sectionHeaders || {};
      const rawOrder = rawHeaders.sections_order || cloned.sections_order;
      const activeOrder = Array.isArray(rawOrder) && rawOrder.length > 0
        ? [...new Set([...rawOrder, ...DEFAULT_SECTION_ORDER])]
        : DEFAULT_SECTION_ORDER;

      const rawArchHeading =
        cloned.architecture_section_heading ||
        cloned.section_headers?.architecture_section_heading ||
        cloned.sectionHeaders?.architecture_section_heading ||
        "View Architecture Details";

      cloned.architecture_section_heading = rawArchHeading;
      cloned.section_headers = {
        ...DEFAULT_SECTION_HEADERS,
        ...(typeof rawHeaders === "object" ? rawHeaders : {}),
        architecture_section_heading: rawArchHeading,
        sections_order: activeOrder,
      };
      cloned.sectionHeaders = cloned.section_headers;
      cloned.sections_order = activeOrder;

      // ── Normalize Section 01: Combine Paragraphs into single Project Description ──
      const legacyP1 = (cloned.about_text_1 || "").trim();
      const legacyP2 = (cloned.about_text_2 || "").trim();
      const legacyP3 = (cloned.about_text_3 || "").trim();

      let initialDescription = (cloned.description || cloned.about_text || "").trim();
      if (!initialDescription) {
        if (legacyP1 && legacyP2 && !legacyP1.includes(legacyP2)) {
          initialDescription = [legacyP1, legacyP2, legacyP3].filter(Boolean).join("\n\n");
        } else if (legacyP1) {
          initialDescription = legacyP1;
        } else {
          initialDescription = [legacyP2, legacyP3].filter(Boolean).join("\n\n");
        }
      }

      cloned.about_text_1 = initialDescription;
      cloned.description = initialDescription;
      cloned.about_text = initialDescription;
      cloned.about_text_2 = "";
      cloned.about_text_3 = "";

      // ── Normalize Section 02: Prerequisites category_order, category_titles & section_2_design ──
      cloned.section_2_design = cloned.section_2_design || cloned.section_headers?.section_2_design || "grid";
      const rawPrereqCats = cloned.prerequisites?.category_order || cloned.prerequisites_order;
      const activePrereqCats = Array.isArray(rawPrereqCats) && rawPrereqCats.length > 0
        ? [...new Set([...rawPrereqCats, ...DEFAULT_PREREQ_CATEGORIES_ORDER])]
        : DEFAULT_PREREQ_CATEGORIES_ORDER;

      if (!cloned.prerequisites || typeof cloned.prerequisites !== "object" || Array.isArray(cloned.prerequisites)) {
        cloned.prerequisites = {
          programming: [],
          data: [],
          statistics: [],
          machineLearning: [],
        };
      }
      cloned.prerequisites.category_order = activePrereqCats;
      cloned.prerequisites_order = activePrereqCats;

      const rawPrereqTitles = cloned.prerequisites?.category_titles || cloned.prereq_category_titles || {};
      cloned.prerequisites.category_titles = {
        ...PREREQ_CATEGORY_LABELS,
        ...(typeof rawPrereqTitles === "object" ? rawPrereqTitles : {}),
      };
      cloned.prereq_category_titles = cloned.prerequisites.category_titles;

      // Stable keys for prerequisite items across categories
      const initialKeys = {};
      activePrereqCats.forEach((cat) => {
        const catItems = Array.isArray(cloned.prerequisites?.[cat]) ? cloned.prerequisites[cat] : [];
        initialKeys[cat] = catItems.map(
          (_, i) => `prereq-${cat}-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`
        );
      });
      setPrereqItemKeys(initialKeys);

      // ── Normalize Section 03: objectives ──
      if (Array.isArray(cloned.objectives)) {
        cloned.objectives = cloned.objectives.map((obj, idx) => ({
          ...obj,
          id: obj.id || `obj-id-${idx + 1}`,
          num: obj.num || String(idx + 1).padStart(2, "0"),
        }));
      } else {
        cloned.objectives = [];
      }

      // ── Normalize Section 04: architecture_steps ──
      if (Array.isArray(cloned.architecture_steps)) {
        cloned.architecture_steps = cloned.architecture_steps.map((step, idx) => ({
          ...step,
          id: step.id || `arch-id-${idx + 1}`,
          num: step.num || String(idx + 1).padStart(2, "0"),
          title: step.title || "",
        }));
      } else {
        cloned.architecture_steps = [];
      }

      // ── Normalize Section 04: architecture_details ──
      if (Array.isArray(cloned.architecture_details)) {
        cloned.architecture_details = cloned.architecture_details.map((detail, idx) => ({
          ...detail,
          id: detail.id || `arch-detail-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
          step: detail.step || "",
          desc: detail.desc || detail.description || "",
          description: detail.desc || detail.description || "",
        }));
      } else {
        cloned.architecture_details = [];
      }

      // ── Normalize Section 05: implementation_steps ──
      if (Array.isArray(cloned.implementation_steps)) {
        cloned.implementation_steps = cloned.implementation_steps.map((step, idx) => {
          const desc = combineStepDescription(step);
          return {
            ...step,
            id: step.id || `step-id-${idx + 1}`,
            num: step.num || String(idx + 1).padStart(2, "0"),
            title: step.title || "",
            subtitle: step.subtitle || "",
            description: desc,
            whatYouDo: desc,
            tools: Array.isArray(step.tools) ? step.tools : (step.toolsUsed || []),
            command: step.command || step.codeSnippet || "",
            titleLabel: step.titleLabel || "",
            subtitleLabel: step.subtitleLabel || "",
            descriptionLabel: step.descriptionLabel || step.implementationDescriptionLabel || "",
            toolsLabel: step.toolsLabel || step.toolsUsedLabel || "",
            commandLabel: step.commandLabel || step.codeSnippetLabel || "",
          };
        });
      } else {
        cloned.implementation_steps = [];
      }

      // ── Normalize Section 06: technologies ──
      if (Array.isArray(cloned.technologies)) {
        cloned.technologies = cloned.technologies.map((t, idx) => ({
          id: t.id || `tech-${idx + 1}`,
          toolName: t.toolName || t.name || "",
          categoryUsage: t.categoryUsage || t.desc || "",
          name: t.name || t.toolName || "",
          desc: t.desc || t.categoryUsage || "",
        }));
      } else {
        cloned.technologies = [];
      }

      // ── Normalize Section 07: datasetResources / dataset_resources ──
      const rawDatasets = cloned.datasetResources || cloned.dataset_resources || [];
      const seenDatasets = new Set();
      const uniqueDatasets = [];
      for (const ds of rawDatasets) {
        const titleKey = (ds.providerTitle || ds.title || "").trim().toLowerCase();
        const urlKey = (ds.externalUrl || ds.url || "").trim().toLowerCase();
        const dedupeKey = `${titleKey}:::${urlKey}`;
        if (!seenDatasets.has(dedupeKey)) {
          seenDatasets.add(dedupeKey);
          uniqueDatasets.push(ds);
        }
      }
      const finalRawDatasets = uniqueDatasets.length > 0 ? uniqueDatasets : rawDatasets;
      const normalizedDatasets = finalRawDatasets.map((ds, idx) => ({
        id: ds.id || `ds-${idx + 1}`,
        providerTitle: ds.providerTitle || ds.title || "",
        externalUrl: ds.externalUrl || ds.url || "",
        description: ds.description || ds.desc || "",
        title: ds.title || ds.providerTitle || "",
        url: ds.url || ds.externalUrl || "",
        desc: ds.desc || ds.description || "",
      }));
      cloned.datasetResources = normalizedDatasets;
      cloned.dataset_resources = normalizedDatasets;

      // ── Normalize Section 08: technical_learnings, practical_learnings, learnings_order & learning_category_titles ──
      cloned.technical_learnings = Array.isArray(cloned.technical_learnings)
        ? cloned.technical_learnings
        : (Array.isArray(cloned.technicalLearnings) ? cloned.technicalLearnings : []);
      cloned.technicalLearnings = cloned.technical_learnings;

      cloned.practical_learnings = Array.isArray(cloned.practical_learnings)
        ? cloned.practical_learnings
        : (Array.isArray(cloned.practicalLearnings) ? cloned.practicalLearnings : []);
      cloned.practicalLearnings = cloned.practical_learnings;

      const rawLearnings = cloned.learnings_order || cloned.section_headers?.learnings_order;
      const activeLearnings = Array.isArray(rawLearnings) && rawLearnings.length > 0
        ? [...new Set([...rawLearnings, ...DEFAULT_LEARNINGS_ORDER])]
        : DEFAULT_LEARNINGS_ORDER;
      cloned.learnings_order = activeLearnings;

      const rawLearningTitles = cloned.section_headers?.learning_category_titles ||
        cloned.learning_category_titles ||
        {};
      const activeLearningTitles = {
        ...DEFAULT_LEARNING_CATEGORY_TITLES,
        ...(typeof rawLearningTitles === "object" ? rawLearningTitles : {}),
      };
      cloned.learning_category_titles = activeLearningTitles;

      if (cloned.section_headers && typeof cloned.section_headers === "object") {
        cloned.section_headers.learnings_order = activeLearnings;
        cloned.section_headers.learning_category_titles = activeLearningTitles;
      }

      // ── Normalize Section 09: common_mistakes ──
      const rawMistakes = Array.isArray(cloned.common_mistakes)
        ? cloned.common_mistakes
        : (Array.isArray(cloned.commonMistakes) ? cloned.commonMistakes : []);
      const seenMistakes = new Set();
      const uniqueMistakes = [];
      for (const m of rawMistakes) {
        const titleKey = (m.title || "").trim().toLowerCase();
        const mistakeKey = (m.mistake || "").trim().toLowerCase();
        const dedupeKey = `${titleKey}:::${mistakeKey}`;
        if (!seenMistakes.has(dedupeKey)) {
          seenMistakes.add(dedupeKey);
          uniqueMistakes.push(m);
        }
      }
      const finalRawMistakes = uniqueMistakes.length > 0 ? uniqueMistakes : rawMistakes;
      const normalizedMistakes = finalRawMistakes.map((m, idx) => {
        const desc = combineMistakeDescription(m);
        return {
          ...m,
          id: m.id || `mistake-id-${idx + 1}`,
          num: m.num || String(idx + 1).padStart(2, "0"),
          title: m.title || "",
          description: desc,
          mistake: desc,
          titleLabel: m.titleLabel || m.mistakeTitleLabel || "",
          descriptionLabel: m.descriptionLabel || m.mistakeDescriptionLabel || "",
        };
      });
      cloned.common_mistakes = normalizedMistakes;
      cloned.commonMistakes = normalizedMistakes;

      // ── Normalize Sidebar Cards ──
      const rawSidebar = cloned.sidebar_cards || cloned.sidebarCards || {};
      const normCardList = (arr, secType, defaultList) => {
        if (Array.isArray(arr)) {
          return arr.map((c, idx) => ({
            id: c.id || `${secType}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
            section_type: secType,
            title: c.title || "",
            display_date: c.display_date || c.date || "05 Aug, 2025",
            destination_url: c.destination_url || c.link || "",
            linked_resource: c.linked_resource || "",
            display_order: Number(c.display_order ?? idx + 1),
            status: c.status || (c.is_active === false ? "inactive" : "active"),
            is_active: c.is_active !== false && c.status !== "inactive",
          }));
        }
        return defaultList.map((c, idx) => ({
          ...c,
          id: c.id || `${secType}-${idx + 1}`,
        }));
      };

      cloned.sidebar_cards = {
        related_projects: normCardList(
          rawSidebar.related_projects,
          "related_project",
          DEFAULT_SIDEBAR_CARDS.related_projects
        ),
        tutorials: normCardList(
          rawSidebar.tutorials,
          "tutorial",
          DEFAULT_SIDEBAR_CARDS.tutorials
        ),
        mini_guides: normCardList(
          rawSidebar.mini_guides,
          "mini_guide",
          DEFAULT_SIDEBAR_CARDS.mini_guides
        ),
      };
      cloned.sidebarCards = cloned.sidebar_cards;

      setFormData(cloned);
    }
  }, [currentData]);

  const handleSlugChange = (newSlug) => {
    setSelectedSlug(newSlug);
    navigate(`/admin/projects/details/${newSlug}`);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      about_text_1: value,
      description: value,
      about_text: value,
      about_text_2: "",
      about_text_3: "",
    }));
  };

  const handleSectionHeaderChange = (sectionId, field, value) => {
    setFormData((prev) => {
      const currentHeaders = prev?.section_headers || prev?.sectionHeaders || DEFAULT_SECTION_HEADERS;
      const currentSec = currentHeaders[sectionId] || DEFAULT_SECTION_HEADERS[sectionId] || { title: "", subtitle: "" };
      const updatedSec = {
        ...currentSec,
        [field]: value,
      };
      const updated = {
        ...currentHeaders,
        [sectionId]: updatedSec,
      };
      return {
        ...prev,
        section_headers: updated,
        sectionHeaders: updated,
      };
    });
  };

  const handleSaveDirectHeader = async (sectionId, newTitle, newSubtitle) => {
    const currentHeaders = formData?.section_headers || formData?.sectionHeaders || DEFAULT_SECTION_HEADERS;
    const updated = {
      ...currentHeaders,
      [sectionId]: {
        title: newTitle,
        subtitle: newSubtitle,
      },
    };

    setFormData((prev) => ({
      ...prev,
      section_headers: updated,
      sectionHeaders: updated,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          section_headers: updated,
          sectionHeaders: updated,
        },
      });
      showNotification(`${newTitle || "Section"} saved successfully!`, "success");
      return true;
    } catch (err) {
      showNotification(err?.message || "Failed to save section heading", "danger");
      throw err;
    }
  };

  // ── Section 2 Display Design helpers ──
  const [isSavingDesign, setIsSavingDesign] = useState(false);

  const handleSection2DesignChange = (newDesign) => {
    setFormData((prev) => ({
      ...prev,
      section_2_design: newDesign,
    }));
  };

  const handleSaveSection2Design = async () => {
    const designToSave = formData?.section_2_design || "grid";
    try {
      setIsSavingDesign(true);
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          section_2_design: designToSave,
        },
      });
      showNotification(
        `Section 2 design saved: ${designToSave === "single_column" ? "Design 2 — Single Column Layout" : "Design 1 — Grid Card Layout"}`,
        "success"
      );
    } catch (err) {
      showNotification(err?.message || "Failed to save Section 2 design setting", "danger");
    } finally {
      setIsSavingDesign(false);
    }
  };

  const handleResetSection2Design = () => {
    const savedDesign = currentData?.section_2_design || currentData?.section_headers?.section_2_design || "grid";
    setFormData((prev) => ({
      ...prev,
      section_2_design: savedDesign,
    }));
    showNotification("Reset Section 2 design to saved value.", "info");
  };

  // ── Prerequisite helpers ──
  const handlePrereqChange = (category, index, value) => {
    setFormData((prev) => {
      const updated = { ...(prev.prerequisites || {}) };
      const list = [...(updated[category] || [])];
      list[index] = value;
      updated[category] = list;
      return { ...prev, prerequisites: updated };
    });
  };

  const addPrereqItem = (category) => {
    const newId = `prereq-${category}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setPrereqItemKeys((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newId],
    }));
    setFormData((prev) => {
      const updated = { ...(prev.prerequisites || {}) };
      const list = [...(updated[category] || []), ""];
      updated[category] = list;
      return { ...prev, prerequisites: updated };
    });
  };

  const removePrereqItem = (category, index) => {
    setPrereqItemKeys((prev) => {
      const list = [...(prev[category] || [])];
      list.splice(index, 1);
      return { ...prev, [category]: list };
    });
    setFormData((prev) => {
      const updated = { ...(prev.prerequisites || {}) };
      const list = [...(updated[category] || [])];
      list.splice(index, 1);
      updated[category] = list;
      return { ...prev, prerequisites: updated };
    });
  };

  const handleReorderPrereq = async (category, reorderedList) => {
    const updated = {
      ...(formData?.prerequisites || {}),
      [category]: reorderedList,
    };
    setFormData((prev) => ({ ...prev, prerequisites: updated }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          prerequisites: updated,
        },
      });
      showNotification("Prerequisites reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered prerequisites", "danger");
    }
  };

  const handleMovePrereq = (category, index, direction) => {
    const list = [...(formData?.prerequisites?.[category] || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const reordered = arrayMove(list, index, targetIndex);

    setPrereqItemKeys((prev) => {
      const keys = [...(prev[category] || [])];
      if (targetIndex < 0 || targetIndex >= keys.length) return prev;
      return { ...prev, [category]: arrayMove(keys, index, targetIndex) };
    });

    handleReorderPrereq(category, reordered);
  };

  // ── Reorder Prerequisite Categories ──
  const handleReorderPrereqCategories = async (newOrder) => {
    const updatedPrereq = {
      ...(formData?.prerequisites || {}),
      category_order: newOrder,
    };
    setFormData((prev) => ({
      ...prev,
      prerequisites: updatedPrereq,
      prerequisites_order: newOrder,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          prerequisites: updatedPrereq,
        },
      });
      showNotification("Prerequisite categories reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered prerequisite categories", "danger");
    }
  };

  const handleMovePrereqCategory = (index, direction) => {
    const currentList = [
      ...(formData?.prerequisites?.category_order ||
        formData?.prerequisites_order ||
        DEFAULT_PREREQ_CATEGORIES_ORDER),
    ];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;
    const reordered = arrayMove(currentList, index, targetIndex);
    handleReorderPrereqCategories(reordered);
  };

  const handlePrereqCategoryTitleChange = async (catKey, newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const currentTitles = {
      ...PREREQ_CATEGORY_LABELS,
      ...(formData?.prerequisites?.category_titles || formData?.prereq_category_titles || {}),
    };
    const updatedTitles = {
      ...currentTitles,
      [catKey]: trimmed,
    };

    const updatedPrereq = {
      ...(formData?.prerequisites || {}),
      category_titles: updatedTitles,
    };

    setFormData((prev) => ({
      ...prev,
      prerequisites: updatedPrereq,
      prereq_category_titles: updatedTitles,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          prerequisites: updatedPrereq,
        },
      });
      showNotification(`Category heading updated to "${trimmed}"!`, "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save category heading", "danger");
    }
  };

  // ── Objectives helpers ──
  const handleObjectiveChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.objectives || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, objectives: list };
    });
  };

  const addObjective = () => {
    setFormData((prev) => {
      const list = [...(prev.objectives || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `obj-${Date.now()}`,
        num: nextNum,
        title: "Objective Title",
        content: "Detailed description of what the learner will accomplish in this objective.",
      });
      return { ...prev, objectives: list };
    });
  };

  const removeObjective = (index) => {
    setFormData((prev) => {
      const list = [...(prev.objectives || [])];
      list.splice(index, 1);
      const reindexed = list.map((obj, idx) => ({
        ...obj,
        num: String(idx + 1).padStart(2, "0"),
      }));
      return { ...prev, objectives: reindexed };
    });
  };

  const handleReorderObjectives = async (reordered) => {
    const reindexed = reordered.map((obj, idx) => ({
      ...obj,
      num: String(idx + 1).padStart(2, "0"),
    }));

    setFormData((prev) => ({
      ...prev,
      objectives: reindexed,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          objectives: reindexed,
        },
      });
      showNotification("Objectives reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered objectives", "danger");
    }
  };

  const handleMoveObjective = (index, direction) => {
    const list = [...(formData?.objectives || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const reordered = arrayMove(list, index, targetIndex);
    handleReorderObjectives(reordered);
  };

  // ── Architecture Steps helpers ──
  const handleArchStepChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.architecture_steps || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, architecture_steps: list };
    });
  };

  const addArchStep = () => {
    setFormData((prev) => {
      const list = [...(prev.architecture_steps || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({ id: `arch-${Date.now()}`, num: nextNum, title: "New Step" });
      return { ...prev, architecture_steps: list };
    });
  };

  const removeArchStep = (index) => {
    setFormData((prev) => {
      const list = [...(prev.architecture_steps || [])];
      list.splice(index, 1);
      const reindexed = list.map((step, idx) => ({
        ...step,
        num: String(idx + 1).padStart(2, "0"),
      }));
      return { ...prev, architecture_steps: reindexed };
    });
  };

  // ── Reorder Architecture Steps ──
  const handleReorderArchSteps = async (reordered) => {
    const reindexed = reordered.map((step, idx) => ({
      ...step,
      num: String(idx + 1).padStart(2, "0"),
    }));

    setFormData((prev) => ({
      ...prev,
      architecture_steps: reindexed,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          architecture_steps: reindexed,
        },
      });
      showNotification("Architecture workflow reordered and saved!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered architecture steps", "danger");
    }
  };

  const handleMoveArchStep = (index, direction) => {
    const list = [...(formData.architecture_steps || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const reordered = arrayMove(list, index, targetIndex);
    handleReorderArchSteps(reordered);
  };

  // ── Architecture Details helpers ──
  const handleArchDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.architecture_details || [])];
      list[index] = {
        ...list[index],
        [field]: value,
        ...(field === "desc" ? { description: value } : {}),
        ...(field === "description" ? { desc: value } : {}),
      };
      return { ...prev, architecture_details: list };
    });
  };

  const addArchDetail = () => {
    setFormData((prev) => {
      const list = [...(prev.architecture_details || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      const newId = `arch-detail-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      list.push({
        id: newId,
        step: `${nextNum} · Component`,
        desc: "",
        description: "",
      });
      return { ...prev, architecture_details: list };
    });
  };

  const removeArchDetail = (index) => {
    setFormData((prev) => {
      const list = [...(prev.architecture_details || [])];
      list.splice(index, 1);
      return { ...prev, architecture_details: list };
    });
  };

  // ── Implementation Steps helpers ──
  const handleImplStepChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.implementation_steps || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, implementation_steps: list };
    });
  };

  const addImplStep = () => {
    setFormData((prev) => {
      const list = [...(prev.implementation_steps || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `step-${Date.now()}`,
        num: nextNum,
        title: "Implementation Step Title",
        subtitle: "Short summary subtitle",
        description: "<p>Actionable steps taken in this phase. Why this phase is important. Artifact or output produced.</p>",
        tools: ["Python", "Jupyter"],
        command: "pip install package-name",
        titleLabel: "",
        subtitleLabel: "",
        descriptionLabel: "",
        toolsLabel: "",
        commandLabel: "",
      });
      return { ...prev, implementation_steps: list };
    });
  };

  const removeImplStep = (index) => {
    setFormData((prev) => {
      const list = [...(prev.implementation_steps || [])];
      list.splice(index, 1);
      const reindexed = list.map((step, idx) => ({
        ...step,
        num: String(idx + 1).padStart(2, "0"),
      }));
      return { ...prev, implementation_steps: reindexed };
    });
  };

  // ── Reorder Implementation Steps ──
  const handleReorderImplSteps = async (reordered) => {
    const reindexed = reordered.map((step, idx) => ({
      ...step,
      num: String(idx + 1).padStart(2, "0"),
    }));

    setFormData((prev) => ({
      ...prev,
      implementation_steps: reindexed,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          implementation_steps: reindexed,
        },
      });
      showNotification("Steps reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered steps", "danger");
    }
  };

  const handleMoveImplStep = (index, direction) => {
    const list = [...(formData.implementation_steps || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const reordered = arrayMove(list, index, targetIndex);
    handleReorderImplSteps(reordered);
  };

  // ── Section 06: Technologies / Tools helpers ──
  const handleTechChange = (idOrIndex, field, value) => {
    setFormData((prev) => {
      const list = (prev.technologies || []).map((item, idx) => {
        const match = item.id ? item.id === idOrIndex : idx === idOrIndex;
        if (!match) return item;

        const updated = { ...item };
        if (field === "toolName" || field === "name") {
          updated.toolName = value;
          updated.name = value;
        } else if (field === "categoryUsage" || field === "desc") {
          updated.categoryUsage = value;
          updated.desc = value;
        } else {
          updated[field] = value;
        }
        return updated;
      });
      return { ...prev, technologies: list };
    });
  };

  const addTech = () => {
    setFormData((prev) => {
      const list = [...(prev.technologies || [])];
      const newId = `tech-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      list.push({
        id: newId,
        toolName: "",
        categoryUsage: "",
        name: "",
        desc: "",
      });
      return { ...prev, technologies: list };
    });
  };

  const removeTech = (idOrIndex) => {
    setFormData((prev) => {
      const list = (prev.technologies || []).filter((item, idx) =>
        item.id ? item.id !== idOrIndex : idx !== idOrIndex
      );
      return { ...prev, technologies: list };
    });
  };

  const handleReorderTech = async (reordered) => {
    setFormData((prev) => ({
      ...prev,
      technologies: reordered,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          technologies: reordered,
        },
      });
      showNotification("Technologies reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered technologies", "danger");
    }
  };

  const handleMoveTech = (index, direction) => {
    const list = [...(formData?.technologies || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const reordered = arrayMove(list, index, targetIndex);
    handleReorderTech(reordered);
  };

  // ── Section 07: Dataset Resources helpers ──
  const handleDatasetChange = (idOrIndex, field, value) => {
    setFormData((prev) => {
      const currentList = prev.datasetResources || prev.dataset_resources || [];
      const updated = currentList.map((item, idx) => {
        const match = item.id ? item.id === idOrIndex : idx === idOrIndex;
        if (!match) return item;

        const updatedItem = { ...item };
        if (field === "providerTitle" || field === "title") {
          updatedItem.providerTitle = value;
          updatedItem.title = value;
        } else if (field === "externalUrl" || field === "url") {
          updatedItem.externalUrl = value;
          updatedItem.url = value;
        } else if (field === "description" || field === "desc") {
          updatedItem.description = value;
          updatedItem.desc = value;
        } else {
          updatedItem[field] = value;
        }
        return updatedItem;
      });

      return {
        ...prev,
        datasetResources: updated,
        dataset_resources: updated,
      };
    });
  };

  const addDataset = () => {
    setFormData((prev) => {
      const currentList = prev.datasetResources || prev.dataset_resources || [];
      const newId = `ds-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newItem = {
        id: newId,
        providerTitle: "",
        externalUrl: "https://",
        description: "",
        title: "",
        url: "https://",
        desc: "",
      };
      const updated = [...currentList, newItem];
      return {
        ...prev,
        datasetResources: updated,
        dataset_resources: updated,
      };
    });
  };

  const removeDataset = (idOrIndex) => {
    setFormData((prev) => {
      const currentList = prev.datasetResources || prev.dataset_resources || [];
      const updated = currentList.filter((item, idx) =>
        item.id ? item.id !== idOrIndex : idx !== idOrIndex
      );
      return {
        ...prev,
        datasetResources: updated,
        dataset_resources: updated,
      };
    });
  };

  const handleReorderDatasets = async (reordered) => {
    setFormData((prev) => ({
      ...prev,
      datasetResources: reordered,
      dataset_resources: reordered,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          dataset_resources: reordered,
          datasetResources: reordered,
        },
      });
      showNotification("Dataset resources reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered resources", "danger");
    }
  };

  const handleMoveDataset = (index, direction) => {
    const currentList = [...(formData?.datasetResources || formData?.dataset_resources || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;
    const reordered = arrayMove(currentList, index, targetIndex);
    handleReorderDatasets(reordered);
  };

  // ── Section 08: Learnings helpers ──
  const handleLearningChange = (category, index, value) => {
    setFormData((prev) => {
      const list = [...(prev[category] || [])];
      list[index] = value;
      const camel = category === "technical_learnings" ? "technicalLearnings" : "practicalLearnings";
      return { ...prev, [category]: list, [camel]: list };
    });
  };

  const addLearning = (category) => {
    setFormData((prev) => {
      const list = [...(prev[category] || []), ""];
      const camel = category === "technical_learnings" ? "technicalLearnings" : "practicalLearnings";
      return { ...prev, [category]: list, [camel]: list };
    });
  };

  const removeLearning = (category, index) => {
    setFormData((prev) => {
      const list = [...(prev[category] || [])];
      list.splice(index, 1);
      const camel = category === "technical_learnings" ? "technicalLearnings" : "practicalLearnings";
      return { ...prev, [category]: list, [camel]: list };
    });
  };

  const handleReorderLearnings = async (category, reorderedList) => {
    const camel = category === "technical_learnings" ? "technicalLearnings" : "practicalLearnings";
    setFormData((prev) => ({
      ...prev,
      [category]: reorderedList,
      [camel]: reorderedList,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          [category]: reorderedList,
          [camel]: reorderedList,
        },
      });
      showNotification("Learnings reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered learnings", "danger");
    }
  };

  const handleMoveLearning = (category, index, direction) => {
    const list = [...(formData?.[category] || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const reordered = arrayMove(list, index, targetIndex);
    handleReorderLearnings(category, reordered);
  };

  // ── Reorder Learning Categories ──
  const handleReorderLearningCategories = async (newOrder) => {
    const updatedHeaders = {
      ...(formData.section_headers || formData.sectionHeaders || DEFAULT_SECTION_HEADERS),
      learnings_order: newOrder,
    };
    setFormData((prev) => ({
      ...prev,
      learnings_order: newOrder,
      section_headers: updatedHeaders,
      sectionHeaders: updatedHeaders,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          section_headers: updatedHeaders,
        },
      });
      showNotification("Learning categories reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered learning categories", "danger");
    }
  };

  const handleMoveLearningCategory = (index, direction) => {
    const currentList = [
      ...(formData?.learnings_order ||
        formData?.section_headers?.learnings_order ||
        DEFAULT_LEARNINGS_ORDER),
    ];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;
    const reordered = arrayMove(currentList, index, targetIndex);
    handleReorderLearningCategories(reordered);
  };

  const handleLearningCategoryTitleChange = async (catKey, newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const currentTitles = {
      ...DEFAULT_LEARNING_CATEGORY_TITLES,
      ...(formData?.section_headers?.learning_category_titles ||
        formData?.learning_category_titles ||
        {}),
    };
    const updatedTitles = {
      ...currentTitles,
      [catKey]: trimmed,
    };

    const updatedHeaders = {
      ...(formData?.section_headers || formData?.sectionHeaders || DEFAULT_SECTION_HEADERS),
      learning_category_titles: updatedTitles,
    };

    setFormData((prev) => ({
      ...prev,
      learning_category_titles: updatedTitles,
      section_headers: updatedHeaders,
      sectionHeaders: updatedHeaders,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          section_headers: updatedHeaders,
        },
      });
      showNotification(`Learning heading updated to "${trimmed}"!`, "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save learning heading", "danger");
    }
  };

  // ── Section 09: Common Mistakes helpers ──
  const handleMistakeChange = (idOrIndex, field, value) => {
    setFormData((prev) => {
      const currentList = prev.common_mistakes || prev.commonMistakes || [];
      const list = currentList.map((item, idx) => {
        const match = item.id ? item.id === idOrIndex : idx === idOrIndex;
        if (!match) return item;
        return {
          ...item,
          [field]: value,
          ...(field === "description" ? { mistake: value } : {}),
        };
      });
      return { ...prev, common_mistakes: list, commonMistakes: list };
    });
  };

  const addMistake = () => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || prev.commonMistakes || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      const newId = `mistake-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      list.push({
        id: newId,
        num: nextNum,
        title: "",
        description: "",
        mistake: "",
        titleLabel: "",
        descriptionLabel: "",
      });
      return { ...prev, common_mistakes: list, commonMistakes: list };
    });
  };

  const removeMistake = (idOrIndex) => {
    setFormData((prev) => {
      const currentList = prev.common_mistakes || prev.commonMistakes || [];
      const list = currentList.filter((item, idx) =>
        item.id ? item.id !== idOrIndex : idx !== idOrIndex
      );
      const reindexed = list.map((item, idx) => ({
        ...item,
        num: String(idx + 1).padStart(2, "0"),
      }));
      return { ...prev, common_mistakes: reindexed, commonMistakes: reindexed };
    });
  };

  // ── Reorder Pitfalls ──
  const handleReorderMistakes = async (reordered) => {
    const reindexed = reordered.map((m, idx) => ({
      ...m,
      num: String(idx + 1).padStart(2, "0"),
    }));

    setFormData((prev) => ({
      ...prev,
      common_mistakes: reindexed,
      commonMistakes: reindexed,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          common_mistakes: reindexed,
        },
      });
      showNotification("Pitfalls reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered pitfalls", "danger");
    }
  };

  const handleMoveMistake = (index, direction) => {
    const currentList = [...(formData.common_mistakes || formData.commonMistakes || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;
    const reordered = arrayMove(currentList, index, targetIndex);
    handleReorderMistakes(reordered);
  };

  // ── Reorder Main Sections ──
  const handleReorderSections = async (newOrder) => {
    const currentHeaders = { ...(formData.section_headers || formData.sectionHeaders || DEFAULT_SECTION_HEADERS) };

    newOrder.forEach((secId, idx) => {
      const newNum = String(idx + 1).padStart(2, "0");
      const sec = currentHeaders[secId] || DEFAULT_SECTION_HEADERS[secId];
      if (sec?.title) {
        const updatedTitle = sec.title.replace(/^\d{2}\s*·\s*/, `${newNum} · `);
        currentHeaders[secId] = {
          ...sec,
          title: updatedTitle,
        };
      }
    });

    const updatedHeaders = {
      ...currentHeaders,
      sections_order: newOrder,
    };

    setFormData((prev) => ({
      ...prev,
      sections_order: newOrder,
      section_headers: updatedHeaders,
      sectionHeaders: updatedHeaders,
    }));

    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          section_headers: updatedHeaders,
        },
      });
      showNotification("Sections reordered and saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save reordered sections", "danger");
    }
  };

  const handleMoveSection = (index, direction) => {
    const list = [...(formData.sections_order || DEFAULT_SECTION_ORDER)];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const reordered = arrayMove(list, index, targetIndex);
    handleReorderSections(reordered);
  };

  // ── Submit / Save handler ──
  const handleSave = async () => {
    if (!formData) return;
    try {
      const finalTech = (formData.technologies || []).map((t, idx) => ({
        id: t.id || `tech-${idx + 1}`,
        toolName: t.toolName || t.name || "",
        categoryUsage: t.categoryUsage || t.desc || "",
        name: t.toolName || t.name || "",
        desc: t.categoryUsage || t.desc || "",
      }));

      const finalDatasets = (formData.datasetResources || formData.dataset_resources || []).map((ds, idx) => ({
        id: ds.id || `ds-${idx + 1}`,
        providerTitle: ds.providerTitle || ds.title || "",
        externalUrl: ds.externalUrl || ds.url || "",
        description: ds.description || ds.desc || "",
        title: ds.providerTitle || ds.title || "",
        url: ds.externalUrl || ds.url || "",
        desc: ds.description || ds.desc || "",
      }));

      const finalMistakes = (formData.common_mistakes || formData.commonMistakes || []).map((m, idx) => {
        const desc = combineMistakeDescription(m);
        return {
          ...m,
          id: m.id || `mistake-${idx + 1}`,
          num: m.num || String(idx + 1).padStart(2, "0"),
          title: m.title || "",
          description: desc,
          mistake: desc,
          titleLabel: m.titleLabel || "",
          descriptionLabel: m.descriptionLabel || "",
        };
      });

      const finalImplSteps = (formData.implementation_steps || []).map((step, idx) => {
        const desc = combineStepDescription(step);
        return {
          ...step,
          num: step.num || String(idx + 1).padStart(2, "0"),
          title: step.title || "",
          subtitle: step.subtitle || "",
          description: desc,
          whatYouDo: desc,
          tools: Array.isArray(step.tools) ? step.tools : [],
          command: step.command || "",
          titleLabel: step.titleLabel || "",
          subtitleLabel: step.subtitleLabel || "",
          descriptionLabel: step.descriptionLabel || "",
          toolsLabel: step.toolsLabel || "",
          commandLabel: step.commandLabel || "",
        };
      });

      const finalPrereq = {
        ...(formData.prerequisites || {}),
        category_order:
          formData.prerequisites?.category_order ||
          formData.prerequisites_order ||
          DEFAULT_PREREQ_CATEGORIES_ORDER,
        category_titles:
          formData.prerequisites?.category_titles ||
          formData.prereq_category_titles ||
          PREREQ_CATEGORY_LABELS,
      };

      // Clean prerequisite category items into clean strings
      const prereqCats = finalPrereq.category_order || DEFAULT_PREREQ_CATEGORIES_ORDER;
      for (const catKey of prereqCats) {
        if (Array.isArray(finalPrereq[catKey])) {
          finalPrereq[catKey] = finalPrereq[catKey].map((it) =>
            typeof it === "string" ? it : (it?.text || "")
          );
        }
      }

      const archHeadingToSave =
        formData.architecture_section_heading !== undefined
          ? formData.architecture_section_heading
          : (formData.section_headers?.architecture_section_heading || "View Architecture Details");

      const finalHeaders = {
        ...(formData.section_headers || formData.sectionHeaders || DEFAULT_SECTION_HEADERS),
        architecture_section_heading: archHeadingToSave,
        learnings_order:
          formData.learnings_order ||
          formData.section_headers?.learnings_order ||
          DEFAULT_LEARNINGS_ORDER,
        learning_category_titles:
          formData.section_headers?.learning_category_titles ||
          formData.learning_category_titles ||
          DEFAULT_LEARNING_CATEGORY_TITLES,
      };

      const finalDescription = formData.about_text_1 ?? formData.description ?? formData.about_text ?? "";

      const finalDomain = formData.domain === "Other" && formData.custom_domain?.trim()
        ? formData.custom_domain.trim()
        : (formData.domain || "Data Science");

      const finalProjectType = formData.project_type === "Other" && formData.custom_project_type?.trim()
        ? formData.custom_project_type.trim()
        : (formData.project_type || "Machine Learning");

      const payload = {
        ...formData,
        domain: finalDomain,
        project_type: finalProjectType,
        about_text_1: finalDescription,
        about_text_2: "",
        about_text_3: "",
        description: finalDescription,
        about_text: finalDescription,
        project_description: finalDescription,
        section_2_design: formData.section_2_design || "grid",
        prerequisites: finalPrereq,
        technologies: finalTech,
        dataset_resources: finalDatasets,
        datasetResources: finalDatasets,
        technical_learnings: formData.technical_learnings || formData.technicalLearnings || [],
        technicalLearnings: formData.technical_learnings || formData.technicalLearnings || [],
        practical_learnings: formData.practical_learnings || formData.practicalLearnings || [],
        practicalLearnings: formData.practical_learnings || formData.practicalLearnings || [],
        learnings_order: finalHeaders.learnings_order,
        learning_category_titles: finalHeaders.learning_category_titles,
        prereq_category_titles: finalPrereq.category_titles,
        architecture_section_heading: archHeadingToSave,
        architecture_details: (formData.architecture_details || []).map((ad, idx) => ({
          ...ad,
          id: ad.id || `arch-detail-${idx + 1}`,
          step: ad.step || "",
          desc: ad.desc || ad.description || "",
          description: ad.desc || ad.description || "",
        })),
        implementation_steps: finalImplSteps,
        common_mistakes: finalMistakes,
        commonMistakes: finalMistakes,
        section_headers: finalHeaders,
        sectionHeaders: finalHeaders,
        sidebar_cards: formData.sidebar_cards,
      };

      if (currentData && (currentData.id || currentData.slug)) {
        await updateDetails({
          slugOrId: formData.slug || selectedSlug,
          data: payload,
        });
      } else {
        await createDetails(payload);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleSidebarCardsChange = (updatedSidebar) => {
    setFormData((prev) => ({
      ...prev,
      sidebar_cards: updatedSidebar,
      sidebarCards: updatedSidebar,
    }));
  };

  const handleSaveSidebarCards = async (cardsToSave = formData?.sidebar_cards) => {
    if (!cardsToSave) return;
    try {
      await updateDetails({
        slugOrId: formData?.slug || selectedSlug,
        data: {
          sidebar_cards: cardsToSave,
        },
      });
      showNotification("Sidebar content saved successfully!", "success");
    } catch (err) {
      showNotification(err?.message || "Failed to save sidebar content", "danger");
    }
  };

  const sectionsOrder = formData?.sections_order ||
    formData?.section_headers?.sections_order ||
    DEFAULT_SECTION_ORDER;

  // ── Render Section Content Helper ──
  const renderSectionContent = (sectionId, { dragHandleProps, reorderProps, positionLabel } = {}) => {
    switch (sectionId) {
      case "about-project":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
              Section 01 · About the Project Content
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              This description renders inside the primary summary card in Section 01. Paragraph breaks are preserved on the public project page.
            </Typography>

            <SectionHeaderEditCard
              sectionId="about-project"
              label="01 · About the Project"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            <TextField
              label="Project Description"
              fullWidth
              multiline
              minRows={6}
              rows={8}
              value={formData?.about_text_1 ?? formData?.description ?? formData?.about_text ?? ""}
              onChange={(e) => handleProjectDescriptionChange(e.target.value)}
              placeholder="Enter the complete project description. Combine the problem context, what the learner builds, and the working deliverable (use blank lines to separate paragraphs)..."
              helperText="Full-width project description. Use line breaks or blank lines to separate paragraphs."
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.95rem",
                  lineHeight: 1.65,
                },
              }}
            />
          </Box>
        );

      case "prerequisites": {
        const prereqCategoryOrder =
          formData.prerequisites?.category_order ||
          formData.prerequisites_order ||
          DEFAULT_PREREQ_CATEGORIES_ORDER;

        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Section 02 · Prerequisites & What to Know Before Starting
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Add and manage prerequisites by category. Drag category cards or items to reorder.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={(e) => setAddPrereqMenuAnchor(e.currentTarget)}
                sx={{
                  borderColor: "#37AB79",
                  color: "#37AB79",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { borderColor: "#2e8b62", backgroundColor: "#f0fdf4" },
                }}
              >
                + Add Prerequisite
              </Button>

              <Menu
                anchorEl={addPrereqMenuAnchor}
                open={Boolean(addPrereqMenuAnchor)}
                onClose={() => setAddPrereqMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    minWidth: 230,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    borderRadius: 2,
                    border: "1px solid #e0e6ed",
                    py: 0.5,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f1f5f9" }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#074568", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Select Category
                  </Typography>
                </Box>
                {prereqCategoryOrder.map((catKey) => {
                  const catTitle =
                    formData?.prerequisites?.category_titles?.[catKey] ||
                    formData?.prereq_category_titles?.[catKey] ||
                    PREREQ_CATEGORY_LABELS[catKey] ||
                    catKey;
                  return (
                    <MenuItem
                      key={catKey}
                      onClick={() => {
                        addPrereqItem(catKey);
                        setAddPrereqMenuAnchor(null);
                      }}
                      sx={{
                        fontSize: "0.875rem",
                        py: 1,
                        "&:hover": { backgroundColor: "#f0fdf4", color: "#37AB79" },
                      }}
                    >
                      {catTitle}
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>

            <SectionHeaderEditCard
              sectionId="prerequisites"
              label="02 · Prerequisites"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            {/* Section 2 Display Design Toggle (Grid Card vs Single Column) */}
            <Section2DesignCard
              value={formData?.section_2_design || "grid"}
              savedValue={currentData?.section_2_design || currentData?.section_headers?.section_2_design || "grid"}
              onChange={handleSection2DesignChange}
              onSave={handleSaveSection2Design}
              onReset={handleResetSection2Design}
              isSaving={isSavingDesign}
            />

            {/* Sortable Prerequisite Category Cards */}
            <SortableContainer
              items={prereqCategoryOrder.map((cat) => ({ id: `cat-${cat}`, cat }))}
              onReorder={(reordered) => handleReorderPrereqCategories(reordered.map((r) => r.cat))}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {prereqCategoryOrder.map((cat, catIdx) => {
                  const catSortId = `cat-${cat}`;
                  const items = formData.prerequisites?.[cat] || [];
                  const catKeys = prereqItemKeys[cat] || [];
                  const sortableItems = items.map((text, idx) => ({
                    id: catKeys[idx] || `prereq-${cat}-${idx}`,
                    text,
                    idx,
                  }));

                  return (
                    <SortableItem key={catSortId} id={catSortId}>
                      {({ attributes: catAttrs, listeners: catListeners, isDragging: isCatDragging }) => (
                        <Paper
                          sx={{
                            p: 2,
                            border: isCatDragging ? "2px dashed #37AB79" : "1px solid #e0e6ed",
                            borderRadius: 2,
                            backgroundColor: isCatDragging ? "#eefbf4" : "#ffffff",
                            boxShadow: isCatDragging ? 4 : 0,
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <DragHandle
                                attributes={catAttrs}
                                listeners={catListeners}
                                isDragging={isCatDragging}
                                title="Drag to reorder entire category"
                                color="#074568"
                              />
                              <AccessibleReorderButtons
                                isFirst={catIdx === 0}
                                isLast={catIdx === prereqCategoryOrder.length - 1}
                                onMoveUp={() => handleMovePrereqCategory(catIdx, -1)}
                                onMoveDown={() => handleMovePrereqCategory(catIdx, 1)}
                                color="#074568"
                              />
                              <EditableCardHeading
                                title={
                                  formData?.prerequisites?.category_titles?.[cat] ||
                                  formData?.prereq_category_titles?.[cat] ||
                                  PREREQ_CATEGORY_LABELS[cat] ||
                                  cat
                                }
                                subtitle="Drag category card to reorder categories, or drag items within this category."
                                onSave={(newTitle) => handlePrereqCategoryTitleChange(cat, newTitle)}
                                tooltip="Click to edit category heading"
                                color="#074568"
                              />
                            </Box>

                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => addPrereqItem(cat)}
                              sx={{
                                color: "#37AB79",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": { backgroundColor: "#f0fdf4" },
                              }}
                            >
                              + Add Item
                            </Button>
                          </Box>

                          {/* Child Items Drag & Drop */}
                          <SortableContainer
                            items={sortableItems}
                            onReorder={(reordered) => {
                              const newTexts = reordered.map((r) => r.text);
                              const newKeys = reordered.map((r) => r.id);
                              setPrereqItemKeys((prev) => ({ ...prev, [cat]: newKeys }));
                              handleReorderPrereq(cat, newTexts);
                            }}
                          >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              {sortableItems.map(({ id, text }, idx) => (
                                <SortableItem key={id} id={id}>
                                  {({ attributes, listeners, isDragging }) => (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        p: 0.5,
                                        backgroundColor: isDragging ? "#eefbf4" : "transparent",
                                        borderRadius: 1.5,
                                        border: isDragging ? "2px dashed #37AB79" : "none",
                                        boxShadow: isDragging ? 3 : 0,
                                      }}
                                    >
                                      <DragHandle
                                        attributes={attributes}
                                        listeners={listeners}
                                        isDragging={isDragging}
                                        title="Drag to reorder requirement"
                                      />
                                      <AccessibleReorderButtons
                                        isFirst={idx === 0}
                                        isLast={items.length - 1}
                                        onMoveUp={() => handleMovePrereq(cat, idx, -1)}
                                        onMoveDown={() => handleMovePrereq(cat, idx, 1)}
                                      />
                                      <TextField
                                        size="small"
                                        fullWidth
                                        placeholder="Enter prerequisite requirement..."
                                        value={text}
                                        onChange={(e) => handlePrereqChange(cat, idx, e.target.value)}
                                        sx={{
                                          backgroundColor: "#ffffff",
                                          "& .MuiOutlinedInput-root": {
                                            borderRadius: 1.5,
                                          },
                                        }}
                                      />
                                      <IconButton
                                        size="small"
                                        onClick={() => removePrereqItem(cat, idx)}
                                        sx={{ color: "#dc2626", "&:hover": { backgroundColor: "#fef2f2" } }}
                                        title="Delete prerequisite"
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </SortableItem>
                              ))}

                              {items.length === 0 && (
                                <Box
                                  sx={{
                                    p: 2,
                                    textAlign: "center",
                                    border: "1px dashed #cbd5e1",
                                    borderRadius: 1.5,
                                    backgroundColor: "#f8fafc",
                                  }}
                                >
                                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                                    No prerequisites added in this category yet.
                                  </Typography>
                                  <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => addPrereqItem(cat)}
                                    sx={{ color: "#37AB79", textTransform: "none", fontWeight: 600 }}
                                  >
                                    + Add Item
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          </SortableContainer>
                        </Paper>
                      )}
                    </SortableItem>
                  );
                })}
              </Box>
            </SortableContainer>
          </Box>
        );
      }

      case "project-objectives":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Section 03 · Project Objectives
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Drag cards vertically to reorder. Numbering updates automatically.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addObjective}
                sx={{ borderColor: "#37AB79", color: "#37AB79", textTransform: "none", fontWeight: 600 }}
              >
                Add Objective
              </Button>
            </Box>

            <SectionHeaderEditCard
              sectionId="project-objectives"
              label="03 · Project Objectives"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            <SortableContainer
              items={formData.objectives || []}
              onReorder={handleReorderObjectives}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {(formData.objectives || []).map((obj, idx) => (
                  <SortableItem key={obj.id} id={obj.id}>
                    {({ attributes, listeners, isDragging }) => (
                      <Paper
                        sx={{
                          p: 2,
                          border: isDragging ? "2px dashed #37AB79" : "1px solid #e0e6ed",
                          borderRadius: 2,
                          backgroundColor: isDragging ? "#eefbf4" : "#fff",
                          boxShadow: isDragging ? 4 : 0,
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <DragHandle
                              attributes={attributes}
                              listeners={listeners}
                              isDragging={isDragging}
                              title="Drag to reorder objective"
                            />
                            <AccessibleReorderButtons
                              isFirst={idx === 0}
                              isLast={idx === (formData.objectives || []).length - 1}
                              onMoveUp={() => handleMoveObjective(idx, -1)}
                              onMoveDown={() => handleMoveObjective(idx, 1)}
                            />
                            <Typography sx={{ fontWeight: 700, color: "#37AB79" }}>
                              Objective
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => removeObjective(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "80px 1fr" }, gap: 1.5, mb: 1.5 }}>
                          <TextField
                            size="small"
                            label="No."
                            value={obj.num || String(idx + 1).padStart(2, "0")}
                            onChange={(e) => handleObjectiveChange(idx, "num", e.target.value)}
                          />
                          <TextField
                            size="small"
                            label="Objective Title"
                            value={obj.title || ""}
                            onChange={(e) => handleObjectiveChange(idx, "title", e.target.value)}
                          />
                        </Box>

                        <TextField
                          size="small"
                          label="Content / Description"
                          fullWidth
                          multiline
                          rows={2}
                          value={obj.content || ""}
                          onChange={(e) => handleObjectiveChange(idx, "content", e.target.value)}
                        />
                      </Paper>
                    )}
                  </SortableItem>
                ))}
              </Box>
            </SortableContainer>
          </Box>
        );

      case "project-architecture":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
              Section 04 · Architecture Steps & Breakdown
            </Typography>

            <SectionHeaderEditCard
              sectionId="project-architecture"
              label="04 · Architecture"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            {/* 1. Step Cards Grid (Draggable) */}
            <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                    Architecture Workflow Steps (Circular Grid)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Drag items by their six-dot handle to rearrange the grid order.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addArchStep}
                  sx={{ color: "#37AB79", textTransform: "none" }}
                >
                  Add Step
                </Button>
              </Box>

              <SortableContainer
                items={formData.architecture_steps || []}
                onReorder={handleReorderArchSteps}
                strategy={rectSortingStrategy}
              >
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 1.5 }}>
                  {(formData.architecture_steps || []).map((step, idx) => (
                    <SortableItem key={step.id} id={step.id}>
                      {({ attributes, listeners, isDragging }) => (
                        <Box
                          sx={{
                            p: 1.5,
                            border: isDragging ? "2px dashed #37AB79" : "1px solid #e2e8f0",
                            borderRadius: 1.5,
                            backgroundColor: isDragging ? "#eefbf4" : "#fafafa",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            transition: "background-color 0.15s ease",
                            boxShadow: isDragging ? 3 : 0,
                          }}
                        >
                          <DragHandle
                            attributes={attributes}
                            listeners={listeners}
                            isDragging={isDragging}
                            title="Drag to reorder workflow step"
                          />
                          <AccessibleReorderButtons
                            isFirst={idx === 0}
                            isLast={idx === (formData.architecture_steps || []).length - 1}
                            onMoveUp={() => handleMoveArchStep(idx, -1)}
                            onMoveDown={() => handleMoveArchStep(idx, 1)}
                          />
                          <TextField
                            size="small"
                            sx={{ width: 55, flexShrink: 0 }}
                            inputProps={{ style: { textAlign: "center", padding: "6px 4px", fontWeight: 600 } }}
                            value={step.num || String(idx + 1).padStart(2, "0")}
                            onChange={(e) => handleArchStepChange(idx, "num", e.target.value)}
                          />
                          <TextField
                            size="small"
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={2}
                            value={step.title || ""}
                            onChange={(e) => handleArchStepChange(idx, "title", e.target.value)}
                            placeholder="Step Title (e.g. Raw\nDataset)"
                          />
                          <IconButton size="small" onClick={() => removeArchStep(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </SortableItem>
                  ))}
                </Box>
              </SortableContainer>
            </Paper>

            {/* 2. Architecture Details Breakdown */}
            <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                  Architecture Details Breakdown List
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addArchDetail}
                  sx={{ color: "#37AB79", textTransform: "none" }}
                >
                  Add Breakdown Item
                </Button>
              </Box>

              {/* Architecture Section Heading Field */}
              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Architecture Section Heading"
                  placeholder="e.g. View Architecture Details"
                  value={
                    formData.architecture_section_heading !== undefined
                      ? formData.architecture_section_heading
                      : (formData.section_headers?.architecture_section_heading || "View Architecture Details")
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      architecture_section_heading: val,
                      section_headers: {
                        ...(prev?.section_headers || {}),
                        architecture_section_heading: val,
                      },
                      sectionHeaders: {
                        ...(prev?.sectionHeaders || {}),
                        architecture_section_heading: val,
                      },
                    }));
                  }}
                  helperText="Custom heading displayed above the architecture breakdown list on the public page"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {(formData.architecture_details || []).map((item, idx) => (
                  <Paper
                    key={item.id || `arch-detail-${idx}`}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: "#e2e8f0",
                      borderRadius: 1.5,
                      backgroundColor: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: "0.8rem",
                        }}
                      >
                        Description
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeArchDetail(idx)}
                        sx={{ color: "#dc2626" }}
                        title="Delete breakdown item"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#fff",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                          "&:focus-within": {
                            borderColor: "#0284c7",
                            boxShadow: "0 0 0 1px #0284c7",
                          },
                        }}
                      >
                        <Editor
                          key={`arch-editor-${item.id || idx}`}
                          id={`arch-desc-editor-${item.id || idx}`}
                          apiKey="9upr0hixy7g4w8g9mazmhkqgyl0m4kjvz623rjwvekg4l86k"
                          value={item.desc || item.description || ""}
                          onEditorChange={(content) => handleArchDetailChange(idx, "desc", content)}
                          init={{
                            height: 240,
                            menubar: true,
                            branding: false,
                            promotion: false,
                            statusbar: true,
                            elementpath: true,
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
                            toolbar:
                              "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | " +
                              "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                              "table | link codesample removeformat code fullscreen | help",
                            table_toolbar:
                              "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | " +
                              "tableinsertcolbefore tableinsertcolafter tabledeletecol | " +
                              "tablecellprops tablerowprops tablemergecells tablesplitcells",
                            content_style: `
                              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b; padding: 12px 14px; }
                              p { margin: 0 0 10px 0; }
                              p:last-child { margin-bottom: 0; }
                              table { border-collapse: collapse; width: 100%; border: 1px solid #E2E8F0; }
                              table td, table th { border: 1px solid #E2E8F0; padding: 6px 10px; }
                              table th { background-color: #f1f5f9; color: #0f172a; font-weight: 600; }
                              pre { background: #0F172A; color: #E2E8F0; padding: 10px; border-radius: 6px; overflow-x: auto; }
                            `,
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Box>
        );

      case "implementation-guide":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Section 05 · Step-by-Step Implementation Guide
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Drag cards vertically to reorder. Step numbers update automatically and persist to the database.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addImplStep}
                sx={{ borderColor: "#37AB79", color: "#37AB79", textTransform: "none" }}
              >
                Add Implementation Step
              </Button>
            </Box>

            <SectionHeaderEditCard
              sectionId="implementation-guide"
              label="05 · Implementation Guide"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            <SortableContainer
              items={formData.implementation_steps || []}
              onReorder={handleReorderImplSteps}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {(formData.implementation_steps || []).map((step, idx) => (
                  <SortableItem key={step.id} id={step.id}>
                    {({ attributes, listeners, isDragging }) => (
                      <Paper
                        sx={{
                          p: 2.5,
                          border: isDragging ? "2px dashed #37AB79" : "1px solid #e0e6ed",
                          borderRadius: 2,
                          backgroundColor: isDragging ? "#f8fafc" : "#fff",
                          boxShadow: isDragging ? 4 : 0,
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <DragHandle
                              attributes={attributes}
                              listeners={listeners}
                              isDragging={isDragging}
                              title="Drag to reorder step"
                            />
                            <AccessibleReorderButtons
                              isFirst={idx === 0}
                              isLast={idx === (formData.implementation_steps || []).length - 1}
                              onMoveUp={() => handleMoveImplStep(idx, -1)}
                              onMoveDown={() => handleMoveImplStep(idx, 1)}
                            />
                            <Typography sx={{ fontWeight: 700, color: "#37AB79" }}>
                              Step
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Button
                              size="small"
                              variant={openStepLabelEdit === (step.id || idx) ? "contained" : "outlined"}
                              startIcon={<EditIcon sx={{ fontSize: 13 }} />}
                              onClick={() => setOpenStepLabelEdit(openStepLabelEdit === (step.id || idx) ? null : (step.id || idx))}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.75rem",
                                py: 0.3,
                                px: 1.2,
                                fontWeight: 600,
                                borderColor: openStepLabelEdit === (step.id || idx) ? "#37AB79" : "#c7ebda",
                                backgroundColor: openStepLabelEdit === (step.id || idx) ? "#37AB79" : "transparent",
                                color: openStepLabelEdit === (step.id || idx) ? "#fff" : "#166534",
                                "&:hover": {
                                  backgroundColor: openStepLabelEdit === (step.id || idx) ? "#2e8b62" : "#f0fdf4",
                                  borderColor: "#37AB79",
                                },
                              }}
                            >
                              {openStepLabelEdit === (step.id || idx) ? "Close Label Editor" : "Edit Field Labels"}
                            </Button>
                            <IconButton size="small" onClick={() => removeImplStep(idx)} sx={{ color: "#dc2626" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Collapsible Label Editor Panel */}
                        {openStepLabelEdit === (step.id || idx) && (
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              mb: 2,
                              backgroundColor: "#f0fdf4",
                              border: "1px solid #bbf7d0",
                              borderRadius: 1.5,
                            }}
                          >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#166534" }}>
                                🏷️ Custom Field Labels for Step {step.num || String(idx + 1).padStart(2, "0")}
                              </Typography>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => {
                                  handleImplStepChange(idx, "titleLabel", "");
                                  handleImplStepChange(idx, "subtitleLabel", "");
                                  handleImplStepChange(idx, "descriptionLabel", "");
                                  handleImplStepChange(idx, "toolsLabel", "");
                                  handleImplStepChange(idx, "commandLabel", "");
                                }}
                                sx={{ textTransform: "none", fontSize: "0.72rem", color: "#64748b" }}
                              >
                                Reset to Defaults
                              </Button>
                            </Box>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.2 }}>
                              <TextField
                                size="small"
                                label="Title Field Label"
                                placeholder="Title"
                                value={step.titleLabel || ""}
                                onChange={(e) => handleImplStepChange(idx, "titleLabel", e.target.value)}
                                helperText="Default: Title"
                                sx={{ backgroundColor: "#fff" }}
                              />
                              <TextField
                                size="small"
                                label="Subtitle Field Label"
                                placeholder="Subtitle"
                                value={step.subtitleLabel || ""}
                                onChange={(e) => handleImplStepChange(idx, "subtitleLabel", e.target.value)}
                                helperText="Default: Subtitle"
                                sx={{ backgroundColor: "#fff" }}
                              />
                              <Box sx={{ gridColumn: { xs: "1fr", sm: "span 2" } }}>
                                <TextField
                                  size="small"
                                  fullWidth
                                  label="Implementation Description Field Label"
                                  placeholder="Implementation Description"
                                  value={step.descriptionLabel || ""}
                                  onChange={(e) => handleImplStepChange(idx, "descriptionLabel", e.target.value)}
                                  helperText="Default: Implementation Description"
                                  sx={{ backgroundColor: "#fff" }}
                                />
                              </Box>
                              <TextField
                                size="small"
                                label="Tools Used Field Label"
                                placeholder="Tools Used (comma separated)"
                                value={step.toolsLabel || ""}
                                onChange={(e) => handleImplStepChange(idx, "toolsLabel", e.target.value)}
                                helperText="Default: Tools Used (comma separated)"
                                sx={{ backgroundColor: "#fff" }}
                              />
                              <TextField
                                size="small"
                                label="Shell Command / Code snippet Field Label"
                                placeholder="Shell Command / Code snippet"
                                value={step.commandLabel || ""}
                                onChange={(e) => handleImplStepChange(idx, "commandLabel", e.target.value)}
                                helperText="Default: Shell Command / Code snippet"
                                sx={{ backgroundColor: "#fff" }}
                              />
                            </Box>
                          </Paper>
                        )}

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "80px 1fr 1fr" }, gap: 1.5, mb: 1.5 }}>
                          <TextField
                            size="small"
                            label="No."
                            value={step.num || String(idx + 1).padStart(2, "0")}
                            onChange={(e) => handleImplStepChange(idx, "num", e.target.value)}
                          />
                          <TextField
                            size="small"
                            label={step.titleLabel || "Title"}
                            value={step.title || ""}
                            onChange={(e) => handleImplStepChange(idx, "title", e.target.value)}
                          />
                          <TextField
                            size="small"
                            label={step.subtitleLabel || "Subtitle"}
                            value={step.subtitle || ""}
                            onChange={(e) => handleImplStepChange(idx, "subtitle", e.target.value)}
                          />
                        </Box>

                        <Box sx={{ mb: 1.5 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mb: 0.6,
                              fontWeight: 600,
                              color: "#475569",
                              fontSize: "0.8rem",
                            }}
                          >
                            {step.descriptionLabel || "Implementation Description"}
                          </Typography>
                          <Box
                            sx={{
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: "1px solid #cbd5e1",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                              "&:focus-within": {
                                borderColor: "#0284c7",
                                boxShadow: "0 0 0 1px #0284c7",
                              },
                            }}
                          >
                            <Editor
                              key={`editor-${step.id || idx}`}
                              id={`impl-desc-editor-${step.id || idx}`}
                              apiKey="9upr0hixy7g4w8g9mazmhkqgyl0m4kjvz623rjwvekg4l86k"
                              value={step.description || ""}
                              onEditorChange={(content) => handleImplStepChange(idx, "description", content)}
                              init={{
                                height: 300,
                                menubar: true,
                                branding: false,
                                promotion: false,
                                statusbar: true,
                                elementpath: true,
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
                                toolbar:
                                  "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | " +
                                  "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                                  "table | link codesample removeformat code fullscreen | help",
                                table_toolbar:
                                  "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | " +
                                  "tableinsertcolbefore tableinsertcolafter tabledeletecol | " +
                                  "tablecellprops tablerowprops tablemergecells tablesplitcells",
                                content_style: `
                                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b; padding: 12px 14px; }
                                  p { margin: 0 0 10px 0; }
                                  p:last-child { margin-bottom: 0; }
                                  table { border-collapse: collapse; width: 100%; border: 1px solid #E2E8F0; }
                                  table td, table th { border: 1px solid #E2E8F0; padding: 6px 10px; }
                                  table th { background-color: #f1f5f9; color: #0f172a; font-weight: 600; }
                                  pre { background: #0F172A; color: #E2E8F0; padding: 10px; border-radius: 6px; overflow-x: auto; }
                                `,
                              }}
                            />
                          </Box>
                        </Box>

                        <TextField
                          size="small"
                          label={step.toolsLabel || "Tools Used (comma separated)"}
                          placeholder="Python, Jupyter"
                          fullWidth
                          value={Array.isArray(step.tools) ? step.tools.join(", ") : (step.tools || "")}
                          onChange={(e) =>
                            handleImplStepChange(
                              idx,
                              "tools",
                              e.target.value.split(",").map((s) => s.trim())
                            )
                          }
                          sx={{ mb: 1.5 }}
                        />

                        <TextField
                          size="small"
                          label={step.commandLabel || "Shell Command / Code snippet"}
                          fullWidth
                          multiline
                          rows={2}
                          value={step.command || ""}
                          onChange={(e) => handleImplStepChange(idx, "command", e.target.value)}
                        />
                      </Paper>
                    )}
                  </SortableItem>
                ))}
              </Box>
            </SortableContainer>
          </Box>
        );

      case "technologies":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
              Section 06 · Technologies Used & Tools
            </Typography>

            <SectionHeaderEditCard
              sectionId="technologies"
              label="06 · Technologies / Tools"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            <Paper sx={{ p: 2.5, border: "1px solid #e0e6ed", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                    Technologies / Tools (Section 06)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Drag tools to reorder. Title and category usage move together.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addTech}
                  sx={{ color: "#37AB79", textTransform: "none", fontWeight: 600 }}
                >
                  Add Tool
                </Button>
              </Box>

              <SortableContainer
                items={formData.technologies || []}
                onReorder={handleReorderTech}
              >
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                  {(formData.technologies || []).map((t, idx) => (
                    <SortableItem key={t.id} id={t.id}>
                      {({ attributes, listeners, isDragging }) => (
                        <Box
                          sx={{
                            p: 1.5,
                            border: isDragging ? "2px dashed #37AB79" : "1px solid #f0f0f0",
                            borderRadius: 1.5,
                            backgroundColor: isDragging ? "#eefbf4" : "#fafafa",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            boxShadow: isDragging ? 3 : 0,
                          }}
                        >
                          <DragHandle
                            attributes={attributes}
                            listeners={listeners}
                            isDragging={isDragging}
                            title="Drag to reorder tool"
                          />
                          <AccessibleReorderButtons
                            isFirst={idx === 0}
                            isLast={idx === (formData.technologies || []).length - 1}
                            onMoveUp={() => handleMoveTech(idx, -1)}
                            onMoveDown={() => handleMoveTech(idx, 1)}
                          />
                          <TextField
                            size="small"
                            label="Tool Name"
                            value={t.toolName ?? t.name ?? ""}
                            onChange={(e) => handleTechChange(t.id || idx, "toolName", e.target.value)}
                          />
                          <TextField
                            size="small"
                            fullWidth
                            label="Category / Usage"
                            value={t.categoryUsage ?? t.desc ?? ""}
                            onChange={(e) => handleTechChange(t.id || idx, "categoryUsage", e.target.value)}
                          />
                          <IconButton size="small" onClick={() => removeTech(t.id || idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </SortableItem>
                  ))}
                </Box>
              </SortableContainer>
            </Paper>
          </Box>
        );

      case "dataset-resources":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
              Section 07 · Where to Get Data / Dataset Resources
            </Typography>

            <SectionHeaderEditCard
              sectionId="dataset-resources"
              label="07 · Dataset Resources"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            <Paper sx={{ p: 2.5, border: "1px solid #e0e6ed", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                    Dataset Resources (Section 07)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Drag cards vertically to reorder dataset resources.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addDataset}
                  sx={{ color: "#37AB79", textTransform: "none", fontWeight: 600 }}
                >
                  Add Resource
                </Button>
              </Box>

              <SortableContainer
                items={formData.datasetResources || formData.dataset_resources || []}
                onReorder={handleReorderDatasets}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {(formData.datasetResources || formData.dataset_resources || []).map((ds, idx) => (
                    <SortableItem key={ds.id} id={ds.id}>
                      {({ attributes, listeners, isDragging }) => (
                        <Paper
                          sx={{
                            p: 2,
                            border: isDragging ? "2px dashed #37AB79" : "1px solid #f0f0f0",
                            borderRadius: 1.5,
                            backgroundColor: isDragging ? "#eefbf4" : "#fff",
                            boxShadow: isDragging ? 4 : 0,
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <DragHandle
                                attributes={attributes}
                                listeners={listeners}
                                isDragging={isDragging}
                                title="Drag to reorder resource"
                              />
                              <AccessibleReorderButtons
                                isFirst={idx === 0}
                                isLast={idx === (formData.datasetResources || formData.dataset_resources || []).length - 1}
                                onMoveUp={() => handleMoveDataset(idx, -1)}
                                onMoveDown={() => handleMoveDataset(idx, 1)}
                              />
                              <Typography sx={{ fontWeight: 600, color: "#37AB79" }}>
                                Resource
                              </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => removeDataset(ds.id || idx)} sx={{ color: "#dc2626" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 1.5 }}>
                            <TextField
                              size="small"
                              label="Provider / Title"
                              value={ds.providerTitle ?? ds.title ?? ""}
                              onChange={(e) => handleDatasetChange(ds.id || idx, "providerTitle", e.target.value)}
                            />
                            <TextField
                              size="small"
                              label="External URL"
                              value={ds.externalUrl ?? ds.url ?? ""}
                              onChange={(e) => handleDatasetChange(ds.id || idx, "externalUrl", e.target.value)}
                            />
                          </Box>

                          <TextField
                            size="small"
                            label="Description"
                            fullWidth
                            value={ds.description ?? ds.desc ?? ""}
                            onChange={(e) => handleDatasetChange(ds.id || idx, "description", e.target.value)}
                          />
                        </Paper>
                      )}
                    </SortableItem>
                  ))}
                </Box>
              </SortableContainer>
            </Paper>
          </Box>
        );

      case "project-learnings": {
        const learningCategoriesOrder =
          formData.learnings_order ||
          formData.section_headers?.learnings_order ||
          DEFAULT_LEARNINGS_ORDER;

        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
              Section 08 · Learnings From the Project
            </Typography>

            <SectionHeaderEditCard
              sectionId="project-learnings"
              label="08 · Project Learnings"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            {/* Sortable Learning Category Cards Grid (Responsive 2-column on desktop, stacked on mobile) */}
            <SortableContainer
              items={learningCategoriesOrder.map((catKey) => ({ id: `learning-cat-${catKey}`, catKey }))}
              onReorder={(reordered) => handleReorderLearningCategories(reordered.map((r) => r.catKey))}
              strategy={rectSortingStrategy}
            >
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                {learningCategoriesOrder.map((catKey, catIdx) => {
                  const config = LEARNING_CATEGORY_CONFIG[catKey] || {
                    id: catKey,
                    title: catKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                    subtitle: "Drag items vertically to reorder.",
                    camelKey: catKey,
                  };
                  const catSortId = `learning-cat-${catKey}`;
                  const items = formData[catKey] || formData[config.camelKey] || [];
                  const sortableItems = items.map((text, idx) => ({
                    id: `${catKey}-item-${idx}`,
                    text,
                    idx,
                  }));

                  return (
                    <SortableItem key={catSortId} id={catSortId}>
                      {({ attributes: catAttrs, listeners: catListeners, isDragging: isCatDragging }) => (
                        <Paper
                          sx={{
                            p: 2,
                            border: isCatDragging ? "2px dashed #37AB79" : "1px solid #e0e6ed",
                            borderRadius: 2,
                            backgroundColor: isCatDragging ? "#eefbf4" : "#ffffff",
                            boxShadow: isCatDragging ? 4 : 0,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <DragHandle
                                attributes={catAttrs}
                                listeners={catListeners}
                                isDragging={isCatDragging}
                                title="Drag to reorder learning category card"
                                color="#074568"
                              />
                              <AccessibleReorderButtons
                                isFirst={catIdx === 0}
                                isLast={catIdx === learningCategoriesOrder.length - 1}
                                onMoveUp={() => handleMoveLearningCategory(catIdx, -1)}
                                onMoveDown={() => handleMoveLearningCategory(catIdx, 1)}
                                color="#074568"
                              />
                              <EditableCardHeading
                                title={
                                  formData?.section_headers?.learning_category_titles?.[catKey] ||
                                  formData?.learning_category_titles?.[catKey] ||
                                  config.title
                                }
                                subtitle={config.subtitle}
                                onSave={(newTitle) => handleLearningCategoryTitleChange(catKey, newTitle)}
                                tooltip="Click to edit category heading"
                                color="#074568"
                              />
                            </Box>

                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => addLearning(catKey)}
                              sx={{ color: "#37AB79", textTransform: "none", fontWeight: 600 }}
                            >
                              Add
                            </Button>
                          </Box>

                          {/* Child Items Drag & Drop */}
                          <SortableContainer
                            items={sortableItems}
                            onReorder={(reordered) =>
                              handleReorderLearnings(catKey, reordered.map((r) => r.text))
                            }
                          >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                              {sortableItems.map(({ id, text }, idx) => (
                                <SortableItem key={id} id={id}>
                                  {({ attributes, listeners, isDragging }) => (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        p: 0.5,
                                        backgroundColor: isDragging ? "#eefbf4" : "transparent",
                                        borderRadius: 1.5,
                                        border: isDragging ? "2px dashed #37AB79" : "none",
                                        boxShadow: isDragging ? 3 : 0,
                                      }}
                                    >
                                      <DragHandle
                                        attributes={attributes}
                                        listeners={listeners}
                                        isDragging={isDragging}
                                        title="Drag to reorder learning"
                                      />
                                      <AccessibleReorderButtons
                                        isFirst={idx === 0}
                                        isLast={idx === items.length - 1}
                                        onMoveUp={() => handleMoveLearning(catKey, idx, -1)}
                                        onMoveDown={() => handleMoveLearning(catKey, idx, 1)}
                                      />
                                      <TextField
                                        size="small"
                                        fullWidth
                                        value={text}
                                        onChange={(e) => handleLearningChange(catKey, idx, e.target.value)}
                                      />
                                      <IconButton
                                        size="small"
                                        onClick={() => removeLearning(catKey, idx)}
                                        sx={{ color: "#dc2626" }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </SortableItem>
                              ))}
                            </Box>
                          </SortableContainer>
                        </Paper>
                      )}
                    </SortableItem>
                  );
                })}
              </Box>
            </SortableContainer>
          </Box>
        );
      }

      case "common-mistakes":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
              Section 09 · Common Mistakes to Avoid
            </Typography>

            <SectionHeaderEditCard
              sectionId="common-mistakes"
              label="09 · Common Mistakes"
              formData={formData}
              onHeaderChange={handleSectionHeaderChange}
              onSaveDirectly={handleSaveDirectHeader}
              dragHandleProps={dragHandleProps}
              reorderProps={reorderProps}
              positionLabel={positionLabel}
            />

            <Paper sx={{ p: 2.5, border: "1px solid #e0e6ed", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                    Common Mistakes to Avoid (Section 09)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Drag cards vertically to reorder pitfalls. Numbering updates automatically.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addMistake}
                  sx={{ color: "#37AB79", textTransform: "none", fontWeight: 600 }}
                >
                  Add Pitfall
                </Button>
              </Box>

              <SortableContainer
                items={formData.common_mistakes || formData.commonMistakes || []}
                onReorder={handleReorderMistakes}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {(formData.common_mistakes || formData.commonMistakes || []).map((m, idx) => (
                    <SortableItem key={m.id} id={m.id}>
                      {({ attributes, listeners, isDragging }) => (
                        <Paper
                          sx={{
                            p: 2,
                            border: isDragging ? "2px dashed #dc2626" : "1px solid #f0f0f0",
                            borderRadius: 1.5,
                            backgroundColor: isDragging ? "#fffaf0" : "#fff",
                            boxShadow: isDragging ? 4 : 0,
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <DragHandle
                                attributes={attributes}
                                listeners={listeners}
                                isDragging={isDragging}
                                title="Drag to reorder pitfall"
                                color="#dc2626"
                              />
                              <AccessibleReorderButtons
                                isFirst={idx === 0}
                                isLast={idx === (formData.common_mistakes || formData.commonMistakes || []).length - 1}
                                onMoveUp={() => handleMoveMistake(idx, -1)}
                                onMoveDown={() => handleMoveMistake(idx, 1)}
                                color="#dc2626"
                              />
                              <Typography sx={{ fontWeight: 700, color: "#dc2626" }}>
                                Pitfall
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Button
                                size="small"
                                variant={openMistakeLabelEdit === (m.id || idx) ? "contained" : "outlined"}
                                startIcon={<EditIcon sx={{ fontSize: 13 }} />}
                                onClick={() => setOpenMistakeLabelEdit(openMistakeLabelEdit === (m.id || idx) ? null : (m.id || idx))}
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.75rem",
                                  py: 0.3,
                                  px: 1.2,
                                  fontWeight: 600,
                                  borderColor: openMistakeLabelEdit === (m.id || idx) ? "#dc2626" : "#fecdd3",
                                  backgroundColor: openMistakeLabelEdit === (m.id || idx) ? "#dc2626" : "transparent",
                                  color: openMistakeLabelEdit === (m.id || idx) ? "#fff" : "#991b1b",
                                  "&:hover": {
                                    backgroundColor: openMistakeLabelEdit === (m.id || idx) ? "#b91c1c" : "#fff1f2",
                                    borderColor: "#dc2626",
                                  },
                                }}
                              >
                                {openMistakeLabelEdit === (m.id || idx) ? "Close Label Editor" : "Edit Field Labels"}
                              </Button>
                              <IconButton size="small" onClick={() => removeMistake(m.id || idx)} sx={{ color: "#dc2626" }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>

                          {/* Collapsible Mistake Label Editor Panel */}
                          {openMistakeLabelEdit === (m.id || idx) && (
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                mb: 2,
                                backgroundColor: "#fff1f2",
                                border: "1px solid #fecdd3",
                                borderRadius: 1.5,
                              }}
                            >
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#991b1b" }}>
                                  🏷️ Custom Field Labels for Pitfall {m.num || String(idx + 1).padStart(2, "0")}
                                </Typography>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => {
                                    handleMistakeChange(m.id || idx, "titleLabel", "");
                                    handleMistakeChange(m.id || idx, "descriptionLabel", "");
                                    handleMistakeChange(m.id || idx, "mistakeLabel", "");
                                    handleMistakeChange(m.id || idx, "whyLabel", "");
                                    handleMistakeChange(m.id || idx, "avoidLabel", "");
                                  }}
                                  sx={{ textTransform: "none", fontSize: "0.72rem", color: "#64748b" }}
                                >
                                  Reset to Defaults
                                </Button>
                              </Box>
                              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.2 }}>
                                <TextField
                                  size="small"
                                  label="Mistake Title Field Label"
                                  placeholder="Mistake Title"
                                  value={m.titleLabel || ""}
                                  onChange={(e) => handleMistakeChange(m.id || idx, "titleLabel", e.target.value)}
                                  helperText="Default: Mistake Title"
                                  sx={{ backgroundColor: "#fff" }}
                                />
                                <TextField
                                  size="small"
                                  label="Mistake Description Field Label"
                                  placeholder="Mistake Description"
                                  value={m.descriptionLabel || ""}
                                  onChange={(e) => handleMistakeChange(m.id || idx, "descriptionLabel", e.target.value)}
                                  helperText="Default: Mistake Description"
                                  sx={{ backgroundColor: "#fff" }}
                                />
                              </Box>
                            </Paper>
                          )}

                          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "80px 1fr" }, gap: 1.5, mb: 1.5 }}>
                            <TextField
                              size="small"
                              label="No."
                              value={m.num || String(idx + 1).padStart(2, "0")}
                              onChange={(e) => handleMistakeChange(m.id || idx, "num", e.target.value)}
                            />
                            <TextField
                              size="small"
                              label={m.titleLabel || "Mistake Title"}
                              value={m.title || ""}
                              onChange={(e) => handleMistakeChange(m.id || idx, "title", e.target.value)}
                            />
                          </Box>

                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mb: 0.6,
                                fontWeight: 600,
                                color: "#475569",
                                fontSize: "0.8rem",
                              }}
                            >
                              {m.descriptionLabel || "Mistake Description"}
                            </Typography>
                            <Box
                              sx={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #cbd5e1",
                                backgroundColor: "#fff",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                "&:focus-within": {
                                  borderColor: "#dc2626",
                                  boxShadow: "0 0 0 1px #dc2626",
                                },
                              }}
                            >
                              <Editor
                                key={`mistake-editor-${m.id || idx}`}
                                id={`mistake-desc-editor-${m.id || idx}`}
                                apiKey="9upr0hixy7g4w8g9mazmhkqgyl0m4kjvz623rjwvekg4l86k"
                                value={m.description || ""}
                                onEditorChange={(content) => handleMistakeChange(m.id || idx, "description", content)}
                                init={{
                                  height: 300,
                                  menubar: true,
                                  branding: false,
                                  promotion: false,
                                  statusbar: true,
                                  elementpath: true,
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
                                  toolbar:
                                    "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | " +
                                    "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                                    "table | link codesample removeformat code fullscreen | help",
                                  table_toolbar:
                                    "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | " +
                                    "tableinsertcolbefore tableinsertcolafter tabledeletecol | " +
                                    "tablecellprops tablerowprops tablemergecells tablesplitcells",
                                  content_style: `
                                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b; padding: 12px 14px; }
                                    p { margin: 0 0 10px 0; }
                                    p:last-child { margin-bottom: 0; }
                                    table { border-collapse: collapse; width: 100%; border: 1px solid #E2E8F0; }
                                    table td, table th { border: 1px solid #E2E8F0; padding: 6px 10px; }
                                    table th { background-color: #f1f5f9; color: #0f172a; font-weight: 600; }
                                    pre { background: #0F172A; color: #E2E8F0; padding: 10px; border-radius: 6px; overflow-x: auto; }
                                  `,
                                }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      )}
                    </SortableItem>
                  ))}
                </Box>
              </SortableContainer>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1440, mx: "auto", boxSizing: "border-box" }}>
      {/* ── Top Header Actions ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
          gap: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        {/* Left: Title & Subtitle */}
        <Box sx={{ minWidth: 0, flex: { md: "1 1 auto" } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => navigate("/admin/projects")}
              size="small"
              sx={{ color: "#074568", p: 0.5 }}
              aria-label="Back to projects"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#074568",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Project Details Editor
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mt: 0.5,
              ml: { xs: 0, sm: 4.5 },
              fontSize: { xs: "0.82rem", sm: "0.875rem" },
              lineHeight: 1.4,
            }}
          >
            Edit, reorder sections, format steps, and manage the full learning curriculum with drag-and-drop.
          </Typography>
        </Box>

        {/* Right: Project Selector & Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            width: { xs: "100%", md: "auto" },
            flexShrink: 0,
          }}
        >
          {/* Project Selector Dropdown */}
          <TextField
            select
            size="small"
            label="Selected Project"
            value={selectedSlug}
            onChange={(e) => handleSlugChange(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: 220, lg: 240 },
              flex: { xs: "1 1 100%", sm: "0 0 auto" },
              backgroundColor: "#fff",
              "& .MuiInputBase-root": { fontSize: "0.875rem" },
            }}
          >
            <MenuItem value={DEFAULT_SLUG}>Customer Churn Prediction</MenuItem>
            {projectDetailsList
              .filter((p) => p.slug !== DEFAULT_SLUG)
              .map((p) => (
                <MenuItem key={p.slug} value={p.slug}>
                  {p.title || p.slug}
                </MenuItem>
              ))}
            {wpProjects.map((p) => (
              <MenuItem key={p.post_name} value={p.post_name}>
                {p.post_title}
              </MenuItem>
            ))}
          </TextField>

          {/* Action Buttons Container */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: { xs: "100%", sm: "auto" },
              flex: { xs: "1 1 100%", sm: "0 0 auto" },
            }}
          >
            <Tooltip title="View live on website">
              <Button
                variant="outlined"
                size="medium"
                startIcon={<VisibilityIcon />}
                onClick={() => window.open(`/projects-details/${selectedSlug}`, "_blank")}
                sx={{
                  borderColor: "#37AB79",
                  color: "#37AB79",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  flex: { xs: 1, sm: "0 0 auto" },
                  whiteSpace: "nowrap",
                  py: 0.85,
                  px: 2,
                  "&:hover": {
                    borderColor: "#2d8a62",
                    backgroundColor: "#f0fdf4",
                  },
                }}
              >
                View Live
              </Button>
            </Tooltip>

            <Button
              variant="contained"
              size="medium"
              startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              disabled={isSaving}
              onClick={handleSave}
              sx={{
                backgroundColor: "#37AB79",
                "&:hover": { backgroundColor: "#2d8a62" },
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: { xs: 1, sm: "0 0 auto" },
                whiteSpace: "nowrap",
                py: 0.85,
                px: 2.5,
                boxShadow: "0 2px 4px rgba(55, 171, 121, 0.25)",
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── Main Editor Card ── */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e6ed", borderRadius: 3, overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
        {/* Navigation Bar & Mode Switcher */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e6ed",
            backgroundColor: "#f9fafb",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Scrollable Tabs */}
          <Box sx={{ flex: 1, minWidth: 0, width: "100%", overflow: "hidden" }}>
            <Tabs
              value={tabIndex}
              onChange={(e, val) => {
                setTabIndex(val);
                if (viewMode === "all") setViewMode("tabs");
              }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                width: "100%",
                minHeight: 48,
                "& .MuiTabs-scroller": {
                  overflowX: "auto !important",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  minHeight: 48,
                  py: 1,
                  px: { xs: 1.5, sm: 2 },
                  whiteSpace: "nowrap",
                  color: "#64748b",
                  "&.Mui-selected": {
                    color: "#37AB79",
                    fontWeight: 700,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#37AB79",
                  height: 3,
                },
                "& .MuiTabs-scrollButtons": {
                  color: "#074568",
                  "&.Mui-disabled": { opacity: 0.3 },
                },
              }}
            >
              <Tab label="Header & Meta" />
              {sectionsOrder.map((secId, idx) => {
                const meta = SECTION_METAS[secId] || { name: secId, label: secId };
                const currentHdr = formData?.section_headers?.[secId] || DEFAULT_SECTION_HEADERS[secId];
                const displayLabel = currentHdr?.title
                  ? currentHdr.title.replace(/^\d{2}\s*·\s*/, `${String(idx + 1).padStart(2, "0")} · `)
                  : `${String(idx + 1).padStart(2, "0")} · ${meta.name}`;
                return <Tab key={secId} label={displayLabel} />;
              })}
              <Tab label="Sidebar Content Management" />
            </Tabs>
          </Box>

          {/* View Mode Toggle Buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 1,
              px: { xs: 1.5, sm: 2 },
              borderTop: { xs: "1px solid #e0e6ed", md: "none" },
              borderLeft: { md: "1px solid #e0e6ed" },
              flexShrink: 0,
              justifyContent: { xs: "flex-end", md: "center" },
              backgroundColor: { xs: "#f8fafc", md: "transparent" },
            }}
          >
            <Button
              size="small"
              variant={viewMode === "tabs" ? "contained" : "outlined"}
              startIcon={<ViewListIcon sx={{ fontSize: "16px !important" }} />}
              onClick={() => setViewMode("tabs")}
              sx={{
                textTransform: "none",
                fontSize: "0.78rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                backgroundColor: viewMode === "tabs" ? "#37AB79" : "transparent",
                color: viewMode === "tabs" ? "#fff" : "#475569",
                borderColor: "#cbd5e1",
                py: 0.5,
                px: 1.5,
                "&:hover": {
                  backgroundColor: viewMode === "tabs" ? "#2d8a62" : "#f1f5f9",
                  borderColor: viewMode === "tabs" ? "#2d8a62" : "#94a3b8",
                },
              }}
            >
              Tab View
            </Button>
            <Button
              size="small"
              variant={viewMode === "all" ? "contained" : "outlined"}
              startIcon={<ViewStreamIcon sx={{ fontSize: "16px !important" }} />}
              onClick={() => setViewMode("all")}
              sx={{
                textTransform: "none",
                fontSize: "0.78rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                backgroundColor: viewMode === "all" ? "#37AB79" : "transparent",
                color: viewMode === "all" ? "#fff" : "#475569",
                borderColor: "#cbd5e1",
                py: 0.5,
                px: 1.5,
                "&:hover": {
                  backgroundColor: viewMode === "all" ? "#2d8a62" : "#f1f5f9",
                  borderColor: viewMode === "all" ? "#2d8a62" : "#94a3b8",
                },
              }}
            >
              All Sections (Drag to Reorder)
            </Button>
          </Box>
        </Box>

        {/* Quick Reorder Bar (Visible in Tabs View) */}
        {viewMode === "tabs" && (
          <Box
            sx={{
              px: { xs: 1.5, sm: 2.5 },
              py: 1.5,
              backgroundColor: "#f0fdf4",
              borderBottom: "1px solid #bbf7d0",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 1.5,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#166534",
                fontWeight: 700,
                fontSize: "0.82rem",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <SwapVertIcon fontSize="small" />
              <span>Drag to Reorder Sections:</span>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
              <SortableContainer
                items={sectionsOrder.map((id) => ({ id }))}
                onReorder={(reordered) => handleReorderSections(reordered.map((r) => r.id))}
                strategy={rectSortingStrategy}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  {sectionsOrder.map((secId, idx) => {
                    const secMeta = SECTION_METAS[secId] || { name: secId };
                    const numStr = String(idx + 1).padStart(2, "0");
                    const isActiveTab = tabIndex === idx + 1;
                    return (
                      <SortableItem key={secId} id={secId}>
                        {({ attributes, listeners, isDragging }) => (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              backgroundColor: isDragging ? "#dcfce7" : isActiveTab ? "#e8fbf0" : "#fff",
                              border: isDragging ? "2px dashed #16a34a" : isActiveTab ? "2px solid #37AB79" : "1px solid #86efac",
                              borderRadius: "16px",
                              px: 1,
                              py: 0.25,
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "#166534",
                              boxShadow: isDragging ? 3 : "0 1px 2px rgba(0,0,0,0.05)",
                              transition: "all 0.15s ease",
                              maxWidth: "100%",
                              boxSizing: "border-box",
                            }}
                          >
                            <DragHandle
                              attributes={attributes}
                              listeners={listeners}
                              isDragging={isDragging}
                              title="Drag to reorder section"
                              color="#16a34a"
                            />
                            <span
                              style={{
                                cursor: "pointer",
                                userSelect: "none",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              onClick={() => setTabIndex(idx + 1)}
                              title="Click to view tab"
                            >
                              {numStr} · {secMeta.name}
                            </span>
                            <AccessibleReorderButtons
                              isFirst={idx === 0}
                              isLast={idx === sectionsOrder.length - 1}
                              onMoveUp={() => handleMoveSection(idx, -1)}
                              onMoveDown={() => handleMoveSection(idx, 1)}
                              color="#16a34a"
                            />
                          </Box>
                        )}
                      </SortableItem>
                    );
                  })}
                </Box>
              </SortableContainer>
            </Box>
          </Box>
        )}

        {formData && (
          <Box sx={{ p: { xs: 2, sm: 3 }, width: "100%", boxSizing: "border-box" }}>
            {viewMode === "tabs" ? (
              <>
                {/* ── TAB 0: Header & Meta ── */}
                {tabIndex === 0 && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                      Project Header & Core Metadata
                    </Typography>

                    <TextField
                      label="Project Title"
                      fullWidth
                      value={formData.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      helperText="The main title displayed at the top of the project detail page."
                    />

                    <TextField
                      label="URL Slug (Unique)"
                      fullWidth
                      value={formData.slug || ""}
                      onChange={(e) => handleFieldChange("slug", e.target.value)}
                      helperText="URL path slug (e.g. customer-churn-prediction-using-machine-learning)"
                    />

                    <TextField
                      label="Subtitle / Lead Description"
                      fullWidth
                      multiline
                      rows={2}
                      value={formData.subtitle || ""}
                      onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                    />

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                      <TextField
                        select
                        label="Difficulty Level"
                        value={formData.level || "Intermediate"}
                        onChange={(e) => handleFieldChange("level", e.target.value)}
                      >
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                      </TextField>

                      <TextField
                        label="Estimated Duration"
                        value={formData.duration || "8–12 Hours"}
                        onChange={(e) => handleFieldChange("duration", e.target.value)}
                        helperText="e.g. 8–12 Hours, 2 Weeks, etc."
                      />

                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <TextField
                          select
                          fullWidth
                          label="Domain"
                          value={formData.domain || ""}
                          onChange={(e) => handleFieldChange("domain", e.target.value)}
                          helperText="e.g. Data Science, Web Development, IoT & Embedded"
                          SelectProps={{
                            displayEmpty: true,
                          }}
                          sx={{
                            backgroundColor: "#fff",
                            "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <span style={{ color: "#94a3b8" }}>Select Domain</span>
                          </MenuItem>
                          {domainOptionsList.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                              {opt === formData?.domain && !DOMAIN_OPTIONS.includes(opt) ? " (Custom / Legacy)" : ""}
                            </MenuItem>
                          ))}
                        </TextField>

                        {formData.domain === "Other" && (
                          <TextField
                            size="small"
                            label="Specify Other Domain"
                            placeholder="Enter custom domain"
                            value={formData.custom_domain || ""}
                            onChange={(e) => handleFieldChange("custom_domain", e.target.value)}
                            helperText="Specify the domain name"
                            sx={{ mt: 1.5, backgroundColor: "#fff" }}
                          />
                        )}
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <TextField
                          select
                          fullWidth
                          label="Project Type"
                          value={formData.project_type || ""}
                          onChange={(e) => handleFieldChange("project_type", e.target.value)}
                          helperText="e.g. Machine Learning, Full Stack App, Computer Vision"
                          SelectProps={{
                            displayEmpty: true,
                          }}
                          sx={{
                            backgroundColor: "#fff",
                            "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <span style={{ color: "#94a3b8" }}>Select Project Type</span>
                          </MenuItem>
                          {projectTypeOptionsList.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                              {opt === formData?.project_type && !PROJECT_TYPE_OPTIONS.includes(opt) ? " (Custom / Legacy)" : ""}
                            </MenuItem>
                          ))}
                        </TextField>

                        {formData.project_type === "Other" && (
                          <TextField
                            size="small"
                            label="Specify Other Project Type"
                            placeholder="Enter custom project type"
                            value={formData.custom_project_type || ""}
                            onChange={(e) => handleFieldChange("custom_project_type", e.target.value)}
                            helperText="Specify the project type"
                            sx={{ mt: 1.5, backgroundColor: "#fff" }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* ── TABS 1..9: Active Section ── */}
                {tabIndex > 0 && tabIndex <= sectionsOrder.length && (
                  (() => {
                    const activeSecId = sectionsOrder[tabIndex - 1];
                    const secIdx = tabIndex - 1;
                    return renderSectionContent(activeSecId, {
                      reorderProps: {
                        isFirst: secIdx === 0,
                        isLast: secIdx === sectionsOrder.length - 1,
                        onMoveUp: () => {
                          handleMoveSection(secIdx, -1);
                          setTabIndex(Math.max(1, tabIndex - 1));
                        },
                        onMoveDown: () => {
                          handleMoveSection(secIdx, 1);
                          setTabIndex(Math.min(sectionsOrder.length, tabIndex + 1));
                        },
                      },
                      positionLabel: `Section ${String(secIdx + 1).padStart(2, "0")} of 09`,
                    });
                  })()
                )}

                {/* ── TAB sectionsOrder.length + 1: Sidebar Content Management ── */}
                {tabIndex === sectionsOrder.length + 1 && (
                  <SidebarContentManager
                    sidebarCards={formData.sidebar_cards}
                    onChange={handleSidebarCardsChange}
                    onSave={handleSaveSidebarCards}
                    isSaving={isSaving}
                    projectDetailsList={projectDetailsList}
                    wpProjects={wpProjects}
                  />
                )}
              </>
            ) : (
              /* ── ALL SECTIONS DRAGGABLE VIEW ── */
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Box sx={{ p: 2, backgroundColor: "#f0fdf4", borderRadius: 2, border: "1px solid #bbf7d0" }}>
                  <Typography sx={{ fontWeight: 700, color: "#166534", mb: 0.5 }}>
                    ⠿ Full Page Section Reordering Mode
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#15803d" }}>
                    Drag any entire section up or down using the six-dot drag handle on its header. All child steps, cards, and editable headings move together smoothly and save automatically to the database.
                  </Typography>
                </Box>

                <SortableContainer
                  items={sectionsOrder.map((id) => ({ id }))}
                  onReorder={(reordered) => handleReorderSections(reordered.map((r) => r.id))}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
                    {sectionsOrder.map((secId, secIdx) => {
                      const posLabel = `Section ${String(secIdx + 1).padStart(2, "0")} of 09`;
                      return (
                        <SortableItem key={secId} id={secId}>
                          {({ attributes, listeners, isDragging }) => (
                            <Paper
                              elevation={0}
                              sx={{
                                p: 3,
                                border: isDragging ? "2px dashed #37AB79" : "1px solid #e0e6ed",
                                borderRadius: 2.5,
                                backgroundColor: isDragging ? "#f8fafc" : "#fff",
                                boxShadow: isDragging ? 5 : 0,
                                transition: "all 0.2s ease",
                              }}
                            >
                              {renderSectionContent(secId, {
                                dragHandleProps: { attributes, listeners, isDragging },
                                reorderProps: {
                                  isFirst: secIdx === 0,
                                  isLast: secIdx === sectionsOrder.length - 1,
                                  onMoveUp: () => handleMoveSection(secIdx, -1),
                                  onMoveDown: () => handleMoveSection(secIdx, 1),
                                },
                                positionLabel: posLabel,
                              })}
                            </Paper>
                          )}
                        </SortableItem>
                      );
                    })}
                  </Box>
                </SortableContainer>

                {/* ── Sidebar Content Management in All-Sections Mode ── */}
                <Divider sx={{ my: 1 }} />
                <SidebarContentManager
                  sidebarCards={formData.sidebar_cards}
                  onChange={handleSidebarCardsChange}
                  onSave={handleSaveSidebarCards}
                  isSaving={isSaving}
                  projectDetailsList={projectDetailsList}
                  wpProjects={wpProjects}
                />
              </Box>
            )}

            {/* Bottom Save Action Bar */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => refetch()}
                sx={{ textTransform: "none", color: "#666", borderColor: "#ccc" }}
              >
                Reset to Saved
              </Button>
              <Button
                variant="contained"
                startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                disabled={isSaving}
                onClick={handleSave}
                sx={{
                  backgroundColor: "#37AB79",
                  "&:hover": { backgroundColor: "#2d8a62" },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                }}
              >
                {isSaving ? "Saving..." : "Save Project Details"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
