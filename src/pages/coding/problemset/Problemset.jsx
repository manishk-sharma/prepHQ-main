import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiShuffle } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { useCodingQuestionList } from "../../../services/codingQuestionsServices";
import "./Problemset.css";
import PageBreadcrumbs from "../../../components/PageBreadcrumbs";
import ProblemsetSkeleton from "../../../skeletons/ProblemsetSkeleton";

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

const NAVY  = "#074568";
const MINT  = "#E6FFF4";
const GREEN = "#37AB79";

const DIFF_BADGE = {
  Easy:   { color: "#16a34a", bg: "#f0fdf4" },
  Medium: { color: "#d97706", bg: "#fffbeb" },
  Hard:   { color: "#dc2626", bg: "#fef2f2" },
};

const getAcceptanceBadge = (acceptance) => {
  const val = parseFloat(acceptance);
  if (isNaN(val)) return { color: "#9ca3af", bg: "#f3f4f6" };
  if (val >= 80)  return { color: "#16a34a", bg: "#f0fdf4" };
  if (val >= 70)  return { color: "#d97706", bg: "#fffbeb" };
  return              { color: "#dc2626", bg: "#fef2f2" };
};

const HEAD_COLS = [
  { label: "S/N",           width: 52,   hideOnMobile: false },
  { label: "Title",       width: "auto", hideOnMobile: false },
  { label: "Topic",       width: 130,  hideOnMobile: false },
  { label: "Acceptance",  width: 120,  hideOnMobile: true  },
  { label: "Difficulty",  width: 110,  hideOnMobile: true  },
];

