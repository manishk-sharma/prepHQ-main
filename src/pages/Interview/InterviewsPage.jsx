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
  FaXTwitter,
  FaWhatsapp,
  FaFacebookF,
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
export const sanitizeHtml = (html) => {
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
  const startsWithQuote = trimmed.startsWith('"') || trimmed.startsWith('“') || trimmed.startsWith('&quot;');
  const endsWithQuote = trimmed.endsWith('"') || trimmed.endsWith('”') || trimmed.endsWith('&quot;');
  const display = startsWithQuote && endsWithQuote ? trimmed : `"${trimmed.replace(/^["“]+|["”]+$/g, "")}"`;
  return <em>{renderContent(display)}</em>;
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
    title: "03 · Scenario-Based Interview Questions",
    subtitle: "Real-world interview situations and practical problem solving.",
  },
  "coding-questions": {
    title: "04 · Practical & Coding Questions",
    subtitle: "Implementation and coding exercises with algorithmic explanations.",
  },
  "common-mistakes": {
    title: "05 · Common Interview Mistakes",
    subtitle: "Frequent mistakes candidates should avoid during technical interviews.",
  },
  "quick-revision": {
    title: "06 · Quick Revision",
    subtitle: "Quick-reference summary table before entering your interview.",
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

      if (scenarioQuestions[0]?.id) initialOpen[scenarioQuestions[0].id] = true;
      if (codingQuestions[0]?.id) initialOpen[codingQuestions[0].id] = true;
      if (commonMistakes[0]?.id) initialOpen[commonMistakes[0].id] = true;
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
    return (
      <section
        key="scenario-based"
        id="scenario-based"
        className="interview-section"
        aria-labelledby="heading-scenarios"
      >
        <div className="section-header-wrap">
          <h2 id="heading-scenarios" className="section-main-heading">
            {header?.title || "03 · Scenario-Based Interview Questions"}
          </h2>
          <p className="section-sub-desc">
            {header?.subtitle || "Real-world interview situations and practical problem solving."}
          </p>
        </div>

        <div className="interview-accordion-group">
          {scenarioQuestions.map((item, idx) => {
            const itemId = item.id || `sc-${idx + 1}`;
            const isOpen = !!openAccordions[itemId];
            const num = item.num || String(idx + 1).padStart(2, "0");

            return (
              <article
                key={itemId}
                className={`interview-accordion-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="accordion-header-btn"
                  onClick={() => toggleAccordion(itemId)}
                  aria-expanded={isOpen}
                >
                  <div className="accordion-title-wrap">
                    <span className="accordion-num-badge">{num}</span>
                    <h3 className="accordion-title-text">{item.question}</h3>
                  </div>
                  <FiChevronDown
                    className={`accordion-chevron-icon ${isOpen ? "rotate" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="accordion-body-content">
                    {(item.problem_context || item.problemUnderstanding) && (
                      <div className="content-block">
                        <h4 className="content-subtitle">1. Problem Understanding & Context</h4>
                        {renderContent(item.problem_context || item.problemUnderstanding)}
                      </div>
                    )}

                    {(item.investigation_approach || item.investigationSteps) && (
                      <div className="content-block">
                        <h4 className="content-subtitle">2. Investigation Approach</h4>
                        {Array.isArray(item.investigationSteps) ? (
                          <ul className="content-bullet-list">
                            {item.investigationSteps.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ul>
                        ) : (
                          renderContent(item.investigation_approach)
                        )}
                      </div>
                    )}

                    {item.recommended_solution && (
                      <div className="content-block">
                        <h4 className="content-subtitle">3. Recommended Solution</h4>
                        {renderContent(item.recommended_solution)}
                      </div>
                    )}

                    {item.reasoning && (
                      <div className="content-block">
                        <h4 className="content-subtitle">4. Reasoning & Trade-offs</h4>
                        {renderContent(item.reasoning)}
                      </div>
                    )}

                    {(item.expected_outcome || item.highlightBox) && (
                      <div className="mint-callout-box" role="note">
                        <strong>Expected Outcome: </strong>
                        {renderContent(item.expected_outcome || item.highlightBox)}
                      </div>
                    )}

                    {(item.key_considerations || item.followUp) && (
                      <div className="content-block">
                        <h4 className="content-subtitle">5. Key Considerations & Follow-Ups</h4>
                        {Array.isArray(item.followUp) ? (
                          <ul className="content-bullet-list">
                            {item.followUp.map((fu, fIdx) => (
                              <li key={fIdx}>{fu}</li>
                            ))}
                          </ul>
                        ) : (
                          renderContent(item.key_considerations)
                        )}
                      </div>
                    )}
                  </div>
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
    return (
      <section
        key="coding-questions"
        id="coding-questions"
        className="interview-section"
        aria-labelledby="heading-coding"
      >
        <div className="section-header-wrap">
          <h2 id="heading-coding" className="section-main-heading">
            {header?.title || "04 · Practical & Coding Questions"}
          </h2>
          <p className="section-sub-desc">
            {header?.subtitle || "Implementation and coding exercises with algorithmic explanations."}
          </p>
        </div>

        <div className="interview-accordion-group">
          {codingQuestions.map((item, idx) => {
            const itemId = item.id || `code-${idx + 1}`;
            const isOpen = !!openAccordions[itemId];
            const num = item.num || String(idx + 1).padStart(2, "0");

            return (
              <article
                key={itemId}
                className={`interview-accordion-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="accordion-header-btn"
                  onClick={() => toggleAccordion(itemId)}
                  aria-expanded={isOpen}
                >
                  <div className="accordion-title-wrap">
                    <span className="accordion-num-badge">{num}</span>
                    <h3 className="accordion-title-text">{item.question}</h3>
                    {item.difficulty && (
                      <span className="difficulty-pill-tag">
                        {item.difficulty}
                      </span>
                    )}
                  </div>
                  <FiChevronDown
                    className={`accordion-chevron-icon ${isOpen ? "rotate" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="accordion-body-content">
                    {(item.problem_statement || item.problemStatement) && (
                      <div className="content-block">
                        <h4 className="content-subtitle">Problem Statement</h4>
                        {renderContent(item.problem_statement || item.problemStatement)}
                      </div>
                    )}

                    {item.approach && (
                      <div className="content-block">
                        <h4 className="content-subtitle">Algorithm & Approach</h4>
                        {renderContent(item.approach)}
                      </div>
                    )}

                    {item.code && (
                      <div
                        className="interview-code-container"
                        role="region"
                        aria-label="Code snippet"
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
                    )}

                    {(item.explanation ||
                      item.time_complexity ||
                      item.space_complexity ||
                      item.timeComplexity ||
                      item.spaceComplexity) && (
                      <div className="content-block">
                        <h4 className="content-subtitle">Approach & Complexity</h4>
                        {item.explanation && renderContent(item.explanation)}
                        {((item.time_complexity || item.timeComplexity) ||
                          (item.space_complexity || item.spaceComplexity)) && (
                          <div className="complexity-meta-bar">
                            {(item.time_complexity || item.timeComplexity) && (
                              <div>
                                Time Complexity:{" "}
                                <span>{item.time_complexity || item.timeComplexity}</span>
                              </div>
                            )}
                            {(item.space_complexity || item.spaceComplexity) && (
                              <div>
                                Space Complexity:{" "}
                                <span>{item.space_complexity || item.spaceComplexity}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {(item.sample_input || item.sample_output) && (
                      <div
                        className="sample-io-grid"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          marginTop: "12px",
                        }}
                      >
                        {item.sample_input && (
                          <div
                            style={{
                              background: "#f8fafc",
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <strong
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                textTransform: "uppercase",
                              }}
                            >
                              Sample Input
                            </strong>
                            <pre
                              style={{
                                margin: "4px 0 0",
                                fontSize: "12px",
                                fontFamily: "monospace",
                              }}
                            >
                              {item.sample_input}
                            </pre>
                          </div>
                        )}
                        {item.sample_output && (
                          <div
                            style={{
                              background: "#f8fafc",
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <strong
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                textTransform: "uppercase",
                              }}
                            >
                              Sample Output
                            </strong>
                            <pre
                              style={{
                                margin: "4px 0 0",
                                fontSize: "12px",
                                fontFamily: "monospace",
                              }}
                            >
                              {item.sample_output}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
    return (
      <section
        key="common-mistakes"
        id="common-mistakes"
        className="interview-section"
        aria-labelledby="heading-mistakes"
      >
        <div className="section-header-wrap">
          <h2 id="heading-mistakes" className="section-main-heading">
            {header?.title || "05 · Common Interview Mistakes"}
          </h2>
          <p className="section-sub-desc">
            {header?.subtitle || "Frequent mistakes candidates should avoid during technical interviews."}
          </p>
        </div>

        <div className="interview-accordion-group">
          {commonMistakes.map((item, idx) => {
            const itemId = item.id || `cm-${idx + 1}`;
            const isOpen = !!openAccordions[itemId];
            const num = item.num || String(idx + 1).padStart(2, "0");

            return (
              <article
                key={itemId}
                className={`interview-accordion-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="accordion-header-btn"
                  onClick={() => toggleAccordion(itemId)}
                  aria-expanded={isOpen}
                >
                  <div className="accordion-title-wrap">
                    <span className="accordion-num-badge">{num}</span>
                    <h3 className="accordion-title-text">{item.title}</h3>
                  </div>
                  <FiChevronDown
                    className={`accordion-chevron-icon ${isOpen ? "rotate" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="accordion-body-content">
                    {item.mistake && (
                      <div className="content-block">
                        <h4 className="content-subtitle">What the Mistake Is</h4>
                        {renderContent(item.mistake)}
                      </div>
                    )}

                    {(item.why_it_happens || item.whyItMatters) && (
                      <div className="content-block">
                        <h4 className="content-subtitle">Why It Happens</h4>
                        {renderContent(item.why_it_happens || item.whyItMatters)}
                      </div>
                    )}

                    {(item.how_to_avoid || item.howToAvoid) && (
                      <div className="content-block">
                        <h4 className="content-subtitle">How to Avoid It</h4>
                        {renderContent(item.how_to_avoid || item.howToAvoid)}
                      </div>
                    )}

                    {item.recommendation && (
                      <div className="mint-callout-box" role="note">
                        <strong>{renderContent(item.recommendation)}</strong>
                      </div>
                    )}
                  </div>
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
    return (
      <section
        key="quick-revision"
        id="quick-revision"
        className="interview-section"
        aria-labelledby="heading-revision"
      >
        <div className="section-header-wrap">
          <h2 id="heading-revision" className="section-main-heading">
            {header?.title || "06 · Quick Revision"}
          </h2>
          <p className="section-sub-desc">
            {header?.subtitle || "Quick-reference summary table before entering your interview."}
          </p>
        </div>

        <div className="revision-table-container">
          <table className="revision-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: "26%" }}>
                  Concept
                </th>
                <th scope="col">Concise Explanation</th>
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
              LEFT COLUMN: "In This Project" Navigation
              ========================================================= */}
          <aside className="interview-left-sidebar" aria-label="Section Navigation">
            <div className="left-sidebar-inner">
              <h3 className="sidebar-nav-title">
                <FiLayers aria-hidden="true" />
                <span>In This Project</span>
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

            {/* ── Page Header ─────────────────────────────────────────── */}
            <header className="interview-page-header">
              <div className="header-text-col">
                <h1 className="interview-page-title">{pageTitle}</h1>
                <p className="interview-page-desc">{pageDesc}</p>
              </div>

              {/* Share Controls */}
              <div className="header-share-col" aria-label="Share Controls">
                <span className="share-label">Share</span>
                <div className="share-buttons-group">
                  <button
                    type="button"
                    className="share-icon-btn copy-btn"
                    onClick={handleCopyPageLink}
                    title="Copy Link to Clipboard"
                    aria-label="Copy Link"
                  >
                    {copiedLink ? <FiCheck /> : <FiCopy />}
                    {copiedLink && (
                      <span className="copy-feedback-tooltip">Copied!</span>
                    )}
                  </button>

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
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-icon-btn twitter-btn"
                    title="Share on X (Twitter)"
                    aria-label="Share on X"
                  >
                    <FaXTwitter />
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
                </div>
              </div>
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
              RIGHT COLUMN: Related Content Widgets Sidebar
              ========================================================= */}
          <aside className="interview-right-sidebar" aria-label="Related Resources">

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
