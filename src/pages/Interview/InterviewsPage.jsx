import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiCalendar,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaLinkedinIn,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa6";
import parse from "html-react-parser";
import {
  useInterviewList,
  useInterviewDetails,
} from "../../services/interviewsServices";
import { useTutorialList } from "../../services/tutorialServices";
import { useBlogList } from "../../services/blogServices";
import "./InterviewsPage.css";

// ── HTML Sanitization & Safe Parsing ───────────────────────────────────────
const sanitizeHtml = (html) => {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*(["'])[\s\S]*?\1/gi, "")
    .replace(/javascript:/gi, "");
};

const renderContent = (content) => {
  if (!content) return null;
  if (typeof content !== "string") return content;
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return parse(sanitizeHtml(content));
  }
  if (content.includes("\n")) {
    return (
      <div className="multiline-text-block">
        {content.split("\n").map((line, idx) =>
          line.trim() ? <p key={idx} style={{ marginBottom: "0.4rem" }}>{line}</p> : null
        )}
      </div>
    );
  }
  return <p>{content}</p>;
};

const renderQuote = (content) => {
  if (!content) return null;
  if (typeof content !== "string") {
    return <em>{renderContent(content)}</em>;
  }
  const trimmed = content.trim();
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return <em>{renderContent(trimmed)}</em>;
  }
  const clean = trimmed.replace(/^["“]+|["”]+$/g, "");
  return <em>"{clean}"</em>;
};

// ── Default Fallback Section Headers ───────────────────────────────────────
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
    subtitle: "Questions where you may be asked to write code, explain an approach or solve a technical problem.",
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

const SECTION_DEFAULT_NAMES = {
  "must-know": "Must-Know Questions",
  "questions-answers": "Questions & Answers",
  "scenario-based": "Scenario-Based Questions",
  "coding-questions": "Practical & Coding Questions",
  "common-mistakes": "Common Interview Mistakes",
  "quick-revision": "Quick Revision",
};

const DEFAULT_SECTIONS_ORDER = [
  "must-know",
  "questions-answers",
  "scenario-based",
  "coding-questions",
  "common-mistakes",
  "quick-revision",
];

// ── Fallback Right Sidebar Cards ───────────────────────────────────────────
const DEFAULT_RELATED_INTERVIEWS = [
  {
    title: "Top List of Blockchain Project Ideas for Students",
    date: "18 Mar 2026",
    link: "/interviews/blockchain-projects",
  },
  {
    title: "AI Project Ideas: Beginner to Final-Year Level",
    date: "10 Feb 2026",
    link: "/interviews/ai-project-ideas",
  },
  {
    title: "SQL Projects for Data Analysis: Detailed Guide",
    date: "12 Dec 2025",
    link: "/interviews/sql-projects-for-data-analysis",
  },
];

const DEFAULT_TUTORIALS = [
  {
    title: "Python for Machine Learning Masterclass",
    date: "05 Aug 2025",
    link: "/tutorials",
  },
  {
    title: "Deep Learning with PyTorch from Scratch",
    date: "12 Jul 2025",
    link: "/tutorials",
  },
  {
    title: "Feature Engineering & Data Cleaning Guide",
    date: "22 Jun 2025",
    link: "/tutorials",
  },
];

const DEFAULT_MINI_GUIDES = [
  {
    title: "ML Algorithms Cheatsheet & Formulas",
    date: "15 Jan 2026",
    link: "/blogs",
  },
  {
    title: "Model Evaluation Metrics Handbook",
    date: "02 Feb 2026",
    link: "/blogs",
  },
  {
    title: "System Design for ML Services Guide",
    date: "20 Feb 2026",
    link: "/blogs",
  },
];