const Problemset = () => {
  const navigate = useNavigate();
  const [search, setSearch]           = useState("");
  const [topic, setTopic]             = useState("All");
  const [difficulty, setDifficulty]   = useState("All");
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: problemsData = [], isLoading } = useCodingQuestionList();

  const topics = useMemo(() => {
    const unique = [...new Set(problemsData.map((p) => p.domain).filter(Boolean))].sort();
    return ["All", ...unique];
  }, [problemsData]);

  const filtered = useMemo(() => {
    
    return problemsData.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchTopic  = topic === "All" || p.domain?.toLowerCase() === topic.toLowerCase();
      const matchDiff   = difficulty === "All" || p.difficulty === difficulty;
      return matchSearch && matchTopic && matchDiff;
    });
  }, [search, topic, difficulty, problemsData]);

  const diffClass = (d) =>
    d === "Easy" ? "ps-easy" : d === "Medium" ? "ps-medium" : "ps-hard";

  if (isLoading) return <ProblemsetSkeleton />;

  return (
    <>
      <PageBreadcrumbs title={"PrepCode Problems"} />
      <section className="precode-problemset py-4 py-lg-5">
        <div className="ps-page container">

          {/* ── Header ── */}
          <div className="ps-header">
            <h1 className="ps-title">Problems</h1>
            <p className="ps-subtitle">
              {filtered.length} problems · solve, improve, repeat
            </p>
          </div>

          {/* ── Topic Chips ── */}
          <div className="ps-topics">
            {topics.map((t) => (
              <button
                key={t}
                className={`ps-chip ${topic === t ? "ps-chip-active" : ""}`}
                onClick={() => { setTopic(t); setPage(0); }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ── Filter Bar ── */}
          <div className="ps-filterbar">
            <div className="ps-search-wrap">
              <FiSearch className="ps-search-icon" />
              <input
                className="ps-search"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              />
            </div>

            <div className="ps-diff-tabs">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  className={`ps-diff-tab ${difficulty === d ? "ps-diff-active" : ""} ${
                    d !== "All" ? diffClass(d) + "-tab" : ""
                  }`}
                  onClick={() => { setDifficulty(d); setPage(0); }}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              className="ps-random-btn"
              onClick={() => {
                const r = filtered[Math.floor(Math.random() * filtered.length)];
                if (r) navigate(`/prepcode/problems/${r.slug}`);
              }}
              title="Random problem"
            >
              <FiShuffle size={14} />
              Pick one
            </button>
          </div>

          {/* ── MUI Table ── */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid color-mix(in srgb, ${GREEN} 25%, #e5e7eb)`,
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Table sx={{ tableLayout: { xs: "auto", sm: "fixed" }, width: "100%" }}>

              {/* Head */}
              <TableHead>
                <TableRow>
                  {HEAD_COLS.map(({ label, width, hideOnMobile }) => (
                    <TableCell
                      key={label}
                      sx={{
                        width,
                        display: hideOnMobile ? { xs: "none", sm: "table-cell" } : "table-cell",
                        bgcolor: NAVY,
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderBottom: `2px solid color-mix(in srgb, ${GREEN} 45%, ${NAVY})`,
                        py: { xs: 1, sm: 1.5 },
                        px: { xs: 1, sm: 2 },
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Body */}
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 7, color: "#d1d5db", fontSize: "14px" }}
                    >
                      No problems match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((p, i) => {
                      const globalIdx = page * rowsPerPage + i;
                      const isOdd     = globalIdx % 2 === 0;
                      const diff      = DIFF_BADGE[p.difficulty] ?? { color: "#6b7280", bg: "#f3f4f6" };
                      const cellBorder = `1px solid color-mix(in srgb, ${NAVY} 8%, #e5e7eb)`;
                      const cellPy = { xs: 1, sm: 1.75 };
                      const cellPx = { xs: 1, sm: 2 };

                      return (
                        <TableRow
                          key={p.id}
                          onClick={() => navigate(`/prepcode/problems/${p.slug}`)}
                          sx={{
                            cursor: "pointer",
                            bgcolor: isOdd
                              ? `color-mix(in srgb, ${NAVY} 4%, white)`
                              : "#ffffff",
                            transition: "background 0.12s",
                            "&:hover": {
                              bgcolor: `color-mix(in srgb, ${GREEN} 14%, ${MINT})`,
                              "& .row-title":  { color: NAVY },
                              "& .row-num":    { color: `color-mix(in srgb, ${NAVY} 70%, white)` },
                            },
                          }}
                        >
                          {/* # */}
                          <TableCell
                            className="row-num"
                            sx={{
                              color: `color-mix(in srgb, ${NAVY} 35%, #d1d5db)`,
                              fontSize: "13px",
                              fontVariantNumeric: "tabular-nums",
                              transition: "color 0.12s",
                              borderBottom: cellBorder,
                              py: cellPy, px: cellPx,
                            }}
                          >
                            {globalIdx + 1}
                          </TableCell>

                          {/* Title */}
                          <TableCell sx={{ borderBottom: cellBorder, py: cellPy, px: cellPx }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {p.solved && (
                                <BsCheckCircleFill
                                  style={{ color: GREEN, fontSize: 13, flexShrink: 0 }}
                                />
                              )}
                              <Typography
                                className="row-title"
                                sx={{
                                  fontSize: { xs: "13px", sm: "14px" },
                                  fontWeight: 500,
                                  color: NAVY,
                                  transition: "color 0.12s",
                                  lineHeight: 1.4,
                                }}
                              >
                                {p.title}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Topic */}
                          <TableCell sx={{ borderBottom: cellBorder, py: cellPy, px: cellPx }}>
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                px: 1.25, py: 0.4,
                                bgcolor: MINT,
                                border: `1px solid color-mix(in srgb, ${GREEN} 35%, white)`,
                                borderRadius: "20px",
                                fontSize: "11px",
                                color: GREEN,
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            >
                              {p.domain}
                            </Box>
                          </TableCell>

                          {/* Acceptance — hidden on mobile */}
                          <TableCell
                            sx={{
                              display: { xs: "none", sm: "table-cell" },
                              borderBottom: cellBorder,
                              py: cellPy, px: cellPx,
                            }}
                          >
                            {(() => {
                              const acc = p.acceptance ?? "—";
                              const { color, bg } = getAcceptanceBadge(acc);
                              return (
                                <Box
                                  component="span"
                                  sx={{
                                    display: "inline-block",
                                    px: 1.25, py: 0.4,
                                    bgcolor: bg,
                                    color,
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    borderRadius: "20px",
                                  }}
                                >
                                  {acc}
                                </Box>
                              );
                            })()}
                          </TableCell>

                          {/* Difficulty — hidden on mobile */}
                          <TableCell sx={{ display: { xs: "none", sm: "table-cell" }, borderBottom: cellBorder, py: cellPy, px: cellPx }}>
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                px: 1.25, py: 0.4,
                                bgcolor: diff.bg,
                                color: diff.color,
                                fontSize: "12px",
                                fontWeight: 600,
                                borderRadius: "20px",
                              }}
                            >
                              {p.difficulty}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {filtered.length > 0 && (
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 15, 20]}
                sx={{
                  borderTop: `1px solid color-mix(in srgb, ${NAVY} 8%, #e5e7eb)`,
                  color: NAVY,
                  "& .MuiTablePagination-toolbar": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                    gap: "4px",
                    minHeight: "52px",
                    px: 2,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                    color: NAVY,
                    fontSize: "13px",
                    margin: 0,
                    lineHeight: 1,
                  },
                  "& .MuiTablePagination-select": {
                    color: NAVY,
                    fontSize: "13px",
                    paddingTop: 0,
                    paddingBottom: 0,
                  },
                  "& .MuiTablePagination-selectIcon": { color: NAVY },
                  "& .MuiTablePagination-actions": {
                    display: "flex",
                    alignItems: "center",
                    ml: 1,
                  },
                  "& .MuiTablePagination-actions button": { color: NAVY },
                  "& .MuiTablePagination-actions button:hover": { bgcolor: MINT },
                  "& .MuiTablePagination-actions button.Mui-disabled": { color: "#d1d5db" },
                }}
              />
            )}
          </TableContainer>

        </div>
      </section>
    </>
  );
};

export default Problemset;
