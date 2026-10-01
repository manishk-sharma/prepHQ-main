import React from "react";
import { Skeleton, Box } from "@mui/material";
import PageBreadcrumbs from "../components/PageBreadcrumbs";

const NAVY  = "#074568";
const GREEN = "#37AB79";

const CHIP_WIDTHS  = [44, 76, 92, 68, 110, 84, 96, 60];
const ROW_COUNT    = 10;

const pulse = {
  "&::after": {
    animationDuration: "1.4s",
  },
};

const ProblemsetSkeleton = () => (
  <>
    <PageBreadcrumbs title="PrepCode Problems" />

    <section style={{ padding: "32px 0" }}>
      <div className="container" style={{ padding: "0 28px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <Skeleton
            variant="text"
            width={160}
            height={42}
            sx={{ borderRadius: 1, mb: 0.75, ...pulse }}
          />
          <Skeleton
            variant="text"
            width={220}
            height={28}
            sx={{ borderRadius: 1, ...pulse }}
          />
        </div>

        {/* ── Topic Chips ── */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px", mb: "20px" }}>
          {CHIP_WIDTHS.map((w, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={w}
              height={28}
              sx={{ borderRadius: "20px", ...pulse }}
            />
          ))}
        </Box>

        {/* ── Filter Bar ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "16px", flexWrap: "wrap" }}>
          {/* Search */}
          <Skeleton
            variant="rounded"
            width={340}
            height={38}
            sx={{ borderRadius: "8px", flexShrink: 0, ...pulse }}
          />
          {/* Difficulty tabs */}
          <Skeleton
            variant="rounded"
            width={200}
            height={38}
            sx={{ borderRadius: "8px", flexShrink: 0, ...pulse }}
          />
          {/* Random button */}
          <Skeleton
            variant="rounded"
            width={100}
            height={38}
            sx={{ borderRadius: "8px", flexShrink: 0, ...pulse }}
          />
        </Box>

        {/* ── Table ── */}
        <Box
          sx={{
            border: `1px solid color-mix(in srgb, ${GREEN} 25%, #e5e7eb)`,
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Table head */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "52px 1fr 130px 120px 110px",
              bgcolor: NAVY,
              px: 0,
            }}
          >
            {[52, "1fr", 130, 120, 110].map((w, i) => (
              <Box
                key={i}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderBottom: `2px solid color-mix(in srgb, ${GREEN} 45%, ${NAVY})`,
                  display: i >= 3 ? { xs: "none", sm: "flex" } : "flex",
                  alignItems: "center",
                }}
              >
                <Skeleton
                  variant="text"
                  width={i === 1 ? 60 : i === 0 ? 24 : 64}
                  height={14}
                  sx={{ bgcolor: "rgba(255,255,255,0.18)", borderRadius: 0.5 }}
                />
              </Box>
            ))}
          </Box>

          {/* Table rows */}
          {Array.from({ length: ROW_COUNT }).map((_, rowIdx) => {
            const isOdd = rowIdx % 2 === 0;
            return (
              <Box
                key={rowIdx}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "52px 1fr 130px 120px 110px",
                  bgcolor: isOdd ? `color-mix(in srgb, ${NAVY} 4%, white)` : "#ffffff",
                  borderBottom: `1px solid color-mix(in srgb, ${NAVY} 8%, #e5e7eb)`,
                }}
              >
                {/* S/N */}
                <Box sx={{ py: 1.75, px: 2, display: "flex", alignItems: "center" }}>
                  <Skeleton variant="text" width={22} height={18} sx={{ borderRadius: 0.5, ...pulse }} />
                </Box>

                {/* Title */}
                <Box sx={{ py: 1.75, px: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <Skeleton
                    variant="text"
                    width={`${55 + (rowIdx % 5) * 8}%`}
                    height={18}
                    sx={{ borderRadius: 0.5, ...pulse }}
                  />
                </Box>

                {/* Topic badge */}
                <Box sx={{ py: 1.75, px: 2, display: "flex", alignItems: "center" }}>
                  <Skeleton
                    variant="rounded"
                    width={72}
                    height={22}
                    sx={{ borderRadius: "20px", ...pulse }}
                  />
                </Box>

                {/* Acceptance badge — hidden mobile */}
                <Box
                  sx={{
                    py: 1.75,
                    px: 2,
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    width={52}
                    height={22}
                    sx={{ borderRadius: "20px", ...pulse }}
                  />
                </Box>

                {/* Difficulty badge — hidden mobile */}
                <Box
                  sx={{
                    py: 1.75,
                    px: 2,
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    width={56}
                    height={22}
                    sx={{ borderRadius: "20px", ...pulse }}
                  />
                </Box>
              </Box>
            );
          })}

          {/* Pagination bar */}
          <Box
            sx={{
              borderTop: `1px solid color-mix(in srgb, ${NAVY} 8%, #e5e7eb)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 2,
              px: 2,
              minHeight: 52,
            }}
          >
            <Skeleton variant="text" width={120} height={18} sx={{ borderRadius: 0.5, ...pulse }} />
            <Skeleton variant="text" width={80}  height={18} sx={{ borderRadius: 0.5, ...pulse }} />
            <Skeleton variant="circular" width={28} height={28} sx={{ ...pulse }} />
            <Skeleton variant="circular" width={28} height={28} sx={{ ...pulse }} />
          </Box>
        </Box>

      </div>
    </section>
  </>
);

export default ProblemsetSkeleton;
