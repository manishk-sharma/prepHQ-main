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
    title: "Scenario-Based Interview Questions",
    subtitle: "Questions that test how you apply concepts to real-world problems.",
  },
  "coding-questions": {
    title: "Practical & Coding Questions",
    subtitle:
      "Questions where you apply your skills to write code, explain an approach or solve a technical problem.",
  },
  "common-mistakes": {
    title: "Common Interview Mistakes",
    subtitle: "Small habits that quietly weaken good answers.",
  },
  "quick-revision": {
    title: "Quick Revision",
    subtitle: "Refresh the most important concepts at a glance.",
    column1_label: "Concept",
    column2_label: "Concise Explanation",
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
  const [expandedScenarioIds, setExpandedScenarioIds] = useState({});
  const [expandedCodingIds, setExpandedCodingIds] = useState({});
  const [expandedMistakesIds, setExpandedMistakesIds] = useState({});

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
        interview_answer_label: q.interview_answer_label || q.callout_label || "What you can say in an interview",
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
        interview_answer_label: q.interview_answer_label || q.callout_label || "What you can say in an interview",
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

      // Normalize Scenario questions
      const sanitizedScenario = (currentData.scenario_questions || []).map((q, idx) => ({
        id: q.id || `sc-${idx + 1}-${Date.now()}`,
        num: q.num || String(idx + 1).padStart(2, "0"),
        question: q.question || q.title || "",
        default_open: q.default_open !== undefined ? Boolean(q.default_open) : idx === 0,
        interviewer_testing: q.interviewer_testing || q.testing_criteria || q.problem_context || "",
        testing_criteria: q.testing_criteria || q.interviewer_testing || q.problem_context || "",
        problem_context: q.problem_context || q.interviewer_testing || q.testing_criteria || "",
        approach: q.approach || q.investigation_approach || "",
        investigation_approach: q.investigation_approach || q.approach || "",
        expected_answer_label: q.expected_answer_label || "Expected answer",
        expected_answer: q.expected_answer || q.recommended_solution || q.expected_outcome || "",
        recommended_solution: q.recommended_solution || q.expected_answer || q.expected_outcome || "",
        expected_outcome: q.expected_outcome || q.expected_answer || q.recommended_solution || "",
        follow_up_questions: (q.follow_up_questions || q.followUps || q.follow_ups || []).map((fq, fidx) => ({
          id: typeof fq === "object" ? fq.id || `sc-fu-${fidx + 1}-${Date.now()}` : `sc-fu-${fidx + 1}-${Date.now()}`,
          question: typeof fq === "string" ? fq : fq.question || fq.text || "",
          hint: typeof fq === "object" ? fq.hint || "" : "",
        })),
      }));

      // Expand first Scenario card in admin editor by default
      const initialScenarioExpanded = {};
      sanitizedScenario.forEach((q, i) => {
        initialScenarioExpanded[q.id] = i === 0;
      });
      setExpandedScenarioIds(initialScenarioExpanded);

      // Normalize Coding questions
      const sanitizedCoding = (currentData.coding_questions || []).map((q, idx) => ({
        id: q.id || `code-${idx + 1}-${Date.now()}`,
        num: q.num || String(idx + 1).padStart(2, "0"),
        question: q.question || q.title || "",
        title: q.title || q.question || "",
        default_open: q.default_open !== undefined ? Boolean(q.default_open) : idx === 0,
        difficulty: q.difficulty || "Easy",
        language: (q.language || "python").toLowerCase(),
        approach: q.approach || q.expected_approach || "",
        expected_approach: q.expected_approach || q.approach || "",
        code: q.code || q.solution || "",
        solution: q.solution || q.code || "",
        explanation: q.explanation || "",
        time_complexity: q.time_complexity || "",
        space_complexity: q.space_complexity || "",
        follow_up_questions: (q.follow_up_questions || q.follow_ups || q.followUps || (q.follow_up ? [q.follow_up] : [])).map((fq, fidx) => ({
          id: typeof fq === "object" ? fq.id || `code-fu-${fidx + 1}-${Date.now()}` : `code-fu-${fidx + 1}-${Date.now()}`,
          question: typeof fq === "string" ? fq : fq.question || fq.text || "",
          hint: typeof fq === "object" ? fq.hint || "" : "",
        })),
      }));

      const initialCodingExpanded = {};
      sanitizedCoding.forEach((q, i) => {
        initialCodingExpanded[q.id] = i === 0;
      });
      setExpandedCodingIds(initialCodingExpanded);

      // Normalize Common Mistakes
      const sanitizedMistakes = (currentData.common_mistakes || []).map((m, idx) => ({
        id: m.id || `cm-${idx + 1}-${Date.now()}`,
        num: m.num || String(idx + 1).padStart(2, "0"),
        title: m.title || m.question || "",
        default_open: m.default_open !== undefined ? Boolean(m.default_open) : idx === 0,
        problem: m.problem || m.mistake || "",
        mistake: m.mistake || m.problem || "",
        why_it_hurts: m.why_it_hurts || m.why_it_happens || m.whyItMatters || "",
        why_it_happens: m.why_it_happens || m.why_it_hurts || m.whyItMatters || "",
        better_approach: m.better_approach || m.how_to_avoid || m.howToAvoid || "",
        how_to_avoid: m.how_to_avoid || m.better_approach || m.howToAvoid || "",
        recommendation: m.recommendation || "",
      }));

      const initialMistakesExpanded = {};
      sanitizedMistakes.forEach((m, i) => {
        initialMistakesExpanded[m.id] = i === 0;
      });
      setExpandedMistakesIds(initialMistakesExpanded);

      // Normalize Quick Revision
      const sanitizedQuickRevision = (currentData.quick_revision || []).map((r, idx) => ({
        id: r.id || `rev-${idx + 1}-${Date.now()}`,
        concept: r.concept || "",
        explanation: r.explanation || r.definition || r.summary || "",
      }));

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
        scenario_questions: sanitizedScenario,
        coding_questions: sanitizedCoding,
        common_mistakes: sanitizedMistakes,
        quick_revision: sanitizedQuickRevision,
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
        interview_answer_label: "What you can say in an interview",
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
        interview_answer_label: "What you can say in an interview",
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
  const toggleScenarioExpand = (id) => {
    setExpandedScenarioIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllScenario = () => {
    const nextState = {};
    (formData.scenario_questions || []).forEach((q) => {
      nextState[q.id] = true;
    });
    setExpandedScenarioIds(nextState);
  };

  const collapseAllScenario = () => {
    setExpandedScenarioIds({});
  };

  const addScenario = () => {
    const newId = `sc-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: newId,
        num: nextNum,
        question: "New Scenario Question",
        default_open: list.length === 0,
        interviewer_testing: "",
        testing_criteria: "",
        problem_context: "",
        approach: "",
        investigation_approach: "",
        expected_answer_label: "Expected answer",
        expected_answer: "",
        recommended_solution: "",
        expected_outcome: "",
        follow_up_questions: [
          {
            id: `sc-fu-${Date.now()}-1`,
            question: "Is this metric always reliable?",
            hint: "",
          },
        ],
      });
      return { ...prev, scenario_questions: list };
    });
    setExpandedScenarioIds((prev) => ({ ...prev, [newId]: true }));
  };

  const updateScenario = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      const item = { ...list[idx], [field]: val };
      // Backward/forward compatibility sync
      if (field === "interviewer_testing") {
        item.testing_criteria = val;
        item.problem_context = val;
      } else if (field === "testing_criteria" || field === "problem_context") {
        item.interviewer_testing = val;
      } else if (field === "approach") {
        item.investigation_approach = val;
      } else if (field === "investigation_approach") {
        item.approach = val;
      } else if (field === "expected_answer") {
        item.recommended_solution = val;
        item.expected_outcome = val;
      } else if (field === "recommended_solution" || field === "expected_outcome") {
        item.expected_answer = val;
      }
      list[idx] = item;
      return { ...prev, scenario_questions: list };
    });
  };

  const deleteScenario = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      list.splice(idx, 1);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, scenario_questions: renumbered };
    });
  };

  const duplicateScenario = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      const orig = list[idx];
      const newId = `sc-${Date.now()}`;
      const clone = {
        ...orig,
        id: newId,
        question: `${orig.question || "Scenario"} (Copy)`,
        follow_up_questions: (orig.follow_up_questions || []).map((fq, fidx) => ({
          ...fq,
          id: `sc-fu-${Date.now()}-${fidx + 1}`,
        })),
      };
      list.splice(idx + 1, 0, clone);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, scenario_questions: renumbered };
    });
  };

  const handleReorderScenario = (newScenarioList) => {
    const renumbered = newScenarioList.map((item, idx) => ({
      ...item,
      num: String(idx + 1).padStart(2, "0"),
    }));
    setFormData((prev) => ({
      ...prev,
      scenario_questions: renumbered,
    }));
  };

  const moveScenarioItem = (idx, direction) => {
    setFormData((prev) => {
      const fullList = [...(prev.scenario_questions || [])];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= fullList.length) return prev;

      const temp = fullList[idx];
      fullList[idx] = fullList[targetIdx];
      fullList[targetIdx] = temp;

      const renumbered = fullList.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, scenario_questions: renumbered };
    });
  };

  // Follow-up question nested handlers for Scenario
  const addScenarioFollowUp = (scIdx) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      const sc = { ...list[scIdx] };
      const followUps = [...(sc.follow_up_questions || [])];
      followUps.push({
        id: `sc-fu-${Date.now()}`,
        question: "",
        hint: "",
      });
      sc.follow_up_questions = followUps;
      list[scIdx] = sc;
      return { ...prev, scenario_questions: list };
    });
  };

  const updateScenarioFollowUp = (scIdx, fIdx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      const sc = { ...list[scIdx] };
      const followUps = [...(sc.follow_up_questions || [])];
      followUps[fIdx] = { ...followUps[fIdx], [field]: val };
      sc.follow_up_questions = followUps;
      list[scIdx] = sc;
      return { ...prev, scenario_questions: list };
    });
  };

  const deleteScenarioFollowUp = (scIdx, fIdx) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      const sc = { ...list[scIdx] };
      const followUps = [...(sc.follow_up_questions || [])];
      followUps.splice(fIdx, 1);
      sc.follow_up_questions = followUps;
      list[scIdx] = sc;
      return { ...prev, scenario_questions: list };
    });
  };

  const moveScenarioFollowUp = (scIdx, fIdx, direction) => {
    setFormData((prev) => {
      const list = [...(prev.scenario_questions || [])];
      const sc = { ...list[scIdx] };
      const followUps = [...(sc.follow_up_questions || [])];
      const targetIdx = fIdx + direction;
      if (targetIdx < 0 || targetIdx >= followUps.length) return prev;
      const temp = followUps[fIdx];
      followUps[fIdx] = followUps[targetIdx];
      followUps[targetIdx] = temp;
      sc.follow_up_questions = followUps;
      list[scIdx] = sc;
      return { ...prev, scenario_questions: list };
    });
  };

  // ── 4. Coding Handlers ─────────────────────────────────────────────────────
  const toggleCodingExpand = (id) => {
    setExpandedCodingIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllCoding = () => {
    const nextState = {};
    (formData.coding_questions || []).forEach((q) => {
      nextState[q.id] = true;
    });
    setExpandedCodingIds(nextState);
  };

  const collapseAllCoding = () => {
    setExpandedCodingIds({});
  };

  const addCoding = () => {
    const newId = `code-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: newId,
        num: nextNum,
        question: "New Coding Question",
        title: "New Coding Question",
        default_open: list.length === 0,
        difficulty: "Easy",
        language: "python",
        approach: "",
        expected_approach: "",
        code: `# Write solution here\n`,
        solution: `# Write solution here\n`,
        explanation: "",
        time_complexity: "O(n)",
        space_complexity: "O(1)",
        follow_up_questions: [
          {
            id: `code-fu-${Date.now()}-1`,
            question: "How would you optimize this approach if memory is strictly limited?",
            hint: "",
          },
        ],
      });
      return { ...prev, coding_questions: list };
    });
    setExpandedCodingIds((prev) => ({ ...prev, [newId]: true }));
  };

  const updateCoding = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const updated = { ...list[idx], [field]: val };
      if (field === "question") updated.title = val;
      if (field === "title") updated.question = val;
      if (field === "approach") updated.expected_approach = val;
      if (field === "expected_approach") updated.approach = val;
      if (field === "code") updated.solution = val;
      if (field === "solution") updated.code = val;
      list[idx] = updated;
      return { ...prev, coding_questions: list };
    });
  };

  const deleteCoding = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      list.splice(idx, 1);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, coding_questions: renumbered };
    });
  };

  const duplicateCoding = (idx) => {
    const newId = `code-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const source = list[idx];
      if (!source) return prev;
      const copy = JSON.parse(JSON.stringify(source));
      copy.id = newId;
      copy.question = `${copy.question || copy.title} (Copy)`;
      copy.title = copy.question;
      copy.default_open = false;
      copy.follow_up_questions = (copy.follow_up_questions || []).map((fq, fi) => ({
        ...fq,
        id: `code-fu-${Date.now()}-${fi}`,
      }));
      list.splice(idx + 1, 0, copy);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, coding_questions: renumbered };
    });
    setExpandedCodingIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleReorderCoding = (reorderedList) => {
    const renumbered = reorderedList.map((item, i) => ({
      ...item,
      num: String(i + 1).padStart(2, "0"),
    }));
    setFormData((prev) => ({
      ...prev,
      coding_questions: renumbered,
    }));
  };

  const moveCodingItem = (index, direction) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const targetIdx = index + direction;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, coding_questions: renumbered };
    });
  };

  const addCodingFollowUp = (codingIdx) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const codeItem = { ...list[codingIdx] };
      const followUps = [...(codeItem.follow_up_questions || [])];
      followUps.push({
        id: `code-fu-${Date.now()}-${followUps.length + 1}`,
        question: "",
        hint: "",
      });
      codeItem.follow_up_questions = followUps;
      list[codingIdx] = codeItem;
      return { ...prev, coding_questions: list };
    });
  };

  const updateCodingFollowUp = (codingIdx, fIdx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const codeItem = { ...list[codingIdx] };
      const followUps = [...(codeItem.follow_up_questions || [])];
      followUps[fIdx] = { ...followUps[fIdx], [field]: val };
      codeItem.follow_up_questions = followUps;
      list[codingIdx] = codeItem;
      return { ...prev, coding_questions: list };
    });
  };

  const deleteCodingFollowUp = (codingIdx, fIdx) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const codeItem = { ...list[codingIdx] };
      const followUps = [...(codeItem.follow_up_questions || [])];
      followUps.splice(fIdx, 1);
      codeItem.follow_up_questions = followUps;
      list[codingIdx] = codeItem;
      return { ...prev, coding_questions: list };
    });
  };

  const moveCodingFollowUp = (codingIdx, fIdx, direction) => {
    setFormData((prev) => {
      const list = [...(prev.coding_questions || [])];
      const codeItem = { ...list[codingIdx] };
      const followUps = [...(codeItem.follow_up_questions || [])];
      const targetIdx = fIdx + direction;
      if (targetIdx < 0 || targetIdx >= followUps.length) return prev;
      const temp = followUps[fIdx];
      followUps[fIdx] = followUps[targetIdx];
      followUps[targetIdx] = temp;
      codeItem.follow_up_questions = followUps;
      list[codingIdx] = codeItem;
      return { ...prev, coding_questions: list };
    });
  };

  // ── 5. Common Mistakes Handlers ────────────────────────────────────────────
  const toggleMistakesExpand = (id) => {
    setExpandedMistakesIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllMistakes = () => {
    const nextState = {};
    (formData.common_mistakes || []).forEach((m) => {
      nextState[m.id] = true;
    });
    setExpandedMistakesIds(nextState);
  };

  const collapseAllMistakes = () => {
    setExpandedMistakesIds({});
  };

  const addMistake = () => {
    const newId = `cm-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: newId,
        num: nextNum,
        title: "New Common Mistake",
        default_open: list.length === 0,
        problem: "",
        mistake: "",
        why_it_hurts: "",
        why_it_happens: "",
        better_approach: "",
        how_to_avoid: "",
        recommendation: "",
      });
      return { ...prev, common_mistakes: list };
    });
    setExpandedMistakesIds((prev) => ({ ...prev, [newId]: true }));
  };

  const updateMistake = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      const updated = { ...list[idx], [field]: val };
      if (field === "problem") updated.mistake = val;
      if (field === "mistake") updated.problem = val;
      if (field === "why_it_hurts") updated.why_it_happens = val;
      if (field === "why_it_happens") updated.why_it_hurts = val;
      if (field === "better_approach") updated.how_to_avoid = val;
      if (field === "how_to_avoid") updated.better_approach = val;
      list[idx] = updated;
      return { ...prev, common_mistakes: list };
    });
  };

  const deleteMistake = (idx) => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      list.splice(idx, 1);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, common_mistakes: renumbered };
    });
  };

  const duplicateMistake = (idx) => {
    const newId = `cm-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      const source = list[idx];
      if (!source) return prev;
      const copy = JSON.parse(JSON.stringify(source));
      copy.id = newId;
      copy.title = `${copy.title} (Copy)`;
      copy.default_open = false;
      list.splice(idx + 1, 0, copy);
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, common_mistakes: renumbered };
    });
    setExpandedMistakesIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleReorderMistakes = (reorderedList) => {
    const renumbered = reorderedList.map((item, i) => ({
      ...item,
      num: String(i + 1).padStart(2, "0"),
    }));
    setFormData((prev) => ({
      ...prev,
      common_mistakes: renumbered,
    }));
  };

  const moveMistakeItem = (index, direction) => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      const targetIdx = index + direction;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      const renumbered = list.map((item, i) => ({
        ...item,
        num: String(i + 1).padStart(2, "0"),
      }));
      return { ...prev, common_mistakes: renumbered };
    });
  };

  // ── 6. Quick Revision Handlers ─────────────────────────────────────────────
  const addRevisionRow = () => {
    const newId = `rev-${Date.now()}`;
    setFormData((prev) => {
      const list = [...(prev.quick_revision || [])];
      list.push({
        id: newId,
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

  const moveRevisionRow = (index, direction) => {
    setFormData((prev) => {
      const list = [...(prev.quick_revision || [])];
      const targetIdx = index + direction;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, quick_revision: list };
    });
  };

  const handleReorderRevision = (reorderedList) => {
    setFormData((prev) => ({
      ...prev,
      quick_revision: reorderedList,
    }));
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
                                      C. Interview-ready answer callout box
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Callout Heading Label"
                                        placeholder="What you can say in an interview"
                                        value={item.interview_answer_label !== undefined ? item.interview_answer_label : "What you can say in an interview"}
                                        onChange={(e) => updateMustKnow(idx, "interview_answer_label", e.target.value)}
                                        sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                                      />
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={2.5}
                                        size="small"
                                        label="Interview Answer Text (Displayed in callout box)"
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
                                          C. Interview-ready answer callout box
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                          <TextField
                                            fullWidth
                                            size="small"
                                            label="Callout Heading Label"
                                            placeholder="What you can say in an interview"
                                            value={item.interview_answer_label !== undefined ? item.interview_answer_label : "What you can say in an interview"}
                                            onChange={(e) => updateQA(originalIdx, "interview_answer_label", e.target.value)}
                                            sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                                          />
                                          <TextField
                                            fullWidth
                                            multiline
                                            rows={2.5}
                                            size="small"
                                            label="Interview Answer Text (Displayed in callout box)"
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
                {/* Section Toolbar */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                        Section 03 · Scenario-Based Interview Questions
                      </Typography>
                      <Chip
                        label={`${formData.scenario_questions?.length || 0} scenarios`}
                        size="small"
                        sx={{ backgroundColor: "#DEF7EC", color: "#03543F", fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Real-world scenarios with test rationale, investigation approach, highlighted expected answers, and follow-ups.
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={expandAllScenario}
                      sx={{ textTransform: "none", fontSize: "0.8rem", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={collapseAllScenario}
                      sx={{ textTransform: "none", fontSize: "0.8rem", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      Collapse All
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addScenario}
                      sx={{
                        backgroundColor: "#0D5C75",
                        "&:hover": { backgroundColor: "#094153" },
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      + Add Scenario Question
                    </Button>
                  </Box>
                </Box>

                {/* Editable Section Title & Subtitle */}
                {renderSectionHeaderBox("scenario-based", "03 · Scenario-Based Interview Questions")}

                {/* Sortable Scenario Cards List */}
                {(formData.scenario_questions || []).length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 3, backgroundColor: "#f8fafc" }}>
                    <Typography variant="body1" sx={{ color: "#64748b", mb: 1.5, fontWeight: 500 }}>
                      No scenario-based interview questions yet.
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addScenario}
                      sx={{ backgroundColor: "#0D5C75", "&:hover": { backgroundColor: "#094153" }, textTransform: "none" }}
                    >
                      + Add First Scenario Question
                    </Button>
                  </Paper>
                ) : (
                  <SortableContainer
                    items={formData.scenario_questions || []}
                    onReorder={handleReorderScenario}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {(formData.scenario_questions || []).map((item, idx) => {
                        const isCardExpanded = expandedScenarioIds[item.id] ?? false;

                        return (
                          <SortableItem key={item.id} id={item.id}>
                            {({ listeners, isDragging }) => (
                              <Paper
                                variant="outlined"
                                sx={{
                                  borderRadius: 2.5,
                                  backgroundColor: "#ffffff",
                                  borderColor: isDragging ? "#0D5C75" : "#e2e8f0",
                                  boxShadow: isDragging ? 3 : 0,
                                  borderLeft: "4px solid #0D5C75",
                                  overflow: "hidden",
                                  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                }}
                              >
                                {/* Card Header */}
                                <Box
                                  sx={{
                                    p: { xs: 1.5, sm: 2 },
                                    backgroundColor: isCardExpanded ? "#f8fafc" : "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    borderBottom: isCardExpanded ? "1px solid #e2e8f0" : "none",
                                  }}
                                >
                                  {/* Left: Drag Handle, Number Badge, Title, Default Open */}
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                                    <DragHandle listeners={listeners} isDragging={isDragging} />
                                    <Chip
                                      label={`#${item.num || String(idx + 1).padStart(2, "0")}`}
                                      size="small"
                                      sx={{
                                        fontWeight: 700,
                                        backgroundColor: isCardExpanded ? "#0B3553" : "#E2E8F0",
                                        color: isCardExpanded ? "#ffffff" : "#1e293b",
                                        borderRadius: 1.5,
                                        fontSize: "0.75rem",
                                        height: 24,
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
                                      onClick={() => toggleScenarioExpand(item.id)}
                                    >
                                      {item.question || "Untitled Scenario Question"}
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

                                  {/* Right: Actions */}
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                                    <AccessibleReorderButtons
                                      onMoveUp={() => moveScenarioItem(idx, -1)}
                                      onMoveDown={() => moveScenarioItem(idx, 1)}
                                      isFirst={idx === 0}
                                      isLast={idx === (formData.scenario_questions || []).length - 1}
                                    />
                                    <Tooltip title="Duplicate Scenario">
                                      <IconButton
                                        size="small"
                                        onClick={() => duplicateScenario(idx)}
                                        sx={{ color: "#64748b", "&:hover": { color: "#074568" } }}
                                      >
                                        <ContentCopyIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Scenario">
                                      <IconButton
                                        size="small"
                                        onClick={() => deleteScenario(idx)}
                                        sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <IconButton
                                      size="small"
                                      onClick={() => toggleScenarioExpand(item.id)}
                                      sx={{ color: "#475569" }}
                                    >
                                      {isCardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                  </Box>
                                </Box>

                                {/* Card Body (Collapsible) */}
                                {isCardExpanded && (
                                  <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", flexDirection: "column", gap: 2.25 }}>
                                    {/* Field 1: Scenario Question Title and Expand by default switch */}
                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { sm: "center" } }}>
                                      <TextField
                                        fullWidth
                                        required
                                        size="small"
                                        label="Scenario Question (Displayed in header)"
                                        placeholder="e.g. Your model has 95% accuracy, but the business team says the model is not useful. What would you investigate?"
                                        value={item.question || ""}
                                        onChange={(e) => updateScenario(idx, "question", e.target.value)}
                                        sx={{ flex: 1 }}
                                      />
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={Boolean(item.default_open)}
                                            onChange={(e) => updateScenario(idx, "default_open", e.target.checked)}
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

                                    {/* Field 2: What the interviewer is testing */}
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                        A. What the interviewer is testing
                                      </Typography>
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        placeholder="e.g. Understanding of model evaluation and business context."
                                        value={item.interviewer_testing || item.testing_criteria || item.problem_context || ""}
                                        onChange={(e) => updateScenario(idx, "interviewer_testing", e.target.value)}
                                      />
                                    </Box>

                                    {/* Field 3: How to approach it (Rich-Text Editor) */}
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                        B. How to approach it (Rich-Text: investigation steps, paragraphs, lists)
                                      </Typography>
                                      <Box sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5, overflow: "hidden" }}>
                                        <Editor
                                          apiKey={TINYMCE_API_KEY}
                                          value={item.approach || item.investigation_approach || ""}
                                          init={{
                                            height: 180,
                                            menubar: false,
                                            plugins: ["lists", "link", "code"],
                                            toolbar: "undo redo | bold italic underline | bullist numlist | link code",
                                            content_style: "body { font-family: Inter, sans-serif; font-size: 14px; }",
                                          }}
                                          onEditorChange={(content) => updateScenario(idx, "approach", content)}
                                        />
                                      </Box>
                                    </Box>

                                    {/* Field 4 & 5: Expected Answer (Mint Highlighted Callout Box) */}
                                    <Box sx={{ backgroundColor: "#DEF7EC", p: 1.5, borderRadius: 2, border: "1px solid #BBF7D0", borderLeft: "4px solid #0D5C75" }}>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#065F46", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                        C. Expected answer callout box (Mint-green background, teal border)
                                      </Typography>
                                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Expected Answer Label"
                                          placeholder="Expected answer"
                                          value={item.expected_answer_label !== undefined ? item.expected_answer_label : "Expected answer"}
                                          onChange={(e) => updateScenario(idx, "expected_answer_label", e.target.value)}
                                          sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}
                                        />
                                        <TextField
                                          fullWidth
                                          multiline
                                          rows={3}
                                          size="small"
                                          label="Expected Answer Text (Displayed in italics inside mint box)"
                                          placeholder='e.g. &quot;Accuracy can hide poor performance when classes are imbalanced. I would check the class distribution, review precision, recall and PR-AUC for the minority class, align the threshold with business cost, and then improve with class weights, better features or more minority data.&quot;'
                                          value={item.expected_answer || item.recommended_solution || item.expected_outcome || ""}
                                          onChange={(e) => updateScenario(idx, "expected_answer", e.target.value)}
                                          sx={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: 1,
                                            "& .MuiOutlinedInput-root": { fontStyle: "italic" },
                                          }}
                                        />
                                      </Box>
                                    </Box>

                                    {/* Field 6: Possible Follow-ups Manager */}
                                    <Paper
                                      variant="outlined"
                                      sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: "#f8fafc",
                                        borderColor: "#e2e8f0",
                                      }}
                                    >
                                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                        <Box>
                                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", fontSize: "0.8rem" }}>
                                            D. Possible follow-ups ({item.follow_up_questions?.length || 0})
                                          </Typography>
                                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                                            Bulleted follow-up questions interviewer might ask based on this scenario.
                                          </Typography>
                                        </Box>
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          startIcon={<AddIcon />}
                                          onClick={() => addScenarioFollowUp(idx)}
                                          sx={{
                                            textTransform: "none",
                                            borderColor: "#0D5C75",
                                            color: "#0D5C75",
                                            "&:hover": { borderColor: "#094153", backgroundColor: "#DEF7EC" },
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
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                          {(item.follow_up_questions || []).map((fq, fIdx) => (
                                            <Paper
                                              key={fq.id || fIdx}
                                              variant="outlined"
                                              sx={{
                                                p: 1.25,
                                                borderRadius: 1.5,
                                                backgroundColor: "#ffffff",
                                                borderColor: "#e2e8f0",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
                                                <IconButton
                                                  size="small"
                                                  disabled={fIdx === 0}
                                                  onClick={() => moveScenarioFollowUp(idx, fIdx, -1)}
                                                  sx={{ p: 0.25 }}
                                                >
                                                  <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                                <IconButton
                                                  size="small"
                                                  disabled={fIdx === (item.follow_up_questions || []).length - 1}
                                                  onClick={() => moveScenarioFollowUp(idx, fIdx, 1)}
                                                  sx={{ p: 0.25 }}
                                                >
                                                  <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                              </Box>
                                              <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="e.g. Is accuracy always reliable?"
                                                value={fq.question || ""}
                                                onChange={(e) => updateScenarioFollowUp(idx, fIdx, "question", e.target.value)}
                                              />
                                              <IconButton
                                                size="small"
                                                onClick={() => deleteScenarioFollowUp(idx, fIdx)}
                                                sx={{ p: 0.5, color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" }, flexShrink: 0 }}
                                              >
                                                <DeleteIcon sx={{ fontSize: 18 }} />
                                              </IconButton>
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
            )}

            {/* ── TAB 4: 04 · Practical & Coding ── */}
            {(activeMode === "all" || activeTab === 4) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                {/* Section Toolbar */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                        Section 04 · Practical & Coding Questions
                      </Typography>
                      <Chip
                        label={`${formData.coding_questions?.length || 0} questions`}
                        size="small"
                        sx={{ backgroundColor: "#DEF7EC", color: "#03543F", fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Questions where you apply your skills to write code, explain an approach or solve a technical problem.
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={expandAllCoding}
                      sx={{ textTransform: "none", fontSize: "0.8rem", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={collapseAllCoding}
                      sx={{ textTransform: "none", fontSize: "0.8rem", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      Collapse All
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addCoding}
                      sx={{
                        backgroundColor: "#075174",
                        "&:hover": { backgroundColor: "#053d57" },
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      + Add Coding Question
                    </Button>
                  </Box>
                </Box>

                {/* Editable Section Title & Subtitle */}
                {renderSectionHeaderBox("coding-questions", "04 · Practical & Coding Questions")}

                {/* Sortable Coding Cards List */}
                {(formData.coding_questions || []).length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 3, backgroundColor: "#f8fafc" }}>
                    <Typography variant="body1" sx={{ color: "#64748b", mb: 1.5, fontWeight: 500 }}>
                      No practical & coding questions yet.
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addCoding}
                      sx={{ backgroundColor: "#075174", "&:hover": { backgroundColor: "#053d57" }, textTransform: "none" }}
                    >
                      + Add First Coding Question
                    </Button>
                  </Paper>
                ) : (
                  <SortableContainer
                    items={formData.coding_questions || []}
                    onReorder={handleReorderCoding}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {(formData.coding_questions || []).map((item, idx) => {
                        const isCardExpanded = expandedCodingIds[item.id] ?? false;

                        return (
                          <SortableItem key={item.id} id={item.id}>
                            {({ listeners, isDragging }) => (
                              <Paper
                                variant="outlined"
                                sx={{
                                  borderRadius: 2.5,
                                  backgroundColor: "#ffffff",
                                  borderColor: isDragging ? "#075174" : "#e2e8f0",
                                  boxShadow: isDragging ? 3 : 0,
                                  borderLeft: "4px solid #075174",
                                  overflow: "hidden",
                                  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                }}
                              >
                                {/* Card Header */}
                                <Box
                                  sx={{
                                    p: { xs: 1.5, sm: 2 },
                                    backgroundColor: isCardExpanded ? "#f8fafc" : "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    borderBottom: isCardExpanded ? "1px solid #e2e8f0" : "none",
                                  }}
                                >
                                  {/* Left: Drag Handle, Number Badge, Title, Chips */}
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                                    <DragHandle listeners={listeners} isDragging={isDragging} />
                                    <Chip
                                      label={`#${item.num || String(idx + 1).padStart(2, "0")}`}
                                      size="small"
                                      sx={{
                                        fontWeight: 700,
                                        backgroundColor: isCardExpanded ? "#0B3553" : "#E2E8F0",
                                        color: isCardExpanded ? "#ffffff" : "#1e293b",
                                        borderRadius: 1.5,
                                        fontSize: "0.75rem",
                                        height: 24,
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
                                      onClick={() => toggleCodingExpand(item.id)}
                                    >
                                      {item.question || item.title || "Untitled Coding Question"}
                                    </Typography>
                                    <Chip
                                      label={item.language || "python"}
                                      size="small"
                                      sx={{
                                        fontWeight: 700,
                                        backgroundColor: "#0284c7",
                                        color: "#fff",
                                        fontSize: "0.7rem",
                                        height: 20,
                                        textTransform: "uppercase",
                                      }}
                                    />
                                    {item.difficulty && (
                                      <Chip
                                        label={item.difficulty}
                                        size="small"
                                        sx={{
                                          fontSize: "0.7rem",
                                          height: 20,
                                          fontWeight: 600,
                                          backgroundColor:
                                            item.difficulty === "Easy"
                                              ? "#DEF7EC"
                                              : item.difficulty === "Medium"
                                              ? "#FEF3C7"
                                              : "#FEE2E2",
                                          color:
                                            item.difficulty === "Easy"
                                              ? "#03543F"
                                              : item.difficulty === "Medium"
                                              ? "#92400E"
                                              : "#991B1B",
                                        }}
                                      />
                                    )}
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

                                  {/* Right: Actions */}
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                                    <AccessibleReorderButtons
                                      onMoveUp={() => moveCodingItem(idx, -1)}
                                      onMoveDown={() => moveCodingItem(idx, 1)}
                                      isFirst={idx === 0}
                                      isLast={idx === (formData.coding_questions || []).length - 1}
                                    />
                                    <Tooltip title="Duplicate Question">
                                      <IconButton
                                        size="small"
                                        onClick={() => duplicateCoding(idx)}
                                        sx={{ color: "#64748b", "&:hover": { color: "#074568" } }}
                                      >
                                        <ContentCopyIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Question">
                                      <IconButton
                                        size="small"
                                        onClick={() => deleteCoding(idx)}
                                        sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <IconButton
                                      size="small"
                                      onClick={() => toggleCodingExpand(item.id)}
                                      sx={{ color: "#64748b" }}
                                    >
                                      {isCardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                  </Box>
                                </Box>

                                {/* Card Body (Expanded) */}
                                {isCardExpanded && (
                                  <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    {/* Top Row: Title, Language, Difficulty, Default Open Switch */}
                                    <Box
                                      sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "1fr", sm: "3fr 1.2fr 1.2fr auto" },
                                        gap: 2,
                                        alignItems: "center",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Question Title"
                                        placeholder="e.g. Write Python code to find duplicate values in a list."
                                        value={item.question || ""}
                                        onChange={(e) => updateCoding(idx, "question", e.target.value)}
                                      />
                                      <FormControl size="small" fullWidth>
                                        <InputLabel>Language</InputLabel>
                                        <Select
                                          value={item.language || "python"}
                                          label="Language"
                                          onChange={(e) => updateCoding(idx, "language", e.target.value)}
                                        >
                                          <MenuItem value="python">Python</MenuItem>
                                          <MenuItem value="javascript">JavaScript</MenuItem>
                                          <MenuItem value="typescript">TypeScript</MenuItem>
                                          <MenuItem value="sql">SQL</MenuItem>
                                          <MenuItem value="cpp">C++</MenuItem>
                                          <MenuItem value="java">Java</MenuItem>
                                        </Select>
                                      </FormControl>
                                      <FormControl size="small" fullWidth>
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
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            size="small"
                                            checked={item.default_open ?? false}
                                            onChange={(e) => updateCoding(idx, "default_open", e.target.checked)}
                                            color="success"
                                          />
                                        }
                                        label={
                                          <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569" }}>
                                            Open by default
                                          </Typography>
                                        }
                                        sx={{ m: 0 }}
                                      />
                                    </Box>

                                    {/* Field 1: Expected Approach */}
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                        A. Expected approach (Short explanation of algorithm or strategy)
                                      </Typography>
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        placeholder="Track values already seen; when a value appears again, record it as a duplicate. One pass, O(n)."
                                        value={item.approach || item.expected_approach || ""}
                                        onChange={(e) => updateCoding(idx, "approach", e.target.value)}
                                        sx={{ backgroundColor: "#f8fafc", borderRadius: 1.5 }}
                                      />
                                    </Box>

                                    {/* Field 2: Solution Code (Monospace Code Block) */}
                                    <Box>
                                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.8rem" }}>
                                          B. Solution code (Syntax-highlighted monospace code block, preserves indentation)
                                        </Typography>
                                        <Chip
                                          label={item.language || "python"}
                                          size="small"
                                          sx={{ height: 20, fontSize: "0.7rem", backgroundColor: "#075174", color: "#fff", fontWeight: 700 }}
                                        />
                                      </Box>
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={9}
                                        placeholder={`def find_duplicates(nums):\n    seen, dups = set(), set()\n    for x in nums:\n        if x in seen:\n            dups.add(x)\n        seen.add(x)\n    return list(dups)`}
                                        value={item.code || item.solution || ""}
                                        onChange={(e) => updateCoding(idx, "code", e.target.value)}
                                        sx={{
                                          backgroundColor: "#075174",
                                          borderRadius: 2,
                                          p: 1,
                                          "& .MuiInputBase-root": {
                                            backgroundColor: "transparent",
                                            color: "#e2e8f0",
                                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                                            fontSize: "0.875rem",
                                            lineHeight: 1.6,
                                          },
                                          "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(255, 255, 255, 0.2)",
                                          },
                                          "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#38bdf8",
                                          },
                                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#38bdf8",
                                          },
                                        }}
                                      />
                                    </Box>

                                    {/* Field 3: Explanation */}
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                        C. Explanation (Detailed breakdown of how the solution works)
                                      </Typography>
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        placeholder="seen stores everything visited. If x is already in seen, it is a repeat and goes into dups. A set gives O(1) lookups, so the loop is linear."
                                        value={item.explanation || ""}
                                        onChange={(e) => updateCoding(idx, "explanation", e.target.value)}
                                        sx={{ backgroundColor: "#f8fafc", borderRadius: 1.5 }}
                                      />
                                    </Box>

                                    {/* Field 4: Time and Space Complexity */}
                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Time Complexity (e.g. O(n))"
                                        value={item.time_complexity || ""}
                                        onChange={(e) => updateCoding(idx, "time_complexity", e.target.value)}
                                        sx={{ backgroundColor: "#f8fafc" }}
                                      />
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Space Complexity (e.g. O(n) or O(1))"
                                        value={item.space_complexity || ""}
                                        onChange={(e) => updateCoding(idx, "space_complexity", e.target.value)}
                                        sx={{ backgroundColor: "#f8fafc" }}
                                      />
                                    </Box>

                                    {/* Field 5: Interviewer follow-up questions */}
                                    <Paper
                                      variant="outlined"
                                      sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: "#f8fafc",
                                        borderColor: "#e2e8f0",
                                      }}
                                    >
                                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                        <Box>
                                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", fontSize: "0.8rem" }}>
                                            D. Interviewer follow-up questions ({item.follow_up_questions?.length || 0})
                                          </Typography>
                                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                                            Follow-up questions or alternative constraints an interviewer might ask.
                                          </Typography>
                                        </Box>
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          startIcon={<AddIcon />}
                                          onClick={() => addCodingFollowUp(idx)}
                                          sx={{
                                            textTransform: "none",
                                            borderColor: "#075174",
                                            color: "#075174",
                                            "&:hover": { borderColor: "#053d57", backgroundColor: "#DEF7EC" },
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
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                          {(item.follow_up_questions || []).map((fq, fIdx) => (
                                            <Paper
                                              key={fq.id || fIdx}
                                              variant="outlined"
                                              sx={{
                                                p: 1.25,
                                                borderRadius: 1.5,
                                                backgroundColor: "#ffffff",
                                                borderColor: "#e2e8f0",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
                                                <IconButton
                                                  size="small"
                                                  disabled={fIdx === 0}
                                                  onClick={() => moveCodingFollowUp(idx, fIdx, -1)}
                                                  sx={{ p: 0.25 }}
                                                >
                                                  <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                                <IconButton
                                                  size="small"
                                                  disabled={fIdx === (item.follow_up_questions || []).length - 1}
                                                  onClick={() => moveCodingFollowUp(idx, fIdx, 1)}
                                                  sx={{ p: 0.25 }}
                                                >
                                                  <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                              </Box>
                                              <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="e.g. How would you solve this without using a set? Sort the list and compare neighbours O(n log n)."
                                                value={fq.question || ""}
                                                onChange={(e) => updateCodingFollowUp(idx, fIdx, "question", e.target.value)}
                                              />
                                              <IconButton
                                                size="small"
                                                onClick={() => deleteCodingFollowUp(idx, fIdx)}
                                                sx={{ p: 0.5, color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" }, flexShrink: 0 }}
                                              >
                                                <DeleteIcon sx={{ fontSize: 18 }} />
                                              </IconButton>
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
            )}

            {/* ── TAB 5: 05 · Common Mistakes ── */}
            {(activeMode === "all" || activeTab === 5) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                {/* Section Toolbar */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                        Section 05 · Common Interview Mistakes
                      </Typography>
                      <Chip
                        label={`${formData.common_mistakes?.length || 0} mistakes`}
                        size="small"
                        sx={{ backgroundColor: "#DEF7EC", color: "#03543F", fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Small habits that quietly weaken good answers.
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={expandAllMistakes}
                      sx={{ textTransform: "none", fontSize: "0.8rem", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={collapseAllMistakes}
                      sx={{ textTransform: "none", fontSize: "0.8rem", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      Collapse All
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addMistake}
                      sx={{
                        backgroundColor: "#075174",
                        "&:hover": { backgroundColor: "#053d57" },
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      + Add Common Mistake
                    </Button>
                  </Box>
                </Box>

                {/* Editable Section Title & Subtitle */}
                {renderSectionHeaderBox("common-mistakes", "05 · Common Interview Mistakes")}

                {/* Sortable Mistakes Cards List */}
                {(formData.common_mistakes || []).length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 3, backgroundColor: "#f8fafc" }}>
                    <Typography variant="body1" sx={{ color: "#64748b", mb: 1.5, fontWeight: 500 }}>
                      No common interview mistakes added yet.
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addMistake}
                      sx={{ backgroundColor: "#075174", "&:hover": { backgroundColor: "#053d57" }, textTransform: "none" }}
                    >
                      + Add First Common Mistake
                    </Button>
                  </Paper>
                ) : (
                  <SortableContainer
                    items={formData.common_mistakes || []}
                    onReorder={handleReorderMistakes}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {(formData.common_mistakes || []).map((item, idx) => {
                        const isCardExpanded = expandedMistakesIds[item.id] ?? false;

                        return (
                          <SortableItem key={item.id} id={item.id}>
                            {({ listeners, isDragging }) => (
                              <Paper
                                variant="outlined"
                                sx={{
                                  borderRadius: 2.5,
                                  backgroundColor: "#ffffff",
                                  borderColor: isDragging ? "#075174" : "#e2e8f0",
                                  boxShadow: isDragging ? 3 : 0,
                                  borderLeft: "4px solid #075174",
                                  overflow: "hidden",
                                  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                }}
                              >
                                {/* Card Header */}
                                <Box
                                  sx={{
                                    p: { xs: 1.5, sm: 2 },
                                    backgroundColor: isCardExpanded ? "#f8fafc" : "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    borderBottom: isCardExpanded ? "1px solid #e2e8f0" : "none",
                                  }}
                                >
                                  {/* Left: Drag Handle, Number Badge, Title, Default Open */}
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                                    <DragHandle listeners={listeners} isDragging={isDragging} />
                                    <Chip
                                      label={`#${item.num || String(idx + 1).padStart(2, "0")}`}
                                      size="small"
                                      sx={{
                                        fontWeight: 700,
                                        backgroundColor: isCardExpanded ? "#0B3553" : "#E2E8F0",
                                        color: isCardExpanded ? "#ffffff" : "#1e293b",
                                        borderRadius: 1.5,
                                        fontSize: "0.75rem",
                                        height: 24,
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
                                      onClick={() => toggleMistakesExpand(item.id)}
                                    >
                                      {item.title || "Untitled Mistake"}
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

                                  {/* Right: Actions */}
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                                    <AccessibleReorderButtons
                                      onMoveUp={() => moveMistakeItem(idx, -1)}
                                      onMoveDown={() => moveMistakeItem(idx, 1)}
                                      isFirst={idx === 0}
                                      isLast={idx === (formData.common_mistakes || []).length - 1}
                                    />
                                    <Tooltip title="Duplicate Mistake">
                                      <IconButton
                                        size="small"
                                        onClick={() => duplicateMistake(idx)}
                                        sx={{ color: "#64748b", "&:hover": { color: "#074568" } }}
                                      >
                                        <ContentCopyIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Mistake">
                                      <IconButton
                                        size="small"
                                        onClick={() => deleteMistake(idx)}
                                        sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <IconButton
                                      size="small"
                                      onClick={() => toggleMistakesExpand(item.id)}
                                      sx={{ color: "#64748b" }}
                                    >
                                      {isCardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                  </Box>
                                </Box>

                                {/* Card Body (Expanded) */}
                                {isCardExpanded && (
                                  <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    {/* Top Row: Title & Default Open Switch */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                                      <TextField
                                        fullWidth
                                        size="small"
                                        label="Mistake Title"
                                        placeholder="e.g. Memorizing Definitions"
                                        value={item.title || ""}
                                        onChange={(e) => updateMistake(idx, "title", e.target.value)}
                                        sx={{ flex: 1 }}
                                      />
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            size="small"
                                            checked={item.default_open ?? false}
                                            onChange={(e) => updateMistake(idx, "default_open", e.target.checked)}
                                            color="success"
                                          />
                                        }
                                        label={
                                          <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569" }}>
                                            Open by default
                                          </Typography>
                                        }
                                        sx={{ m: 0 }}
                                      />
                                    </Box>

                                    {/* Field 1: The problem */}
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                        A. The problem (Concise explanation of the mistake)
                                      </Typography>
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        placeholder="Reciting textbook lines word for word."
                                        value={item.problem || item.mistake || ""}
                                        onChange={(e) => updateMistake(idx, "problem", e.target.value)}
                                        sx={{ backgroundColor: "#f8fafc", borderRadius: 1.5 }}
                                      />
                                    </Box>

                                    {/* Field 2: Why it hurts */}
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                        B. Why it hurts (How the mistake affects interview performance)
                                      </Typography>
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        placeholder="Interviewers can tell, and follow-up questions expose shallow understanding."
                                        value={item.why_it_hurts || item.why_it_happens || ""}
                                        onChange={(e) => updateMistake(idx, "why_it_hurts", e.target.value)}
                                        sx={{ backgroundColor: "#f8fafc", borderRadius: 1.5 }}
                                      />
                                    </Box>

                                    {/* Field 3: Better approach */}
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", mb: 0.5, fontSize: "0.8rem" }}>
                                        C. Better approach (How the candidate can improve)
                                      </Typography>
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        placeholder="Explain in your own words, then connect it to a problem you have worked on."
                                        value={item.better_approach || item.how_to_avoid || ""}
                                        onChange={(e) => updateMistake(idx, "better_approach", e.target.value)}
                                        sx={{ backgroundColor: "#f8fafc", borderRadius: 1.5 }}
                                      />
                                    </Box>

                                    {/* Field 4: Recommendation tip (optional) */}
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", display: "block", mb: 0.5, fontSize: "0.75rem" }}>
                                        D. Optional Recommendation / Tip (Summary highlight)
                                      </Typography>
                                      <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="e.g. Always anchor your answers with a concrete project story or metric."
                                        value={item.recommendation || ""}
                                        onChange={(e) => updateMistake(idx, "recommendation", e.target.value)}
                                        sx={{ backgroundColor: "#f0fdf4", borderRadius: 1.5 }}
                                      />
                                    </Box>
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
            )}

            {/* ── TAB 6: 06 · Quick Revision ── */}
            {(activeMode === "all" || activeTab === 6) && (
              <Box sx={{ mb: activeMode === "all" ? 4 : 0 }}>
                {/* Section Toolbar */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                        Section 06 · Quick Revision Table
                      </Typography>
                      <Chip
                        label={`${formData.quick_revision?.length || 0} rows`}
                        size="small"
                        sx={{ backgroundColor: "#DEF7EC", color: "#03543F", fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Refresh the most important concepts at a glance.
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addRevisionRow}
                    sx={{
                      backgroundColor: "#075174",
                      "&:hover": { backgroundColor: "#053d57" },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    + Add Revision Row
                  </Button>
                </Box>

                {/* Section Header & Column Labels Editor */}
                <Paper variant="outlined" sx={{ p: 2, mb: 2.5, backgroundColor: "#f8fafc", borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568", mb: 1 }}>
                    Quick Revision Section Header & Table Columns
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mb: 1.5 }}>
                    <TextField
                      size="small"
                      label="Section Title"
                      value={formData.section_headers?.["quick-revision"]?.title || "Quick Revision"}
                      onChange={(e) => handleSectionHeaderChange("quick-revision", "title", e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Section Subtitle"
                      value={formData.section_headers?.["quick-revision"]?.subtitle || "Refresh the most important concepts at a glance."}
                      onChange={(e) => handleSectionHeaderChange("quick-revision", "subtitle", e.target.value)}
                      sx={{ flex: 2 }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                    <TextField
                      size="small"
                      label="Table Column 1 Header"
                      value={formData.section_headers?.["quick-revision"]?.column1_label || "Concept"}
                      onChange={(e) => handleSectionHeaderChange("quick-revision", "column1_label", e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Table Column 2 Header"
                      value={formData.section_headers?.["quick-revision"]?.column2_label || "Concise Explanation"}
                      onChange={(e) => handleSectionHeaderChange("quick-revision", "column2_label", e.target.value)}
                      sx={{ flex: 2 }}
                    />
                  </Box>
                </Paper>

                {/* Table Rows List */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", borderColor: "#e2e8f0" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "50px 1fr 1.5fr 70px", sm: "80px 1.2fr 2.5fr 90px" },
                      backgroundColor: "#075174",
                      color: "#fff",
                      px: 2,
                      py: 1.4,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      alignItems: "center",
                    }}
                  >
                    <Box>#</Box>
                    <Box>{formData.section_headers?.["quick-revision"]?.column1_label || "Concept"}</Box>
                    <Box>{formData.section_headers?.["quick-revision"]?.column2_label || "Concise Explanation"}</Box>
                    <Box sx={{ textAlign: "right" }}>Actions</Box>
                  </Box>

                  {(formData.quick_revision || []).length === 0 ? (
                    <Box sx={{ p: 4, textAlign: "center", color: "#64748b" }}>
                      <Typography variant="body2" sx={{ mb: 1.5 }}>
                        No revision rows yet. Click "+ Add Revision Row" above.
                      </Typography>
                    </Box>
                  ) : (
                    <SortableContainer
                      items={formData.quick_revision || []}
                      onReorder={handleReorderRevision}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {(formData.quick_revision || []).map((row, idx) => (
                          <SortableItem key={row.id || idx} id={row.id || `rev-${idx}`}>
                            {({ listeners, isDragging }) => (
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: { xs: "50px 1fr 1.5fr 70px", sm: "80px 1.2fr 2.5fr 90px" },
                                  alignItems: "center",
                                  px: 2,
                                  py: 1,
                                  borderBottom: "1px solid #f1f5f9",
                                  backgroundColor: isDragging
                                    ? "#f0fdf4"
                                    : idx % 2 === 0
                                    ? "#ffffff"
                                    : "#f8fafc",
                                  gap: 1,
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <DragHandle listeners={listeners} isDragging={isDragging} />
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b" }}>
                                    {String(idx + 1).padStart(2, "0")}
                                  </Typography>
                                </Box>
                                <TextField
                                  size="small"
                                  placeholder="e.g. Overfitting"
                                  value={row.concept || ""}
                                  onChange={(e) => updateRevisionRow(idx, "concept", e.target.value)}
                                  sx={{ mr: 0.5, "& .MuiInputBase-input": { fontWeight: 600 } }}
                                />
                                <TextField
                                  size="small"
                                  placeholder="e.g. Performs well on training data but poorly on unseen data"
                                  value={row.explanation || ""}
                                  onChange={(e) => updateRevisionRow(idx, "explanation", e.target.value)}
                                  sx={{ mr: 0.5 }}
                                />
                                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.25 }}>
                                  <AccessibleReorderButtons
                                    onMoveUp={() => moveRevisionRow(idx, -1)}
                                    onMoveDown={() => moveRevisionRow(idx, 1)}
                                    isFirst={idx === 0}
                                    isLast={idx === (formData.quick_revision || []).length - 1}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteRevisionRow(idx)}
                                    sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                                  >
                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            )}
                          </SortableItem>
                        ))}
                      </Box>
                    </SortableContainer>
                  )}
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
