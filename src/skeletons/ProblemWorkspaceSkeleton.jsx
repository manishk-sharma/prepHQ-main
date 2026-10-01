import React from "react";
import { Skeleton, Box } from "@mui/material";

const NAVY  = "#074568";
const GREEN = "#37AB79";
const BORDER = `color-mix(in srgb, ${NAVY} 12%, #e5e7eb)`;

const CODE_LINE_WIDTHS = [72, 58, 85, 45, 90, 62, 78, 50, 68, 55, 80, 40, 75, 60, 88];

const ProblemWorkspaceSkeleton = ({ theme = "light" }) => {
  const dark = theme === "dark";

  const skBg   = dark ? "#2a2a2a" : undefined;
  const sk     = (extra = {}) => ({ bgcolor: skBg, ...extra });
  const panelBg = dark ? "#282828" : "#ffffff";
  const editorBg = dark ? "#1e1e1e" : "#ffffff";
  const langbarBg = dark ? "#252526" : "#f8fafc";
  const tcBg   = dark ? "#282828" : "#ffffff";
  const borderCol = dark ? "#2d2d2d" : BORDER;
  const footerBg  = dark ? "#1e1e1e" : "#f8fafc";
  const tagBg     = dark ? "#3a3a3a" : "#E6FFF4";

  return (
    <div
      className={`workspace-container${dark ? " ws-dark" : ""}`}
      style={{ overflow: "hidden" }}
    >
      {/* ══ HEADER 48px ══ */}
      <div className="ws-header">
        {/* Left: logo + nav chevrons */}
        <div className="ws-header-left" style={{ gap: 8 }}>
          <Skeleton variant="circular" width={28} height={28} sx={sk()} />
          <Skeleton variant="rounded" width={72} height={18} sx={sk({ borderRadius: 1 })} />
          <div className="ws-nav-divider" />
          <Skeleton variant="circular" width={28} height={28} sx={sk()} />
          <Skeleton variant="circular" width={28} height={28} sx={sk()} />
          <Skeleton variant="circular" width={28} height={28} sx={sk()} />
        </div>

        {/* Center: Run + Submit */}
        <div className="ws-header-center">
          <Skeleton variant="rounded" width={72}  height={30} sx={sk({ borderRadius: "6px" })} />
          <Skeleton variant="rounded" width={80}  height={30} sx={sk({ borderRadius: "6px", bgcolor: dark ? "#2d4a3e" : "rgba(55,171,121,0.25)" })} />
        </div>

        {/* Right: timer + user icon */}
        <div className="ws-header-right">
          <Skeleton variant="text"     width={48} height={16} sx={sk()} />
          <Skeleton variant="circular" width={28} height={28} sx={sk()} />
          <Skeleton variant="circular" width={28} height={28} sx={sk()} />
        </div>
      </div>

      {/* ══ DESKTOP ══ */}
      <div className="ws-panels ws-desktop">

        {/* ── LEFT PANEL (45%) — Problem description ── */}
        <div
          style={{
            width: "45%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            background: panelBg,
          }}
        >
          {/* Prob tabs bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderBottom: `1px solid ${borderCol}`,
              height: 40,
              flexShrink: 0,
              gap: 16,
              background: panelBg,
            }}
          >
            {[60, 72, 56].map((w, i) => (
              <Skeleton key={i} variant="rounded" width={w} height={14} sx={sk({ borderRadius: 1 })} />
            ))}
          </div>

          {/* Prob content */}
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 20px 80px" }}>
            {/* Title */}
            <Skeleton variant="text" width="70%" height={26} sx={sk({ borderRadius: 1, mb: 1.5 })} />

            {/* Meta badges: difficulty + tags */}
            <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
              <Skeleton variant="rounded" width={54}  height={22} sx={sk({ borderRadius: "12px" })} />
              <Skeleton variant="rounded" width={72}  height={22} sx={{ bgcolor: dark ? "#3a3a3a" : tagBg, borderRadius: "12px" }} />
              <Skeleton variant="rounded" width={88}  height={22} sx={{ bgcolor: dark ? "#3a3a3a" : tagBg, borderRadius: "12px" }} />
              <Skeleton variant="rounded" width={64}  height={22} sx={{ bgcolor: dark ? "#3a3a3a" : tagBg, borderRadius: "12px" }} />
            </Box>

            {/* Description paragraphs */}
            {[100, 92, 85, 78, 96].map((w, i) => (
              <Skeleton key={i} variant="text" width={`${w}%`} height={16} sx={sk({ borderRadius: 0.5, mb: 0.75 })} />
            ))}

            {/* Example 1 block */}
            <Box sx={{ mt: 2.5, mb: 2 }}>
              <Skeleton variant="text" width={90} height={15} sx={sk({ borderRadius: 0.5, mb: 1 })} />
              <Box
                sx={{
                  background: dark ? "#1e1e1e" : `color-mix(in srgb, ${NAVY} 4%, white)`,
                  borderLeft: `3px solid ${GREEN}`,
                  borderRadius: "0 6px 6px 0",
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {[55, 48, 62].map((w, i) => (
                  <Skeleton key={i} variant="text" width={`${w}%`} height={14} sx={sk({ borderRadius: 0.5 })} />
                ))}
              </Box>
            </Box>

            {/* Example 2 block */}
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width={90} height={15} sx={sk({ borderRadius: 0.5, mb: 1 })} />
              <Box
                sx={{
                  background: dark ? "#1e1e1e" : `color-mix(in srgb, ${NAVY} 4%, white)`,
                  borderLeft: `3px solid ${GREEN}`,
                  borderRadius: "0 6px 6px 0",
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {[50, 44, 58].map((w, i) => (
                  <Skeleton key={i} variant="text" width={`${w}%`} height={14} sx={sk({ borderRadius: 0.5 })} />
                ))}
              </Box>
            </Box>

            {/* Constraints */}
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width={100} height={15} sx={sk({ borderRadius: 0.5, mb: 1.25 })} />
              {[62, 48, 55, 44].map((w, i) => (
                <Skeleton key={i} variant="text" width={`${w}%`} height={14} sx={sk({ borderRadius: 0.5, mb: 0.75 })} />
              ))}
            </Box>
          </div>

          {/* Prob footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 20px",
              borderTop: `1px solid ${borderCol}`,
              flexShrink: 0,
              background: footerBg,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="rounded" width={52} height={26} sx={sk({ borderRadius: "6px" })} />
              <Skeleton variant="rounded" width={52} height={26} sx={sk({ borderRadius: "6px" })} />
              <Skeleton variant="rounded" width={52} height={26} sx={sk({ borderRadius: "6px" })} />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="rounded" width={52} height={26} sx={sk({ borderRadius: "6px" })} />
              <Skeleton variant="rounded" width={52} height={26} sx={sk({ borderRadius: "6px" })} />
            </Box>
          </div>
        </div>

        {/* Resize handle */}
        <div className="resize-handle" />

        {/* ── RIGHT PANEL (55%) — Editor + Testcase ── */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Code editor (~68% height) ── */}
          <div style={{ flex: "68 68 0", minHeight: 0, display: "flex", flexDirection: "column", background: editorBg }}>

            {/* Editor topbar 45px */}
            <div
              style={{
                height: 45,
                borderBottom: `1px solid ${borderCol}`,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                gap: 8,
                flexShrink: 0,
                background: editorBg,
              }}
            >
              <Skeleton variant="circular" width={16} height={16} sx={sk()} />
              <Skeleton variant="text" width={56} height={16} sx={sk({ borderRadius: 0.5 })} />
            </div>

            {/* Lang bar 40px */}
            <div
              style={{
                height: 40,
                borderBottom: `1px solid ${borderCol}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                flexShrink: 0,
                background: langbarBg,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Skeleton variant="rounded" width={110} height={26} sx={sk({ borderRadius: "6px" })} />
                <Skeleton variant="text"    width={64}  height={14} sx={sk({ borderRadius: 0.5 })} />
              </Box>
              <Box sx={{ display: "flex", gap: 0.75 }}>
                <Skeleton variant="rounded" width={26} height={26} sx={sk({ borderRadius: "5px" })} />
                <Skeleton variant="rounded" width={26} height={26} sx={sk({ borderRadius: "5px" })} />
                <Skeleton variant="rounded" width={26} height={26} sx={sk({ borderRadius: "5px" })} />
              </Box>
            </div>

            {/* Code body */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                padding: "16px 20px",
                overflowY: "auto",
                background: editorBg,
              }}
            >
              {/* Line numbers + code lines */}
              {CODE_LINE_WIDTHS.map((w, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 0.6, gap: 2 }}>
                  <Skeleton
                    variant="text"
                    width={18}
                    height={14}
                    sx={sk({ borderRadius: 0.5, opacity: 0.4, flexShrink: 0 })}
                  />
                  {w > 0 && (
                    <Skeleton
                      variant="text"
                      width={`${w}%`}
                      height={14}
                      sx={sk({ borderRadius: 0.5 })}
                    />
                  )}
                </Box>
              ))}
            </div>

            {/* Status bar 24px */}
            <div
              style={{
                height: 24,
                background: NAVY,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                flexShrink: 0,
              }}
            >
              <Skeleton variant="text" width={80}  height={12} sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: 0.5 }} />
              <Skeleton variant="text" width={60}  height={12} sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: 0.5 }} />
            </div>
          </div>

          {/* Resize handle horizontal */}
          <div className="resize-handle-horizontal" />

          {/* ── Testcase panel (~32% height) ── */}
          <div style={{ flex: "32 32 0", minHeight: 0, display: "flex", flexDirection: "column", background: tcBg }}>

            {/* TC tabs 40px */}
            <div
              style={{
                height: 40,
                borderBottom: `1px solid ${borderCol}`,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                gap: 4,
                flexShrink: 0,
                background: tcBg,
              }}
            >
              <Skeleton variant="text" width={80} height={14} sx={sk({ borderRadius: 0.5 })} />
              <div style={{ width: 1, height: 14, background: borderCol, margin: "0 6px" }} />
              <Skeleton variant="text" width={80} height={14} sx={sk({ borderRadius: 0.5 })} />
            </div>

            {/* TC body */}
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 14, background: tcBg }}>
              {/* Case switcher buttons */}
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                {[72, 72, 72].map((w, i) => (
                  <Skeleton key={i} variant="rounded" width={w} height={28} sx={sk({ borderRadius: "8px" })} />
                ))}
                <Skeleton variant="rounded" width={28} height={28} sx={sk({ borderRadius: "8px" })} />
              </Box>

              {/* Input field 1 */}
              <Box sx={{ mb: 2 }}>
                <Skeleton variant="text" width={60} height={14} sx={sk({ borderRadius: 0.5, mb: 0.75 })} />
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={44}
                  sx={sk({ borderRadius: "8px" })}
                />
              </Box>

              {/* Input field 2 */}
              <Box>
                <Skeleton variant="text" width={60} height={14} sx={sk({ borderRadius: 0.5, mb: 0.75 })} />
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={44}
                  sx={sk({ borderRadius: "8px" })}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE ══ */}
      <div className="ws-mobile">
        <div className="ws-mobile-content" style={{ background: panelBg }}>
          {/* Mobile: show description skeleton */}
          <div style={{ padding: "20px 16px" }}>
            <Skeleton variant="text" width="65%" height={26} sx={sk({ borderRadius: 1, mb: 1.5 })} />
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Skeleton variant="rounded" width={54} height={22} sx={sk({ borderRadius: "12px" })} />
              <Skeleton variant="rounded" width={72} height={22} sx={sk({ borderRadius: "12px" })} />
            </Box>
            {[100, 90, 82, 95, 75].map((w, i) => (
              <Skeleton key={i} variant="text" width={`${w}%`} height={15} sx={sk({ borderRadius: 0.5, mb: 0.75 })} />
            ))}
          </div>
        </div>

        {/* Mobile tabbar 52px */}
        <div
          className="ws-mobile-tabbar"
          style={{ background: dark ? "#1e1e1e" : "#ffffff", borderTop: `1px solid ${borderCol}` }}
        >
          {[64, 40].map((w, i) => (
            <div key={i} className="ws-mob-tab" style={{ pointerEvents: "none" }}>
              <Skeleton variant="circular" width={22} height={22} sx={sk()} />
              <Skeleton variant="text" width={w} height={12} sx={sk({ borderRadius: 0.5 })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemWorkspaceSkeleton;
