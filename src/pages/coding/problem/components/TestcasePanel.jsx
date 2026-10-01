import React, { useState, useEffect } from "react";
import { MdCheckBox } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import { FaCloudUploadAlt } from "react-icons/fa";

const defaultCases = [
  { id: 1, inputs: { nums: "[2,7,11,15]", target: "9" } },
  { id: 2, inputs: { nums: "[3,2,4]", target: "6" } },
];

/* Renders an inputs object ({ x: "123" }) as labelled key = value rows. */
const InputRows = ({ inputs }) =>
  Object.entries(inputs || {}).map(([key, val]) => (
    <div key={key} className="tc-input-group">
      <label className="tc-input-label">{key} =</label>
      <div className="tc-input-box">{val}</div>
    </div>
  ));

const TestcasePanel = ({
  problemSlug,
  testcases     = defaultCases,
  runResult     = null,
  isRunning     = false,
  runError      = null,
  submitResult  = null,
  isSubmitting  = false,
  submitError   = null,
}) => {
  // "testcase" | "result" | "submit"
  const [activeTab, setActiveTab] = useState("testcase");
  const [activeCase, setActiveCase] = useState(0);

  /* Reset panel to default state whenever the question changes */
  useEffect(() => {
    setActiveTab("testcase");
    setActiveCase(0);
  }, [problemSlug]);

  /* Jump to Test Result tab when run starts/finishes/fails */
  useEffect(() => {
    if (isRunning || runResult || runError) {
      setActiveTab("result");
      setActiveCase(0);
    }
  }, [isRunning, runResult, runError]);

  /* Jump to Submit tab when submit starts/finishes/fails */
  useEffect(() => {
    if (isSubmitting || submitResult || submitError) {
      setActiveTab("submit");
    }
  }, [isSubmitting, submitResult, submitError]);

  const currentCase = testcases[activeCase];

  /* ── Run Result body ── */
  const renderRunResult = () => {
    if (isRunning) {
      return <p className="tc-running">Running your code…</p>;
    }

    if (runError) {
      return (
        <div className="tc-error-box">
          <div className="tc-error-title">Couldn't reach the server</div>
          <div className="tc-error-detail">
            {runError?.message || "Please try again."}
          </div>
        </div>
      );
    }

    if (!runResult) {
      return <p className="tc-no-result">Run your code to see results here.</p>;
    }

    if (runResult.status === "runtime_error") {
      return (
        <div className="tc-error-box">
          <div className="tc-error-title">Runtime / Compile Error</div>
          <pre className="tc-error-detail tc-error-pre">
            {runResult.error_message || "Execution failed."}
          </pre>
        </div>
      );
    }

    if (runResult.status === "timeout") {
      return (
        <div className="tc-summary tc-summary-warn">
          {runResult.message || "Time Limit Exceeded"}
        </div>
      );
    }

    const results  = runResult.results  || [];
    const summary  = runResult.summary  || {};
    const accepted = summary.status === "Accepted";
    const activeResult = results[activeCase];

    return (
      <>
        <div className={`tc-summary ${accepted ? "tc-summary-pass" : "tc-summary-fail"}`}>
          <span className="tc-summary-status">{summary.status}</span>
          <span className="tc-summary-meta">
            {summary.passed}/{summary.total} passed
            {summary.avg_runtime_ms != null && ` · ${summary.avg_runtime_ms} ms`}
          </span>
        </div>

        <div className="tc-case-switcher">
          {results.map((r, i) => (
            <button
              key={i}
              className={`tc-case-btn ${activeCase === i ? "tc-case-btn-active" : ""}`}
              onClick={() => setActiveCase(i)}
            >
              <span className={`tc-dot ${r.passed ? "tc-dot-pass" : "tc-dot-fail"}`} />
              Case {i + 1}
            </button>
          ))}
        </div>

        {activeResult && (
          <>
            <div className={`tc-result-status ${activeResult.passed ? "tc-pass" : "tc-fail"}`}>
              {activeResult.passed ? "✓ Passed" : "✗ Failed"}
              {activeResult.runtime_ms != null && (
                <span className="tc-runtime"> · {activeResult.runtime_ms} ms</span>
              )}
            </div>

            <InputRows inputs={activeResult.input} />

            <div className="tc-input-group">
              <label className="tc-input-label">Output</label>
              <div className="tc-input-box">{String(activeResult.your_output)}</div>
            </div>

            <div className="tc-input-group">
              <label className="tc-input-label">Expected</label>
              <div className="tc-input-box">{String(activeResult.expected_output)}</div>
            </div>

            {activeResult.error && (
              <div className="tc-error-box">
                <div className="tc-error-title">Error</div>
                <pre className="tc-error-detail tc-error-pre">{activeResult.error}</pre>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  /* ── Submit Result body ── */
  const renderSubmitResult = () => {
    if (isSubmitting) {
      return <p className="tc-running">Judging your submission…</p>;
    }

    if (submitError) {
      return (
        <div className="tc-error-box">
          <div className="tc-error-title">Couldn't reach the server</div>
          <div className="tc-error-detail">
            {submitError?.message || "Please try again."}
          </div>
        </div>
      );
    }

    if (!submitResult) {
      return <p className="tc-no-result">Submit your code to see the verdict here.</p>;
    }

    const status  = String(submitResult.status || "").trim();
    const summary = submitResult.summary || {};
    const results = submitResult.results || [];

    /* ── QUEUED ── */
    if (status === "QUEUED") {
      return (
        <div className="sub-queued-wrap">
          <i className="ti ti-hourglass sub-queued-icon" />
          <div className="sub-queued-title">Submission Received</div>
          <div className="sub-queued-sub">Your code has been queued for judging</div>
          <div className="sub-queued-pills">
            {submitResult.submission_id != null && (
              <span className="sub-pill">
                <i className="ti ti-hash" /> {submitResult.submission_id}
              </span>
            )}
            {submitResult.question?.title && (
              <span className="sub-pill">
                <i className="ti ti-file-text" /> {submitResult.question.title}
              </span>
            )}
          </div>
        </div>
      );
    }

    /* ── Runtime / Compile Error ── */
    if (status === "RUNTIME ERROR" || status === "COMPILATION ERROR") {
      const label = status === "COMPILATION ERROR" ? "Compilation Error" : "Runtime Error";
      return (
        <>
          <div className="sub-verdict-banner sub-verdict-fail">
            <div className="sub-verdict-left">
              <i className="ti ti-x sub-verdict-icon" />
              <span className="sub-verdict-label">{label}</span>
            </div>
            {submitResult.submission_id != null && (
              <span className="sub-pill"># {submitResult.submission_id}</span>
            )}
          </div>
          {submitResult.error_message && (
            <div className="tc-error-box">
              <div className="tc-error-title">Error Details</div>
              <pre className="tc-error-detail tc-error-pre">{submitResult.error_message}</pre>
            </div>
          )}
        </>
      );
    }

    /* ── Time Limit Exceeded ── */
    if (status === "TIME LIMIT EXCEEDED") {
      return (
        <div className="sub-verdict-banner sub-verdict-tle">
          <div className="sub-verdict-left">
            <i className="ti ti-clock-exclamation sub-verdict-icon" />
            <span className="sub-verdict-label">Time Limit Exceeded</span>
          </div>
          {submitResult.submission_id != null && (
            <span className="sub-pill"># {submitResult.submission_id}</span>
          )}
        </div>
      );
    }

    /* ── Normal verdict (Accepted / Wrong Answer) ── */
    const isAccepted = status === "ACCEPTED";

    return (
      <>
        {/* Verdict banner */}
        <div className={`sub-verdict-banner ${isAccepted ? "sub-verdict-pass" : "sub-verdict-fail"}`}>
          <div className="sub-verdict-left">
            <i className={`ti ${isAccepted ? "ti-circle-check" : "ti-circle-x"} sub-verdict-icon`} />
            <span className="sub-verdict-label">
              {status.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          </div>
          {submitResult.submission_id != null && (
            <span className="sub-pill"># {submitResult.submission_id}</span>
          )}
        </div>

        {/* Stats row */}
        {(submitResult.runtime_ms != null || submitResult.memory_mb != null ||
          summary.passed != null || submitResult.language) && (
          <div className="sub-stats-row">
            {submitResult.runtime_ms != null && (
              <div className="sub-stat">
                <i className="ti ti-bolt sub-stat-icon" />
                <div>
                  <div className="sub-stat-val">{submitResult.runtime_ms} ms</div>
                  <div className="sub-stat-key">Runtime</div>
                </div>
              </div>
            )}
            {submitResult.memory_mb != null && (
              <div className="sub-stat">
                <i className="ti ti-cpu sub-stat-icon" />
                <div>
                  <div className="sub-stat-val">{submitResult.memory_mb} MB</div>
                  <div className="sub-stat-key">Memory</div>
                </div>
              </div>
            )}
            {summary.passed != null && (
              <div className="sub-stat">
                <i className="ti ti-list-check sub-stat-icon" />
                <div>
                  <div className="sub-stat-val">{summary.passed}/{summary.total}</div>
                  <div className="sub-stat-key">Tests</div>
                </div>
              </div>
            )}
            {submitResult.language && (
              <div className="sub-stat">
                <i className="ti ti-code sub-stat-icon" />
                <div>
                  <div className="sub-stat-val">{submitResult.language}</div>
                  <div className="sub-stat-key">Language</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meta row */}
        {(submitResult.question?.title || submitResult.submitted_at) && (
          <div className="sub-meta-row">
            {submitResult.question?.title && (
              <span className="sub-meta-item">
                <i className="ti ti-file-text" /> {submitResult.question.title}
              </span>
            )}
            {submitResult.submitted_at && (
              <span className="sub-meta-item">
                <i className="ti ti-clock" />{" "}
                {new Date(submitResult.submitted_at).toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Per-case breakdown */}
        {results.length > 0 && (
          <>
            <div className="tc-case-switcher">
              {results.map((r, i) => (
                <button
                  key={i}
                  className={`tc-case-btn ${activeCase === i ? "tc-case-btn-active" : ""}`}
                  onClick={() => setActiveCase(i)}
                >
                  <span className={`tc-dot ${r.passed ? "tc-dot-pass" : "tc-dot-fail"}`} />
                  Case {i + 1}
                </button>
              ))}
            </div>

            {results[activeCase] && (
              <>
                <div className={`tc-result-status ${results[activeCase].passed ? "tc-pass" : "tc-fail"}`}>
                  {results[activeCase].passed ? "✓ Passed" : "✗ Failed"}
                  {results[activeCase].runtime_ms != null && (
                    <span className="tc-runtime"> · {results[activeCase].runtime_ms} ms</span>
                  )}
                </div>

                <InputRows inputs={results[activeCase].input} />

                {results[activeCase].your_output != null && (
                  <div className="tc-input-group">
                    <label className="tc-input-label">Output</label>
                    <div className="tc-input-box">{String(results[activeCase].your_output)}</div>
                  </div>
                )}
                {results[activeCase].expected_output != null && (
                  <div className="tc-input-group">
                    <label className="tc-input-label">Expected</label>
                    <div className="tc-input-box">{String(results[activeCase].expected_output)}</div>
                  </div>
                )}

                {results[activeCase].error && (
                  <div className="tc-error-box">
                    <div className="tc-error-title">Error</div>
                    <pre className="tc-error-detail tc-error-pre">{results[activeCase].error}</pre>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="tc-panel">
      {/* TABS */}
      <div className="tc-tabs">
        <button
          className={`tc-tab ${activeTab === "testcase" ? "tc-tab-active" : ""}`}
          onClick={() => setActiveTab("testcase")}
        >
          <MdCheckBox size={15} />
          Testcase
        </button>

        <div className="tc-tab-sep" />

        <button
          className={`tc-tab ${activeTab === "result" ? "tc-tab-active" : ""}`}
          onClick={() => setActiveTab("result")}
        >
          <FiChevronRight size={14} />
          Test Result
        </button>

        <div className="tc-tab-sep" />

        <button
          className={`tc-tab ${activeTab === "submit" ? "tc-tab-active" : ""}`}
          onClick={() => setActiveTab("submit")}
        >
          <FaCloudUploadAlt size={13} />
          &nbsp;Submit Result
        </button>
      </div>

      {/* BODY */}
      <div className="tc-body">
        {activeTab === "testcase" && (
          <>
            <div className="tc-case-switcher">
              {testcases.map((tc, i) => (
                <button
                  key={i}
                  className={`tc-case-btn ${activeCase === i ? "tc-case-btn-active" : ""}`}
                  onClick={() => setActiveCase(i)}
                >
                  Case {i + 1}
                </button>
              ))}
            </div>

            {currentCase && <InputRows inputs={currentCase.inputs} />}
          </>
        )}

        {activeTab === "result" && (
          <div className="tc-result">{renderRunResult()}</div>
        )}

        {activeTab === "submit" && (
          <div className="tc-result">{renderSubmitResult()}</div>
        )}
      </div>
    </div>
  );
};

export default TestcasePanel;
