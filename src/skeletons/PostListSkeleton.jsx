import React from "react";
import { Skeleton, Box } from "@mui/material";
import PageBreadcrumbs from "../components/PageBreadcrumbs";

const GREEN = "#37AB79";

const CARD_TITLE_WIDTHS = [
  [90, 65], [80, 50], [95, 70],
  [85, 55], [88, 62], [75, 48],
];

const CATEGORY_WIDTHS = [110, 130, 95, 120, 105, 140, 88];

const PostCardSkeleton = ({ widths }) => (
  <div className="post-card rounded-4 d-flex flex-column gap-3">
    {/* Featured image */}
    <Skeleton
      variant="rounded"
      width="100%"
      height={200}
      sx={{ borderRadius: "12px", flexShrink: 0 }}
    />

    {/* Author row */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Skeleton variant="circular" width={50} height={50} sx={{ flexShrink: 0 }} />
        <Skeleton variant="text" width={80} height={16} sx={{ borderRadius: 0.5 }} />
      </Box>
      <Skeleton variant="rounded" width={72} height={30} sx={{ borderRadius: "8px" }} />
    </Box>

    {/* Title — 2 lines */}
    <Box>
      <Skeleton variant="text" width={`${widths[0]}%`} height={20} sx={{ borderRadius: 0.5, mb: 0.5 }} />
      <Skeleton variant="text" width={`${widths[1]}%`} height={20} sx={{ borderRadius: 0.5 }} />
    </Box>

    {/* Date + likes row */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Skeleton variant="text" width={90} height={16} sx={{ borderRadius: 0.5 }} />
      <Skeleton variant="text" width={50} height={16} sx={{ borderRadius: 0.5 }} />
    </Box>

    {/* Read more button */}
    <Skeleton variant="rounded" width="100%" height={38} sx={{ borderRadius: "8px" }} />
  </div>
);

const PostListSkeleton = ({ title = "Posts" }) => (
  <>
    <PageBreadcrumbs title={title} />

    <section className="tutorials-page py-4 py-lg-5">
      <div className="container">
        <div className="row g-4">

          {/* ── Left col: cards + pagination ── */}
          <div className="col-lg-8">
            <div className="posts-grid">
              {CARD_TITLE_WIDTHS.map((widths, i) => (
                <PostCardSkeleton key={i} widths={widths} />
              ))}
            </div>

            {/* Pagination row */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, lg: 5 }, gap: 1 }}>
              {[44, 44, 44, 44, 44].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="circular"
                  width={44}
                  height={44}
                />
              ))}
            </Box>
          </div>

          {/* ── Right col: search + categories ── */}
          <div className="col-lg-4">
            <div className="sticky-div">

              {/* Search box */}
              <Skeleton
                variant="rounded"
                width="100%"
                height={50}
                sx={{ borderRadius: "14px", mb: 3 }}
              />

              {/* "Popular Category" heading */}
              <Skeleton
                variant="text"
                width={140}
                height={22}
                sx={{ borderRadius: 0.5, mb: 2 }}
              />

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
                {CATEGORY_WIDTHS.map((w, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      minHeight: 51,
                      px: "4px",
                    }}
                  >
                    <Skeleton variant="text" width={w} height={16} sx={{ borderRadius: 0.5 }} />
                    <Skeleton variant="text" width={28} height={16} sx={{ borderRadius: 0.5 }} />
                  </Box>
                ))}
              </Box>
            </div>
          </div>

        </div>
      </div>
    </section>
  </>
);

export default PostListSkeleton;
