import { useState, useEffect, useRef } from "react";
import { useTOC } from "../context/useTOCContext";

const tocData = [
  { id: "toc-h2-0", text: "What is Data Visualization?", type: "h2" },
  { id: "toc-h2-1", text: "Why Use Excel for Charts?", type: "h2" },
  { id: "toc-h3-0", text: "Bar Charts & Column Charts", type: "h3" },
  { id: "toc-h3-1", text: "Line Graphs & Trends", type: "h3" },
  { id: "toc-h2-2", text: "Step-by-Step Guide", type: "h2" },
  { id: "toc-h3-2", text: "Inserting a Chart", type: "h3" },
  { id: "toc-h3-3", text: "Customizing Colors", type: "h3" },
  { id: "toc-h2-3", text: "Advanced Techniques", type: "h2" },
  { id: "toc-h2-4", text: "Common Mistakes to Avoid", type: "h2" },
  { id: "toc-h2-5", text: "Conclusion", type: "h2" },
];

export default function TableOfContents({ toc = tocData, activeId }) {
  // const [isOpen, setIsOpen] = useState(false);
   const { isTOCOpen:isOpen, setIsTOCOpen:setIsOpen } = useTOC();
  const [active, setActive] = useState(activeId || toc[0]?.id || "");
  const panelRef = useRef(null);

  useEffect(() => {
    if (activeId) setActive(activeId);
  }, [activeId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        const trigger = document.getElementById("toc-trigger-btn");
        if (!trigger?.contains(e.target)) setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const scrollTo = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const progress =
    toc.length > 1
      ? (toc.findIndex((t) => t.id === active) / (toc.length - 1)) * 100
      : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .toc-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

        /* Trigger button */
        .toc-trigger {
          position: fixed;
          left: 20px;
          top: 52%;
         
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 20px;
          padding: 14px 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .toc-trigger:hover {
          background: rgba(255,255,255,0.28);
          transform:  scale(1.05);
          box-shadow: 0 12px 40px rgba(0,0,0,0.16);
        }
        .toc-trigger-label {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: rgba(55,171,121,0.9);
          text-transform: uppercase;
          user-select: none;
        }
        .toc-trigger-icon {
          width: 18px;
          height: 18px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          align-items: center;
        }
        .toc-trigger-icon span {
          display: block;
          height: 2px;
          border-radius: 2px;
          background: rgba(55,171,121,0.85);
          transition: width 0.2s;
        }
        .toc-trigger-icon span:nth-child(1) { width: 14px; }
        .toc-trigger-icon span:nth-child(2) { width: 10px; }
        .toc-trigger-icon span:nth-child(3) { width: 12px; }

        /* Progress arc indicator */
        .toc-progress-ring {
          position: absolute;
          top: -2px; left: -2px;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          pointer-events: none;
          border-radius: 22px;
          overflow: visible;
        }

        /* Panel */
        .toc-panel {
          position: fixed;
          left: 20px;
          top: 50%;
          transform: translateY(-40%) translateX(-110%);
          z-index: 999;
          width: 280px;
          max-height: min(520px, 80vh);
          border-radius: 20px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.14),
            0 4px 16px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1),
                      opacity 0.3s ease;
          opacity: 0;
          pointer-events: none;
        }
        .toc-panel.open {
          transform: translateY(-40%) translateX(0);
          opacity: 1;
          pointer-events: all;
        }

        /* Panel header */
        .toc-panel-header {
          padding: 16px 18px 12px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .toc-panel-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(0,0,0,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .toc-close-btn {
          width: 24px; height: 24px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.07);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          color: rgba(0,0,0,0.45);
          font-size: 14px;
          line-height: 1;
          padding: 0;
        }
        .toc-close-btn:hover { background: rgba(0,0,0,0.12); }

        /* Progress bar */
        .toc-progress-bar {
          height: 2px;
          background: rgba(55,171,121,0.15);
          flex-shrink: 0;
        }
        .toc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #37AB79, #57CC99);
          border-radius: 2px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Scrollable list */
        .toc-list {
          overflow-y: auto;
          padding: 10px 10px;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.12) transparent;
        }
        .toc-list::-webkit-scrollbar { width: 4px; }
        .toc-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }

        /* TOC Items */
        .toc-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          margin-bottom: 2px;
          border: 1px solid transparent;
        }
        .toc-item:hover {
          background: rgba(55,171,121,0.08);
          border-color: rgba(55,171,121,0.15);
        }
        .toc-item.active {
          background: rgba(55,171,121,0.12);
          border-color: rgba(55,171,121,0.25);
        }
        .toc-item.h3 {
          padding-left: 26px;
        }

        /* Dot indicator */
        .toc-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          background: rgba(0,0,0,0.18);
          transition: all 0.25s ease;
        }
        .toc-item.active .toc-dot {
          background: #37AB79;
          box-shadow: 0 0 0 3px rgba(55,171,121,0.2);
          transform: scale(1.2);
        }
        .toc-item.h3 .toc-dot {
          width: 5px; height: 5px;
          background: rgba(0,0,0,0.12);
        }
        .toc-item.h3.active .toc-dot {
          background: #57CC99;
          box-shadow: 0 0 0 2px rgba(87,204,153,0.2);
        }

        /* Item text */
        .toc-text {
          font-size: 13.5px;
          font-weight: 400;
          color: rgba(0,0,0,0.55);
          line-height: 1.35;
          transition: color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .toc-item.active .toc-text {
          color: rgba(0,0,0,0.85);
          font-weight: 500;
        }
        .toc-item.h3 .toc-text { font-size: 12.5px; }

        /* Section count badge */
        .toc-count {
          margin-left: auto;
          font-size: 10px;
          color: rgba(55,171,121,0.7);
          font-weight: 600;
          flex-shrink: 0;
        }

        /* Panel footer */
        .toc-panel-footer {
          padding: 10px 18px 14px;
          border-top: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .toc-footer-text {
          font-size: 11px;
          color: rgba(0,0,0,0.3);
        }
        .toc-footer-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
        }
        .toc-footer-progress {
          font-size: 11px;
          font-weight: 600;
          color: #37AB79;
        }

        /* Backdrop for mobile */
        .toc-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(2px);
          z-index: 998;
          transition: opacity 0.3s;
        }

        /* Mobile styles */
        @media (max-width: 767px) {
          .toc-trigger {
            left: 14px;
            padding: 12px 8px;
          }
          .toc-panel {
            left: 14px;
            width: calc(100vw - 28px);
            max-height: 60vh;
            top: auto;
            bottom: 20px;
            transform: translateY(120%) translateX(0);
          }
          .toc-panel.open {
            transform: translateY(0) translateX(0);
          }
          .toc-backdrop { display: block; opacity: 0; pointer-events: none; }
          .toc-backdrop.open { opacity: 1; pointer-events: all; }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .toc-trigger {
            background: rgba(30,30,30,0.5);
            border-color: rgba(255,255,255,0.12);
          }
          .toc-trigger:hover { background: rgba(40,40,40,0.65); }
          .toc-panel {
            background: rgba(28,28,30,0.82);
            border-color: rgba(255,255,255,0.1);
            box-shadow: 0 20px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.08);
          }
          .toc-panel-header { border-bottom-color: rgba(255,255,255,0.07); }
          .toc-panel-title { color: rgba(255,255,255,0.4); }
          .toc-close-btn { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }
          .toc-close-btn:hover { background: rgba(255,255,255,0.15); }
          .toc-item:hover { background: rgba(55,171,121,0.12); border-color: rgba(55,171,121,0.2); }
          .toc-item.active { background: rgba(55,171,121,0.16); border-color: rgba(55,171,121,0.3); }
          .toc-dot { background: rgba(255,255,255,0.25); }
          .toc-text { color: rgba(255,255,255,0.45); }
          .toc-item.active .toc-text { color: rgba(255,255,255,0.9); }
          .toc-panel-footer { border-top-color: rgba(255,255,255,0.06); }
          .toc-footer-text { color: rgba(255,255,255,0.25); }
          .toc-footer-dot { background: rgba(255,255,255,0.2); }
          .toc-trigger-label { color: rgba(87,204,153,0.85); }
          .toc-trigger-icon span { background: rgba(87,204,153,0.75); }
        }
      `}</style>

      <div className="toc-root">
        {/* Mobile backdrop */}
        <div
          className={`toc-backdrop ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(false)}
        />

        {/* Trigger button */}
        <button
          id="toc-trigger-btn"
          className="toc-trigger"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Table of Contents"
          title="Table of Contents"
        >
          <div className="toc-trigger-icon">
            <span />
            <span />
            <span />
          </div>
          <span className="toc-trigger-label">TOC</span>
        </button>

        {/* Frosted glass panel */}
        <div ref={panelRef} className={`toc-panel ${isOpen ? "open" : ""}`}>
          {/* Header */}
          <div className="toc-panel-header">
            <span className="toc-panel-title">Contents</span>
            <button
              className="toc-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div className="toc-progress-bar">
            <div
              className="toc-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* TOC List */}
          <div className="toc-list">
            {toc.map((item, i) => (
              <div
                key={item.id}
                className={`toc-item ${item.type} ${active === item.id ? "active" : ""}`}
                onClick={() => scrollTo(item.id)}
              >
                <span className="toc-dot" />
                <span className="toc-text">{item.text}</span>
                {item.type === "h2" && (
                  <span className="toc-count">
                    {String(
                      toc
                        .slice(0, i + 1)
                        .filter((t) => t.type === "h2").length
                    ).padStart(2, "0")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="toc-panel-footer">
            <span className="toc-footer-text">
              {toc.findIndex((t) => t.id === active) + 1} of {toc.length}{" "}
              sections
            </span>
            <span className="toc-footer-dot" />
            <span className="toc-footer-progress">
              {Math.round(progress)}% read
            </span>
          </div>
        </div>
      </div>
    </>
  );
}