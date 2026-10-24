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
  CircularProgress,
  IconButton,
  Paper,
  Divider,
  Alert,
  Tooltip,
  Chip,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CodeIcon from "@mui/icons-material/Code";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TableChartIcon from "@mui/icons-material/TableChart";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";

import {
  useInterviewDetails,
  useInterviewDetailsList,
  useUpdateInterviewDetails,
  useCreateInterviewDetails,
} from "../../../../services/interviewsServices";
import { useNotification } from "../../../../context/useNotificationContext";
import { Editor } from "@tinymce/tinymce-react";

const TINYMCE_API_KEY = "9upr0hixy7g4w8g9mazmhkqgyl0m4kjvz623rjwvekg4l86k";

const DEFAULT_SECTION_HEADERS = {
  "must-know": {
    title: "01 · Must-Know Questions",
    subtitle: "Essential concepts every candidate must know before stepping into the interview.",
  },
  "questions-answers": {
    title: "02 · Questions & Answers",
    subtitle: "Comprehensive questions categorized by experience level from fundamental to advanced.",
  },
  "scenario-based": {
    title: "03 · Scenario-Based Interview Questions",
    subtitle: "Real-world production engineering trade-offs, debugging, and system decisions.",
  },
  "coding-questions": {
    title: "04 · Practical & Coding Questions",
    subtitle: "Core algorithmic patterns and practical Python/NumPy implementations.",
  },
  "common-mistakes": {
    title: "05 · Common Interview Mistakes",
    subtitle: "Pitfalls to avoid and recommended interview practices that interviewers look for.",
  },
  "quick-revision": {
    title: "06 · Quick Revision",
    subtitle: "Fast memory refresher of essential terminology, formulas, and definitions.",
  },
};

const DEFAULT_SECTIONS_ORDER = [
  "must-know",
  "questions-answers",
  "scenario-based",
  "coding-questions",
  "common-mistakes",
  "quick-revision",
];

const SECTION_META = {
  "must-know": { label: "Must-Know Questions", icon: <HelpOutlineIcon fontSize="small" /> },
  "questions-answers": { label: "Questions & Answers", icon: <MenuBookIcon fontSize="small" /> },
  "scenario-based": { label: "Scenario-Based", icon: <PsychologyIcon fontSize="small" /> },
  "coding-questions": { label: "Coding Questions", icon: <CodeIcon fontSize="small" /> },
  "common-mistakes": { label: "Common Mistakes", icon: <WarningAmberIcon fontSize="small" /> },
  "quick-revision": { label: "Quick Revision", icon: <TableChartIcon fontSize="small" /> },
};

