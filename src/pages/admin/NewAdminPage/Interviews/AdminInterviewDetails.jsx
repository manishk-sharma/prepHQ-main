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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import {
  useInterviewDetails,
  useInterviewDetailsList,
  useUpdateInterviewDetails,
  useCreateInterviewDetails,
} from "../../../../services/interviewsServices";
import { useNotification } from "../../../../context/useNotificationContext";
import { Editor } from "@tinymce/tinymce-react";
import {
  SortableContainer,
  SortableItem,
  DragHandle,
  AccessibleReorderButtons,
} from "../Projects/components/DndSortableWrapper";

const TINYMCE_API_KEY = "9upr0hixy7g4w8g9mazmhkqgyl0m4kjvz623rjwvekg4l86k";

const DEFAULT_SECTION_HEADERS = {
  "must-know": {
    title: "Must–Know Questions",
    subtitle: "Start with the questions you should be able to answer before any Machine Learning interview.",
  },
  "questions-answers": {
    title: "Questions & Answers",
    subtitle: "Explore interview questions topic by topic.",
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
  const [expandedMustKnowIds, setExpandedMustKnowIds] = useState({});
  const [expandedQaIds, setExpandedQaIds] = useState({});

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
      const sanitizedMustKnow = (currentData.must_know_questions || []).map((q, idx) => ({
        id: q.id || `mk-${idx + 1}-${Date.now()}`,
        num: q.num || String(idx + 1).padStart(2, "0"),
        question: q.question || q.title || "",
        default_open: q.default_open !== undefined ? Boolean(q.default_open) : idx === 0,
        simple_explanation: q.simple_explanation || q.simple_definition || "",
        simple_definition: q.simple_definition || q.simple_explanation || "",
        technical_explanation: q.technical_explanation || q.explanation || "",
        explanation: q.explanation || q.technical_explanation || "",
        interview_answer: q.interview_answer || q.highlight_box || q.interview_ready_answer || "",
        highlight_box: q.highlight_box || q.interview_answer || q.interview_ready_answer || "",
        example: q.example || "",
        interview_tip: q.interview_tip || "",
        follow_up_questions: (q.follow_up_questions || q.subQuestions || q.sub_questions || []).map((fq, fidx) => ({
          id: fq.id || `fq-${fidx + 1}-${Date.now()}`,
          question: fq.question || fq.text || "",
          hint: fq.hint || "",
        })),
      }));

      // Expand first Must-Know card in admin editor by default
      const initialExpanded = {};
      sanitizedMustKnow.forEach((q, i) => {
        initialExpanded[q.id] = i === 0;
      });
      setExpandedMustKnowIds(initialExpanded);

      // Normalize QA questions
      const sanitizedQA = (currentData.qa_questions || []).map((q, idx) => ({
        id: q.id || `qa-${idx + 1}-${Date.now()}`,
        num: q.num || String(idx + 1).padStart(2, "0"),
        question: q.question || q.title || "",
        difficulty: (q.difficulty || "beginner").toLowerCase(),
        default_open: q.default_open !== undefined ? Boolean(q.default_open) : idx === 0,
        simple_explanation: q.simple_explanation || q.simple_definition || q.answer || "",
        simple_definition: q.simple_definition || q.simple_explanation || q.answer || "",
        answer: q.answer || q.simple_explanation || q.simple_definition || "",
        technical_explanation: q.technical_explanation || q.explanation || "",
        explanation: q.explanation || q.technical_explanation || "",
        interview_answer: q.interview_answer || q.highlight_box || q.interview_ready_answer || q.highlightBox || "",
        highlight_box: q.highlight_box || q.interview_answer || q.interview_ready_answer || q.highlightBox || "",
        example: q.example || "",
        interview_tip: q.interview_tip || "",
        code_snippet: q.code_snippet || "",
        follow_up_questions: (q.follow_up_questions || q.subQuestions || q.sub_questions || []).map((fq, fidx) => ({
          id: fq.id || `fq-${fidx + 1}-${Date.now()}`,
          question: fq.question || fq.text || "",
          hint: fq.hint || "",
        })),
      }));

      // Expand first QA card in admin editor by default
      const initialQaExpanded = {};
      sanitizedQA.forEach((q, i) => {
        initialQaExpanded[q.id] = i === 0;
      });
      setExpandedQaIds(initialQaExpanded);

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
        must_know_questions: sanitizedMustKnow,
        qa_questions: sanitizedQA,
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
  const toggleMustKnowExpand = (id) => {
    setExpandedMustKnowIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllMustKnow = () => {
    const nextState = {};
    (formData.must_know_questions || []).forEach((q) => {
      nextState[q.id] = true;
    });
    setExpandedMustKnowIds(nextState);
  };

  const collapseAllMustKnow = () => {
    setExpandedMustKnowIds({});
  };

  const addMustKnow = () => {
    const newId = `mk-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: newId,
        num: nextNum,
        question: "New Question Title",
        default_open: list.length === 0,
        simple_explanation: "",
        simple_definition: "",
        technical_explanation: "",
        explanation: "",
        interview_answer: "",
        highlight_box: "",
        example: "",
        interview_tip: "",
        follow_up_questions: [
          {
            id: `fq-${Date.now()}-1`,
            question: "",
            hint: "Try answering this aloud first, then link it back to the main question above.",
          },
        ],
      });
      return { ...prev, must_know_questions: list };
    });
    setExpandedMustKnowIds((prev) => ({ ...prev, [newId]: true }));
  };

  const updateMustKnow = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      const updated = { ...list[idx], [field]: val };
      if (field === "simple_explanation") updated.simple_definition = val;
      if (field === "simple_definition") updated.simple_explanation = val;
      if (field === "technical_explanation") updated.explanation = val;
      if (field === "explanation") updated.technical_explanation = val;
      if (field === "interview_answer") updated.highlight_box = val;
      if (field === "highlight_box") updated.interview_answer = val;
      list[idx] = updated;
      return { ...prev, must_know_questions: list };
    });
  };

  const deleteMustKnow = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      list.splice(idx, 1);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, must_know_questions: renumbered };
    });
  };

  const duplicateMustKnow = (idx) => {
    const newId = `mk-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      const source = list[idx];
      if (!source) return prev;
      const copy = {
        ...source,
        id: newId,
        question: `${source.question || "Question"} (Copy)`,
        follow_up_questions: (source.follow_up_questions || []).map((fq, fidx) => ({
          ...fq,
          id: `fq-${Date.now()}-${fidx}`,
        })),
      };
      list.splice(idx + 1, 0, copy);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, must_know_questions: renumbered };
    });
    setExpandedMustKnowIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleReorderMustKnow = (reordered) => {
    const renumbered = reordered.map((item, idx) => ({
      ...item,
      num: String(idx + 1).padStart(2, "0"),
    }));
    setFormData((prev) => ({
      ...prev,
      must_know_questions: renumbered,
    }));
  };

  // Follow-up question nested handlers
  const addFollowUp = (qIdx) => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      const q = { ...list[qIdx] };
      const followUps = [...(q.follow_up_questions || [])];
      followUps.push({
        id: `fq-${Date.now()}`,
        question: "",
        hint: "Try answering this aloud first, then link it back to the main question above.",
      });
      q.follow_up_questions = followUps;
      list[qIdx] = q;
      return { ...prev, must_know_questions: list };
    });
  };

  const updateFollowUp = (qIdx, fIdx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      const q = { ...list[qIdx] };
      const followUps = [...(q.follow_up_questions || [])];
      followUps[fIdx] = { ...followUps[fIdx], [field]: val };
      q.follow_up_questions = followUps;
      list[qIdx] = q;
      return { ...prev, must_know_questions: list };
    });
  };

  const deleteFollowUp = (qIdx, fIdx) => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      const q = { ...list[qIdx] };
      const followUps = [...(q.follow_up_questions || [])];
      followUps.splice(fIdx, 1);
      q.follow_up_questions = followUps;
      list[qIdx] = q;
      return { ...prev, must_know_questions: list };
    });
  };

  const moveFollowUp = (qIdx, fIdx, direction) => {
    setFormData((prev) => {
      const list = [...(prev.must_know_questions || [])];
      const q = { ...list[qIdx] };
      const followUps = [...(q.follow_up_questions || [])];
      const targetIdx = fIdx + direction;
      if (targetIdx < 0 || targetIdx >= followUps.length) return prev;
      const temp = followUps[fIdx];
      followUps[fIdx] = followUps[targetIdx];
      followUps[targetIdx] = temp;
      q.follow_up_questions = followUps;
      list[qIdx] = q;
      return { ...prev, must_know_questions: list };
    });
  };

  // ── 2. Q&A Handlers ────────────────────────────────────────────────────────
  const toggleQaExpand = (id) => {
    setExpandedQaIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllQa = () => {
    const nextState = {};
    (formData.qa_questions || []).forEach((q) => {
      nextState[q.id] = true;
    });
    setExpandedQaIds(nextState);
  };

  const collapseAllQa = () => {
    setExpandedQaIds({});
  };

  const addQA = () => {
    const newId = `qa-${Date.now()}`;
    const targetDiff = qaFilterTab !== "all" ? qaFilterTab : "beginner";
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: newId,
        num: nextNum,
        difficulty: targetDiff,
        question: "New Question Title",
        default_open: list.length === 0,
        simple_explanation: "",
        simple_definition: "",
        answer: "",
        technical_explanation: "",
        explanation: "",
        interview_answer: "",
        highlight_box: "",
        example: "",
        interview_tip: "",
        code_snippet: "",
        follow_up_questions: [
          {
            id: `fq-${Date.now()}-1`,
            question: "",
            hint: "Try answering this aloud first, then link it back to the main question above.",
          },
        ],
      });
      return { ...prev, qa_questions: list };
    });
    setExpandedQaIds((prev) => ({ ...prev, [newId]: true }));
  };

  const updateQA = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      const updated = { ...list[idx], [field]: val };
      if (field === "simple_explanation") {
        updated.simple_definition = val;
        updated.answer = val;
      }
      if (field === "simple_definition") {
        updated.simple_explanation = val;
        updated.answer = val;
      }
      if (field === "answer") {
        updated.simple_explanation = val;
        updated.simple_definition = val;
      }
      if (field === "technical_explanation") updated.explanation = val;
      if (field === "explanation") updated.technical_explanation = val;
      if (field === "interview_answer") updated.highlight_box = val;
      if (field === "highlight_box") updated.interview_answer = val;
      list[idx] = updated;
      return { ...prev, qa_questions: list };
    });
  };

  const deleteQA = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      list.splice(idx, 1);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, qa_questions: renumbered };
    });
  };

  const duplicateQA = (idx) => {
    const newId = `qa-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      const source = list[idx];
      if (!source) return prev;
      const copy = {
        ...source,
        id: newId,
        question: `${source.question || "Question"} (Copy)`,
        follow_up_questions: (source.follow_up_questions || []).map((fq, fidx) => ({
          ...fq,
          id: `fq-${Date.now()}-${fidx}`,
        })),
      };
      list.splice(idx + 1, 0, copy);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, qa_questions: renumbered };
    });
    setExpandedQaIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleReorderQA = (reordered) => {
    if (qaFilterTab === "all") {
      const renumbered = reordered.map((item, idx) => ({
        ...item,
        num: String(idx + 1).padStart(2, "0"),
      }));
      setFormData((prev) => ({ ...prev, qa_questions: renumbered }));
    } else {
      setFormData((prev) => {
        const fullList = [...(prev.qa_questions || [])];
        const nonFiltered = fullList.filter(
          (q) => (q.difficulty || "beginner").toLowerCase() !== qaFilterTab
        );
        const combined = [...reordered, ...nonFiltered];
        const renumbered = combined.map((item, idx) => ({
          ...item,
          num: String(idx + 1).padStart(2, "0"),
        }));
        return { ...prev, qa_questions: renumbered };
      });
    }
  };

  const moveQAItem = (filteredIndex, direction) => {
    setFormData((prev) => {
      const fullList = [...(prev.qa_questions || [])];
      const filtered = fullList.filter(
        (q) => qaFilterTab === "all" || (q.difficulty || "beginner").toLowerCase() === qaFilterTab
      );
      const targetFilteredIndex = filteredIndex + direction;
      if (targetFilteredIndex < 0 || targetFilteredIndex >= filtered.length) return prev;

      const itemToMove = filtered[filteredIndex];
      const targetItem = filtered[targetFilteredIndex];
      const fromRealIndex = fullList.findIndex((q) => q.id === itemToMove.id);
      const toRealIndex = fullList.findIndex((q) => q.id === targetItem.id);

      if (fromRealIndex === -1 || toRealIndex === -1) return prev;

      const temp = fullList[fromRealIndex];
      fullList[fromRealIndex] = fullList[toRealIndex];
      fullList[toRealIndex] = temp;

      const renumbered = fullList.map((item, idx) => ({
        ...item,
        num: String(idx + 1).padStart(2, "0"),
      }));
      return { ...prev, qa_questions: renumbered };
    });
  };

  // Follow-up question nested handlers for Q&A
  const addQAFollowUp = (qIdx) => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      const q = { ...list[qIdx] };
      const followUps = [...(q.follow_up_questions || [])];
      followUps.push({
        id: `fq-${Date.now()}`,
        question: "",
        hint: "Try answering this aloud first, then link it back to the main question above.",
      });
      q.follow_up_questions = followUps;
      list[qIdx] = q;
      return { ...prev, qa_questions: list };
    });
  };

  const updateQAFollowUp = (qIdx, fIdx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      const q = { ...list[qIdx] };
      const followUps = [...(q.follow_up_questions || [])];
      followUps[fIdx] = { ...followUps[fIdx], [field]: val };
      q.follow_up_questions = followUps;
      list[qIdx] = q;
      return { ...prev, qa_questions: list };
    });
  };

  const deleteQAFollowUp = (qIdx, fIdx) => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      const q = { ...list[qIdx] };
      const followUps = [...(q.follow_up_questions || [])];
      followUps.splice(fIdx, 1);
      q.follow_up_questions = followUps;
      list[qIdx] = q;
      return { ...prev, qa_questions: list };
    });
  };

  const moveQAFollowUp = (qIdx, fIdx, direction) => {
    setFormData((prev) => {
      const list = [...(prev.qa_questions || [])];
      const q = { ...list[qIdx] };
      const followUps = [...(q.follow_up_questions || [])];
      const targetIdx = fIdx + direction;
      if (targetIdx < 0 || targetIdx >= followUps.length) return prev;
      const temp = followUps[fIdx];
      followUps[fIdx] = followUps[targetIdx];
      followUps[targetIdx] = temp;
      q.follow_up_questions = followUps;
      list[qIdx] = q;
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
                {/* Section Header toolbar */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                      Must–Know Questions ({formData.must_know_questions?.length || 0})
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Core questions candidates should be able to answer before any interview. Expandable accordion with simple definition, technical explanation, interview callout, practical example, and follow-up questions with hints.
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<UnfoldMoreIcon fontSize="small" />}
                      onClick={expandAllMustKnow}
                      sx={{ textTransform: "none", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      Expand All
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<UnfoldLessIcon fontSize="small" />}
                      onClick={collapseAllMustKnow}
                      sx={{ textTransform: "none", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      Collapse All
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addMustKnow}
                      sx={{
                        backgroundColor: "#37AB79",
                        "&:hover": { backgroundColor: "#2d8a62" },
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      + Add Question
                    </Button>
                  </Box>
                </Box>

                {/* Section Title & Subtitle editing box */}
                {renderSectionHeaderBox("must-know", "Must–Know Questions")}

                {/* Sortable List of Question Cards */}
                <SortableContainer
                  items={formData.must_know_questions || []}
                  onReorder={handleReorderMustKnow}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {(formData.must_know_questions || []).map((item, idx) => {
                      const isCardExpanded = Boolean(expandedMustKnowIds[item.id]);
                      const numLabel = item.num || String(idx + 1).padStart(2, "0");

                      return (
                        <SortableItem key={item.id} id={item.id}>
                          {({ attributes, listeners, isDragging }) => (
                            <Paper
                              variant="outlined"
                              sx={{
                                borderRadius: 2.5,
                                backgroundColor: "#ffffff",
                                borderColor: isDragging ? "#37AB79" : isCardExpanded ? "#94a3b8" : "#e2e8f0",
                                boxShadow: isCardExpanded ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                                overflow: "hidden",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                              }}
                            >
                              {/* Card Header */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  p: 1.5,
                                  px: 2,
                                  backgroundColor: isCardExpanded ? "#f8fafc" : "#fafafa",
                                  borderBottom: isCardExpanded ? "1px solid #e2e8f0" : "none",
                                  gap: 1.5,
                                }}
                              >
                                {/* Left: Drag Handle, Number Badge, Title, Default Open Badge */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.25,
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <DragHandle
                                    attributes={attributes}
                                    listeners={listeners}
                                    isDragging={isDragging}
                                  />
                                  <Chip
                                    label={numLabel}
                                    size="small"
                                    sx={{
                                      fontWeight: 700,
                                      backgroundColor: isCardExpanded ? "#0B3553" : "#E2E8F0",
                                      color: isCardExpanded ? "#ffffff" : "#334155",
                                      borderRadius: 1.5,
                                      fontSize: "0.8rem",
                                      height: 26,
                                    }}
                                  />
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 700,
                                      color: "#1e293b",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => toggleMustKnowExpand(item.id)}
                                  >
                                    {item.question || "Untitled Question"}
                                  </Typography>
                                  {item.default_open && (
                                    <Chip
                                      label="Default Open"
                                      size="small"
                                      sx={{
                                        fontSize: "0.7rem",
                                        height: 20,
                                        backgroundColor: "#DEF7EC",
                                        color: "#03543F",
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                </Box>

                                {/* Right: Actions (Move up/down, Duplicate, Delete, Expand/Collapse) */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                                  <AccessibleReorderButtons
                                    onMoveUp={() => moveItem("must_know_questions", idx, -1)}
                                    onMoveDown={() => moveItem("must_know_questions", idx, 1)}
                                    isFirst={idx === 0}
                                    isLast={idx === (formData.must_know_questions || []).length - 1}
                                  />
                                  <Tooltip title="Duplicate Question">
                                    <IconButton
                                      size="small"
                                      onClick={() => duplicateMustKnow(idx)}
                                      sx={{ color: "#64748b", "&:hover": { color: "#074568" } }}
                                    >
                                      <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Question">
                                    <IconButton
                                      size="small"
                                      onClick={() => deleteMustKnow(idx)}
                                      sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <IconButton
                                    size="small"
                                    onClick={() => toggleMustKnowExpand(item.id)}
                                    sx={{ color: "#475569" }}
                                  >
                                    {isCardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                  </IconButton>
                                </Box>
                              </Box>

                              {/* Card Body (Collapsible) */}
                              {isCardExpanded && (
                                <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", flexDirection: "column", gap: 2.25 }}>
                                  {/* Field 1: Question Title & Default Open */}
                                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { sm: "center" } }}>
                                    <TextField
                                      fullWidth
                                      required
                                      size="small"
                                      label="Question Title (Displayed in accordion header)"
                                      value={item.question || ""}
                                      onChange={(e) => updateMustKnow(idx, "question", e.target.value)}
                                      sx={{ flex: 1 }}
                                    />
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={Boolean(item.default_open)}
                                          onChange={(e) => updateMustKnow(idx, "default_open", e.target.checked)}
                                          color="primary"
                                        />
                                      }
                                      label={
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                                          Expand by default on public page
                                        </Typography>
                                      }
                                      sx={{ flexShrink: 0 }}
                                    />
                                  </Box>

                                  {/* Field 2: Simple Explanation */}
                                  <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                      A. Simple explanation
                                    </Typography>
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={2}
                                      size="small"
                                      placeholder="Instead of writing rules by hand, you show a computer many examples and let it work out the rules itself."
                                      value={item.simple_explanation || item.simple_definition || ""}
                                      onChange={(e) => updateMustKnow(idx, "simple_explanation", e.target.value)}
                                    />
                                  </Box>

                                  {/* Field 3: Technical Explanation (Rich-Text Editor) */}
                                  <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                      B. Technical explanation (Rich-Text: paragraphs, lists, bold, code)
                                    </Typography>
                                    <Box sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5, overflow: "hidden" }}>
                                      <Editor
                                        apiKey={TINYMCE_API_KEY}
                                        value={item.technical_explanation || item.explanation || ""}
                                        init={{
                                          height: 180,
                                          menubar: false,
                                          plugins: ["lists", "link", "code"],
                                          toolbar: "undo redo | bold italic underline | bullist numlist | link code",
                                          content_style: "body { font-family: Inter, sans-serif; font-size: 14px; }",
                                        }}
                                        onEditorChange={(content) => updateMustKnow(idx, "technical_explanation", content)}
                                      />
                                    </Box>
                                  </Box>

                                  {/* Field 4: Interview-Ready Answer (Highlighted Mint Callout Box) */}
                                  <Box sx={{ backgroundColor: "#F0FDF4", p: 1.5, borderRadius: 2, border: "1px solid #BBF7D0", borderLeft: "4px solid #0D5C75" }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#065F46", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                      C. Interview-ready answer ("What you can say in an interview" callout box)
                                    </Typography>
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={2.5}
                                      size="small"
                                      placeholder="&quot;Machine learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed for every outcome.&quot;"
                                      value={item.interview_answer || item.highlight_box || ""}
                                      onChange={(e) => updateMustKnow(idx, "interview_answer", e.target.value)}
                                      sx={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": { fontStyle: "italic" },
                                      }}
                                    />
                                  </Box>

                                  {/* Field 5: Example */}
                                  <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                      D. Example
                                    </Typography>
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={2}
                                      size="small"
                                      placeholder="A spam filter learns from thousands of labelled emails which words and senders suggest spam."
                                      value={item.example || ""}
                                      onChange={(e) => updateMustKnow(idx, "example", e.target.value)}
                                    />
                                  </Box>

                                  {/* Field 6: Nested Follow-up Questions ("Interviewer may ask") */}
                                  <Paper
                                    variant="outlined"
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      backgroundColor: "#f8fafc",
                                      border: "1px dashed #cbd5e1",
                                    }}
                                  >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                      <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                          E. Interviewer may ask (Suggested Follow-up Questions)
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                                          Outlined question pills with supporting hints (e.g. "Try answering this aloud first...").
                                        </Typography>
                                      </Box>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<AddIcon fontSize="small" />}
                                        onClick={() => addFollowUp(idx)}
                                        sx={{
                                          textTransform: "none",
                                          fontSize: "0.75rem",
                                          fontWeight: 600,
                                          borderColor: "#37AB79",
                                          color: "#166534",
                                          "&:hover": { borderColor: "#166534", backgroundColor: "#f0fdf4" },
                                        }}
                                      >
                                        + Add Follow-up
                                      </Button>
                                    </Box>

                                    {(item.follow_up_questions || []).length === 0 ? (
                                      <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center", py: 1 }}>
                                        No follow-up questions yet. Click "+ Add Follow-up" to add one.
                                      </Typography>
                                    ) : (
                                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                        {(item.follow_up_questions || []).map((fq, fIdx) => (
                                          <Paper
                                            key={fq.id || fIdx}
                                            variant="outlined"
                                            sx={{
                                              p: 1.5,
                                              borderRadius: 2,
                                              backgroundColor: "#ffffff",
                                              borderColor: "#e2e8f0",
                                            }}
                                          >
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                              <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                                                Follow-up #{fIdx + 1}
                                              </Typography>
                                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <IconButton
                                                  size="small"
                                                  disabled={fIdx === 0}
                                                  onClick={() => moveFollowUp(idx, fIdx, -1)}
                                                  sx={{ p: 0.25 }}
                                                >
                                                  <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                                <IconButton
                                                  size="small"
                                                  disabled={fIdx === (item.follow_up_questions || []).length - 1}
                                                  onClick={() => moveFollowUp(idx, fIdx, 1)}
                                                  sx={{ p: 0.25 }}
                                                >
                                                  <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                                <IconButton
                                                  size="small"
                                                  onClick={() => deleteFollowUp(idx, fIdx)}
                                                  sx={{ p: 0.25, color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                                                >
                                                  <DeleteIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                              </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                              <TextField
                                                fullWidth
                                                size="small"
                                                label="Follow-up Question Text"
                                                placeholder="e.g. How is ML different from traditional programming?"
                                                value={fq.question || ""}
                                                onChange={(e) => updateFollowUp(idx, fIdx, "question", e.target.value)}
                                              />
                                              <TextField
                                                fullWidth
                                                size="small"
                                                label="Supporting Hint / Instruction (displayed underneath question)"
                                                placeholder="e.g. Try answering this aloud first, then link it back to the main question above."
                                                value={fq.hint || ""}
                                                onChange={(e) => updateFollowUp(idx, fIdx, "hint", e.target.value)}
                                              />
                                            </Box>
                                          </Paper>
                                        ))}
                                      </Box>
                                    )}
                                  </Paper>
                                </Box>
                              )}
                            </Paper>
                          )}
                        </SortableItem>
                      );
                    })}
                  </Box>
                </SortableContainer>
              </Box>
            )}

            {/* ── TAB 2: 02 · Questions & Answers ── */}
            {(activeMode === "all" || activeTab === 2) && (() => {
              const visibleQA = (formData.qa_questions || [])
                .map((item, originalIdx) => ({ item, originalIdx }))
                .filter(
                  ({ item }) => qaFilterTab === "all" || (item.difficulty || "beginner").toLowerCase() === qaFilterTab
                );

              return (
                <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                  {/* Header with Title, Counts, and Top Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                        Section 02 · Questions & Answers ({formData.qa_questions?.length || 0})
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Filterable questions by difficulty (Beginner, Intermediate, Advanced) with accordion cards, rich explanations, interview-ready answers, and follow-up questions.
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<UnfoldMoreIcon fontSize="small" />}
                        onClick={expandAllQa}
                        sx={{ textTransform: "none", borderColor: "#cbd5e1", color: "#475569" }}
                      >
                        Expand All
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<UnfoldLessIcon fontSize="small" />}
                        onClick={collapseAllQa}
                        sx={{ textTransform: "none", borderColor: "#cbd5e1", color: "#475569" }}
                      >
                        Collapse All
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={addQA}
                        sx={{
                          backgroundColor: "#37AB79",
                          "&:hover": { backgroundColor: "#2d8a62" },
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        + Add Question
                      </Button>
                    </Box>
                  </Box>

                  {/* Section Title & Subtitle editing box */}
                  {renderSectionHeaderBox("questions-answers", "Questions & Answers")}

                  {/* Difficulty Filter Chips for Admin view */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 2,
                      p: 1.5,
                      backgroundColor: "#f8fafc",
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Filter by Difficulty:
                      </Typography>
                      {["all", "beginner", "intermediate", "advanced"].map((lvl) => {
                        const count =
                          lvl === "all"
                            ? (formData.qa_questions || []).length
                            : (formData.qa_questions || []).filter(
                                (q) => (q.difficulty || "beginner").toLowerCase() === lvl
                              ).length;
                        return (
                          <Chip
                            key={lvl}
                            label={`${lvl.charAt(0).toUpperCase() + lvl.slice(1)} (${count})`}
                            clickable
                            onClick={() => setQaFilterTab(lvl)}
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              backgroundColor: qaFilterTab === lvl ? "#0B3553" : "#ffffff",
                              color: qaFilterTab === lvl ? "#ffffff" : "#475569",
                              border: qaFilterTab === lvl ? "1px solid #0B3553" : "1px solid #cbd5e1",
                              "&:hover": {
                                backgroundColor: qaFilterTab === lvl ? "#072338" : "#f1f5f9",
                              },
                            }}
                          />
                        );
                      })}
                    </Box>
                    {qaFilterTab !== "all" && (
                      <Typography variant="caption" sx={{ color: "#64748b", fontStyle: "italic" }}>
                        Showing {qaFilterTab} questions only. New questions will default to {qaFilterTab}.
                      </Typography>
                    )}
                  </Box>

                  {visibleQA.length === 0 ? (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 2.5,
                        backgroundColor: "#f8fafc",
                        border: "1px dashed #cbd5e1",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                        No questions configured for difficulty level "{qaFilterTab.toUpperCase()}".
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addQA}
                        sx={{
                          backgroundColor: "#37AB79",
                          "&:hover": { backgroundColor: "#2d8a62" },
                          textTransform: "none",
                        }}
                      >
                        + Add {qaFilterTab.toUpperCase()} Question
                      </Button>
                    </Paper>
                  ) : (
                    /* Sortable List of Question Cards */
                    <SortableContainer
                      items={visibleQA.map((v) => v.item)}
                      onReorder={handleReorderQA}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {visibleQA.map(({ item, originalIdx }, filteredIdx) => {
                          const isCardExpanded = Boolean(expandedQaIds[item.id]);
                          const numLabel = String(filteredIdx + 1).padStart(2, "0");
                          const diff = (item.difficulty || "beginner").toLowerCase();

                          return (
                            <SortableItem key={item.id} id={item.id}>
                              {({ attributes, listeners, isDragging }) => (
                                <Paper
                                  variant="outlined"
                                  sx={{
                                    borderRadius: 2.5,
                                    backgroundColor: "#ffffff",
                                    borderColor: isDragging ? "#37AB79" : isCardExpanded ? "#94a3b8" : "#e2e8f0",
                                    boxShadow: isCardExpanded ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                                    overflow: "hidden",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                  }}
                                >
                                  {/* Card Header */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      p: 1.5,
                                      px: 2,
                                      backgroundColor: isCardExpanded ? "#f8fafc" : "#fafafa",
                                      borderBottom: isCardExpanded ? "1px solid #e2e8f0" : "none",
                                      gap: 1.5,
                                    }}
                                  >
                                    {/* Left: Drag Handle, Number Badge, Difficulty Chip, Title, Default Open Badge */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.25,
                                        flex: 1,
                                        minWidth: 0,
                                      }}
                                    >
                                      <DragHandle
                                        attributes={attributes}
                                        listeners={listeners}
                                        isDragging={isDragging}
                                      />
                                      <Chip
                                        label={numLabel}
                                        size="small"
                                        sx={{
                                          fontWeight: 700,
                                          backgroundColor: isCardExpanded ? "#0B3553" : "#E2E8F0",
                                          color: isCardExpanded ? "#ffffff" : "#334155",
                                          borderRadius: 1.5,
                                          fontSize: "0.8rem",
                                          height: 26,
                                        }}
                                      />
                                      <Chip
                                        label={diff.toUpperCase()}
                                        size="small"
                                        sx={{
                                          fontWeight: 700,
                                          fontSize: "0.7rem",
                                          height: 22,
                                          backgroundColor:
                                            diff === "advanced"
                                              ? "#fee2e2"
                                              : diff === "intermediate"
                                              ? "#fef3c7"
                                              : "#e0f2fe",
                                          color:
                                            diff === "advanced"
                                              ? "#b91c1c"
                                              : diff === "intermediate"
                                              ? "#b45309"
                                              : "#0369a1",
                                        }}
                                      />
                                      <Typography
                                        variant="subtitle2"
                                        sx={{
                                          fontWeight: 700,
                                          color: "#1e293b",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => toggleQaExpand(item.id)}
                                      >
                                        {item.question || "Untitled Question"}
                                      </Typography>
                                      {item.default_open && (
                                        <Chip
                                          label="Default Open"
                                          size="small"
                                          sx={{
                                            fontSize: "0.7rem",
                                            height: 20,
                                            backgroundColor: "#DEF7EC",
                                            color: "#03543F",
                                            fontWeight: 600,
                                          }}
                                        />
                                      )}
                                    </Box>

                                    {/* Right: Actions (Move up/down, Duplicate, Delete, Expand/Collapse) */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                                      <AccessibleReorderButtons
                                        onMoveUp={() => moveQAItem(filteredIdx, -1)}
                                        onMoveDown={() => moveQAItem(filteredIdx, 1)}
                                        isFirst={filteredIdx === 0}
                                        isLast={filteredIdx === visibleQA.length - 1}
                                      />
                                      <Tooltip title="Duplicate Question">
                                        <IconButton
                                          size="small"
                                          onClick={() => duplicateQA(originalIdx)}
                                          sx={{ color: "#64748b", "&:hover": { color: "#074568" } }}
                                        >
                                          <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete Question">
                                        <IconButton
                                          size="small"
                                          onClick={() => deleteQA(originalIdx)}
                                          sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <IconButton
                                        size="small"
                                        onClick={() => toggleQaExpand(item.id)}
                                        sx={{ color: "#475569" }}
                                      >
                                        {isCardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                      </IconButton>
                                    </Box>
                                  </Box>

                                  {/* Card Body (Collapsible) */}
                                  {isCardExpanded && (
                                    <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", flexDirection: "column", gap: 2.25 }}>
                                      {/* Field 1: Question Title, Difficulty, and Default Open */}
                                      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: { md: "center" } }}>
                                        <TextField
                                          fullWidth
                                          required
                                          size="small"
                                          label="Question Title (Displayed in accordion header)"
                                          value={item.question || ""}
                                          onChange={(e) => updateQA(originalIdx, "question", e.target.value)}
                                          sx={{ flex: 3 }}
                                        />
                                        <FormControl size="small" sx={{ minWidth: 160 }}>
                                          <InputLabel>Difficulty</InputLabel>
                                          <Select
                                            value={item.difficulty || "beginner"}
                                            label="Difficulty"
                                            onChange={(e) => updateQA(originalIdx, "difficulty", e.target.value)}
                                          >
                                            <MenuItem value="beginner">Beginner</MenuItem>
                                            <MenuItem value="intermediate">Intermediate</MenuItem>
                                            <MenuItem value="advanced">Advanced</MenuItem>
                                          </Select>
                                        </FormControl>
                                        <FormControlLabel
                                          control={
                                            <Switch
                                              checked={Boolean(item.default_open)}
                                              onChange={(e) => updateQA(originalIdx, "default_open", e.target.checked)}
                                              color="primary"
                                            />
                                          }
                                          label={
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                                              Expand by default
                                            </Typography>
                                          }
                                          sx={{ flexShrink: 0 }}
                                        />
                                      </Box>

                                      {/* Field 2: Simple Explanation */}
                                      <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                          A. Simple explanation
                                        </Typography>
                                        <TextField
                                          fullWidth
                                          multiline
                                          rows={2}
                                          size="small"
                                          placeholder="Instead of writing rules by hand, you show a computer many examples and let it work out the rules itself."
                                          value={item.simple_explanation || item.simple_definition || item.answer || ""}
                                          onChange={(e) => updateQA(originalIdx, "simple_explanation", e.target.value)}
                                        />
                                      </Box>

                                      {/* Field 3: Technical Explanation (Rich-Text Editor) */}
                                      <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                          B. Technical explanation (Rich-Text: paragraphs, lists, bold, math/code)
                                        </Typography>
                                        <Box sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5, overflow: "hidden" }}>
                                          <Editor
                                            apiKey={TINYMCE_API_KEY}
                                            value={item.technical_explanation || item.explanation || ""}
                                            init={{
                                              height: 180,
                                              menubar: false,
                                              plugins: ["lists", "link", "code"],
                                              toolbar: "undo redo | bold italic underline | bullist numlist | link code",
                                              content_style: "body { font-family: Inter, sans-serif; font-size: 14px; }",
                                            }}
                                            onEditorChange={(content) => updateQA(originalIdx, "technical_explanation", content)}
                                          />
                                        </Box>
                                      </Box>

                                      {/* Field 4: Interview-Ready Answer (Highlighted Mint Callout Box) */}
                                      <Box sx={{ backgroundColor: "#F0FDF4", p: 1.5, borderRadius: 2, border: "1px solid #BBF7D0", borderLeft: "4px solid #0D5C75" }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#065F46", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                          C. Interview-ready answer ("What you can say in an interview" callout box)
                                        </Typography>
                                        <TextField
                                          fullWidth
                                          multiline
                                          rows={2.5}
                                          size="small"
                                          placeholder='&quot;Machine learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed for every outcome.&quot;'
                                          value={item.interview_answer || item.highlight_box || ""}
                                          onChange={(e) => updateQA(originalIdx, "interview_answer", e.target.value)}
                                          sx={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: 1,
                                            "& .MuiOutlinedInput-root": { fontStyle: "italic" },
                                          }}
                                        />
                                      </Box>

                                      {/* Field 5: Example */}
                                      <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                          D. Example
                                        </Typography>
                                        <TextField
                                          fullWidth
                                          multiline
                                          rows={2}
                                          size="small"
                                          placeholder="A spam filter learns from thousands of labelled emails which words and senders suggest spam."
                                          value={item.example || ""}
                                          onChange={(e) => updateQA(originalIdx, "example", e.target.value)}
                                        />
                                      </Box>

                                      {/* Field 6: Nested Follow-up Questions ("Interviewer may ask") */}
                                      <Paper
                                        variant="outlined"
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          backgroundColor: "#f8fafc",
                                          border: "1px dashed #cbd5e1",
                                        }}
                                      >
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                          <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                              E. Interviewer may ask (Suggested Follow-up Questions)
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#64748b" }}>
                                              Outlined question pills with supporting hints (e.g. "Try answering this aloud first...").
                                            </Typography>
                                          </Box>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<AddIcon fontSize="small" />}
                                            onClick={() => addQAFollowUp(originalIdx)}
                                            sx={{
                                              textTransform: "none",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              borderColor: "#37AB79",
                                              color: "#166534",
                                              "&:hover": { borderColor: "#166534", backgroundColor: "#f0fdf4" },
                                            }}
                                          >
                                            + Add Follow-up
                                          </Button>
                                        </Box>

                                        {(item.follow_up_questions || []).length === 0 ? (
                                          <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center", py: 1 }}>
                                            No follow-up questions yet. Click "+ Add Follow-up" to add one.
                                          </Typography>
                                        ) : (
                                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                            {(item.follow_up_questions || []).map((fq, fIdx) => (
                                              <Paper
                                                key={fq.id || fIdx}
                                                variant="outlined"
                                                sx={{
                                                  p: 1.5,
                                                  borderRadius: 2,
                                                  backgroundColor: "#ffffff",
                                                  borderColor: "#e2e8f0",
                                                }}
                                              >
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                                                    Follow-up #{fIdx + 1}
                                                  </Typography>
                                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <IconButton
                                                      size="small"
                                                      disabled={fIdx === 0}
                                                      onClick={() => moveQAFollowUp(originalIdx, fIdx, -1)}
                                                      sx={{ p: 0.25 }}
                                                    >
                                                      <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <IconButton
                                                      size="small"
                                                      disabled={fIdx === (item.follow_up_questions || []).length - 1}
                                                      onClick={() => moveQAFollowUp(originalIdx, fIdx, 1)}
                                                      sx={{ p: 0.25 }}
                                                    >
                                                      <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <IconButton
                                                      size="small"
                                                      onClick={() => deleteQAFollowUp(originalIdx, fIdx)}
                                                      sx={{ p: 0.25, color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                                                    >
                                                      <DeleteIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                  </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                  <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Follow-up Question Text"
                                                    placeholder="e.g. How is ML different from traditional programming?"
                                                    value={fq.question || ""}
                                                    onChange={(e) => updateQAFollowUp(originalIdx, fIdx, "question", e.target.value)}
                                                  />
                                                  <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Supporting Hint / Instruction (displayed underneath question)"
                                                    placeholder="e.g. Try answering this aloud first, then link it back to the main question above."
                                                    value={fq.hint || ""}
                                                    onChange={(e) => updateQAFollowUp(originalIdx, fIdx, "hint", e.target.value)}
                                                  />
                                                </Box>
                                              </Paper>
                                            ))}
                                          </Box>
                                        )}
                                      </Paper>
                                    </Box>
                                  )}
                                </Paper>
                              )}
                            </SortableItem>
                          );
                        })}
                      </Box>
                    </SortableContainer>
                  )}
                </Box>
              );
            })()}

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
