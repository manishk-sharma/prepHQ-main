import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useDeleteProject,
  useProjectList,
  useToggleFeaturedProject,
} from "../../../../services/projectsServices";

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
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  const { mutate: deleteProject, isPending: deleting } = useDeleteProject();
  const { mutate: toggleFeatured } = useToggleFeaturedProject();
  const { data: projects = [], isLoading, error } = useProjectList();

  // Section A: Featured Projects state
  const [searchFeatured, setSearchFeatured] = useState("");
  const [featuredPage, setFeaturedPage] = useState(1);
  const featuredItemsPerPage = 5;

  // Section B: All Projects state
  const [searchAll, setSearchAll] = useState("");
  const [allPage, setAllPage] = useState(1);
  const allItemsPerPage = 10;

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
        <div className="admin-card p-4 mb-5">
          <div className="d-flex justify-content-between mb-4">
            <div className="skeleton-box" style={{ width: 220, height: 28, borderRadius: 8 }} />
            <div className="skeleton-box" style={{ width: 120, height: 28, borderRadius: 20 }} />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="d-flex align-items-center justify-content-between py-3 border-bottom">
              <div className="skeleton-box" style={{ width: 50, height: 22, borderRadius: 6 }} />
              <div className="skeleton-box" style={{ width: 340, height: 22, borderRadius: 6 }} />
              <div className="skeleton-box" style={{ width: 130, height: 24, borderRadius: 20 }} />
              <div className="skeleton-box" style={{ width: 100, height: 20, borderRadius: 6 }} />
              <div className="skeleton-box" style={{ width: 140, height: 34, borderRadius: 8 }} />
            </div>
          ))}
        </div>
        <div className="admin-card p-4">
          <div className="d-flex justify-content-between mb-4">
            <div className="skeleton-box" style={{ width: 220, height: 28, borderRadius: 8 }} />
            <div className="skeleton-box" style={{ width: 120, height: 28, borderRadius: 20 }} />
          </div>
          {[...Array(5)].map((_, i) => (
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

  // Derived datasets
  const featuredProjects = projects.filter((item) => Boolean(item.is_featured));
  const allProjects = projects;

  // Filter & paginate Section A (Featured Projects)
  const filteredFeatured = featuredProjects.filter(
    (item) =>
      (item.post_title || "").toLowerCase().includes(searchFeatured.toLowerCase()) ||
      (item.category_name || "").toLowerCase().includes(searchFeatured.toLowerCase())
  );
  const featuredStart = (featuredPage - 1) * featuredItemsPerPage;
  const paginatedFeatured = filteredFeatured.slice(
    featuredStart,
    featuredStart + featuredItemsPerPage
  );
  const totalFeaturedPages = Math.ceil(filteredFeatured.length / featuredItemsPerPage);

  // Filter & paginate Section B (All Projects)
  const filteredAll = allProjects.filter(
    (item) =>
      (item.post_title || "").toLowerCase().includes(searchAll.toLowerCase()) ||
      (item.category_name || "").toLowerCase().includes(searchAll.toLowerCase())
  );
  const allStart = (allPage - 1) * allItemsPerPage;
  const paginatedAll = filteredAll.slice(allStart, allStart + allItemsPerPage);
  const totalAllPages = Math.ceil(filteredAll.length / allItemsPerPage);

  // Feature / Unfeature handler
  const handleToggleFeatured = (item) => {
    setToggleLoadingId(item.ID);
    toggleFeatured(
      { id: item.ID, is_featured: !item.is_featured },
      {
        onSettled: () => {
          setToggleLoadingId(null);
        },
      }
    );
  };

  // Delete handlers
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
          </div>
          <p className="admin-page-desc">
            Manage, organize, and publish engineering projects.
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

      {/* =========================================================================
          SECTION A — FEATURED PROJECTS
          ========================================================================= */}
      <section className="mb-5" aria-labelledby="featured-projects-heading">
        {/* Section Heading & Supporting Text */}
        <div className="admin-section-header">
          <div>
            <div className="admin-section-title-wrap">
              <h2 id="featured-projects-heading" className="admin-section-title">
                Featured Projects
              </h2>
              <span className="admin-featured-count-badge" title="Number of featured projects">
                <StarIcon sx={{ fontSize: 13 }} />
                {featuredProjects.length} Featured
              </span>
            </div>
            <p className="admin-section-desc">
              Manage the projects highlighted at the top of the public project listing page.
            </p>
          </div>
        </div>

        {/* Featured Projects Card Container */}
        <div className="admin-card admin-card-featured">
          {/* Card Toolbar: Independent Search for Featured Projects */}
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
                  placeholder="Search featured projects..."
                  value={searchFeatured}
                  onChange={(e) => {
                    setSearchFeatured(e.target.value);
                    setFeaturedPage(1);
                  }}
                  className="admin-search-input"
                  aria-label="Search featured projects by title or category"
                />
                {searchFeatured && (
                  <button
                    type="button"
                    className="admin-search-clear"
                    onClick={() => {
                      setSearchFeatured("");
                      setFeaturedPage(1);
                    }}
                    title="Clear featured search"
                    aria-label="Clear featured search"
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </button>
                )}
              </div>
            </div>

            <div className="admin-counter-pill">
              <span>Showing</span>
              <strong style={{ color: "var(--admin-text, #0F172A)" }}>
                {filteredFeatured.length
                  ? `${featuredStart + 1}–${Math.min(featuredStart + featuredItemsPerPage, filteredFeatured.length)}`
                  : "0"}
              </strong>
              <span>of</span>
              <strong style={{ color: "var(--admin-text, #0F172A)" }}>{filteredFeatured.length}</strong>
              <span>featured</span>
            </div>
          </div>

          {/* Featured Projects Table */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>ID</th>
                  <th style={{ minWidth: 260 }}>Project Title</th>
                  <th style={{ width: 180 }}>Category</th>
                  <th style={{ width: 140 }}>Published</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th style={{ width: 160, textAlign: "right", paddingRight: 20 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {paginatedFeatured.map((item) => {
                    const catName = decodeHtml(item.category_name) || "Engineering";
                    const catStyle = getCategoryStyle(catName);

                    return (
                      <motion.tr
                        key={`featured-${item.ID}`}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        layout
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
                              maxWidth: 170,
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

                        {/* Status Column */}
                        <td>
                          <span className="admin-status-badge featured">
                            <StarIcon sx={{ fontSize: 13 }} />
                            <span>Featured</span>
                          </span>
                        </td>

                        {/* Actions Column */}
                        <td style={{ textAlign: "right", paddingRight: 20 }}>
                          <div className="d-flex align-items-center justify-content-end" style={{ gap: "5px" }}>
                            {/* View live project */}
                            <Tooltip title="View Live Project" arrow placement="top">
                              <button
                                type="button"
                                id={`view-featured-${item.ID}`}
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

                            {/* Project Details & Curriculum */}
                            <Tooltip title="Open Project Details & Curriculum" arrow placement="top">
                              <button
                                type="button"
                                id={`details-featured-${item.ID}`}
                                className="admin-action-btn details"
                                onClick={() =>
                                  navigate(`/admin/projects/details/${item.post_name || item.ID}`)
                                }
                                aria-label="Edit project curriculum and details"
                              >
                                <MenuBookIcon sx={{ fontSize: 15 }} />
                              </button>
                            </Tooltip>

                            {/* Edit project */}
                            <Tooltip title="Edit Project Information" arrow placement="top">
                              <button
                                type="button"
                                id={`edit-featured-${item.ID}`}
                                className="admin-action-btn edit"
                                onClick={() =>
                                  navigate(`/admin/projects/edit/${item.ID}`)
                                }
                                aria-label="Edit project"
                              >
                                <EditIcon sx={{ fontSize: 15 }} />
                              </button>
                            </Tooltip>

                            {/* Remove from Featured action */}
                            <Tooltip title="Remove from Featured" arrow placement="top">
                              <button
                                type="button"
                                id={`unfeature-project-${item.ID}`}
                                className="admin-action-btn feature-remove"
                                onClick={() => handleToggleFeatured(item)}
                                disabled={toggleLoadingId === item.ID}
                                aria-label="Remove project from Featured"
                              >
                                {toggleLoadingId === item.ID ? (
                                  <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                                ) : (
                                  <StarIcon sx={{ fontSize: 16 }} />
                                )}
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>

                {/* Empty State for Featured Projects */}
                {paginatedFeatured.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="admin-empty-state">
                        <div
                          className="admin-empty-icon-wrap"
                          style={{ backgroundColor: "#ECFDF5", color: "#047857" }}
                        >
                          <StarIcon sx={{ fontSize: 30 }} />
                        </div>
                        <div className="admin-empty-title">
                          {searchFeatured ? "No matching featured projects found" : "No Featured Projects Selected"}
                        </div>
                        <div className="admin-empty-desc">
                          {searchFeatured
                            ? `No featured projects found matching "${searchFeatured}". Try searching by another keyword or clear the search.`
                            : "None of your projects are currently highlighted at the top of the public project listing. Feature any project from the All Projects section below to highlight it."}
                        </div>
                        {searchFeatured ? (
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => {
                              setSearchFeatured("");
                              setFeaturedPage(1);
                            }}
                          >
                            Clear Search
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => {
                              const el = document.getElementById("all-projects-section");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                            <span>Browse All Projects Below</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Featured Projects Pagination */}
          {totalFeaturedPages > 1 && (
            <div
              className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-3 px-4 border-top"
              style={{ backgroundColor: "#FAFBFD" }}
            >
              <div style={{ fontSize: "13px", color: "var(--admin-text-secondary, #64748B)" }}>
                Page <strong>{featuredPage}</strong> of <strong>{totalFeaturedPages}</strong>
              </div>

              <Pagination
                count={totalFeaturedPages}
                page={featuredPage}
                onChange={(e, value) => setFeaturedPage(value)}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    sx={{
                      borderRadius: "8px",
                      fontWeight: 500,
                      fontSize: "13px",
                      "&.Mui-selected": {
                        backgroundColor: "#10B981 !important",
                        color: "#FFFFFF !important",
                        fontWeight: 600,
                        boxShadow: "0 2px 4px rgba(16, 185, 129, 0.25)",
                      },
                    }}
                  />
                )}
              />
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION B — ALL PROJECTS
          ========================================================================= */}
      <section id="all-projects-section" aria-labelledby="all-projects-heading">
        {/* Section Heading & Supporting Text */}
        <div className="admin-section-header">
          <div>
            <div className="admin-section-title-wrap">
              <h2 id="all-projects-heading" className="admin-section-title">
                All Projects
              </h2>
              <span className="admin-page-badge" title="Total published projects in database">
                {projects.length} Total
              </span>
            </div>
            <p className="admin-section-desc">
              Browse and manage the complete collection of projects.
            </p>
          </div>
        </div>

        {/* All Projects Card Container */}
        <div className="admin-card">
          {/* Card Toolbar: Independent Search for All Projects */}
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
                  value={searchAll}
                  onChange={(e) => {
                    setSearchAll(e.target.value);
                    setAllPage(1);
                  }}
                  className="admin-search-input"
                  aria-label="Search all projects by title or category"
                />
                {searchAll && (
                  <button
                    type="button"
                    className="admin-search-clear"
                    onClick={() => {
                      setSearchAll("");
                      setAllPage(1);
                    }}
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
                {filteredAll.length
                  ? `${allStart + 1}–${Math.min(allStart + allItemsPerPage, filteredAll.length)}`
                  : "0"}
              </strong>
              <span>of</span>
              <strong style={{ color: "var(--admin-text, #0F172A)" }}>{filteredAll.length}</strong>
              <span>projects</span>
            </div>
          </div>

          {/* All Projects Table */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>ID</th>
                  <th style={{ minWidth: 260 }}>Project Title</th>
                  <th style={{ width: 180 }}>Category</th>
                  <th style={{ width: 140 }}>Published</th>
                  <th style={{ width: 140 }}>Featured Status</th>
                  <th style={{ width: 190, textAlign: "right", paddingRight: 20 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {paginatedAll.map((item) => {
                    const catName = decodeHtml(item.category_name) || "Engineering";
                    const catStyle = getCategoryStyle(catName);
                    const isRemoving = removingIds.has(item.ID);
                    const isFeatured = Boolean(item.is_featured);

                    return (
                      <motion.tr
                        key={`all-${item.ID}`}
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
                              maxWidth: 170,
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

                        {/* Featured Status Column */}
                        <td>
                          {isFeatured ? (
                            <span className="admin-status-badge featured" title="Currently featured on public page">
                              <StarIcon sx={{ fontSize: 13 }} />
                              <span>Featured</span>
                            </span>
                          ) : (
                            <span className="admin-status-badge not-featured" title="Standard project">
                              Not Featured
                            </span>
                          )}
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

                            {/* 4. Feature or Remove from Featured toggle */}
                            <Tooltip
                              title={isFeatured ? "Remove from Featured" : "Add to Featured"}
                              arrow
                              placement="top"
                            >
                              <button
                                type="button"
                                id={`toggle-featured-${item.ID}`}
                                className={`admin-action-btn feature ${isFeatured ? "active" : ""}`}
                                onClick={() => handleToggleFeatured(item)}
                                disabled={toggleLoadingId === item.ID}
                                aria-label={isFeatured ? "Remove from Featured" : "Add to Featured"}
                              >
                                {toggleLoadingId === item.ID ? (
                                  <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                                ) : isFeatured ? (
                                  <StarIcon sx={{ fontSize: 16 }} />
                                ) : (
                                  <StarBorderIcon sx={{ fontSize: 16 }} />
                                )}
                              </button>
                            </Tooltip>

                            {/* 5. Delete project */}
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
                {paginatedAll.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="admin-empty-state">
                        <div className="admin-empty-icon-wrap">
                          <WorkIcon sx={{ fontSize: 32 }} />
                        </div>
                        <div className="admin-empty-title">
                          {searchAll ? "No matching projects found" : "No projects created yet"}
                        </div>
                        <div className="admin-empty-desc">
                          {searchAll
                            ? `No projects found matching "${searchAll}". Try searching by another keyword or clear the search.`
                            : "Get started by publishing your first project showcase."}
                        </div>
                        {searchAll ? (
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => {
                              setSearchAll("");
                              setAllPage(1);
                            }}
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

          {/* All Projects Table Footer & Pagination */}
          {totalAllPages > 1 && (
            <div
              className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-3 px-4 border-top"
              style={{ backgroundColor: "#FAFBFD" }}
            >
              <div style={{ fontSize: "13px", color: "var(--admin-text-secondary, #64748B)" }}>
                Page <strong>{allPage}</strong> of <strong>{totalAllPages}</strong>
              </div>

              <Pagination
                count={totalAllPages}
                page={allPage}
                onChange={(e, value) => setAllPage(value)}
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
      </section>

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
