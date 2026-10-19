import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDeleteProject, useProjectList } from "../../../../services/projectsServices";

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
import WorkIcon from "@mui/icons-material/Work";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { motion, AnimatePresence } from "framer-motion";

// Helper to decode raw HTML entities in titles and categories
const decodeHtml = (html) => {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Helper for professional date formatting
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper for category pill tag styles
const getCategoryStyle = (cat) => {
  const c = (cat || "").toLowerCase();
  if (c.includes("blockchain")) {
    return { bg: "#EEF2FF", text: "#4338CA", border: "#E0E7FF" };
  }
  if (c.includes("ai") || c.includes("agentic")) {
    return { bg: "#FAF5FF", text: "#7E22CE", border: "#F3E8FF" };
  }
  if (c.includes("machine learning")) {
    return { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" };
  }
  if (c.includes("data science")) {
    return { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" };
  }
  if (c.includes("iot") || c.includes("embedded")) {
    return { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" };
  }
  if (c.includes("sql") || c.includes("database")) {
    return { bg: "#F8FAFC", text: "#334155", border: "#E2E8F0" };
  }
  return { bg: "#EBF3F7", text: "#0B4565", border: "#D0E2ED" };
};

const ListProject = () => {
  const navigate = useNavigate();

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [openDelete, setOpenDelete] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());

  const { mutate: deleteProject, isPending: deleting } = useDeleteProject();
  const { data: projects = [], isLoading, error } = useProjectList();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  if (isLoading) {
    return (
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <div className="admin-page-header">
          <div>
            <div className="skeleton-box" style={{ width: 180, height: 32, marginBottom: 8, borderRadius: 8 }} />
            <div className="skeleton-box" style={{ width: 280, height: 18, borderRadius: 6 }} />
          </div>
          <div className="d-flex gap-2">
            <div className="skeleton-box" style={{ width: 170, height: 40, borderRadius: 10 }} />
            <div className="skeleton-box" style={{ width: 140, height: 40, borderRadius: 10 }} />
          </div>
        </div>
        <div className="admin-card p-4">
          <div className="d-flex justify-content-between mb-4">
            <div className="skeleton-box" style={{ width: 320, height: 40, borderRadius: 10 }} />
            <div className="skeleton-box" style={{ width: 160, height: 32, borderRadius: 20 }} />
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="d-flex align-items-center justify-content-between py-3 border-bottom">
              <div className="skeleton-box" style={{ width: 50, height: 22, borderRadius: 6 }} />
              <div className="skeleton-box" style={{ width: 340, height: 22, borderRadius: 6 }} />
              <div className="skeleton-box" style={{ width: 130, height: 24, borderRadius: 20 }} />
              <div className="skeleton-box" style={{ width: 100, height: 20, borderRadius: 6 }} />
              <div className="skeleton-box" style={{ width: 140, height: 34, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card p-5 text-center" style={{ maxWidth: "600px", margin: "40px auto" }}>
        <div className="admin-empty-icon-wrap" style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}>
          <WarningAmberIcon sx={{ fontSize: 32 }} />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--admin-text)", marginBottom: 8 }}>
          Error Loading Projects
        </h3>
        <p style={{ fontSize: "14px", color: "var(--admin-text-secondary)", marginBottom: 20 }}>
          {error?.message || "Unable to fetch projects from the server. Please check your connection and try again."}
        </p>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const filtered = projects.filter((item) =>
    (item.post_title || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.category_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleOpenDelete = (item) => {
    setDeleteTarget({ id: item.ID, title: item.post_title });
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget?.id) return;
    const targetId = deleteTarget.id;

    setRemovingIds((prev) => new Set(prev).add(targetId));
    setDeleteLoadingId(targetId);

    setTimeout(() => {
      deleteProject(targetId, {
        onSettled: () => {
          setDeleteLoadingId(null);
          setRemovingIds((prev) => {
            const next = new Set(prev);
            next.delete(targetId);
            return next;
          });
        },
      });
    }, 400);

    handleCloseDelete();
  };

  return (
    <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title-wrap">
            <h1 className="admin-page-title">Projects</h1>
            <span className="admin-page-badge" title="Total published projects">
              {projects.length} Total
            </span>
          </div>
          <p className="admin-page-desc">
            Organize, showcase, and publish engineering projects and codebases.
          </p>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2 gap-sm-3">
          <Link
            to="/admin/projects/details"
            className="admin-btn-secondary"
            style={{ textDecoration: "none" }}
            title="Configure project curriculum structure and highlights"
          >
            <MenuBookIcon sx={{ fontSize: 18 }} />
            <span>Project Details Page</span>
          </Link>
          <Link
            to="/admin/projects/add"
            className="admin-btn-primary"
            style={{ textDecoration: "none" }}
            title="Create and publish a new engineering project"
          >
            <AddIcon sx={{ fontSize: 19 }} />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* ── Main Projects Card ── */}
      <div className="admin-card">
        {/* Card Toolbar: Search and Filter Info */}
        <div className="admin-card-header flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2" style={{ flex: 1, minWidth: 260, maxWidth: 440 }}>
            <div className="admin-search-wrap">
              <SearchIcon
                sx={{
                  position: "absolute",
                  left: 14,
                  fontSize: 18,
                  color: "var(--admin-text-secondary, #64748B)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search projects by title or category..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="admin-search-input"
                aria-label="Search projects by title or category"
              />
              {search && (
                <button
                  type="button"
                  className="admin-search-clear"
                  onClick={() => setSearch("")}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </button>
              )}
            </div>
          </div>

          <div className="admin-counter-pill">
            <span>Showing</span>
            <strong style={{ color: "var(--admin-text, #0F172A)" }}>
              {filtered.length ? `${start + 1}–${Math.min(start + itemsPerPage, filtered.length)}` : "0"}
            </strong>
            <span>of</span>
            <strong style={{ color: "var(--admin-text, #0F172A)" }}>{filtered.length}</strong>
            <span>projects</span>
          </div>
        </div>

        {/* ── Table Content ── */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>ID</th>
                <th style={{ minWidth: 260 }}>Project Title</th>
                <th style={{ width: 190 }}>Category</th>
                <th style={{ width: 140 }}>Published</th>
                <th style={{ width: 160, textAlign: "right", paddingRight: 20 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {paginated.map((item) => {
                  const catName = decodeHtml(item.category_name) || "Engineering";
                  const catStyle = getCategoryStyle(catName);
                  const isRemoving = removingIds.has(item.ID);

                  return (
                    <motion.tr
                      key={item.ID}
                      initial={{ opacity: 1, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: -50,
                        backgroundColor: "#FEE2E2",
                        transition: { duration: 0.3, ease: "easeInOut" },
                      }}
                      layout
                      style={{
                        backgroundColor: isRemoving ? "#FEE2E2" : undefined,
                        color: isRemoving ? "#DC2626" : "inherit",
                        pointerEvents: isRemoving ? "none" : "auto",
                      }}
                    >
                      {/* ID Column */}
                      <td>
                        <span className="admin-id-badge">#{item.ID}</span>
                      </td>

                      {/* Title Column */}
                      <td>
                        <div
                          className="admin-project-title"
                          title={decodeHtml(item.post_title)}
                        >
                          {decodeHtml(item.post_title)}
                        </div>
                        <div
                          className="admin-project-slug"
                          title={item.post_name || `project-${item.ID}`}
                        >
                          {item.post_name ? `/projects-details/${item.post_name}` : `ID: ${item.ID}`}
                        </div>
                      </td>

                      {/* Category Badge Column */}
                      <td>
                        <span
                          className="admin-category-pill"
                          title={catName}
                          style={{
                            backgroundColor: catStyle.bg,
                            color: catStyle.text,
                            borderColor: catStyle.border,
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {catName}
                        </span>
                      </td>

                      {/* Published Date Column */}
                      <td>
                        <div className="admin-date-cell">
                          <CalendarTodayOutlinedIcon sx={{ fontSize: 13.5, color: "var(--admin-text-muted, #94A3B8)" }} />
                          <span>{formatDate(item.post_date)}</span>
                        </div>
                      </td>

                      {/* Action Buttons Column */}
                      <td style={{ textAlign: "right", paddingRight: 20 }}>
                        <div className="d-flex align-items-center justify-content-end" style={{ gap: "5px" }}>
                          {/* 1. View live project */}
                          <Tooltip title="View Live Project" arrow placement="top">
                            <button
                              type="button"
                              id={`view-project-${item.ID}`}
                              className="admin-action-btn view"
                              onClick={() =>
                                window.open(
                                  `/projects-details/${item.post_name || "customer-churn-prediction-using-machine-learning"}`,
                                  "_blank"
                                )
                              }
                              aria-label="View project on live website"
                            >
                              <VisibilityIcon sx={{ fontSize: 15 }} />
                            </button>
                          </Tooltip>

                          {/* 2. Edit curriculum details */}
                          <Tooltip title="Open Project Details & Curriculum" arrow placement="top">
                            <button
                              type="button"
                              id={`details-project-${item.ID}`}
                              className="admin-action-btn details"
                              onClick={() =>
                                navigate(`/admin/projects/details/${item.post_name || item.ID}`)
                              }
                              aria-label="Edit project curriculum and details"
                            >
                              <MenuBookIcon sx={{ fontSize: 15 }} />
                            </button>
                          </Tooltip>

                          {/* 3. Edit project */}
                          <Tooltip title="Edit Project Information" arrow placement="top">
                            <button
                              type="button"
                              id={`edit-project-${item.ID}`}
                              className="admin-action-btn edit"
                              onClick={() =>
                                navigate(`/admin/projects/edit/${item.ID}`)
                              }
                              aria-label="Edit project"
                            >
                              <EditIcon sx={{ fontSize: 15 }} />
                            </button>
                          </Tooltip>

                          {/* 4. Delete project */}
                          <Tooltip title="Delete Project" arrow placement="top">
                            <button
                              type="button"
                              id={`delete-project-${item.ID}`}
                              className="admin-action-btn delete"
                              onClick={() => handleOpenDelete(item)}
                              disabled={deleteLoadingId === item.ID}
                              aria-label="Delete project"
                            >
                              {deleteLoadingId === item.ID ? (
                                <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                              ) : (
                                <DeleteIcon sx={{ fontSize: 15 }} />
                              )}
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>

              {/* Empty Results State */}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="admin-empty-state">
                      <div className="admin-empty-icon-wrap">
                        <WorkIcon sx={{ fontSize: 32 }} />
                      </div>
                      <div className="admin-empty-title">
                        {search ? "No matching projects found" : "No projects created yet"}
                      </div>
                      <div className="admin-empty-desc">
                        {search
                          ? `No projects found matching "${search}". Try searching by another keyword or clear the search.`
                          : "Get started by publishing your first project showcase."}
                      </div>
                      {search ? (
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          onClick={() => setSearch("")}
                        >
                          Clear Search
                        </button>
                      ) : (
                        <Link
                          to="/admin/projects/add"
                          className="admin-btn-primary"
                          style={{ textDecoration: "none" }}
                        >
                          <AddIcon sx={{ fontSize: 18 }} />
                          <span>Add Your First Project</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ── */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-3 px-4 border-top" style={{ backgroundColor: "#FAFBFD" }}>
            <div style={{ fontSize: "13px", color: "var(--admin-text-secondary, #64748B)" }}>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={{
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "13px",
                    "&.Mui-selected": {
                      backgroundColor: "var(--admin-primary, #0B4565) !important",
                      color: "#FFFFFF !important",
                      fontWeight: 600,
                      boxShadow: "0 2px 4px rgba(11, 69, 101, 0.2)",
                    },
                  }}
                />
              )}
            />
          </div>
        )}
      </div>

      {/* ── Modern Delete Confirmation Dialog ── */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "8px",
            maxWidth: 440,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <div style={{ padding: "16px 20px 8px" }}>
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <DialogTitle sx={{ p: 0, fontWeight: 700, fontSize: "17px", color: "var(--admin-text, #0F172A)" }}>
                Delete Project
              </DialogTitle>
              <div style={{ fontSize: "12px", color: "var(--admin-text-secondary, #64748B)", marginTop: 2 }}>
                This action is permanent and irreversible
              </div>
            </div>
          </div>
        </div>

        <DialogContent sx={{ px: 3, py: 1.5, fontSize: "13.5px", color: "var(--admin-text-secondary, #64748B)", lineHeight: 1.5 }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--admin-text, #0F172A)" }}>
            {deleteTarget?.title ? `"${decodeHtml(deleteTarget.title)}"` : "this project"}
          </strong>
          ? All associated curriculum modules and details will be permanently removed.
        </DialogContent>

        <DialogActions sx={{ p: "16px 20px" }}>
          <Button
            onClick={handleCloseDelete}
            sx={{
              textTransform: "none",
              color: "var(--admin-text-secondary)",
              fontWeight: 600,
              fontSize: "13.5px",
              borderRadius: "8px",
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "13.5px",
              borderRadius: "9px",
              px: 2.5,
              py: 1,
              backgroundColor: "#DC2626",
              "&:hover": { backgroundColor: "#B91C1C" },
              boxShadow: "0 2px 4px rgba(220, 38, 38, 0.25)",
            }}
          >
            {deleting ? (
              <span className="d-flex align-items-center gap-2">
                <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} />
                <span>Deleting...</span>
              </span>
            ) : (
              "Delete Project"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListProject;
