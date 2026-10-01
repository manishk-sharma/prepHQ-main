import React, { useEffect, useMemo, useState } from "react";

const tocData = [
  { id: "toc-h2-0", text: "What is Data Visualization?", type: "h2" },
  { id: "toc-h2-1", text: "Why Use Excel for Charts?", type: "h2" },
  { id: "toc-h3-0", text: "Bar Charts & Column Charts", type: "h3" },
  { id: "toc-h3-1", text: "Line Graphs & Trends", type: "h3" },
  { id: "toc-h2-2", text: "Step-by-Step Guide", type: "h2" },
  { id: "toc-h3-2", text: "Inserting a Chart", type: "h3" },
  { id: "toc-h3-3", text: "Customizing Colors", type: "h3" },
  { id: "toc-h3-4", text: "Formatting Axis Labels", type: "h3" },
  { id: "toc-h3-5", text: "Adding Data Legends", type: "h3" },
  { id: "toc-h2-3", text: "Advanced Techniques", type: "h2" },
  { id: "toc-h3-6", text: "Dynamic Charts", type: "h3" },
  { id: "toc-h3-7", text: "Interactive Dashboards", type: "h3" },
  { id: "toc-h3-8", text: "Using Pivot Charts", type: "h3" },
  { id: "toc-h2-4", text: "Common Mistakes to Avoid", type: "h2" },
  { id: "toc-h3-9", text: "Overloading Charts", type: "h3" },
  { id: "toc-h3-10", text: "Wrong Color Combinations", type: "h3" },
  { id: "toc-h3-11", text: "Poor Data Scaling", type: "h3" },
  { id: "toc-h2-5", text: "Working with Large Datasets", type: "h2" },
  { id: "toc-h3-12", text: "Filtering Data Efficiently", type: "h3" },
  { id: "toc-h3-13", text: "Using Excel Tables", type: "h3" },
  { id: "toc-h2-6", text: "Data Cleaning Techniques", type: "h2" },
  { id: "toc-h3-14", text: "Removing Duplicate Entries", type: "h3" },
  { id: "toc-h3-15", text: "Handling Missing Values", type: "h3" },
  { id: "toc-h3-16", text: "Text to Columns", type: "h3" },
  { id: "toc-h2-7", text: "Excel Shortcuts for Productivity", type: "h2" },
  { id: "toc-h3-17", text: "Keyboard Navigation", type: "h3" },
  { id: "toc-h3-18", text: "Quick Formatting Tricks", type: "h3" },
  { id: "toc-h2-8", text: "Best Practices for Dashboards", type: "h2" },
  { id: "toc-h3-19", text: "Minimal UI Design", type: "h3" },
  { id: "toc-h3-20", text: "Choosing the Right Chart", type: "h3" },
  { id: "toc-h3-21", text: "Responsive Dashboard Layouts", type: "h3" },
  { id: "toc-h2-9", text: "Exporting & Sharing Reports", type: "h2" },
  { id: "toc-h3-22", text: "Exporting as PDF", type: "h3" },
  { id: "toc-h3-23", text: "Embedding Charts in PowerPoint", type: "h3" },
  { id: "toc-h3-24", text: "Sharing Online with Teams", type: "h3" },
  { id: "toc-h2-10", text: "Conclusion", type: "h2" },
];

const NewSideBar = ({ toc = tocData }) => {
  const [activeId, setActiveId]         = useState("");
  const [readProgress, setReadProgress] = useState(0);
  const [isOpen, setIsOpen]             = useState(false);

  const roundedProgress = useMemo(() => Math.round(readProgress), [readProgress]);

  // lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // IntersectionObserver
  useEffect(() => {
    const els = toc.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0.1 }
    );

    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, [toc]);

  // scroll progress
  useEffect(() => {
    const update = () => {
      const scrollTop      = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100)));
    };
    update();
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  const handleTocClick = (e, id) => {
    e.preventDefault();
    setActiveId(id);
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };

  // reusable ring
  const ProgressRing = ({ size = 54, radius = 22, progress }) => {
    const circumference = +(2 * Math.PI * radius).toFixed(1);
    return (
      <div className="reading-progress" style={{ width: size, height: size }}>
        <svg className="progress-ring" width={size} height={size}>
          <circle className="progress-ring-bg" cx={size / 2} cy={size / 2} r={radius} />
          <circle
            className="progress-ring-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference - (circumference * progress) / 100,
            }}
          />
        </svg>
        <div className="progress-text">
          <span style={{ fontSize: size < 50 ? "9px" : "11px" }}>{progress}%</span>
        </div>
      </div>
    );
  };

  const TocList = () => (
    <div className="toc-list d-flex flex-column">
      {toc?.map((item, index) => (
        <div
          key={index}
          className={`toc-item py-1 px-2 ${activeId === item.id ? "active" : ""}`}
        >
          <a
            href={`#${item.id}`}
            className="toc-link"
            onClick={(e) => handleTocClick(e, item.id)}
          >
            {item.text}
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP sidebar (md and above)
      ══════════════════════════════════════ */}
      <div className="sidebar sticky-div text-muted d-none d-md-block">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="sidebar-title">Table of Contents</div>
          <ProgressRing size={54} radius={22} progress={roundedProgress} />
        </div>
        <div className="toc-list mt-3 d-flex flex-column">
          <TocList />
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE — sticky toggle bar (< md)
      ══════════════════════════════════════ */}
      <div className="toc-mobile-bar d-flex d-md-none">
        <button
          className="sidebar-mobile-toggle d-flex align-items-center justify-content-between w-100"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <div className="d-flex align-items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span className="sidebar-toggle-label">Table of Contents</span>
          </div>
          <ProgressRing size={36} radius={13} progress={roundedProgress} />
        </button>
      </div>

      {/* ══════════════════════════════════════
          MOBILE — backdrop
      ══════════════════════════════════════ */}
      <div
        className={`toc-backdrop d-md-none ${isOpen ? "toc-backdrop-visible" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* ══════════════════════════════════════
          MOBILE — offcanvas panel
      ══════════════════════════════════════ */}
      <div className={`toc-offcanvas d-md-none ${isOpen ? "toc-offcanvas-open" : ""}`}>
        {/* panel header */}
        <div className="toc-offcanvas-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <ProgressRing size={44} radius={17} progress={roundedProgress} />
            <div className="sidebar-title mb-0">Table of Contents</div>
          </div>
          <button
            className="toc-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* scrollable list */}
        <div className="toc-offcanvas-body toc-list">
          <TocList />
        </div>
      </div>
    </>
  );
};

export default NewSideBar;