import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPlay,
  FaCloudUploadAlt,
  FaRandom,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { Link } from "react-router-dom";
import { toggleTheme } from "../../../../redux/slices/workspaceSlice";

const WorkspaceHeader = ({
  onRun, onSubmit, onPrev, onNext, onShuffle,
  hasPrev, hasNext,
  isRunning = false, isSubmitting = false, isPolling = false,
}) => {
  const dispatch = useDispatch();
  const theme    = useSelector((state) => state.workspace?.theme ?? "light");

  const isBusy = isRunning || isSubmitting || isPolling;

  const submitLabel = isSubmitting ? "Submitting…" : isPolling ? "Judging…" : "Submit";

  return (
    <div className="ws-header">
      {/* LEFT */}
      <div className="ws-header-left">
        <Link to="/prepcode" className="text-decoration-none">
          <span className="ws-logo">
            <img
              src="/logos/PrepHQ-02.png"
              alt="PrepHQ"
              className="ws-logo-img"
            />
            <span className="ws-logo-text">PrepCode</span>
          </span>
        </Link>

        <div className="ws-nav-divider" />
        <button
          className="ws-icon-btn"
          title="Previous Question"
          onClick={onPrev}
          disabled={!hasPrev || isBusy}
          style={{ opacity: hasPrev && !isBusy ? 1 : 0.35, cursor: hasPrev && !isBusy ? "pointer" : "not-allowed" }}
        >
          <FaChevronLeft size={13} />
        </button>
        <button
          className="ws-icon-btn"
          title="Next Question"
          onClick={onNext}
          disabled={!hasNext || isBusy}
          style={{ opacity: hasNext && !isBusy ? 1 : 0.35, cursor: hasNext && !isBusy ? "pointer" : "not-allowed" }}
        >
          <FaChevronRight size={13} />
        </button>
        <button
          className="ws-icon-btn"
          title="Shuffle — go to a random question"
          onClick={onShuffle}
          disabled={isBusy}
          style={{ opacity: isBusy ? 0.35 : 1, cursor: isBusy ? "not-allowed" : "pointer" }}
        >
          <FaRandom size={13} />
        </button>
      </div>

      {/* CENTER */}
      <div className="ws-header-center">
        <button className="ws-btn-run" onClick={onRun} disabled={isBusy}>
          {isRunning ? <span className="ws-spinner" /> : <FaPlay size={11} />}
          {isRunning ? "Running…" : "Run"}
        </button>
        <button className="ws-btn-submit" onClick={onSubmit} disabled={isBusy}>
          {(isSubmitting || isPolling) ? <span className="ws-spinner" /> : <FaCloudUploadAlt size={15} />}
          {submitLabel}
        </button>
      </div>

      {/* RIGHT */}
      <div className="ws-header-right">
        <button
          className="ws-icon-btn ws-theme-toggle"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light"
            ? <MdOutlineDarkMode  size={18} />
            : <MdOutlineLightMode size={18} />
          }
        </button>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
