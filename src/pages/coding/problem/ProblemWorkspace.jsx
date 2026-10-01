import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Group, Panel, Separator } from "react-resizable-panels";
import "./ProblemWorkspace.css";
import WorkspaceHeader from "./components/WorkspaceHeader";
import ProblemDescription from "./components/ProblemDescription";
import TestcasePanel from "./components/TestcasePanel";
import CodeEditorPanel from "./components/CodeEditorPanel";
import {
  useCodingQuestionBySlug,
  useCodingQuestionList,
  useRunCode,
  useSubmitCode,
  getSubmissionResult,
} from "../../../services/codingQuestionsServices";
import useUserAuthorization from "../../../hooks/useUserAuthorization";
import ProblemWorkspaceSkeleton from "../../../skeletons/ProblemWorkspaceSkeleton";
import ConfirmModal from "../../../components/ConfirmModal";
import {
  submissionQueued,
  pollResultReceived,
  pollingStopped,
  resetSubmission,
} from "../../../redux/slices/prepCodeSlice";

// Normalise any status string → uppercase with spaces, then match against terminals
const TERMINAL_STATUSES = new Set([
  "ACCEPTED",
  "WRONG ANSWER",
  "RUNTIME ERROR",
  "COMPILATION ERROR",
  "TIME LIMIT EXCEEDED",
]);

const isTerminalStatus = (status) => {
  if (!status) return false;
  const normalized = String(status).toUpperCase().replace(/_/g, " ").trim();
  return TERMINAL_STATUSES.has(normalized);
};

