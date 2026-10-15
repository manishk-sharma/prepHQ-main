import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TerminalIcon from "@mui/icons-material/Terminal";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";

import {
  useCodingQuestionList,
  useDeleteCodingQuestion,
} from "../../../../services/codingQuestionsServices";

const DIFF_STYLE = {
  Easy:   { color: "#15803D", background: "#DCFCE7" },
  Medium: { color: "#B45309", background: "#FEF3C7" },
  Hard:   { color: "#B91C1C", background: "#FEE2E2" },
};

const ListCodingQuestion = () => {
  const navigate = useNavigate();

  const [search, setSearch]             = useState("");
  const [page, setPage]                 = useState(1);
  const [deleteId, setDeleteId]         = useState(null);
  const [openDelete, setOpenDelete]     = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [removingId, setRemovingId]     = useState(null);

  const itemsPerPage = 10;

  const { data: questions = [], isLoading, error } = useCodingQuestionList();
  const { mutate: deleteCodingQuestion, isPending: deleting } = useDeleteCodingQuestion();

  if (isLoading) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div className="admin-page-header">
          <div>
            <div className="skeleton-box" style={{ width: 180, height: 28, marginBottom: 8 }} />
            <div className="skeleton-box" style={{ width: 260, height: 16 }} />
          </div>
        </div>
        <div className="admin-card p-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="d-flex gap-3 mb-3">
              <div className="skeleton-box" style={{ width: 40, height: 22 }} />
              <div className="skeleton-box" style={{ width: 240, height: 22 }} />
              <div className="skeleton-box" style={{ width: 80, height: 22 }} />
              <div className="skeleton-box" style={{ width: 100, height: 22 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card p-4 text-center">
        <p className="text-danger mb-2">Error loading coding questions.</p>
        <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
          {error?.message || "Please check your network or try again."}
        </p>
      </div>
    );
  }

  const filtered = questions.filter((q) =>
    (q.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (q.domain || "").toLowerCase().includes(search.toLowerCase()) ||
    (q.difficulty || "").toLowerCase().includes(search.toLowerCase())
  );

  const start      = (page - 1) * itemsPerPage;
  const paginated  = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;

    setRemovingId(deleteId);
    setDeleteLoadingId(deleteId);

    setTimeout(() => {
      deleteCodingQuestion(deleteId, {
        onSettled: () => {
          setDeleteLoadingId(null);
          setRemovingId(null);
        },
      });
    }, 400);

    handleCloseDelete();
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coding Questions</h1>
          <p className="admin-page-desc">
            Create, manage testcases, and publish coding problems for PrepCode.
          </p>
        </div>

        <Link
          to="/admin/coding-questions/add"
          className="admin-btn-primary d-inline-flex align-items-center gap-1"
          style={{ textDecoration: "none" }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          <span>Add Question</span>
        </Link>
      </div>

      {/* ── Table Container Card ── */}
      <div className="admin-card">
        {/* Card Toolbar: Search and Filter Info */}
        <div className="admin-card-header flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2" style={{ flex: 1, minWidth: 240, maxWidth: 420 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SearchIcon
                sx={{
                  position: "absolute",
                  left: 12,
                  fontSize: 18,
                  color: "var(--admin-text-secondary, #64748B)",
                }}
              />
              <input
                type="text"
                placeholder="Search by title, domain, or difficulty..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: "100%",
                  height: 40,
                  paddingLeft: 38,
                  paddingRight: 14,
                  fontSize: "13.5px",
                  borderRadius: "10px",
                  border: "1px solid var(--admin-border, #E2E8F0)",
                  backgroundColor: "#FAFBFD",
                  color: "var(--admin-text, #172B3A)",
                  outline: "none",
                  transition: "var(--admin-transition)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--admin-accent, #35B779)";
                  e.target.style.backgroundColor = "#FFFFFF";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--admin-border, #E2E8F0)";
                  e.target.style.backgroundColor = "#FAFBFD";
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: "13px", color: "var(--admin-text-secondary, #64748B)" }}>
            Showing <strong>{filtered.length ? start + 1 : 0}–{Math.min(start + itemsPerPage, filtered.length)}</strong> of <strong>{filtered.length}</strong> questions
          </div>
        </div>

        {/* ── Table Content ── */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Domain</th>
                <th>Topics</th>
                <th style={{ width: 140, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {paginated.map((q, i) => (
                  <motion.tr
                    key={q._id || q.id || q.slug || i}
                    initial={{ opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: -60,
                      backgroundColor: "#FEE2E2",
                      transition: { duration: 0.35, ease: "easeInOut" },
                    }}
                    layout
                    style={{
                      backgroundColor: removingId === q.id ? "#FEE2E2" : undefined,
                      color:           removingId === q.id ? "#DC2626" : "inherit",
                      pointerEvents:   removingId === q.id ? "none" : "auto",
                    }}
                  >
                    <td style={{ color: "var(--admin-text-secondary)", fontSize: "12.5px" }}>
                      {start + i + 1}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--admin-text)" }}>
                        {q.title}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#64748B", fontFamily: "monospace" }}>
                        /{q.slug}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          ...(DIFF_STYLE[q.difficulty] || { color: "#475569", background: "#F1F5F9" }),
                          fontWeight: 600,
                          fontSize: "12px",
                          padding: "3px 10px",
                          borderRadius: "14px",
                        }}
                      >
                        {q.difficulty || "Medium"}
                      </span>
                    </td>

                    <td style={{ fontSize: "13px", fontWeight: 500, color: "var(--admin-text)" }}>
                      {q.domain || "Data Structures"}
                    </td>

                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {q.topics?.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: "11px",
                              backgroundColor: "#F1F5F9",
                              color: "#334155",
                              padding: "2px 8px",
                              borderRadius: "8px",
                              fontWeight: 500,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                        {q.topics?.length > 3 && (
                          <span style={{ fontSize: "11px", color: "var(--admin-text-secondary)" }}>
                            +{q.topics.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        {/* View in PrepCode */}
                        <Tooltip title="Open in PrepCode" arrow>
                          <button
                            type="button"
                            className="admin-action-btn"
                            onClick={() =>
                              window.open(`/prepcode/problems/${q.slug}`, "_blank")
                            }
                            aria-label="View problem"
                          >
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                          </button>
                        </Tooltip>

                        {/* Edit */}
                        <Tooltip title="Edit Question" arrow>
                          <button
                            type="button"
                            className="admin-action-btn edit"
                            onClick={() =>
                              navigate(`/admin/coding-questions/edit/${q.slug || q._id}`)
                            }
                            aria-label="Edit problem"
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </button>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip title="Delete Question" arrow>
                          <button
                            type="button"
                            className="admin-action-btn delete"
                            onClick={() => handleOpenDelete(q.id || q._id)}
                            disabled={deleteLoadingId === (q.id || q._id)}
                            aria-label="Delete problem"
                          >
                            {deleteLoadingId === (q.id || q._id) ? (
                              <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} />
                            ) : (
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            )}
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {paginated.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <TerminalIcon sx={{ fontSize: 44, color: "#CBD5E1", mb: 1 }} />
                    <div style={{ fontWeight: 600, color: "var(--admin-text)" }}>
                      No coding questions found
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
                      {search ? "Try searching for a different question or domain" : "Click 'Add Question' above to publish your first coding challenge"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ── */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center p-3 border-top">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={{
                    borderRadius: "8px",
                    "&.Mui-selected": {
                      backgroundColor: "var(--admin-accent, #35B779) !important",
                      color: "#FFFFFF !important",
                      fontWeight: 600,
                    },
                  }}
                />
              )}
            />
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        PaperProps={{
          sx: {
            borderRadius: "14px",
            padding: "8px",
            maxWidth: 420,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "17px", color: "var(--admin-text, #172B3A)" }}>
          Confirm Delete Question
        </DialogTitle>
        <DialogContent sx={{ fontSize: "14px", color: "var(--admin-text-secondary, #64748B)" }}>
          Are you sure you want to delete this coding question? Test cases and student submissions will no longer be linked.
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDelete}
            sx={{ textTransform: "none", color: "var(--admin-text-secondary)", fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
          >
            {deleting ? "Deleting..." : "Delete Question"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListCodingQuestion;