export default function AdminInterviewDetails() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [selectedSlug, setSelectedSlug] = useState(
    idOrSlug || "machine-learning-interview-questions-answers"
  );
  const [activeTab, setActiveTab] = useState(0);
  const [activeMode, setActiveMode] = useState("tab"); // "tab" | "all"
  const [qaFilterTab, setQaFilterTab] = useState("all");

  const { data: interviewList = [], refetch: refetchList } = useInterviewDetailsList();
  const { data: currentData, isLoading, refetch } = useInterviewDetails(selectedSlug);
  const { mutateAsync: updateDetails, isPending: isUpdating } = useUpdateInterviewDetails();
  const { mutateAsync: createDetails, isPending: isCreating } = useCreateInterviewDetails();

  const isSaving = isUpdating || isCreating;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    author: "PrepHQ Editorial Team",
    publication_date: "24 Oct, 2026",
    status: "published",
    level: "All Levels",
    domain: "Machine Learning",
    seo_title: "",
    meta_description: "",
    keywords: "",
    must_know_questions: [],
    qa_questions: [],
    scenario_questions: [],
    coding_questions: [],
    common_mistakes: [],
    quick_revision: [],
    section_headers: DEFAULT_SECTION_HEADERS,
    sections_order: DEFAULT_SECTIONS_ORDER,
    sidebar_cards: {
      related_interviews: [],
      tutorials: [],
      mini_guides: [],
    },
  });

  // Sync state when DB data loads
  useEffect(() => {
    if (currentData) {
      setFormData({
        title: currentData.title || "",
        slug: currentData.slug || selectedSlug,
        subtitle: currentData.subtitle || "",
        description: currentData.description || "",
        author: currentData.author || "PrepHQ Editorial Team",
        publication_date: currentData.publication_date || "24 Oct, 2026",
        status: currentData.status || "published",
        level: currentData.level || "All Levels",
        domain: currentData.domain || "Machine Learning",
        seo_title: currentData.seo_title || "",
        meta_description: currentData.meta_description || "",
        keywords: currentData.keywords || "",
        must_know_questions: currentData.must_know_questions || [],
        qa_questions: currentData.qa_questions || [],
        scenario_questions: currentData.scenario_questions || [],
        coding_questions: currentData.coding_questions || [],
        common_mistakes: currentData.common_mistakes || [],
        quick_revision: currentData.quick_revision || [],
        section_headers: {
          ...DEFAULT_SECTION_HEADERS,
          ...(currentData.section_headers || {}),
        },
        sections_order:
          currentData.sections_order && currentData.sections_order.length > 0
            ? currentData.sections_order
            : DEFAULT_SECTIONS_ORDER,
        sidebar_cards: currentData.sidebar_cards || {
          related_interviews: [],
          tutorials: [],
          mini_guides: [],
        },
      });
    }
  }, [currentData, selectedSlug]);

  const handleSlugChange = (newSlug) => {
    if (newSlug === "__new__") {
      const uniqueSlug = `interview-page-${Date.now()}`;
      setFormData({
        title: "New Interview Questions & Answers",
        slug: uniqueSlug,
        subtitle: "A practical collection of interview questions covering core concepts and solutions.",
        description: "",
        author: "PrepHQ Editorial Team",
        publication_date: "24 Oct, 2026",
        status: "published",
        level: "All Levels",
        domain: "Machine Learning",
        seo_title: "",
        meta_description: "",
        keywords: "",
        must_know_questions: [],
        qa_questions: [],
        scenario_questions: [],
        coding_questions: [],
        common_mistakes: [],
        quick_revision: [],
        section_headers: DEFAULT_SECTION_HEADERS,
        sections_order: DEFAULT_SECTIONS_ORDER,
        sidebar_cards: {
          related_interviews: [],
          tutorials: [],
          mini_guides: [],
        },
      });
      setSelectedSlug(uniqueSlug);
      navigate(`/admin/interviews/details/${uniqueSlug}`);
      return;
    }
    setSelectedSlug(newSlug);
    navigate(`/admin/interviews/details/${newSlug}`);
  };

  // Section header edit helper
  const handleSectionHeaderChange = (secKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      section_headers: {
        ...prev.section_headers,
        [secKey]: {
          ...(prev.section_headers?.[secKey] || DEFAULT_SECTION_HEADERS[secKey]),
          [field]: value,
        },
      },
    }));
  };

  // Reordering array helper
  const moveItem = (listKey, index, direction) => {
    setFormData((prev) => {
      const list = [...(prev[listKey] || [])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, [listKey]: list };
    });
  };

  // Reorder sections helper
  const moveSection = (index, direction) => {
    setFormData((prev) => {
      const order = [...(prev.sections_order || DEFAULT_SECTIONS_ORDER)];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= order.length) return prev;
      const temp = order[index];
      order[index] = order[targetIndex];
      order[targetIndex] = temp;
      return { ...prev, sections_order: order };
    });
  };

  // ── 1. Must-Know Handlers ──────────────────────────────────────────────────
  const addMustKnow = () => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `mk-${Date.now()}`,
        num: nextNum,
        question: "New Question Title",
        default_open: false,
        simple_definition: "",
        explanation: "",
        highlight_box: "",
        example: "",
        interview_tip: "",
      });
      return { ...prev, must_know_questions: list };
    });
  };

  const updateMustKnow = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, must_know_questions: list };
    });
  };

  const deleteMustKnow = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      list.splice(idx, 1);
      return { ...prev, must_know_questions: list };
    });
  };

  // ── 2. Q&A Handlers ────────────────────────────────────────────────────────
  const addQA = () => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `qa-${Date.now()}`,
        num: nextNum,
        difficulty: qaFilterTab !== "all" ? qaFilterTab : "beginner",
        question: "New Question Title",
        answer: "",
        explanation: "",
        highlight_box: "",
        example: "",
        interview_tip: "",
        code_snippet: "",
      });
      return { ...prev, qa_questions: list };
    });
  };

  const updateQA = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, qa_questions: list };
    });
  };

  const deleteQA = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      list.splice(idx, 1);
      return { ...prev, qa_questions: list };
    });
  };

  // ── 3. Scenario Handlers ───────────────────────────────────────────────────
  const addScenario = () => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `sc-${Date.now()}`,
        num: nextNum,
        question: "New Scenario Question",
        default_open: false,
        problem_context: "",
        investigation_approach: "",
        recommended_solution: "",
        expected_outcome: "",
      });
      return { ...prev, scenario_questions: list };
    });
  };

  const updateScenario = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, scenario_questions: list };
    });
  };

  const deleteScenario = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      list.splice(idx, 1);
      return { ...prev, scenario_questions: list };
    });
  };

  // ── 4. Coding Handlers ─────────────────────────────────────────────────────
  const addCoding = () => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `code-${Date.now()}`,
        num: nextNum,
        question: "New Coding Challenge",
        default_open: false,
        problem_statement: "",
        difficulty: "Easy",
        language: "python",
        approach: "",
        code: `# Write solution here\n`,
        explanation: "",
        time_complexity: "O(n)",
        space_complexity: "O(1)",
        sample_input: "",
        sample_output: "",
      });
      return { ...prev, coding_questions: list };
    });
  };

  const updateCoding = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, coding_questions: list };
    });
  };

  const deleteCoding = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      list.splice(idx, 1);
      return { ...prev, coding_questions: list };
    });
  };

  // ── 5. Common Mistakes Handlers ────────────────────────────────────────────
  const addMistake = () => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `cm-${Date.now()}`,
        num: nextNum,
        title: "New Common Mistake",
        default_open: false,
        mistake: "",
        why_it_happens: "",
        how_to_avoid: "",
        recommendation: "",
      });
      return { ...prev, common_mistakes: list };
    });
  };

  const updateMistake = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, common_mistakes: list };
    });
  };

  const deleteMistake = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      list.splice(idx, 1);
      return { ...prev, common_mistakes: list };
    });
  };

  // ── 6. Quick Revision Handlers ─────────────────────────────────────────────
  const addRevisionRow = () => {
    setFormData((prev) => {
      const list = [...(prev.quick_revision || [])];
      list.push({
        id: `rev-${Date.now()}`,
        concept: "",
        explanation: "",
      });
      return { ...prev, quick_revision: list };
    });
  };

  const updateRevisionRow = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.quick_revision || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, quick_revision: list };
    });
  };

  const deleteRevisionRow = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.quick_revision || [])];
      list.splice(idx, 1);
      return { ...prev, quick_revision: list };
    });
  };

  // ── 7. Sidebar Card Handlers ───────────────────────────────────────────────
  const addSidebarCard = (typeKey) => {
    setFormData((prev) => {
      const currentCards = prev.sidebar_cards?.[typeKey] || [];
      const newCard = {
        id: `card-${Date.now()}`,
        title: "New Card Title",
        display_date: "24 Oct, 2026",
        destination_url: "/interviews",
        status: "active",
        is_active: true,
      };
      return {
        ...prev,
        sidebar_cards: {
          ...prev.sidebar_cards,
          [typeKey]: [...currentCards, newCard],
        },
      };
    });
  };

  const updateSidebarCard = (typeKey, idx, field, val) => {
    setFormData((prev) => {
      const currentCards = [...(prev.sidebar_cards?.[typeKey] || [])];
      currentCards[idx] = { ...currentCards[idx], [field]: val };
      return {
        ...prev,
        sidebar_cards: {
          ...prev.sidebar_cards,
          [typeKey]: currentCards,
        },
      };
    });
  };

  const deleteSidebarCard = (typeKey, idx) => {
    setFormData((prev) => {
      const currentCards = [...(prev.sidebar_cards?.[typeKey] || [])];
      currentCards.splice(idx, 1);
      return {
        ...prev,
        sidebar_cards: {
          ...prev.sidebar_cards,
          [typeKey]: currentCards,
        },
      };
    });
  };

  // ── Main Save Handler ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.title.trim()) {
      showNotification("Interview page title is required", "danger");
      return;
    }

    try {
      const payload = {
        ...formData,
        slug: formData.slug.trim(),
        title: formData.title.trim(),
      };

      if (currentData && (currentData.id || currentData.slug)) {
        await updateDetails({
          slugOrId: formData.slug || selectedSlug,
          data: payload,
        });
      } else {
        await createDetails(payload);
      }
      refetchList();
      refetch();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Helper render for section headers
  const renderSectionHeaderBox = (secKey, defaultLabel) => {
    const header = formData.section_headers?.[secKey] || DEFAULT_SECTION_HEADERS[secKey];
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2.5, backgroundColor: "#f8fafc", borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568", mb: 1 }}>
          {defaultLabel} Heading & Subtitle
        </Typography>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
          <TextField
            size="small"
            label="Section Title"
            value={header.title || ""}
            onChange={(e) => handleSectionHeaderChange(secKey, "title", e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Section Subtitle"
            value={header.subtitle || ""}
            onChange={(e) => handleSectionHeaderChange(secKey, "subtitle", e.target.value)}
            sx={{ flex: 2 }}
          />
        </Box>
      </Paper>
    );
  };

  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* ── Top Header Bar ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton onClick={() => navigate("/admin/interviews/list")} sx={{ color: "#074568" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#074568" }}>
              Interview Questions Editor
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Edit, reorder sections, manage questions, scenarios, coding challenges, and widgets.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          {/* Interview Page Dropdown Selector */}
          <FormControl size="small" sx={{ minWidth: 260 }}>
            <InputLabel id="select-interview-label">Selected Interview Page</InputLabel>
            <Select
              labelId="select-interview-label"
              value={selectedSlug}
              label="Selected Interview Page"
              onChange={(e) => handleSlugChange(e.target.value)}
              sx={{ backgroundColor: "#ffffff" }}
            >
              {interviewList.map((item) => (
                <MenuItem key={item.slug || item.id} value={item.slug || String(item.id)}>
                  {item.title} ({item.slug})
                </MenuItem>
              ))}
              <Divider />
              <MenuItem value="__new__" sx={{ color: "#37AB79", fontWeight: 600 }}>
                + Create New Interview Page
              </MenuItem>
            </Select>
          </FormControl>

          {/* View Live */}
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => window.open(`/interviews/${formData.slug || selectedSlug}`, "_blank")}
            sx={{
              borderColor: "#37AB79",
              color: "#37AB79",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { borderColor: "#2d8a62", backgroundColor: "#f0fdf4" },
            }}
          >
            View Live
          </Button>

          {/* Save Button */}
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
              px: 3,
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>

      {/* ── Main Container Paper ── */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e6ed", borderRadius: 3, overflow: "hidden" }}>
        {/* Navigation Row & Mode Switcher */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e6ed",
            backgroundColor: "#f9fafb",
            px: 2,
            py: 0.5,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {activeMode === "tab" ? (
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  minHeight: 48,
                },
                "& .Mui-selected": { color: "#37AB79" },
                "& .MuiTabs-indicator": { backgroundColor: "#37AB79" },
              }}
            >
              <Tab label="Header & Meta" />
              <Tab label="01 · Must-Know Questions" />
              <Tab label="02 · Questions & Answers" />
              <Tab label="03 · Scenario-Based" />
              <Tab label="04 · Coding Questions" />
              <Tab label="05 · Common Mistakes" />
              <Tab label="06 · Quick Revision" />
              <Tab label="Sidebar & Widgets" />
            </Tabs>
          ) : (
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568", py: 1.5 }}>
              All Sections Mode (Reorder Sections)
            </Typography>
          )}

          {/* Mode Switcher */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant={activeMode === "tab" ? "contained" : "outlined"}
              startIcon={<ViewStreamIcon />}
              onClick={() => setActiveMode("tab")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: activeMode === "tab" ? "#37AB79" : "transparent",
                color: activeMode === "tab" ? "#fff" : "#64748b",
                borderColor: "#cbd5e1",
                "&:hover": {
                  backgroundColor: activeMode === "tab" ? "#2d8a62" : "#f1f5f9",
                  borderColor: "#37AB79",
                },
              }}
            >
              Tab View
            </Button>
            <Button
              size="small"
              variant={activeMode === "all" ? "contained" : "outlined"}
              startIcon={<ViewListIcon />}
              onClick={() => setActiveMode("all")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: activeMode === "all" ? "#37AB79" : "transparent",
                color: activeMode === "all" ? "#fff" : "#64748b",
                borderColor: "#cbd5e1",
                "&:hover": {
                  backgroundColor: activeMode === "all" ? "#2d8a62" : "#f1f5f9",
                  borderColor: "#37AB79",
                },
              }}
            >
              All Sections (Reorder)
            </Button>
          </Box>
        </Box>

        {/* ── Mode 2: Reorder Sections Bar ── */}
        {activeMode === "all" && (
          <Box sx={{ p: 2, backgroundColor: "#f0fdf4", borderBottom: "1px solid #bbf7d0" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#166534", mb: 1 }}>
              Drag or use arrows to reorder content sections on the public interview page:
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {(formData.sections_order || DEFAULT_SECTIONS_ORDER).map((secKey, idx) => (
                <Chip
                  key={secKey}
                  icon={SECTION_META[secKey]?.icon || <HelpOutlineIcon />}
                  label={`${idx + 1}. ${SECTION_META[secKey]?.label || secKey}`}
                  onDelete={undefined}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "#ffffff",
                    border: "1px solid #86efac",
                    color: "#166534",
                    pr: 1,
                  }}
                  deleteIcon={
                    <Box sx={{ display: "flex", gap: 0.2 }}>
                      <IconButton
                        size="small"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, -1)}
                        sx={{ p: 0.2 }}
                      >
                        <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={idx === (formData.sections_order || DEFAULT_SECTIONS_ORDER).length - 1}
                        onClick={() => moveSection(idx, 1)}
                        sx={{ p: 0.2 }}
                      >
                        <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  }
                />
              ))}
            </Box>
          </Box>
        )}

        {/* ── Content Body ── */}
        {isLoading ? (
          <Box sx={{ p: 6, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size={32} sx={{ color: "#37AB79" }} />
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* ── TAB 0: Header & Meta ── */}
            {(activeMode === "all" || activeTab === 0) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568", mb: 2 }}>
                  Interview Page Information & Metadata
                </Typography>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Interview Page Title *"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        helperText="The main title displayed at the top of the interview page"
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="URL Slug *"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        helperText="URL path: /interviews/:slug"
                      />
                    </Box>

                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      label="Introduction / Subtitle Description"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      helperText="Introductory lead paragraph displayed right below the title"
                    />

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Domain"
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Difficulty Level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Publication Date"
                        value={formData.publication_date}
                        onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                      />
                    </Box>

                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568" }}>
                      SEO & Social Metadata
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="SEO Meta Title"
                        value={formData.seo_title}
                        onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Keywords / Tags"
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      />
                    </Box>

                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      label="SEO Meta Description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    />
                  </Box>
                </Paper>
              </Box>
            )}

            {/* ── TAB 1: 01 · Must-Know Questions ── */}
            {(activeMode === "all" || activeTab === 1) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                      Section 01 · Must-Know Questions ({formData.must_know_questions?.length || 0})
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Top priority interview questions with expandable definition, detailed explanation, and takeaway boxes.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addMustKnow}
                    sx={{ backgroundColor: "#37AB79", "&:hover": { backgroundColor: "#2d8a62" }, textTransform: "none" }}
                  >
                    + Add Question
                  </Button>
                </Box>

                {renderSectionHeaderBox("must-know", "01 · Must-Know Questions")}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {(formData.must_know_questions || []).map((item, idx) => (
                    <Paper key={item.id || idx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: "#ffffff" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip label={`#${item.num || idx + 1}`} size="small" sx={{ fontWeight: 700, backgroundColor: "#e0f2fe", color: "#0369a1" }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568" }}>
                            {item.question || "Untitled Question"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <IconButton size="small" disabled={idx === 0} onClick={() => moveItem("must_know_questions", idx, -1)}>
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" disabled={idx === (formData.must_know_questions || []).length - 1} onClick={() => moveItem("must_know_questions", idx, 1)}>
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteMustKnow(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Question Title"
                          value={item.question || ""}
                          onChange={(e) => updateMustKnow(idx, "question", e.target.value)}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Simple Definition / Short Answer"
                          value={item.simple_definition || ""}
                          onChange={(e) => updateMustKnow(idx, "simple_definition", e.target.value)}
                        />

                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", display: "block", mb: 0.5 }}>
                            Detailed Explanation (Rich-Text)
                          </Typography>
                          <Box sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5, overflow: "hidden" }}>
                            <Editor
                              apiKey={TINYMCE_API_KEY}
                              value={item.explanation || ""}
                              init={{
                                height: 180,
                                menubar: false,
                                plugins: ["lists", "link", "code"],
                                toolbar: "undo redo | bold italic underline | bullist numlist | code",
                              }}
                              onEditorChange={(content) => updateMustKnow(idx, "explanation", content)}
                            />
                          </Box>
                        </Box>

                        <TextField
                          fullWidth
                          size="small"
                          label="What Your Answer Should Show / Key Takeaway (Highlighted Callout Box)"
                          value={item.highlight_box || ""}
                          onChange={(e) => updateMustKnow(idx, "highlight_box", e.target.value)}
                          sx={{ backgroundColor: "#f0fdf4" }}
                        />

                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Practical Example"
                            value={item.example || ""}
                            onChange={(e) => updateMustKnow(idx, "example", e.target.value)}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Interview Tip"
                            value={item.interview_tip || ""}
                            onChange={(e) => updateMustKnow(idx, "interview_tip", e.target.value)}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            {/* ── TAB 2: 02 · Questions & Answers ── */}
            {(activeMode === "all" || activeTab === 2) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                      Section 02 · Questions & Answers ({formData.qa_questions?.length || 0})
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Filterable questions by difficulty (Beginner, Intermediate, Advanced) with answers and explanations.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addQA}
                    sx={{ backgroundColor: "#37AB79", "&:hover": { backgroundColor: "#2d8a62" }, textTransform: "none" }}
                  >
                    + Add Q&A Item
                  </Button>
                </Box>

                {renderSectionHeaderBox("questions-answers", "02 · Questions & Answers")}

                {/* Difficulty Filter Tabs */}
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
                    <Chip
                      key={lvl}
                      label={lvl.toUpperCase()}
                      clickable
                      onClick={() => setQaFilterTab(lvl)}
                      color={qaFilterTab === lvl ? "success" : "default"}
                      variant={qaFilterTab === lvl ? "filled" : "outlined"}
                      sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {(formData.qa_questions || [])
                    .filter((q) => qaFilterTab === "all" || (q.difficulty || "beginner").toLowerCase() === qaFilterTab)
                    .map((item, idx) => (
                      <Paper key={item.id || idx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: "#ffffff" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                              label={(item.difficulty || "beginner").toUpperCase()}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                backgroundColor:
                                  item.difficulty === "advanced"
                                    ? "#fee2e2"
                                    : item.difficulty === "intermediate"
                                    ? "#fef3c7"
                                    : "#e0f2fe",
                                color:
                                  item.difficulty === "advanced"
                                    ? "#b91c1c"
                                    : item.difficulty === "intermediate"
                                    ? "#b45309"
                                    : "#0369a1",
                              }}
                            />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568" }}>
                              {item.question || "Untitled Question"}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <IconButton size="small" disabled={idx === 0} onClick={() => moveItem("qa_questions", idx, -1)}>
                              <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" disabled={idx === (formData.qa_questions || []).length - 1} onClick={() => moveItem("qa_questions", idx, 1)}>
                              <ArrowDownwardIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => deleteQA(idx)} sx={{ color: "#dc2626" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Question"
                              value={item.question || ""}
                              onChange={(e) => updateQA(idx, "question", e.target.value)}
                              sx={{ flex: 3 }}
                            />
                            <FormControl size="small" sx={{ flex: 1, minWidth: 140 }}>
                              <InputLabel>Difficulty</InputLabel>
                              <Select
                                value={item.difficulty || "beginner"}
                                label="Difficulty"
                                onChange={(e) => updateQA(idx, "difficulty", e.target.value)}
                              >
                                <MenuItem value="beginner">Beginner</MenuItem>
                                <MenuItem value="intermediate">Intermediate</MenuItem>
                                <MenuItem value="advanced">Advanced</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <TextField
                            fullWidth
                            size="small"
                            label="Short Answer"
                            value={item.answer || ""}
                            onChange={(e) => updateQA(idx, "answer", e.target.value)}
                          />

                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", display: "block", mb: 0.5 }}>
                              Detailed Explanation (Rich-Text)
                            </Typography>
                            <Box sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5, overflow: "hidden" }}>
                              <Editor
                                apiKey={TINYMCE_API_KEY}
                                value={item.explanation || ""}
                                init={{
                                  height: 180,
                                  menubar: false,
                                  plugins: ["lists", "link", "code"],
                                  toolbar: "undo redo | bold italic underline | bullist numlist | code",
                                }}
                                onEditorChange={(content) => updateQA(idx, "explanation", content)}
                              />
                            </Box>
                          </Box>

                          <TextField
                            fullWidth
                            size="small"
                            label="Key Takeaway / Highlight Note"
                            value={item.highlight_box || ""}
                            onChange={(e) => updateQA(idx, "highlight_box", e.target.value)}
                            sx={{ backgroundColor: "#f0fdf4" }}
                          />

                          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Example"
                              value={item.example || ""}
                              onChange={(e) => updateQA(idx, "example", e.target.value)}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              label="Interview Tip"
                              value={item.interview_tip || ""}
                              onChange={(e) => updateQA(idx, "interview_tip", e.target.value)}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                </Box>
              </Box>
            )}

            {/* ── TAB 3: 03 · Scenario-Based ── */}
            {(activeMode === "all" || activeTab === 3) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                      Section 03 · Scenario-Based Interview Questions ({formData.scenario_questions?.length || 0})
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Real-world problem context, investigation approaches, and business-driven recommended solutions.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addScenario}
                    sx={{ backgroundColor: "#37AB79", "&:hover": { backgroundColor: "#2d8a62" }, textTransform: "none" }}
                  >
                    + Add Scenario
                  </Button>
                </Box>

                {renderSectionHeaderBox("scenario-based", "03 · Scenario-Based Interview Questions")}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {(formData.scenario_questions || []).map((item, idx) => (
                    <Paper key={item.id || idx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: "#ffffff" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568" }}>
                          #{item.num || idx + 1}: {item.question || "Untitled Scenario"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <IconButton size="small" disabled={idx === 0} onClick={() => moveItem("scenario_questions", idx, -1)}>
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" disabled={idx === (formData.scenario_questions || []).length - 1} onClick={() => moveItem("scenario_questions", idx, 1)}>
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteScenario(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Scenario Question Title"
                          value={item.question || ""}
                          onChange={(e) => updateScenario(idx, "question", e.target.value)}
                        />

                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", display: "block", mb: 0.5 }}>
                            Problem Context / Understanding
                          </Typography>
                          <Box sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5, overflow: "hidden" }}>
                            <Editor
                              apiKey={TINYMCE_API_KEY}
                              value={item.problem_context || ""}
                              init={{
                                height: 160,
                                menubar: false,
                                plugins: ["lists", "link"],
                                toolbar: "undo redo | bold italic | bullist numlist",
                              }}
                              onEditorChange={(content) => updateScenario(idx, "problem_context", content)}
                            />
                          </Box>
                        </Box>

                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          size="small"
                          label="Investigation Approach (Step-by-step points)"
                          value={item.investigation_approach || ""}
                          onChange={(e) => updateScenario(idx, "investigation_approach", e.target.value)}
                        />

                        <TextField
                          fullWidth
                          size="small"
                          label="Expected Outcome / Recommended Solution (Highlighted Callout Box)"
                          value={item.expected_outcome || item.recommended_solution || ""}
                          onChange={(e) => updateScenario(idx, "expected_outcome", e.target.value)}
                          sx={{ backgroundColor: "#f0fdf4" }}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            {/* ── TAB 4: 04 · Practical & Coding ── */}
            {(activeMode === "all" || activeTab === 4) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                      Section 04 · Practical & Coding Questions ({formData.coding_questions?.length || 0})
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Algorithmic implementation, syntax-highlighted code blocks, and time/space complexity analysis.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addCoding}
                    sx={{ backgroundColor: "#37AB79", "&:hover": { backgroundColor: "#2d8a62" }, textTransform: "none" }}
                  >
                    + Add Coding Challenge
                  </Button>
                </Box>

                {renderSectionHeaderBox("coding-questions", "04 · Practical & Coding Questions")}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {(formData.coding_questions || []).map((item, idx) => (
                    <Paper key={item.id || idx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: "#ffffff" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip label={item.language || "python"} size="small" sx={{ fontWeight: 700, backgroundColor: "#0284c7", color: "#fff" }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568" }}>
                            {item.question || "Untitled Coding Question"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <IconButton size="small" disabled={idx === 0} onClick={() => moveItem("coding_questions", idx, -1)}>
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" disabled={idx === (formData.coding_questions || []).length - 1} onClick={() => moveItem("coding_questions", idx, 1)}>
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteCoding(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Question Title"
                            value={item.question || ""}
                            onChange={(e) => updateCoding(idx, "question", e.target.value)}
                            sx={{ flex: 3 }}
                          />
                          <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
                            <InputLabel>Language</InputLabel>
                            <Select
                              value={item.language || "python"}
                              label="Language"
                              onChange={(e) => updateCoding(idx, "language", e.target.value)}
                            >
                              <MenuItem value="python">Python</MenuItem>
                              <MenuItem value="javascript">JavaScript</MenuItem>
                              <MenuItem value="sql">SQL</MenuItem>
                              <MenuItem value="cpp">C++</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
                            <InputLabel>Difficulty</InputLabel>
                            <Select
                              value={item.difficulty || "Easy"}
                              label="Difficulty"
                              onChange={(e) => updateCoding(idx, "difficulty", e.target.value)}
                            >
                              <MenuItem value="Easy">Easy</MenuItem>
                              <MenuItem value="Medium">Medium</MenuItem>
                              <MenuItem value="Hard">Hard</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        <TextField
                          fullWidth
                          size="small"
                          label="Interview Approach / Strategy"
                          value={item.approach || ""}
                          onChange={(e) => updateCoding(idx, "approach", e.target.value)}
                        />

                        {/* Code Editor Area */}
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", display: "block", mb: 0.5 }}>
                            Source Code Solution (Monospace Code Block)
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={item.code || ""}
                            onChange={(e) => updateCoding(idx, "code", e.target.value)}
                            sx={{
                              backgroundColor: "#0f172a",
                              borderRadius: 1.5,
                              "& .MuiInputBase-input": {
                                color: "#38bdf8",
                                fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                                fontSize: "0.85rem",
                                lineHeight: 1.5,
                              },
                            }}
                          />
                        </Box>

                        <TextField
                          fullWidth
                          size="small"
                          label="Solution Explanation"
                          value={item.explanation || ""}
                          onChange={(e) => updateCoding(idx, "explanation", e.target.value)}
                        />

                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Time Complexity"
                            value={item.time_complexity || ""}
                            onChange={(e) => updateCoding(idx, "time_complexity", e.target.value)}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Space Complexity"
                            value={item.space_complexity || ""}
                            onChange={(e) => updateCoding(idx, "space_complexity", e.target.value)}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            {/* ── TAB 5: 05 · Common Mistakes ── */}
            {(activeMode === "all" || activeTab === 5) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                      Section 05 · Common Interview Mistakes ({formData.common_mistakes?.length || 0})
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      What candidates commonly do wrong, why it matters, and how to avoid it.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addMistake}
                    sx={{ backgroundColor: "#37AB79", "&:hover": { backgroundColor: "#2d8a62" }, textTransform: "none" }}
                  >
                    + Add Common Mistake
                  </Button>
                </Box>

                {renderSectionHeaderBox("common-mistakes", "05 · Common Interview Mistakes")}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {(formData.common_mistakes || []).map((item, idx) => (
                    <Paper key={item.id || idx} variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: "#ffffff" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568" }}>
                          #{item.num || idx + 1}: {item.title || "Untitled Mistake"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <IconButton size="small" disabled={idx === 0} onClick={() => moveItem("common_mistakes", idx, -1)}>
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" disabled={idx === (formData.common_mistakes || []).length - 1} onClick={() => moveItem("common_mistakes", idx, 1)}>
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteMistake(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Mistake Title"
                          value={item.title || ""}
                          onChange={(e) => updateMistake(idx, "title", e.target.value)}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          label="What the Mistake Is"
                          value={item.mistake || ""}
                          onChange={(e) => updateMistake(idx, "mistake", e.target.value)}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          label="Why It Happens / Why It Matters"
                          value={item.why_it_happens || ""}
                          onChange={(e) => updateMistake(idx, "why_it_happens", e.target.value)}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          label="How to Avoid It"
                          value={item.how_to_avoid || ""}
                          onChange={(e) => updateMistake(idx, "how_to_avoid", e.target.value)}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Recommended Practice / Advice"
                          value={item.recommendation || ""}
                          onChange={(e) => updateMistake(idx, "recommendation", e.target.value)}
                          sx={{ backgroundColor: "#f0fdf4" }}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            {/* ── TAB 6: 06 · Quick Revision ── */}
            {(activeMode === "all" || activeTab === 6) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                      Section 06 · Quick Revision Table ({formData.quick_revision?.length || 0} rows)
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Responsive two-column revision table for fast memory refresh before interviews.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addRevisionRow}
                    sx={{ backgroundColor: "#37AB79", "&:hover": { backgroundColor: "#2d8a62" }, textTransform: "none" }}
                  >
                    + Add Revision Row
                  </Button>
                </Box>

                {renderSectionHeaderBox("quick-revision", "06 · Quick Revision")}

                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "60px 1.2fr 2.5fr 100px",
                      backgroundColor: "#075174",
                      color: "#fff",
                      px: 2,
                      py: 1.2,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    <Box>#</Box>
                    <Box>Concept</Box>
                    <Box>Summary / Definition</Box>
                    <Box sx={{ textAlign: "right" }}>Actions</Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {(formData.quick_revision || []).map((row, idx) => (
                      <Box
                        key={row.id || idx}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "60px 1.2fr 2.5fr 100px",
                          alignItems: "center",
                          px: 2,
                          py: 1,
                          borderBottom: "1px solid #f1f5f9",
                          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b" }}>
                          {idx + 1}
                        </Typography>
                        <TextField
                          size="small"
                          placeholder="e.g. Precision"
                          value={row.concept || ""}
                          onChange={(e) => updateRevisionRow(idx, "concept", e.target.value)}
                          sx={{ mr: 1 }}
                        />
                        <TextField
                          size="small"
                          placeholder="Short definition or formula"
                          value={row.explanation || ""}
                          onChange={(e) => updateRevisionRow(idx, "explanation", e.target.value)}
                          sx={{ mr: 1 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                          <IconButton size="small" disabled={idx === 0} onClick={() => moveItem("quick_revision", idx, -1)}>
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            disabled={idx === (formData.quick_revision || []).length - 1}
                            onClick={() => moveItem("quick_revision", idx, 1)}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteRevisionRow(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            {/* ── TAB 7: Sidebar & Widgets ── */}
            {(activeMode === "all" || activeTab === 7) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568", mb: 2 }}>
                  Sidebar Cards & Related Content
                </Typography>

                {/* Related Interviews */}
                <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#074568" }}>
                        Related Interview Questions (Right Sidebar)
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Cards displayed in the Related Interviews widget on the public page.
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => addSidebarCard("related_interviews")}
                      sx={{ borderColor: "#37AB79", color: "#37AB79", textTransform: "none", fontWeight: 600 }}
                    >
                      + Add Related Card
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {(formData.sidebar_cards?.related_interviews || []).map((card, idx) => (
                      <Paper key={card.id || idx} variant="outlined" sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: "#fafbfc" }}>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, alignItems: "center" }}>
                          <TextField
                            size="small"
                            label="Card Title"
                            value={card.title || ""}
                            onChange={(e) => updateSidebarCard("related_interviews", idx, "title", e.target.value)}
                            sx={{ flex: 2 }}
                          />
                          <TextField
                            size="small"
                            label="Display Date"
                            value={card.display_date || ""}
                            onChange={(e) => updateSidebarCard("related_interviews", idx, "display_date", e.target.value)}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            size="small"
                            label="Target URL"
                            value={card.destination_url || ""}
                            onChange={(e) => updateSidebarCard("related_interviews", idx, "destination_url", e.target.value)}
                            sx={{ flex: 2 }}
                          />
                          <IconButton size="small" onClick={() => deleteSidebarCard("related_interviews", idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Paper>

                {/* Tutorials */}
                <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#074568" }}>
                        Tutorials Widget
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Cards displayed in the Tutorials widget on the public page.
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => addSidebarCard("tutorials")}
                      sx={{ borderColor: "#37AB79", color: "#37AB79", textTransform: "none", fontWeight: 600 }}
                    >
                      + Add Tutorial Card
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {(formData.sidebar_cards?.tutorials || []).map((card, idx) => (
                      <Paper key={card.id || idx} variant="outlined" sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: "#fafbfc" }}>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, alignItems: "center" }}>
                          <TextField
                            size="small"
                            label="Tutorial Title"
                            value={card.title || ""}
                            onChange={(e) => updateSidebarCard("tutorials", idx, "title", e.target.value)}
                            sx={{ flex: 2 }}
                          />
                          <TextField
                            size="small"
                            label="Date"
                            value={card.display_date || ""}
                            onChange={(e) => updateSidebarCard("tutorials", idx, "display_date", e.target.value)}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            size="small"
                            label="Target URL"
                            value={card.destination_url || ""}
                            onChange={(e) => updateSidebarCard("tutorials", idx, "destination_url", e.target.value)}
                            sx={{ flex: 2 }}
                          />
                          <IconButton size="small" onClick={() => deleteSidebarCard("tutorials", idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Paper>

                {/* Mini Guides */}
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#074568" }}>
                        Mini Guides Widget
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Cards displayed in the Mini Guides widget on the public page.
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => addSidebarCard("mini_guides")}
                      sx={{ borderColor: "#37AB79", color: "#37AB79", textTransform: "none", fontWeight: 600 }}
                    >
                      + Add Mini Guide Card
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {(formData.sidebar_cards?.mini_guides || []).map((card, idx) => (
                      <Paper key={card.id || idx} variant="outlined" sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: "#fafbfc" }}>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, alignItems: "center" }}>
                          <TextField
                            size="small"
                            label="Mini Guide Title"
                            value={card.title || ""}
                            onChange={(e) => updateSidebarCard("mini_guides", idx, "title", e.target.value)}
                            sx={{ flex: 2 }}
                          />
                          <TextField
                            size="small"
                            label="Date"
                            value={card.display_date || ""}
                            onChange={(e) => updateSidebarCard("mini_guides", idx, "display_date", e.target.value)}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            size="small"
                            label="Target URL"
                            value={card.destination_url || ""}
                            onChange={(e) => updateSidebarCard("mini_guides", idx, "destination_url", e.target.value)}
                            sx={{ flex: 2 }}
                          />
                          <IconButton size="small" onClick={() => deleteSidebarCard("mini_guides", idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            {/* ── Bottom Save Action Bar ── */}
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
                {isSaving ? "Saving..." : "Save Interview Details"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
}