const ProblemWorkspace = () => {
  const { problemSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { submissionId, isPolling, submitPollResult } = useSelector(
    (state) => state.prepCode
  );
  const theme = useSelector((state) => state.workspace?.theme ?? "light");

  const [mobileTab, setMobileTab] = useState("description");
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { authorize, authorizationModal } = useUserAuthorization();

  /* ── Lifted editor state (needed to build the Run payload) ── */
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  // Stores user-edited code per language so switching langs preserves edits.
  const codeByLang = useRef({});

  const { data: rawQuestion, isLoading, isError } = useCodingQuestionBySlug(problemSlug);
  const { data: questionList = [] } = useCodingQuestionList();

  /* ── Navigation: prev / next / shuffle ── */
  const slugs = questionList.map((q) => q.slug).filter(Boolean);
  const currentIndex = slugs.indexOf(problemSlug);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < slugs.length - 1;

  const goTo = (slug) => navigate(`/prepcode/problems/${slug}`);

  const handlePrev = () => { if (hasPrev) goTo(slugs[currentIndex - 1]); };
  const handleNext = () => { if (hasNext) goTo(slugs[currentIndex + 1]); };
  const handleShuffle = () => {
    if (slugs.length < 2) return;
    let pick;
    do { pick = slugs[Math.floor(Math.random() * slugs.length)]; } while (pick === problemSlug);
    goTo(pick);
  };

  /* Run-code mutation — holds runResult / loading / error for the result panel. */
  const runMutation    = useRunCode();
  const submitMutation = useSubmitCode();

  /* When the question changes: clear all run/submit state and reset editor cache. */
  useEffect(() => {
    runMutation.reset();
    submitMutation.reset();
    dispatch(resetSubmission());
    codeByLang.current = {};
  }, [problemSlug]);

  /* When a new question loads: seed editor with its starter code for the active language. */
  useEffect(() => {
    if (rawQuestion?.starter_code) {
      setCode(rawQuestion.starter_code[language] ?? "");
    }
  }, [rawQuestion]);

  /* Language switch: save current code for the old lang, load for the new lang
     (falls back to starter code if user hasn't typed anything yet). */
  const handleLanguageChange = (newLang) => {
    codeByLang.current[language] = code;
    const saved = codeByLang.current[newLang];
    setCode(saved !== undefined ? saved : (rawQuestion?.starter_code?.[newLang] ?? ""));
    setLanguage(newLang);
  };

  /* When POST /submit returns 202 with a submission_id → kick off polling */
  useEffect(() => {
    const data = submitMutation.data;
    if (data?.submission_id) {
      dispatch(submissionQueued(data.submission_id));
    }
  }, [submitMutation.data]);

  /* Polling — recursive setTimeout so calls never overlap.
     Stops on terminal status or after 30 attempts (~60 s). */
  useEffect(() => {
    if (!submissionId || !isPolling) return;

    let cancelled = false;
    let attempts  = 0;
    const MAX_ATTEMPTS = 30;

    const poll = async () => {
      if (cancelled) return;

      if (attempts >= MAX_ATTEMPTS) {
        dispatch(pollingStopped());
        return;
      }

      attempts++;

      try {
        const result = await getSubmissionResult(submissionId);
        if (cancelled) return;

        if (isTerminalStatus(result?.status)) {
          dispatch(pollResultReceived(result));
        } else {
          setTimeout(poll, 2000);
        }
      } catch {
        if (!cancelled) setTimeout(poll, 2000); // retry on network hiccup
      }
    };

    setTimeout(poll, 2000); // first poll after 2 s

    return () => { cancelled = true; };
  }, [submissionId]);


  const themeClass = theme === "dark" ? "ws-dark" : "";

  if (isLoading) return <ProblemWorkspaceSkeleton theme={theme} />;

  if (isError || !rawQuestion) {
    return (
      <div className={`workspace-container ${themeClass}`} style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#ef4444", fontSize: "14px" }}>Failed to load problem.</p>
      </div>
    );
  }

  /* ── Normalize API response to component-expected shape ── */
  const problemData = {
    ...rawQuestion,
    constraints:  rawQuestion.constraints_list || [],
    starterCode:  rawQuestion.starter_code     || {},
    examples:     (rawQuestion.examples || []).map((ex, i) => ({ id: i + 1, ...ex })),
    likes:        rawQuestion.likes    ?? 0,
    dislikes:     rawQuestion.dislikes ?? 0,
    comments:     rawQuestion.comments ?? 0,
  };

  /* Serialization contract (docs/RUN_CODE_ARCHITECTURE.md §1):
     every input value and expected_output must be a VALID JSON STRING.
     - already a string → send as-is (assumed to be the stored JSON form)
     - number/boolean/array/object → JSON.stringify it ("321", "[0,1]", etc.) */
  const toJsonString = (v) => {
    if (v === null || v === undefined) return null;
    return typeof v === "string" ? v : JSON.stringify(v);
  };

  /* ── RUN: build the exact payload we will POST to the backend ──
     Contract: docs/RUN_CODE_ARCHITECTURE.md §3 (Frontend → Backend).
     For now we only console.log it; the API/service wiring comes next,
     built against whatever this payload looks like. */
  const handleRun = () => {
     if (!authorize()) return;

    const payload = {
      language,
      code,
      entry_point: problemData.entry_point ?? null,
      param_order: problemData.param_order ?? [],
      // Run sends ONLY the visible sample testcases.
      testcases: (problemData.testcases || []).map((tc) => ({
        inputs: Object.fromEntries(
          Object.entries(tc.inputs || {}).map(([k, v]) => [k, toJsonString(v)])
        ),
        expected_output: toJsonString(tc.expected_output),
      })),
    };

    console.log("%c[RUN] → POST /run payload", "color:#22c55e;font-weight:bold");
    console.log(payload);
    console.log("[RUN] payload (JSON):\n" + JSON.stringify(payload, null, 2));

    runMutation.mutate(payload);
  };

  const handleSubmit = () => {
    if (!authorize()) return;
    setShowSubmitModal(true);
  };

  const doSubmit = () => {
    setShowSubmitModal(false);
    dispatch(resetSubmission());

    const question_id = problemData.id ?? problemData._id;
    const payload = { question_id, language, code };

    console.log("%c[SUBMIT] → POST /submit payload", "color:#6366f1;font-weight:bold");
    console.log(payload);

    submitMutation.mutate(payload);
  };

  return (
  <>
    <div className={`workspace-container ${themeClass}`}>
      <WorkspaceHeader
        onRun={handleRun}
        onSubmit={handleSubmit}
        onPrev={handlePrev}
        onNext={handleNext}
        onShuffle={handleShuffle}
        hasPrev={hasPrev}
        hasNext={hasNext}
        isRunning={runMutation.isPending}
        isSubmitting={submitMutation.isPending}
        isPolling={isPolling}
      />

      {/* ── DESKTOP ── */}
      <div className="ws-panels ws-desktop">
        <Group orientation="horizontal">

          {/* LEFT — hide when fullscreen */}
          {!editorFullscreen && (
            <>
              <Panel id="prob-panel" order={1} defaultSize={45} minSize="28">
                <div className="prob-panel">
                  <ProblemDescription problem={problemData} />
                </div>
              </Panel>
              <Separator className="resize-handle" />
            </>
          )}

          {/* RIGHT */}
          <Panel id="editor-panel" order={2} defaultSize={editorFullscreen ? 100 : 55} minSize="35">
            <div className="right-panel-wrapper">
              <Group orientation="vertical">

                <Panel id="code-editor" order={1} defaultSize={68} minSize="40">
                  <div className="editor-wrapper">
                    <CodeEditorPanel
                      starterCode={problemData.starterCode}
                      language={language}
                      code={code}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={setCode}
                      isFullscreen={editorFullscreen}
                      onToggleFullscreen={() => setEditorFullscreen(f => !f)}
                      theme={theme}
                    />
                  </div>
                </Panel>

                {!editorFullscreen && (
                  <>
                    <Separator className="resize-handle-horizontal" />
                    <Panel id="testcase-panel" order={2} defaultSize={32} minSize="30">
                      <div className="testcase-wrapper">
                        <TestcasePanel
                          problemSlug={problemSlug}
                          testcases={problemData.testcases}
                          runResult={runMutation.data}
                          isRunning={runMutation.isPending}
                          runError={runMutation.isError ? runMutation.error : null}
                          submitResult={submitPollResult ?? submitMutation.data}
                          isSubmitting={submitMutation.isPending || isPolling}
                          submitError={submitMutation.isError ? submitMutation.error : null}
                        />
                      </div>
                    </Panel>
                  </>
                )}

              </Group>
            </div>
          </Panel>

        </Group>
      </div>

      {/* ── MOBILE ── */}
      <div className="ws-mobile">
        <div className="ws-mobile-content">
          {mobileTab === "description" && (
            <div className="prob-panel">
              <ProblemDescription problem={problemData} />
            </div>
          )}
          {mobileTab === "code" && (
            <div className="ws-mobile-code-split">
              <div className="ws-mobile-editor">
                <CodeEditorPanel
                  starterCode={problemData.starterCode}
                  language={language}
                  code={code}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                />
              </div>
              <div className="ws-mobile-divider" />
              <div className="ws-mobile-testcase">
                <TestcasePanel
                  problemSlug={problemSlug}
                  testcases={problemData.testcases}
                  runResult={runMutation.data}
                  isRunning={runMutation.isPending}
                  runError={runMutation.isError ? runMutation.error : null}
                  submitResult={submitPollResult ?? submitMutation.data}
                  isSubmitting={submitMutation.isPending || isPolling}
                  submitError={submitMutation.isError ? submitMutation.error : null}
                />
              </div>
            </div>
          )}
        </div>

        <div className="ws-mobile-tabbar">
          {[
            { id: "description", label: "Description", icon: "ti-file-text" },
            { id: "code",        label: "Code",        icon: "ti-code" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`ws-mob-tab ${mobileTab === tab.id ? "ws-mob-tab-active" : ""}`}
              onClick={() => setMobileTab(tab.id)}
            >
              <i className={`ti ${tab.icon}`} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
      {authorizationModal}

      <ConfirmModal
        open={showSubmitModal}
        onConfirm={doSubmit}
        onCancel={() => setShowSubmitModal(false)}
        title="Submit Solution?"
        message="Your code will be evaluated against all test cases. Are you ready to submit?"
        confirmLabel="Submit"
        cancelLabel="Cancel"
      />
  </>
  );
};

export default ProblemWorkspace;