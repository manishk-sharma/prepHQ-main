import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { motion, AnimatePresence } from "framer-motion";
import { useDeleteInterview, useInterviewList } from "../../../../services/interviewsServices";

const GREEN = "#58C99A";
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
      <div className="container-fluid mt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div className="d-flex gap-3">
              <div className="skeleton-box" style={{ width: 60, height: 20 }} />
              <div className="skeleton-box" style={{ width: 200, height: 20 }} />
              <div className="skeleton-box" style={{ width: 160, height: 20 }} />
              <div className="skeleton-box" style={{ width: 120, height: 20 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p>Error loading interviews</p>;

  const filtered = interviews.filter((item) =>
    item.post_title.toLowerCase().includes(search.toLowerCase())
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

    // Start animation
    setRemovingIds((prev) => new Set(prev).add(deleteId));
    setDeleteLoadingId(deleteId);

    // Delete after animation
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
    <>
      <div className="container-fluid mt-4">
        <h3>Interview List</h3>

        {/* Search */}
        <input
          type="text"
          placeholder="Search interview..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th width="220">Actions</th>
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
                    x: -80,
                    backgroundColor: "#ffdddd",
                    transition: { duration: 0.35, ease: "easeInOut" },
                  }}
                  layout
                  style={{
                    backgroundColor: removingIds.has(item.ID)
                      ? "#ffdddd"
                      : "#fff",
                    color: removingIds.has(item.ID) ? "#b30000" : "inherit",
                    pointerEvents: removingIds.has(item.ID)
                      ? "none"
                      : "auto",
                    transition: "all 0.3s ease",
                  }}
                >
                  <td>{item.ID}</td>
                  <td>{item.post_title}</td>
                  <td>{item.category_name}</td>
                  <td>
                    {new Date(item.post_date).toLocaleDateString()}
                  </td>

                  <td className="d-flex align-items-center gap-1">
                    {/* View */}
                    <Tooltip title="View Interview" arrow>
                      <IconButton
                        size="small"
                        sx={{
                          color: "#0ea5e9",
                          "&:hover": { backgroundColor: "#e0f2fe" },
                        }}
                        onClick={() =>
                          window.open(
                            `https://prephq.theiotacademy.co/interviews/${item.post_name}`,
                            "_blank"
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Edit */}
                    <Tooltip title="Edit Interview" arrow>
                      <IconButton
                        size="small"
                        sx={{
                          color: "#f59e0b",
                          "&:hover": { backgroundColor: "#fef3c7" },
                        }}
                        onClick={() =>
                          navigate(`/admin/interviews/edit/${item.ID}`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip title="Delete Interview" arrow>
                      <IconButton
                        size="small"
                        sx={{
                          color: "#ef4444",
                          "&:hover": { backgroundColor: "#fee2e2" },
                        }}
                        onClick={() => handleOpenDelete(item.ID)}
                        disabled={deleteLoadingId === item.ID}
                      >
                        {deleteLoadingId === item.ID ? (
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
                <td colSpan="5" className="text-center">
                  No interviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
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
                  next: () => <span>&raquo;</span>,
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
      </div>

      {/* Delete Modal */}
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Delete Interview
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete this interview?
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

export default ListInterview;
