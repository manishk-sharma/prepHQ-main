import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
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
import { motion, AnimatePresence } from "framer-motion";

import {
  useCodingQuestionList,
  useDeleteCodingQuestion,
} from "../../../../services/codingQuestionsServices";

const GREEN = "#58C99A";

const DIFF_STYLE = {
  Easy:   { color: "#2cbb5d", background: "rgba(44,187,93,0.1)"  },
  Medium: { color: "#ffb007", background: "rgba(255,176,7,0.1)"  },
  Hard:   { color: "#ef4444", background: "rgba(239,68,68,0.1)"  },
};

const ListCodingQuestion = () => {
  const navigate = useNavigate();

  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [deleteId, setDeleteId]     = useState(null);
  const [openDelete, setOpenDelete]     = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const itemsPerPage = 10;

  const { data: questions = [], isLoading, error } = useCodingQuestionList();
  const { mutate: deleteCodingQuestion, isPending: deleting } = useDeleteCodingQuestion();

  if (isLoading) {
    return (
      <div className="container-fluid mt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div className="d-flex gap-3">
              <div className="skeleton-box" style={{ width: 40,  height: 20 }} />
              <div className="skeleton-box" style={{ width: 240, height: 20 }} />
              <div className="skeleton-box" style={{ width: 80,  height: 20 }} />
              <div className="skeleton-box" style={{ width: 100, height: 20 }} />
              <div className="skeleton-box" style={{ width: 120, height: 20 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="text-danger mt-4 ms-3">Error loading coding questions.</p>;

  const filtered = questions.filter((q) =>
    q.title?.toLowerCase().includes(search.toLowerCase())
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
    <>
      <div className="container-fluid mt-4">

        {/* ── Header ── */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Coding Questions</h3>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/coding-questions/add")}
            sx={{
              backgroundColor: "#074568",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#05364f" },
            }}
          >
            Add Question
          </Button>
        </div>

        {/* ── Search ── */}
        <input
          type="text"
          placeholder="Search questions..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ maxWidth: "400px" }}
        />

        {/* ── Table ── */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Difficulty</th>
              <th>Domain</th>
              <th>Topics</th>
              <th width="160">Actions</th>
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
                    x: -80,
                    backgroundColor: "#ffdddd",
                    transition: { duration: 0.35, ease: "easeInOut" },
                  }}
                  layout
                  style={{
                    backgroundColor: removingId === q.id ? "#ffdddd" : "#fff",
                    color:           removingId === q.id ? "#b30000" : "inherit",
                    pointerEvents:   removingId === q.id ? "none" : "auto",
                    transition: "all 0.3s ease",
                  }}
                >
                  <td>{start + i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{q.title}</td>
                  <td>
                    <code style={{ fontSize: "12px", color: "#6b7280" }}>{q.slug}</code>
                  </td>
                  <td>
                    <span
                      style={{
                        ...(DIFF_STYLE[q.difficulty] || {}),
                        fontWeight: 600,
                        fontSize: "12px",
                        padding: "2px 10px",
                        borderRadius: "12px",
                      }}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td>{q.domain}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {q.topics?.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "11px",
                            background: "#f0f4f8",
                            color: "#374151",
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {q.topics?.length > 3 && (
                        <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                          +{q.topics.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="d-flex align-items-center gap-1">
                    <Tooltip title="View Question" arrow>
                      <IconButton
                        size="small"
                        sx={{ color: "#0ea5e9", "&:hover": { backgroundColor: "#e0f2fe" } }}
                        onClick={() =>
                          window.open(`/prepcode/problems/${q.slug}`, "_blank")
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit Question" arrow>
                      <IconButton
                        size="small"
                        sx={{ color: "#f59e0b", "&:hover": { backgroundColor: "#fef3c7" } }}
                        onClick={() =>
                          navigate(`/admin/coding-questions/edit/${q.slug || q._id}`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Question" arrow>
                      <IconButton
                        size="small"
                        sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
                        onClick={() => handleOpenDelete(q.id)}
                        disabled={deleteLoadingId === q.id}
                      >
                        {deleteLoadingId === q.id ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {paginated.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{ padding: "48px 0", color: "#9ca3af" }}
                  >
                    <TerminalIcon sx={{ fontSize: 48, color: "#d1d5db", mb: 1 }} />
                    <p className="mb-1" style={{ fontWeight: 600, color: "#6b7280" }}>
                      {search ? "No questions match your search." : "No coding questions yet."}
                    </p>
                    {!search && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/admin/coding-questions/add")}
                        sx={{
                          mt: 1,
                          borderColor: "#074568",
                          color: "#074568",
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": { borderColor: "#05364f", backgroundColor: "#f0f4f8" },
                        }}
                      >
                        Add your first question
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4 mt-lg-5">
            <Pagination
              count={Math.max(totalPages, 1)}
              page={page}
              onChange={(e, value) => setPage(value)}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  slots={{
                    previous: () => <span>&laquo;</span>,
                    next:     () => <span>&raquo;</span>,
                  }}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    fontWeight: 600,
                    border: "1px solid #dcdcdc",
                    color: "#222",

                    "&.Mui-selected": {
                      backgroundColor: GREEN,
                      color: "#fff",
                      border: `1px solid ${GREEN}`,
                    },

                    "&.Mui-selected:hover": {
                      backgroundColor: GREEN,
                    },

                    "&.MuiPaginationItem-previousNext": {
                      border: `1px solid ${GREEN}`,
                      color: GREEN,
                      fontSize: "20px",
                    },

                    "&.MuiPaginationItem-previousNext:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              )}
            />
          </div>
        )}
      </div>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Coding Question</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this coding question? This action cannot be undone.
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListCodingQuestion;
