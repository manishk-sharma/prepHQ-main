import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDeleteInterview, useInterviewList } from "../../../../services/interviewsServices";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Tooltip from "@mui/material/Tooltip";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import { motion, AnimatePresence } from "framer-motion";

const ListInterview = () => {
  const navigate = useNavigate();

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());

  const { mutate: deleteInterview, isPending: deleting } = useDeleteInterview();
  const { data: interviews = [], isLoading, error } = useInterviewList();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  if (isLoading) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div className="admin-page-header">
          <div>
            <div className="skeleton-box" style={{ width: 160, height: 28, marginBottom: 8 }} />
            <div className="skeleton-box" style={{ width: 260, height: 16 }} />
          </div>
        </div>
        <div className="admin-card p-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="d-flex gap-3 mb-3">
              <div className="skeleton-box" style={{ width: 60, height: 22 }} />
              <div className="skeleton-box" style={{ width: 220, height: 22 }} />
              <div className="skeleton-box" style={{ width: 140, height: 22 }} />
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
        <p className="text-danger mb-2">Error loading interviews.</p>
        <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
          {error?.message || "Please check your network or try again."}
        </p>
      </div>
    );
  }

  const filtered = interviews.filter((item) =>
    (item.post_title || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.category_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
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

    setRemovingIds((prev) => new Set(prev).add(deleteId));
    setDeleteLoadingId(deleteId);

    setTimeout(() => {
      deleteInterview(deleteId, {
        onSettled: () => {
          setDeleteLoadingId(null);
          setRemovingIds((prev) => {
            const next = new Set(prev);
            next.delete(deleteId);
            return next;
          });
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
          <h1 className="admin-page-title">Interview Questions & Guides</h1>
          <p className="admin-page-desc">
            Manage technical interview experiences, role guides, and Q&A series.
          </p>
        </div>

        <Link
          to="/admin/interviews/add"
          className="admin-btn-primary d-inline-flex align-items-center gap-1"
          style={{ textDecoration: "none" }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          <span>Add Interview</span>
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
                placeholder="Search interviews by title or category..."
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
            Showing <strong>{filtered.length ? start + 1 : 0}–{Math.min(start + itemsPerPage, filtered.length)}</strong> of <strong>{filtered.length}</strong> items
          </div>
        </div>

        {/* ── Table Content ── */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Published</th>
                <th style={{ width: 140, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {paginated.map((item) => (
                  <motion.tr
                    key={item.ID}
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
                      backgroundColor: removingIds.has(item.ID) ? "#FEE2E2" : undefined,
                      color: removingIds.has(item.ID) ? "#DC2626" : "inherit",
                      pointerEvents: removingIds.has(item.ID) ? "none" : "auto",
                    }}
                  >
                    <td style={{ color: "var(--admin-text-secondary)", fontSize: "12.5px" }}>
                      #{item.ID}
                    </td>

                    <td style={{ fontWeight: 600 }}>
                      <div
                        style={{
                          maxWidth: 420,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={item.post_title}
                      >
                        {item.post_title}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          padding: "3px 10px",
                          borderRadius: "14px",
                          backgroundColor: "#FEF3C7",
                          color: "#B45309",
                        }}
                      >
                        {item.category_name || "Interview Prep"}
                      </span>
                    </td>

                    <td style={{ fontSize: "12.5px", color: "var(--admin-text-secondary)" }}>
                      {item.post_date
                        ? new Date(item.post_date).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        {/* View live interview */}
                        <Tooltip title="View Interview" arrow>
                          <button
                            type="button"
                            className="admin-action-btn"
                            onClick={() =>
                              window.open(
                                `https://prephq.theiotacademy.co/interviews/${item.post_name}`,
                                "_blank"
                              )
                            }
                            aria-label="View interview"
                          >
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                          </button>
                        </Tooltip>

                        {/* Edit interview */}
                        <Tooltip title="Edit Interview" arrow>
                          <button
                            type="button"
                            className="admin-action-btn edit"
                            onClick={() =>
                              navigate(`/admin/interviews/edit/${item.ID}`)
                            }
                            aria-label="Edit interview"
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </button>
                        </Tooltip>

                        {/* Delete interview */}
                        <Tooltip title="Delete Interview" arrow>
                          <button
                            type="button"
                            className="admin-action-btn delete"
                            onClick={() => handleOpenDelete(item.ID)}
                            disabled={deleteLoadingId === item.ID}
                            aria-label="Delete interview"
                          >
                            {deleteLoadingId === item.ID ? (
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
                  <td colSpan="5" className="text-center py-5">
                    <QuestionAnswerIcon sx={{ fontSize: 44, color: "#CBD5E1", mb: 1 }} />
                    <div style={{ fontWeight: 600, color: "var(--admin-text)" }}>
                      No interview guides found
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
                      {search ? "Try searching for a different keyword or category" : "Click 'Add Interview' above to publish your first interview guide"}
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
          Confirm Delete Interview Guide
        </DialogTitle>
        <DialogContent sx={{ fontSize: "14px", color: "var(--admin-text-secondary, #64748B)" }}>
          Are you sure you want to delete this interview guide? This action cannot be undone.
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
            {deleting ? "Deleting..." : "Delete Guide"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListInterview;