// ==========================================================================
// MASTER INTERVIEWS PAGE COMPONENT (DYNAMICALLY BACKED BY DATABASE)
// ==========================================================================
const InterviewsPage = () => {
  const { postSlug } = useParams();
  const activeSlug = postSlug || "machine-learning-interview-questions-answers";

  // Fetch dynamic interview page data from database
  const { data: dbData, isLoading } = useInterviewDetails(activeSlug);

  const [activeSection, setActiveSection] = useState("must-know");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState({
    "mk-1": true,
    "sc-1": true,
    "code-1": true,
    "cm-1": true,
  });

  // Filter state for Section 02 (Questions & Answers)
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");

  // Fallback API hooks for right sidebar widgets
  const { data: apiInterviews } = useInterviewList();
  const { data: apiTutorials } = useTutorialList();
  const { data: apiBlogs } = useBlogList();

  // Extract page metadata
  const pageTitle = dbData?.title || "Machine Learning Interview Questions & Answers";
  const pageDesc =
    dbData?.subtitle ||
    dbData?.description ||
    "Prepare for Machine Learning interviews with essential concepts, practical examples, and frequently asked questions to help you build confidence.";

  // Extract structured sections
  const mustKnowQuestions = dbData?.must_know_questions || [];
  const qaQuestions = dbData?.qa_questions || [];
  const scenarioQuestions = dbData?.scenario_questions || [];
  const codingQuestions = dbData?.coding_questions || [];
  const commonMistakes = dbData?.common_mistakes || [];
  const quickRevision = dbData?.quick_revision || [];

  const sectionHeaders = {
    ...DEFAULT_SECTION_HEADERS,
    ...(dbData?.section_headers || {}),
  };

  const sectionsOrder =
    Array.isArray(dbData?.sections_order) && dbData.sections_order.length > 0
      ? dbData.sections_order
      : DEFAULT_SECTIONS_ORDER;

  // Initialize first item open from DB data if not set
  useEffect(() => {
    if (dbData) {
      const initialOpen = {};
      mustKnowQuestions.forEach((q, idx) => {
        if (q.default_open === true || (idx === 0 && q.default_open !== false)) {
          initialOpen[q.id || `mk-${idx + 1}`] = true;
        }
      });

      // Initialize QA questions open state for the current difficulty
      const currentDifficultyQuestions = (qaQuestions || []).filter(
        (q) => (q.difficulty || "beginner").toLowerCase() === selectedDifficulty.toLowerCase()
      );
      currentDifficultyQuestions.forEach((q, idx) => {
        if (q.default_open === true || (idx === 0 && q.default_open !== false)) {
          initialOpen[q.id || `qa-${idx + 1}`] = true;
        }
      });

      scenarioQuestions.forEach((q, idx) => {
        if (q.default_open === true || (idx === 0 && q.default_open !== false)) {
          initialOpen[q.id || `sc-${idx + 1}`] = true;
        }
      });
      codingQuestions.forEach((q, idx) => {
        if (q.default_open === true || (idx === 0 && q.default_open !== false)) {
          initialOpen[q.id || `code-${idx + 1}`] = true;
        }
      });
      commonMistakes.forEach((m, idx) => {
        if (m.default_open === true || (idx === 0 && m.default_open !== false)) {
          initialOpen[m.id || `cm-${idx + 1}`] = true;
        }
      });
      setOpenAccordions((prev) => ({ ...initialOpen, ...prev }));
    }
  }, [dbData, selectedDifficulty]);

  // Dynamic Navigation Items based on sections_order & headers
  const navSections = sectionsOrder.map((secId, idx) => {
    const header = sectionHeaders[secId] || DEFAULT_SECTION_HEADERS[secId];
    const cleanLabel =
      header?.title?.replace(/^\d+[\s·.-]*/, "") ||
      SECTION_DEFAULT_NAMES[secId] ||
      secId;
    return {
      id: secId,
      number: String(idx + 1).padStart(2, "0"),
      label: cleanLabel,
    };
  });

  // Related Content Lists (DB sidebar_cards prioritized over generic API)
  const relatedInterviews =
    dbData?.sidebar_cards?.related_interviews?.length > 0
      ? dbData.sidebar_cards.related_interviews
          .filter((c) => c.status === "active" || c.is_active !== false)
          .map((c) => ({
            title: c.title,
            date: c.display_date || c.displayDate || "18 Mar 2026",
            link: c.destination_url || c.destinationUrl || "/interviews",
          }))
      : apiInterviews?.length > 0
      ? apiInterviews.slice(0, 3).map((item) => ({
          title: item.post_title,
          date: item.post_date
            ? new Date(item.post_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "18 Mar 2026",
          link: `/interviews/${item.post_name || item.ID}`,
        }))
      : DEFAULT_RELATED_INTERVIEWS;

  const tutorialsList =
    dbData?.sidebar_cards?.tutorials?.length > 0
      ? dbData.sidebar_cards.tutorials
          .filter((c) => c.status === "active" || c.is_active !== false)
          .map((c) => ({
            title: c.title,
            date: c.display_date || c.displayDate || "05 Aug 2025",
            link: c.destination_url || c.destinationUrl || "/tutorials",
          }))
      : apiTutorials?.length > 0
      ? apiTutorials.slice(0, 3).map((item) => ({
          title: item.post_title || item.title,
          date: item.post_date
            ? new Date(item.post_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "05 Aug 2025",
          link: `/tutorials/${item.post_name || item.slug || ""}`,
        }))
      : DEFAULT_TUTORIALS;

  const miniGuidesList =
    dbData?.sidebar_cards?.mini_guides?.length > 0
      ? dbData.sidebar_cards.mini_guides
          .filter((c) => c.status === "active" || c.is_active !== false)
          .map((c) => ({
            title: c.title,
            date: c.display_date || c.displayDate || "15 Jan 2026",
            link: c.destination_url || c.destinationUrl || "/blogs",
          }))
      : apiBlogs?.length > 0
      ? apiBlogs.slice(0, 3).map((item) => ({
          title: item.post_title || item.title,
          date: item.post_date
            ? new Date(item.post_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "15 Jan 2026",
          link: `/blogs/${item.post_name || item.slug || ""}`,
        }))
      : DEFAULT_MINI_GUIDES;

  // Toggle accordion item
  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered Q&A questions based on selected difficulty
  const filteredQaQuestions =
    selectedDifficulty === "all"
      ? qaQuestions
      : qaQuestions.filter(
          (q) =>
            (q.difficulty || "").toLowerCase() === selectedDifficulty.toLowerCase()
        );

  // Smooth scroll handler
  const handleScrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Share handlers
  const handleCopyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = (codeText, id) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const currentUrl =
    typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const shareTitle = encodeURIComponent(`${pageTitle} | PrepHQ`);

  // Scrollspy to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const section of navSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navSections]);

  // ── Section 01 Renderer: Must-Know Questions (Reference-Matched Design) ───
  const renderMustKnowSection = () => {
    const header = sectionHeaders["must-know"];
    const rawTitle = header?.title || "Must–Know Questions";
    const badgeTitle = rawTitle.replace(/^\d+[\s·.-]*/, "").trim() || "Must–Know Questions";
    const subtitle =
      header?.subtitle ||
      "Start with the questions you should be able to answer before any Machine Learning interview.";

    return (
      <section
        key="must-know"
        id="must-know"
        className="interview-section must-know-section-wrap"
        aria-labelledby="heading-must-know"
      >
        <div className="must-know-header-wrap">
          <div id="heading-must-know" className="must-know-badge">
            {badgeTitle}
          </div>
          <p className="must-know-subtitle">{subtitle}</p>
        </div>

        <div className="must-know-accordion-list" role="region" aria-label="Must-Know Questions">
          {mustKnowQuestions.map((item, idx) => {
            const itemId = item.id || `mk-${idx + 1}`;
            const isOpen = !!openAccordions[itemId];
            const num = item.num || String(idx + 1).padStart(2, "0");

            // Extract follow-up questions supporting both { question, hint } and legacy string arrays
            const rawFollowUps =
              item.follow_up_questions || item.subQuestions || item.sub_questions || [];
            const followUpList = Array.isArray(rawFollowUps)
              ? rawFollowUps.map((fu, fIdx) => {
                  if (typeof fu === "string") {
                    return { id: `fu-${itemId}-${fIdx}`, question: fu, hint: "" };
                  }
                  return {
                    id: fu.id || `fu-${itemId}-${fIdx}`,
                    question: fu.question || "",
                    hint: fu.hint || "",
                  };
                })
              : [];

            const simpleExplanation = item.simple_explanation || item.simple_definition;
            const technicalExplanation = item.technical_explanation || item.explanation;
            const interviewAnswer =
              item.interview_answer || item.highlight_box || item.interview_ready_answer;

            return (
              <article
                key={itemId}
                className={`must-know-card ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="must-know-card-header-btn"
                  onClick={() => toggleAccordion(itemId)}
                  aria-expanded={isOpen}
                  aria-controls={`body-${itemId}`}
                  id={`header-${itemId}`}
                >
                  <div className="must-know-header-left">
                    <span
                      className={`must-know-num-badge ${
                        isOpen ? "badge-open" : "badge-closed"
                      }`}
                    >
                      {num}
                    </span>
                    <h3 className="must-know-question-title">{item.question}</h3>
                  </div>
                  {isOpen ? (
                    <FiChevronUp className="must-know-chevron" aria-hidden="true" />
                  ) : (
                    <FiChevronDown className="must-know-chevron" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <>
                    <div className="must-know-divider" aria-hidden="true" />
                    <div
                      id={`body-${itemId}`}
                      className="must-know-card-body"
                      role="region"
                      aria-labelledby={`header-${itemId}`}
                    >
                      {/* A. Simple explanation */}
                      {simpleExplanation && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Simple explanation</h4>
                          <div className="must-know-field-text">
                            {renderContent(simpleExplanation)}
                          </div>
                        </div>
                      )}

                      {/* B. Technical explanation */}
                      {technicalExplanation && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Technical explanation</h4>
                          <div className="must-know-field-text">
                            {renderContent(technicalExplanation)}
                          </div>
                        </div>
                      )}

                      {/* C. Interview-ready answer */}
                      {interviewAnswer && (
                        <div className="must-know-interview-callout" role="note">
                          <div className="must-know-callout-label">
                            {item.interview_answer_label || item.callout_label || "What you can say in an interview"}
                          </div>
                          <div className="must-know-callout-quote">
                            {renderQuote(interviewAnswer)}
                          </div>
                        </div>
                      )}

                      {/* D. Example */}
                      {item.example && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Example</h4>
                          <div className="must-know-field-text">
                            {renderContent(item.example)}
                          </div>
                        </div>
                      )}

                      {/* E. Interviewer may ask */}
                      {followUpList.length > 0 && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Interviewer may ask</h4>
                          <div className="must-know-followups-list">
                            {followUpList.map((fu) => (
                              <div key={fu.id} className="must-know-followup-item">
                                <div className="must-know-followup-box">
                                  {fu.question}
                                </div>
                                {fu.hint && (
                                  <p className="must-know-followup-hint">{fu.hint}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // ── Section 02 Renderer: Questions & Answers ─────────────────────────────
  const renderQASection = () => {
    const header = sectionHeaders["questions-answers"];
    const badgeTitle = header?.title?.replace(/^\d+[\s·.-]*/, "") || "Questions & Answers";
    const subtitle = header?.subtitle || "Explore interview questions topic by topic.";

    return (
      <section
        key="questions-answers"
        id="questions-answers"
        className="interview-section must-know-section-wrap qa-section-wrap"
        aria-labelledby="heading-qa"
      >
        <div className="must-know-header-wrap qa-header-wrap">
          <div id="heading-qa" className="must-know-badge">
            {badgeTitle}
          </div>
          <p className="must-know-subtitle">{subtitle}</p>
        </div>

        {/* Difficulty Filter Tabs */}
        <div
          className="qa-difficulty-tabs"
          role="tablist"
          aria-label="Filter Questions by Difficulty"
        >
          {["beginner", "intermediate", "advanced"].map((diff) => {
            const label = diff.charAt(0).toUpperCase() + diff.slice(1);
            const isActive = selectedDifficulty.toLowerCase() === diff;
            return (
              <button
                key={diff}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`qa-difficulty-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  // Auto-expand first question in newly selected difficulty tab if none in it are open
                  const questionsForDiff = qaQuestions.filter(
                    (q) => (q.difficulty || "beginner").toLowerCase() === diff
                  );
                  if (questionsForDiff.length > 0) {
                    const hasAnyOpen = questionsForDiff.some((q) => !!openAccordions[q.id]);
                    if (!hasAnyOpen) {
                      setOpenAccordions((prev) => ({
                        ...prev,
                        [questionsForDiff[0].id]: true,
                      }));
                    }
                  }
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {filteredQaQuestions.length === 0 ? (
          <div className="qa-empty-state">
            <p>
              No questions found for <strong>{selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}</strong> difficulty.
            </p>
          </div>
        ) : (
          <div className="must-know-accordion-list" role="region" aria-label="Questions & Answers">
            {filteredQaQuestions.map((item, idx) => {
              const itemId = item.id || `qa-${idx + 1}`;
              const isOpen = !!openAccordions[itemId];
              const num = String(idx + 1).padStart(2, "0");

              // Extract follow-up questions supporting both { question, hint } and legacy string arrays
              const rawFollowUps =
                item.follow_up_questions || item.subQuestions || item.sub_questions || [];
              const followUpList = Array.isArray(rawFollowUps)
                ? rawFollowUps.map((fu, fIdx) => {
                    if (typeof fu === "string") {
                      return { id: `fu-${itemId}-${fIdx}`, question: fu, hint: "" };
                    }
                    return {
                      id: fu.id || `fu-${itemId}-${fIdx}`,
                      question: fu.question || fu.text || "",
                      hint: fu.hint || "",
                    };
                  })
                : [];

              const simpleExplanation =
                item.simple_explanation || item.simple_definition || item.answer;
              const technicalExplanation =
                item.technical_explanation || item.explanation;
              const interviewAnswer =
                item.interview_answer ||
                item.highlight_box ||
                item.interview_ready_answer ||
                item.highlightBox;

              return (
                <article
                  key={itemId}
                  className={`must-know-card ${isOpen ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="must-know-card-header-btn"
                    onClick={() => toggleAccordion(itemId)}
                    aria-expanded={isOpen}
                    aria-controls={`body-${itemId}`}
                    id={`header-${itemId}`}
                  >
                    <div className="must-know-header-left">
                      <span
                        className={`must-know-num-badge ${
                          isOpen ? "badge-open" : "badge-closed"
                        }`}
                      >
                        {num}
                      </span>
                      <h3 className="must-know-question-title">{item.question}</h3>
                    </div>
                    {isOpen ? (
                      <FiChevronUp className="must-know-chevron" aria-hidden="true" />
                    ) : (
                      <FiChevronDown className="must-know-chevron" aria-hidden="true" />
                    )}
                  </button>

                  {isOpen && (
                    <>
                      <div className="must-know-divider" aria-hidden="true" />
                      <div
                        id={`body-${itemId}`}
                        className="must-know-card-body"
                        role="region"
                        aria-labelledby={`header-${itemId}`}
                      >
                        {/* A. Simple explanation */}
                        {simpleExplanation && (
                          <div className="must-know-field-block">
                            <h4 className="must-know-field-label">Simple explanation</h4>
                            <div className="must-know-field-text">
                              {renderContent(simpleExplanation)}
                            </div>
                          </div>
                        )}

                        {/* B. Technical explanation */}
                        {technicalExplanation && (
                          <div className="must-know-field-block">
                            <h4 className="must-know-field-label">Technical explanation</h4>
                            <div className="must-know-field-text">
                              {renderContent(technicalExplanation)}
                            </div>
                          </div>
                        )}

                        {/* C. Interview-ready answer */}
                        {interviewAnswer && (
                          <div className="must-know-interview-callout" role="note">
                            <div className="must-know-callout-label">
                              {item.interview_answer_label || item.callout_label || "What you can say in an interview"}
                            </div>
                            <div className="must-know-callout-quote">
                              {renderQuote(interviewAnswer)}
                            </div>
                          </div>
                        )}

                        {/* D. Example */}
                        {item.example && (
                          <div className="must-know-field-block">
                            <h4 className="must-know-field-label">Example</h4>
                            <div className="must-know-field-text">
                              {renderContent(item.example)}
                            </div>
                          </div>
                        )}

                        {/* E. Interviewer may ask */}
                        {followUpList.length > 0 && (
                          <div className="must-know-field-block">
                            <h4 className="must-know-field-label">Interviewer may ask</h4>
                            <div className="must-know-followups-list">
                              {followUpList.map((fu) => (
                                <div key={fu.id} className="must-know-followup-item">
                                  <div className="must-know-followup-box">
                                    {fu.question}
                                  </div>
                                  {fu.hint && (
                                    <p className="must-know-followup-hint">{fu.hint}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Optional Code Snippet if present */}
                        {item.code_snippet && (
                          <div
                            className="interview-code-container"
                            role="region"
                            aria-label="Code snippet"
                            style={{ marginTop: "16px" }}
                          >
                            <div className="code-header-bar">
                              <span className="code-lang-label">Code Snippet</span>
                              <button
                                type="button"
                                className="code-copy-btn"
                                onClick={() => handleCopyCode(item.code_snippet, itemId)}
                                title="Copy code snippet"
                              >
                                {copiedCodeId === itemId ? (
                                  <>
                                    <FiCheck aria-hidden="true" /> Copied!
                                  </>
                                ) : (
                                  <>
                                    <FiCopy aria-hidden="true" /> Copy Code
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="interview-code-pre">
                              <code>{item.code_snippet}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  // ── Section 03 Renderer: Scenario-Based Questions ────────────────────────
  const renderScenarioSection = () => {
    const header = sectionHeaders["scenario-based"];
    const badgeTitle =
      header?.title?.replace(/^\d+[\s·.-]*/, "") || "Scenario-Based Interview Questions";
    const subtitle =
      header?.subtitle || "Questions that test how you apply concepts to real-world problems.";

    return (
      <section
        key="scenario-based"
        id="scenario-based"
        className="interview-section must-know-section-wrap"
        aria-labelledby="heading-scenarios"
      >
        <div className="must-know-header-wrap">
          <div id="heading-scenarios" className="must-know-badge">
            {badgeTitle}
          </div>
          <p className="must-know-subtitle">{subtitle}</p>
        </div>

        <div className="must-know-accordion-list" role="region" aria-label="Scenario-Based Questions">
          {scenarioQuestions.map((item, idx) => {
            const itemId = item.id || `sc-${idx + 1}`;
            const isOpen = !!openAccordions[itemId];
            const num = item.num || String(idx + 1).padStart(2, "0");

            const testingText =
              item.interviewer_testing || item.testing_criteria || item.problem_context;
            const approachText =
              item.approach || item.investigation_approach;
            const expectedAnswerLabel =
              item.expected_answer_label || "Expected answer";
            const expectedAnswer =
              item.expected_answer || item.recommended_solution || item.expected_outcome;

            // Extract follow-ups supporting array of objects { id, question } or array of strings
            const rawFollowUps =
              item.follow_up_questions || item.followUps || item.follow_ups || [];
            const followUpList = Array.isArray(rawFollowUps)
              ? rawFollowUps
                  .map((fu, fIdx) => {
                    if (typeof fu === "string") {
                      return { id: `sc-fu-${itemId}-${fIdx}`, question: fu };
                    }
                    return {
                      id: fu.id || `sc-fu-${itemId}-${fIdx}`,
                      question: fu.question || fu.text || "",
                    };
                  })
                  .filter((fu) => fu.question && fu.question.trim().length > 0)
              : [];

            return (
              <article
                key={itemId}
                className={`must-know-card scenario-card ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="must-know-card-header-btn"
                  onClick={() => toggleAccordion(itemId)}
                  aria-expanded={isOpen}
                  aria-controls={`body-${itemId}`}
                  id={`header-${itemId}`}
                >
                  <div className="must-know-header-left">
                    <span
                      className={`must-know-num-badge ${
                        isOpen ? "badge-open" : "badge-closed"
                      }`}
                    >
                      {num}
                    </span>
                    <h3 className="must-know-question-title">{item.question}</h3>
                  </div>
                  {isOpen ? (
                    <FiChevronUp className="must-know-chevron" aria-hidden="true" />
                  ) : (
                    <FiChevronDown className="must-know-chevron" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <>
                    <div className="must-know-divider" aria-hidden="true" />
                    <div
                      id={`body-${itemId}`}
                      className="must-know-card-body"
                      role="region"
                      aria-labelledby={`header-${itemId}`}
                    >
                      {/* A. What the interviewer is testing */}
                      {testingText && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">
                            What the interviewer is testing
                          </h4>
                          <div className="must-know-field-text">
                            {renderContent(testingText)}
                          </div>
                        </div>
                      )}

                      {/* B. How to approach it */}
                      {approachText && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">
                            How to approach it
                          </h4>
                          <div className="must-know-field-text">
                            {renderContent(approachText)}
                          </div>
                        </div>
                      )}

                      {/* C. Expected answer (Highlighted Mint Callout Box) */}
                      {expectedAnswer && (
                        <div className="must-know-interview-callout" role="note">
                          <div className="must-know-callout-label">
                            {expectedAnswerLabel}
                          </div>
                          <div className="must-know-callout-quote">
                            {renderQuote(expectedAnswer)}
                          </div>
                        </div>
                      )}

                      {/* D. Possible follow-ups (Bulleted List) */}
                      {followUpList.length > 0 && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">
                            Possible follow-ups
                          </h4>
                          <ul className="scenario-followup-bullets">
                            {followUpList.map((fu) => (
                              <li key={fu.id}>{renderContent(fu.question)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // ── Section 04 Renderer: Practical & Coding Questions ───────────────────
  const renderCodingSection = () => {
    const header = sectionHeaders["coding-questions"];
    const badgeTitle =
      header?.title?.replace(/^\d+[\s·.-]*/, "") || "Practical & Coding Questions";
    const subtitle =
      header?.subtitle ||
      "Questions where you may be asked to write code, explain an approach or solve a technical problem.";

    return (
      <section
        key="coding-questions"
        id="coding-questions"
        className="interview-section must-know-section-wrap"
        aria-labelledby="heading-coding"
      >
        <div className="must-know-header-wrap">
          <div id="heading-coding" className="must-know-badge">
            {badgeTitle}
          </div>
          <p className="must-know-subtitle">{subtitle}</p>
        </div>

        <div className="must-know-accordion-list" role="region" aria-label="Practical & Coding Questions">
          {codingQuestions.map((item, idx) => {
            const itemId = item.id || `code-${idx + 1}`;
            const isOpen = !!openAccordions[itemId];
            const num = item.num || String(idx + 1).padStart(2, "0");

            const approach = item.expected_approach || item.approach;
            const explanation = item.explanation;
            const rawFollowUps =
              item.follow_up_questions || item.followUps || item.follow_ups || (item.follow_up ? [item.follow_up] : []);
            const followUpList = Array.isArray(rawFollowUps)
              ? rawFollowUps
                  .map((fu, fIdx) => {
                    if (typeof fu === "string") {
                      return { id: `code-fu-${itemId}-${fIdx}`, question: fu };
                    }
                    return {
                      id: fu.id || `code-fu-${itemId}-${fIdx}`,
                      question: fu.question || fu.text || "",
                    };
                  })
                  .filter((fu) => fu.question && fu.question.trim().length > 0)
              : [];

            return (
              <article
                key={itemId}
                className={`must-know-card ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="must-know-card-header-btn"
                  onClick={() => toggleAccordion(itemId)}
                  aria-expanded={isOpen}
                  aria-controls={`body-${itemId}`}
                  id={`header-${itemId}`}
                >
                  <div className="must-know-header-left">
                    <span
                      className={`must-know-num-badge ${
                        isOpen ? "badge-open" : "badge-closed"
                      }`}
                    >
                      {num}
                    </span>
                    <h3 className="must-know-question-title">{item.question}</h3>
                  </div>
                  {isOpen ? (
                    <FiChevronUp className="must-know-chevron" aria-hidden="true" />
                  ) : (
                    <FiChevronDown className="must-know-chevron" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <>
                    <div className="must-know-divider" aria-hidden="true" />
                    <div
                      id={`body-${itemId}`}
                      className="must-know-card-body"
                      role="region"
                      aria-labelledby={`header-${itemId}`}
                    >
                      {/* Expected approach */}
                      {approach && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Expected approach</h4>
                          <div className="must-know-field-text">
                            {renderContent(approach)}
                          </div>
                        </div>
                      )}

                      {/* Solution */}
                      {item.code && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Solution</h4>
                          <div
                            className="interview-code-container"
                            role="region"
                            aria-label="Code solution"
                          >
                            <div className="code-header-bar">
                              <span className="code-lang-label">
                                {item.language || "Python"}
                              </span>
                              <button
                                type="button"
                                className="code-copy-btn"
                                onClick={() => handleCopyCode(item.code, itemId)}
                                title="Copy code snippet"
                              >
                                {copiedCodeId === itemId ? (
                                  <>
                                    <FiCheck aria-hidden="true" /> Copied!
                                  </>
                                ) : (
                                  <>
                                    <FiCopy aria-hidden="true" /> Copy Code
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="interview-code-pre">
                              <code>{item.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      {explanation && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Explanation</h4>
                          <div className="must-know-field-text">
                            {renderContent(explanation)}
                          </div>
                          {(item.time_complexity || item.space_complexity) && (
                            <div className="complexity-meta-bar">
                              {item.time_complexity && (
                                <div>
                                  Time Complexity: <span>{item.time_complexity}</span>
                                </div>
                              )}
                              {item.space_complexity && (
                                <div>
                                  Space Complexity: <span>{item.space_complexity}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interviewer follow-up */}
                      {followUpList.length > 0 && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">
                            {followUpList.length > 1 ? "Possible follow-ups" : "Interviewer follow-up"}
                          </h4>
                          {followUpList.length === 1 ? (
                            <div className="must-know-field-text">
                              {renderContent(followUpList[0].question)}
                            </div>
                          ) : (
                            <ul className="scenario-followup-bullets">
                              {followUpList.map((fu) => (
                                <li key={fu.id}>{renderContent(fu.question)}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // ── Section 05 Renderer: Common Interview Mistakes ───────────────────────
  const renderMistakesSection = () => {
    const header = sectionHeaders["common-mistakes"];
    const badgeTitle =
      header?.title?.replace(/^\d+[\s·.-]*/, "") || "Common Interview Mistakes";
    const subtitle =
      header?.subtitle || "Small habits that quietly weaken good answers.";

    return (
      <section
        key="common-mistakes"
        id="common-mistakes"
        className="interview-section must-know-section-wrap"
        aria-labelledby="heading-mistakes"
      >
        <div className="must-know-header-wrap">
          <div id="heading-mistakes" className="must-know-badge">
            {badgeTitle}
          </div>
          <p className="must-know-subtitle">{subtitle}</p>
        </div>

        <div className="must-know-accordion-list" role="region" aria-label="Common Interview Mistakes">
          {commonMistakes.map((item, idx) => {
            const itemId = item.id || `cm-${idx + 1}`;
            const isOpen = !!openAccordions[itemId];
            const num = item.num || String(idx + 1).padStart(2, "0");

            const problemText = item.problem || item.mistake;
            const whyItHurts = item.why_it_hurts || item.why_it_happens || item.whyItMatters;
            const betterApproach = item.better_approach || item.how_to_avoid || item.howToAvoid;

            return (
              <article
                key={itemId}
                className={`must-know-card ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="must-know-card-header-btn"
                  onClick={() => toggleAccordion(itemId)}
                  aria-expanded={isOpen}
                  aria-controls={`body-${itemId}`}
                  id={`header-${itemId}`}
                >
                  <div className="must-know-header-left">
                    <span
                      className={`must-know-num-badge ${
                        isOpen ? "badge-open" : "badge-closed"
                      }`}
                    >
                      {num}
                    </span>
                    <h3 className="must-know-question-title">{item.title}</h3>
                  </div>
                  {isOpen ? (
                    <FiChevronUp className="must-know-chevron" aria-hidden="true" />
                  ) : (
                    <FiChevronDown className="must-know-chevron" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <>
                    <div className="must-know-divider" aria-hidden="true" />
                    <div
                      id={`body-${itemId}`}
                      className="must-know-card-body"
                      role="region"
                      aria-labelledby={`header-${itemId}`}
                    >
                      {/* The problem */}
                      {problemText && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">The problem</h4>
                          <div className="must-know-field-text">
                            {renderContent(problemText)}
                          </div>
                        </div>
                      )}

                      {/* Why it hurts */}
                      {whyItHurts && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Why it hurts</h4>
                          <div className="must-know-field-text">
                            {renderContent(whyItHurts)}
                          </div>
                        </div>
                      )}

                      {/* Better approach */}
                      {betterApproach && (
                        <div className="must-know-field-block">
                          <h4 className="must-know-field-label">Better approach</h4>
                          <div className="must-know-field-text">
                            {renderContent(betterApproach)}
                          </div>
                        </div>
                      )}

                      {/* Optional Recommendation */}
                      {item.recommendation && (
                        <div className="must-know-field-block" style={{ marginTop: "10px" }}>
                          <div className="must-know-field-text" style={{ fontStyle: "italic", color: "#475569" }}>
                            {renderContent(item.recommendation)}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // ── Section 06 Renderer: Quick Revision ──────────────────────────────────
  const renderQuickRevisionSection = () => {
    const header = sectionHeaders["quick-revision"];
    const badgeTitle =
      header?.title?.replace(/^\d+[\s·.-]*/, "") || "Quick Revision";
    const subtitle =
      header?.subtitle || "Refresh the most important concepts at a glance.";
    const col1Label = header?.column1_label || "Concept";
    const col2Label = header?.column2_label || "Concise Explanation";

    return (
      <section
        key="quick-revision"
        id="quick-revision"
        className="interview-section must-know-section-wrap"
        aria-labelledby="heading-revision"
      >
        <div className="must-know-header-wrap">
          <div id="heading-revision" className="must-know-badge">
            {badgeTitle}
          </div>
          <p className="must-know-subtitle">{subtitle}</p>
        </div>

        <div className="revision-table-container">
          <table className="revision-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: "26%" }}>
                  {col1Label}
                </th>
                <th scope="col">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{col2Label}</span>
                    <FiChevronUp aria-hidden="true" style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)" }} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {quickRevision.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td className="concept-name-cell">{row.concept}</td>
                  <td>{renderContent(row.explanation)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div className="interview-page-wrapper">
      <Helmet>
        <title>{dbData?.seo_title || `${pageTitle} | PrepHQ`}</title>
        <meta
          name="description"
          content={dbData?.meta_description || pageDesc}
        />
        {dbData?.keywords && <meta name="keywords" content={dbData.keywords} />}
      </Helmet>

      <div className="container">
        <div className="interview-main-grid">

          {/* =========================================================
              LEFT COLUMN: "In This Guide" Navigation
              ========================================================= */}
          <aside className="interview-left-sidebar" aria-label="Section Navigation">
            <div className="left-sidebar-inner">
              <h3 className="sidebar-nav-title">
                <FiLayers aria-hidden="true" />
                <span>In This Guide</span>
              </h3>

              <nav className="sidebar-nav-list" role="navigation">
                {navSections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    className={`sidebar-nav-btn ${
                      activeSection === sec.id ? "active" : ""
                    }`}
                    onClick={() => handleScrollToSection(sec.id)}
                  >
                    <span className="nav-num-badge">{sec.number}</span>
                    <span className="nav-label-text">{sec.label}</span>
                  </button>
                ))}
              </nav>

              <button
                type="button"
                className="download-pdf-btn"
                onClick={() => window.print()}
                title="Download this interview preparation guide as PDF"
              >
                <FiDownload aria-hidden="true" />
                <span>Download PDF</span>
              </button>
            </div>
          </aside>

          {/* =========================================================
              CENTER COLUMN: Main Dynamic Interview Content
              ========================================================= */}
          <main className="interview-center-content">

            {/* ── Page Header Matching Reference Design ─────────────── */}
            <header className="interview-page-header">
              <h1 className="interview-page-title">{pageTitle}</h1>
              <p className="interview-page-desc">{pageDesc}</p>
              <hr className="interview-header-divider" />
            </header>

            {/* ── Render Sections In Dynamically Configured Order ──────── */}
            {sectionsOrder.map((secId) => {
              if (secId === "must-know") return renderMustKnowSection();
              if (secId === "questions-answers") return renderQASection();
              if (secId === "scenario-based") return renderScenarioSection();
              if (secId === "coding-questions") return renderCodingSection();
              if (secId === "common-mistakes") return renderMistakesSection();
              if (secId === "quick-revision") return renderQuickRevisionSection();
              return null;
            })}

          </main>

          {/* =========================================================
              RIGHT COLUMN: Share & Related Content Widgets Sidebar
              ========================================================= */}
          <aside className="interview-right-sidebar" aria-label="Related Resources">

            {/* Share Controls Matching Reference Design */}
            <div className="sidebar-share-row" role="region" aria-label="Share Controls">
              <span className="share-label">Share:</span>
              <div className="share-buttons-group">
                <a
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-icon-btn whatsapp-btn"
                  title="Share on WhatsApp"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp />
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-icon-btn linkedin-btn"
                  title="Share on LinkedIn"
                  aria-label="Share on LinkedIn"
                >
                  <FaLinkedinIn />
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-icon-btn facebook-btn"
                  title="Share on Facebook"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-icon-btn instagram-btn"
                  title="Share on Instagram"
                  aria-label="Share on Instagram"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            {/* 1. Related Interview Questions */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Related Interview Questions</h3>
              <div className="widget-mint-box">
                {relatedInterviews.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link || item.destination_url || "/interviews"}
                    className="widget-card-item"
                  >
                    <div className="widget-card-info">
                      <h4 className="widget-card-title">{item.title}</h4>
                      <div className="widget-card-meta">
                        <FiCalendar aria-hidden="true" />
                        <span>{item.date || item.display_date}</span>
                      </div>
                    </div>
                    <div className="widget-action-icon-wrap" aria-hidden="true">
                      <FiExternalLink />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. Tutorials */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Tutorials</h3>
              <div className="widget-mint-box">
                {tutorialsList.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link || item.destination_url || "/tutorials"}
                    className="widget-card-item"
                  >
                    <div className="widget-card-info">
                      <h4 className="widget-card-title">{item.title}</h4>
                      <div className="widget-card-meta">
                        <FiCalendar aria-hidden="true" />
                        <span>{item.date || item.display_date}</span>
                      </div>
                    </div>
                    <div className="widget-action-icon-wrap" aria-hidden="true">
                      <FiExternalLink />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. Mini Guides */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Mini Guides</h3>
              <div className="widget-mint-box">
                {miniGuidesList.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link || item.destination_url || "/blogs"}
                    className="widget-card-item"
                  >
                    <div className="widget-card-info">
                      <h4 className="widget-card-title">{item.title}</h4>
                      <div className="widget-card-meta">
                        <FiCalendar aria-hidden="true" />
                        <span>{item.date || item.display_date}</span>
                      </div>
                    </div>
                    <div className="widget-action-icon-wrap" aria-hidden="true">
                      <FiExternalLink />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Promotional Banner */}
            <div
              className="sidebar-promo-banner"
              role="region"
              aria-label="Promotion"
            >
              <span>Advertisement / Promotional Banner</span>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default InterviewsPage;
