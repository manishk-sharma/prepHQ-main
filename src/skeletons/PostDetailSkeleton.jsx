import React from "react";
import { Skeleton, Box } from "@mui/material";

const GREEN  = "#37AB79";
const MINT   = "#E6FFF4";

const PARA_WIDTHS    = [100, 92, 97, 85, 100, 78, 94, 88, 100, 72, 96, 83];
const TOC_WIDTHS     = [130, 110, 95, 120, 100, 115, 88];
const CAT_WIDTHS_R   = [110, 130, 95, 120, 105];

const PostDetailSkeleton = () => (
  <section className="post-detail-page py-4 py-lg-5">
    <div className="custom-container">
      <div className="row g-4">

        {/* ── LEFT SIDEBAR: TOC (col-md-4 col-lg-3) ── */}
        <div className="col-md-4 col-lg-3">
          <div className="sticky-div">
            {/* Progress ring */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Skeleton variant="circular" width={54} height={54} />
              <Skeleton variant="text" width={100} height={18} sx={{ borderRadius: 0.5 }} />
            </Box>

            {/* TOC heading */}
            <Skeleton variant="text" width={130} height={20} sx={{ borderRadius: 0.5, mb: 1.5 }} />

            {/* TOC items */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {TOC_WIDTHS.map((w, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: i % 3 !== 0 ? 2 : 0,
                    borderLeft: i === 1 ? `2px solid ${GREEN}` : "2px solid transparent",
                  }}
                >
                  <Skeleton
                    variant="text"
                    width={w}
                    height={16}
                    sx={{
                      borderRadius: 0.5,
                      bgcolor: i === 1 ? `color-mix(in srgb, ${GREEN} 20%, #e5e7eb)` : undefined,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </div>
        </div>

        {/* ── CENTER: Main content (col-md-8 col-lg-6) ── */}
        <div className="col-md-8 col-lg-6">

          {/* Author + meta header row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", lg: "center" },
              flexDirection: { xs: "column", lg: "row" },
              gap: { xs: 1.5, lg: 2 },
              mb: 2,
            }}
          >
            {/* Author */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Skeleton variant="circular" width={50} height={50} sx={{ flexShrink: 0 }} />
              <Skeleton variant="text" width={90} height={16} sx={{ borderRadius: 0.5 }} />
            </Box>

            {/* Date + reading time + category */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Skeleton variant="text" width={90}  height={16} sx={{ borderRadius: 0.5 }} />
              <Skeleton variant="text" width={100} height={16} sx={{ borderRadius: 0.5 }} />
              <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: "8px" }} />
            </Box>
          </Box>

          {/* Post title h1 */}
          <Skeleton variant="text" width="85%" height={40} sx={{ borderRadius: 0.5, mb: 0.5 }} />
          <Skeleton variant="text" width="60%" height={40} sx={{ borderRadius: 0.5, mb: 3 }} />

          {/* Body paragraphs */}
          <Box sx={{ mb: 3 }}>
            {PARA_WIDTHS.slice(0, 5).map((w, i) => (
              <Skeleton key={i} variant="text" width={`${w}%`} height={18} sx={{ borderRadius: 0.5, mb: 0.75 }} />
            ))}
          </Box>

          {/* Code block skeleton */}
          <Box
            sx={{
              background: "#0f172a",
              borderRadius: "12px",
              overflow: "hidden",
              mb: 3,
            }}
          >
            {/* Code header bar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1.5,
                py: 1,
                background: "rgba(255,255,255,0.07)",
              }}
            >
              <Skeleton variant="text" width={40} height={14} sx={{ bgcolor: "rgba(255,255,255,0.2)", borderRadius: 0.5 }} />
              <Skeleton variant="rounded" width={50} height={22} sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "6px" }} />
            </Box>
            {/* Code lines */}
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: "10px" }}>
              {[55, 80, 70, 90, 60, 75, 45, 65].map((w, i) => (
                <Skeleton
                  key={i}
                  variant="text"
                  width={`${w}%`}
                  height={14}
                  sx={{ bgcolor: "rgba(255,255,255,0.12)", borderRadius: 0.5 }}
                />
              ))}
            </Box>
          </Box>

          {/* More paragraphs */}
          <Box sx={{ mb: 3 }}>
            {PARA_WIDTHS.slice(5).map((w, i) => (
              <Skeleton key={i} variant="text" width={`${w}%`} height={18} sx={{ borderRadius: 0.5, mb: 0.75 }} />
            ))}
          </Box>

          {/* About author section */}
          <Box
            sx={{
              background: MINT,
              border: `1px solid ${GREEN}`,
              borderRadius: "12px",
              display: "flex",
              gap: 2,
              p: { xs: 1.5, lg: 2 },
              alignItems: "flex-start",
              mb: { xs: 3, lg: 4 },
            }}
          >
            <Skeleton variant="circular" width={50} height={50} sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={160} height={22} sx={{ borderRadius: 0.5, mb: 1 }} />
              {[100, 92, 78].map((w, i) => (
                <Skeleton key={i} variant="text" width={`${w}%`} height={16} sx={{ borderRadius: 0.5, mb: 0.5 }} />
              ))}
              <Skeleton variant="text" width={120} height={16} sx={{ borderRadius: 0.5, mt: 1.5 }} />
            </Box>
          </Box>

          {/* Related posts */}
          <Skeleton variant="text" width={110} height={24} sx={{ borderRadius: 0.5, mb: 2 }} />
          <div className="posts-grid">
            {[[90, 65], [80, 55]].map((widths, i) => (
              <div key={i} className="post-card rounded-4 d-flex flex-column gap-3">
                <Skeleton variant="rounded" width="100%" height={180} sx={{ borderRadius: "12px" }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Skeleton variant="circular" width={44} height={44} />
                    <Skeleton variant="text" width={70} height={16} sx={{ borderRadius: 0.5 }} />
                  </Box>
                  <Skeleton variant="rounded" width={64} height={28} sx={{ borderRadius: "8px" }} />
                </Box>
                <Skeleton variant="text" width={`${widths[0]}%`} height={18} sx={{ borderRadius: 0.5, mb: 0.4 }} />
                <Skeleton variant="text" width={`${widths[1]}%`} height={18} sx={{ borderRadius: 0.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton variant="text" width={85} height={16} sx={{ borderRadius: 0.5 }} />
                  <Skeleton variant="text" width={44} height={16} sx={{ borderRadius: 0.5 }} />
                </Box>
                <Skeleton variant="rounded" width="100%" height={36} sx={{ borderRadius: "8px" }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR: like + share + categories (d-none d-lg-block col-lg-3) ── */}
        <div className="d-none d-lg-block col-lg-3">
          <div className="sticky-div">

            {/* Like wrapper */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Skeleton variant="circular" width={30} height={30} />
              <Skeleton variant="text" width={90} height={16} sx={{ borderRadius: 0.5 }} />
            </Box>

            {/* Share row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Skeleton variant="text" width={48} height={22} sx={{ borderRadius: 0.5 }} />
              <Box sx={{ display: "flex", gap: 1 }}>
                {[40, 40, 40, 40].map((s, i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    width={s}
                    height={s}
                    sx={{
                      borderRadius: "8px",
                      bgcolor: `color-mix(in srgb, ${GREEN} 15%, #e5e7eb)`,
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Popular Category heading */}
            <Skeleton variant="text" width={140} height={22} sx={{ borderRadius: 0.5, mb: 2 }} />

            {/* Categories list */}
            <Box
              sx={{
                border: `1.5px solid color-mix(in srgb, ${GREEN} 35%, #e5e7eb)`,
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {CAT_WIDTHS_R.map((w, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 51 }}
                >
                  <Skeleton variant="text" width={w}  height={16} sx={{ borderRadius: 0.5 }} />
                  <Skeleton variant="text" width={28} height={16} sx={{ borderRadius: 0.5 }} />
                </Box>
              ))}
            </Box>
          </div>
        </div>

      </div>
    </div>
  </section>
);

export default PostDetailSkeleton;
