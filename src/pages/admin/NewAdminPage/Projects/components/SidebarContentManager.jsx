import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import LaunchIcon from "@mui/icons-material/Launch";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LinkIcon from "@mui/icons-material/Link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LayersIcon from "@mui/icons-material/Layers";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import {
  SortableContainer,
  SortableItem,
  DragHandle,
  AccessibleReorderButtons,
  arrayMove,
} from "./DndSortableWrapper";

const SECTIONS_CONFIG = [
  {
    key: "related_projects",
    type: "related_project",
    label: "Related Projects",
    badgeLabel: "Area A",
    description:
      "Cards displayed in the 'Related Projects' widget at the top of the project details right sidebar.",
    placeholderUrl: "/projects-details/customer-segmentation-using-k-means",
  },
  {
    key: "tutorials",
    type: "tutorial",
    label: "Tutorials",
    badgeLabel: "Area B",
    description:
      "Cards displayed in the 'Tutorials' widget in the middle of the project details right sidebar.",
    placeholderUrl: "/tutorials",
  },
  {
    key: "mini_guides",
    type: "mini_guide",
    label: "Mini Guides",
    badgeLabel: "Area C",
    description:
      "Cards displayed in the 'Mini Guides' widget at the bottom of the project details right sidebar.",
    placeholderUrl: "/guides",
  },
];

const getTodayFormattedDate = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
};

export default function SidebarContentManager({
  sidebarCards = {},
  onChange,
  onSave,
  isSaving = false,
  projectDetailsList = [],
  wpProjects = [],
}) {
  const [activeAreaTab, setActiveAreaTab] = useState("all");
  const [editingCardId, setEditingCardId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [addingSectionKey, setAddingSectionKey] = useState(null);
  const [addFormData, setAddFormData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    sectionKey: null,
    card: null,
  });

  // Current normalized card lists
  const currentCards = {
    related_projects: Array.isArray(sidebarCards?.related_projects)
      ? sidebarCards.related_projects
      : [],
    tutorials: Array.isArray(sidebarCards?.tutorials)
      ? sidebarCards.tutorials
      : [],
    mini_guides: Array.isArray(sidebarCards?.mini_guides)
      ? sidebarCards.mini_guides
      : [],
  };

  const notifyChange = (updated) => {
    if (onChange) {
      onChange(updated);
    }
  };

  // ── Open Add Card Form ──
  const handleStartAdd = (sectionKey) => {
    const sectionList = currentCards[sectionKey] || [];
    const config = SECTIONS_CONFIG.find((c) => c.key === sectionKey);
    setAddingSectionKey(sectionKey);
    setEditingCardId(null);
    setAddFormData({
      title: "",
      display_date: getTodayFormattedDate(),
      destination_url: config?.placeholderUrl || "",
      linked_resource: "",
      display_order: sectionList.length + 1,
      status: "active",
      is_active: true,
    });
  };

  const handleCancelAdd = () => {
    setAddingSectionKey(null);
    setAddFormData(null);
  };

  const handleCommitAdd = (sectionKey) => {
    if (!addFormData || !addFormData.title.trim()) return;
    const config = SECTIONS_CONFIG.find((c) => c.key === sectionKey);
    const sectionList = currentCards[sectionKey] || [];
    const newCard = {
      id: `${config?.type || sectionKey}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      section_type: config?.type || sectionKey,
      title: addFormData.title.trim(),
      display_date: addFormData.display_date?.trim() || getTodayFormattedDate(),
      destination_url: addFormData.destination_url?.trim() || "#",
      linked_resource: addFormData.linked_resource?.trim() || "",
      display_order: Number(addFormData.display_order) || sectionList.length + 1,
      status: addFormData.is_active ? "active" : "inactive",
      is_active: !!addFormData.is_active,
    };

    const updatedList = [...sectionList, newCard];
    const updatedCards = {
      ...currentCards,
      [sectionKey]: updatedList,
    };
    notifyChange(updatedCards);
    setAddingSectionKey(null);
    setAddFormData(null);
  };

  // ── Open Edit Card Form ──
  const handleStartEdit = (card) => {
    setAddingSectionKey(null);
    setEditingCardId(card.id);
    setEditFormData({
      id: card.id,
      section_type: card.section_type,
      title: card.title || "",
      display_date: card.display_date || card.date || getTodayFormattedDate(),
      destination_url: card.destination_url || card.link || "",
      linked_resource: card.linked_resource || "",
      display_order: card.display_order || 1,
      status: card.status || (card.is_active === false ? "inactive" : "active"),
      is_active: card.is_active !== false && card.status !== "inactive",
    });
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditFormData(null);
  };

  const handleCommitEdit = (sectionKey) => {
    if (!editFormData || !editFormData.title.trim()) return;
    const sectionList = currentCards[sectionKey] || [];
    const updatedList = sectionList.map((c) => {
      if (c.id === editFormData.id) {
        return {
          ...c,
          title: editFormData.title.trim(),
          display_date: editFormData.display_date?.trim() || getTodayFormattedDate(),
          destination_url: editFormData.destination_url?.trim() || "#",
          linked_resource: editFormData.linked_resource?.trim() || "",
          display_order: Number(editFormData.display_order) || c.display_order || 1,
          status: editFormData.is_active ? "active" : "inactive",
          is_active: !!editFormData.is_active,
        };
      }
      return c;
    });

    const updatedCards = {
      ...currentCards,
      [sectionKey]: updatedList,
    };
    notifyChange(updatedCards);
    setEditingCardId(null);
    setEditFormData(null);
  };

  // ── Toggle Active/Inactive Status Directly ──
  const handleToggleCardStatus = (sectionKey, cardId) => {
    const sectionList = currentCards[sectionKey] || [];
    const updatedList = sectionList.map((c) => {
      if (c.id === cardId) {
        const currentlyActive = c.is_active !== false && c.status !== "inactive";
        const nextActive = !currentlyActive;
        return {
          ...c,
          is_active: nextActive,
          status: nextActive ? "active" : "inactive",
        };
      }
      return c;
    });

    const updatedCards = {
      ...currentCards,
      [sectionKey]: updatedList,
    };
    notifyChange(updatedCards);
  };

  // ── Delete Confirmation Handlers ──
  const handleRequestDelete = (sectionKey, card) => {
    setDeleteDialog({
      open: true,
      sectionKey,
      card,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog.sectionKey || !deleteDialog.card) return;
    const { sectionKey, card } = deleteDialog;
    const sectionList = currentCards[sectionKey] || [];
    const filtered = sectionList
      .filter((c) => c.id !== card.id)
      .map((c, idx) => ({ ...c, display_order: idx + 1 }));

    const updatedCards = {
      ...currentCards,
      [sectionKey]: filtered,
    };
    notifyChange(updatedCards);

    if (editingCardId === card.id) {
      setEditingCardId(null);
      setEditFormData(null);
    }
    setDeleteDialog({ open: false, sectionKey: null, card: null });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, sectionKey: null, card: null });
  };

  // ── Drag & Drop / Reordering ──
  const handleReorderCards = (sectionKey, reorderedList) => {
    const updatedList = reorderedList.map((c, idx) => ({
      ...c,
      display_order: idx + 1,
    }));
    const updatedCards = {
      ...currentCards,
      [sectionKey]: updatedList,
    };
    notifyChange(updatedCards);
  };

  const handleMoveCard = (sectionKey, index, direction) => {
    const sectionList = [...(currentCards[sectionKey] || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sectionList.length) return;
    const reordered = arrayMove(sectionList, index, targetIndex);
    handleReorderCards(sectionKey, reordered);
  };

  // ── Resource Selection Helper ──
  const handleResourceSelect = (slug, isEdit = false) => {
    const project =
      projectDetailsList.find((p) => p.slug === slug) ||
      wpProjects.find((p) => p.post_name === slug);

    if (isEdit) {
      setEditFormData((prev) => {
        if (!slug) {
          return { ...prev, linked_resource: "" };
        }
        const updated = { ...prev, linked_resource: slug };
        if (!prev.destination_url || prev.destination_url === "#" || prev.destination_url.startsWith("/projects-details/")) {
          updated.destination_url = `/projects-details/${slug}`;
        }
        if (!prev.title.trim() && project) {
          updated.title = project.title || project.post_title || "";
        }
        return updated;
      });
    } else {
      setAddFormData((prev) => {
        if (!slug) {
          return { ...prev, linked_resource: "" };
        }
        const updated = { ...prev, linked_resource: slug };
        if (!prev.destination_url || prev.destination_url === "#" || prev.destination_url.startsWith("/projects-details/")) {
          updated.destination_url = `/projects-details/${slug}`;
        }
        if (!prev.title.trim() && project) {
          updated.title = project.title || project.post_title || "";
        }
        return updated;
      });
    }
  };

  const visibleSections =
    activeAreaTab === "all"
      ? SECTIONS_CONFIG
      : SECTIONS_CONFIG.filter((s) => s.key === activeAreaTab);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, width: "100%" }}>
      {/* ── Top Header Banner ── */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 2.5,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <LayersIcon sx={{ color: "#166534", fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#166534" }}>
              Sidebar Content Management
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#15803d", maxWidth: 750 }}>
            Manage the right-sidebar widgets displayed on the project details page:
            <strong> Related Projects</strong>, <strong>Tutorials</strong>, and <strong>Mini Guides</strong>.
            Add new cards, edit text, toggle visibility, and drag to reorder.
          </Typography>
        </Box>

        {onSave && (
          <Button
            variant="contained"
            size="small"
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            disabled={isSaving}
            onClick={() => onSave(currentCards)}
            sx={{
              backgroundColor: "#37AB79",
              "&:hover": { backgroundColor: "#2d8a62" },
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2.5,
              py: 0.8,
              boxShadow: "0 2px 4px rgba(55, 171, 121, 0.25)",
              flexShrink: 0,
            }}
          >
            {isSaving ? "Saving..." : "Save Sidebar Content"}
          </Button>
        )}
      </Paper>

      {/* ── Filter / Navigation Tabs for 3 Areas ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
          borderBottom: "1px solid #e2e8f0",
          pb: 1,
        }}
      >
        <Tabs
          value={activeAreaTab}
          onChange={(e, val) => setActiveAreaTab(val)}
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              minHeight: 40,
              py: 0.5,
              px: 2,
              color: "#64748b",
              "&.Mui-selected": {
                color: "#37AB79",
                fontWeight: 700,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#37AB79",
              height: 3,
            },
          }}
        >
          <Tab
            value="all"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>All 3 Areas</span>
                <Chip
                  size="small"
                  label={
                    currentCards.related_projects.length +
                    currentCards.tutorials.length +
                    currentCards.mini_guides.length
                  }
                  sx={{
                    height: 20,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    backgroundColor: "#e2e8f0",
                    color: "#334155",
                  }}
                />
              </Box>
            }
          />
          {SECTIONS_CONFIG.map((sec) => {
            const count = (currentCards[sec.key] || []).length;
            const activeCount = (currentCards[sec.key] || []).filter(
              (c) => c.is_active !== false && c.status !== "inactive"
            ).length;
            return (
              <Tab
                key={sec.key}
                value={sec.key}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{sec.label}</span>
                    <Chip
                      size="small"
                      label={`${activeCount}/${count}`}
                      sx={{
                        height: 20,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        backgroundColor: activeCount > 0 ? "#dcfce7" : "#f1f5f9",
                        color: activeCount > 0 ? "#166534" : "#64748b",
                      }}
                    />
                  </Box>
                }
              />
            );
          })}
        </Tabs>
      </Box>

      {/* ── Render Each Management Area ── */}
      {visibleSections.map((sec) => {
        const cardsList = currentCards[sec.key] || [];
        const isAdding = addingSectionKey === sec.key;

        return (
          <Paper
            key={sec.key}
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              border: "1px solid #e0e6ed",
              borderRadius: 3,
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Area Header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 1.5,
                borderBottom: "1px solid #f1f5f9",
                pb: 2,
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip
                    size="small"
                    label={sec.badgeLabel}
                    sx={{
                      backgroundColor: "#ecfdf5",
                      color: "#059669",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      border: "1px solid #a7f3d0",
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                    {sec.label}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${cardsList.length} ${cardsList.length === 1 ? "Card" : "Cards"}`}
                    sx={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#475569",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                  {sec.description}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                disabled={isAdding}
                onClick={() => handleStartAdd(sec.key)}
                sx={{
                  borderColor: "#37AB79",
                  color: "#37AB79",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  px: 2,
                  py: 0.6,
                  "&:hover": {
                    borderColor: "#2d8a62",
                    backgroundColor: "#f0fdf4",
                  },
                }}
              >
                Add {sec.label.replace(/s$/, "")} Card
              </Button>
            </Box>

            {/* Inline Add Card Form */}
            {isAdding && addFormData && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: "#f8fafc",
                  border: "2px dashed #37AB79",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#166534" }}>
                    + New {sec.label.replace(/s$/, "")} Card
                  </Typography>
                  <IconButton size="small" onClick={handleCancelAdd}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                <TextField
                  label="Card Title *"
                  fullWidth
                  size="small"
                  value={addFormData.title}
                  onChange={(e) => setAddFormData({ ...addFormData, title: e.target.value })}
                  placeholder="e.g. Create Amazing Color Schemes Design"
                  helperText="The text displayed prominently on the sidebar card."
                />

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <TextField
                    label="Display Date"
                    size="small"
                    value={addFormData.display_date}
                    onChange={(e) => setAddFormData({ ...addFormData, display_date: e.target.value })}
                    placeholder="05 Aug, 2025"
                    helperText="Formatted date displayed alongside calendar icon."
                  />

                  {/* Linked Project / Resource Dropdown */}
                  <TextField
                    select
                    label="Link to Existing Project (Optional)"
                    size="small"
                    value={addFormData.linked_resource || ""}
                    onChange={(e) => handleResourceSelect(e.target.value, false)}
                    helperText="Auto-populates destination URL and title."
                  >
                    <MenuItem value="">
                      <em>-- Custom URL / Not Linked --</em>
                    </MenuItem>
                    {projectDetailsList.map((p) => (
                      <MenuItem key={p.slug} value={p.slug}>
                        {p.title || p.slug}
                      </MenuItem>
                    ))}
                    {wpProjects.map((p) => (
                      <MenuItem key={p.post_name} value={p.post_name}>
                        {p.post_title} (WordPress)
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" }, gap: 2 }}>
                  <TextField
                    label="Destination URL *"
                    size="small"
                    value={addFormData.destination_url}
                    onChange={(e) => setAddFormData({ ...addFormData, destination_url: e.target.value })}
                    placeholder="/projects-details/... or https://..."
                    helperText="Internal route (e.g. /tutorials) or external URL (https://...)."
                  />

                  <TextField
                    label="Display Order"
                    type="number"
                    size="small"
                    value={addFormData.display_order}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, display_order: Number(e.target.value) || 1 })
                    }
                    helperText="Position in this section."
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={addFormData.is_active}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            is_active: e.target.checked,
                            status: e.target.checked ? "active" : "inactive",
                          })
                        }
                        color="success"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {addFormData.is_active ? "Status: Active (Visible)" : "Status: Inactive (Hidden)"}
                      </Typography>
                    }
                  />

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleCancelAdd}
                      sx={{ textTransform: "none", color: "#64748b", borderColor: "#cbd5e1" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CheckIcon />}
                      disabled={!addFormData.title.trim()}
                      onClick={() => handleCommitAdd(sec.key)}
                      sx={{
                        backgroundColor: "#37AB79",
                        "&:hover": { backgroundColor: "#2d8a62" },
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Add Card
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Cards List with Drag and Drop */}
            {cardsList.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px dashed #cbd5e1",
                }}
              >
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  No cards in this section yet. Click <strong>Add {sec.label.replace(/s$/, "")} Card</strong> above to add one.
                </Typography>
              </Box>
            ) : (
              <SortableContainer
                items={cardsList.map((c) => ({ id: c.id }))}
                onReorder={(reordered) =>
                  handleReorderCards(
                    sec.key,
                    reordered.map((r) => cardsList.find((c) => c.id === r.id)).filter(Boolean)
                  )
                }
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {cardsList.map((card, idx) => {
                    const isEditing = editingCardId === card.id;
                    const isActive = card.is_active !== false && card.status !== "inactive";

                    return (
                      <SortableItem key={card.id} id={card.id}>
                        {({ attributes, listeners, isDragging }) => (
                          <Paper
                            elevation={0}
                            sx={{
                              border: isDragging
                                ? "2px dashed #37AB79"
                                : isEditing
                                ? "2px solid #37AB79"
                                : "1px solid #e2e8f0",
                              borderRadius: 2,
                              backgroundColor: isDragging
                                ? "#f0fdf4"
                                : isActive
                                ? "#ffffff"
                                : "#f8fafc",
                              opacity: isActive ? 1 : 0.75,
                              transition: "all 0.15s ease",
                              boxShadow: isDragging ? 4 : "0 1px 2px rgba(0,0,0,0.03)",
                              overflow: "hidden",
                            }}
                          >
                            {/* Card Display Row */}
                            {!isEditing ? (
                              <Box
                                sx={{
                                  p: 1.75,
                                  display: "flex",
                                  flexDirection: { xs: "column", sm: "row" },
                                  alignItems: { xs: "flex-start", sm: "center" },
                                  justifyContent: "space-between",
                                  gap: 1.5,
                                }}
                              >
                                {/* Left Drag & Info */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flex: 1, minWidth: 0 }}>
                                  <DragHandle
                                    attributes={attributes}
                                    listeners={listeners}
                                    isDragging={isDragging}
                                    title="Drag to reorder card"
                                    color="#16a34a"
                                  />

                                  <AccessibleReorderButtons
                                    isFirst={idx === 0}
                                    isLast={idx === cardsList.length - 1}
                                    onMoveUp={() => handleMoveCard(sec.key, idx, -1)}
                                    onMoveDown={() => handleMoveCard(sec.key, idx, 1)}
                                    color="#16a34a"
                                  />

                                  <Chip
                                    size="small"
                                    label={`#${idx + 1}`}
                                    sx={{
                                      height: 22,
                                      fontWeight: 700,
                                      fontSize: "0.72rem",
                                      backgroundColor: "#f1f5f9",
                                      color: "#475569",
                                    }}
                                  />

                                  <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                      <Typography
                                        variant="subtitle2"
                                        sx={{
                                          fontWeight: 600,
                                          color: isActive ? "#1e293b" : "#64748b",
                                          textDecoration: isActive ? "none" : "line-through",
                                        }}
                                      >
                                        {card.title || "Untitled Card"}
                                      </Typography>

                                      <Chip
                                        size="small"
                                        icon={<CalendarTodayIcon sx={{ fontSize: "12px !important" }} />}
                                        label={card.display_date || card.date || "No date"}
                                        sx={{
                                          height: 20,
                                          fontSize: "0.7rem",
                                          backgroundColor: "#f1f5f9",
                                          color: "#64748b",
                                        }}
                                      />

                                      {card.linked_resource && (
                                        <Chip
                                          size="small"
                                          icon={<LinkIcon sx={{ fontSize: "12px !important" }} />}
                                          label={`Linked: ${card.linked_resource}`}
                                          sx={{
                                            height: 20,
                                            fontSize: "0.7rem",
                                            backgroundColor: "#e0f2fe",
                                            color: "#0369a1",
                                          }}
                                        />
                                      )}
                                    </Box>

                                    {/* URL link preview */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.4 }}>
                                      <LaunchIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "#64748b",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          maxWidth: { xs: 260, sm: 420 },
                                          fontFamily: "monospace",
                                        }}
                                      >
                                        {card.destination_url || card.link || "#"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                {/* Right Controls */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    alignSelf: { xs: "flex-end", sm: "center" },
                                    flexShrink: 0,
                                  }}
                                >
                                  {/* Status Toggle Chip */}
                                  <Tooltip title={isActive ? "Click to deactivate / hide" : "Click to activate / show"}>
                                    <Chip
                                      size="small"
                                      icon={
                                        isActive ? (
                                          <VisibilityIcon sx={{ fontSize: "14px !important" }} />
                                        ) : (
                                          <VisibilityOffIcon sx={{ fontSize: "14px !important" }} />
                                        )
                                      }
                                      label={isActive ? "Active" : "Inactive"}
                                      onClick={() => handleToggleCardStatus(sec.key, card.id)}
                                      sx={{
                                        cursor: "pointer",
                                        height: 24,
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        backgroundColor: isActive ? "#dcfce7" : "#f1f5f9",
                                        color: isActive ? "#15803d" : "#64748b",
                                        border: isActive ? "1px solid #86efac" : "1px solid #cbd5e1",
                                        "&:hover": {
                                          backgroundColor: isActive ? "#bbf7d0" : "#e2e8f0",
                                        },
                                      }}
                                    />
                                  </Tooltip>

                                  <Tooltip title="Edit Card">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleStartEdit(card)}
                                      sx={{
                                        color: "#0369a1",
                                        backgroundColor: "#f0f9ff",
                                        "&:hover": { backgroundColor: "#e0f2fe" },
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Delete Card">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleRequestDelete(sec.key, card)}
                                      sx={{
                                        color: "#dc2626",
                                        backgroundColor: "#fef2f2",
                                        "&:hover": { backgroundColor: "#fee2e2" },
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            ) : (
                              /* ── Inline Edit Card Form ── */
                              <Box sx={{ p: 2.5, backgroundColor: "#ffffff", display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568" }}>
                                    Edit Card #{idx + 1}
                                  </Typography>
                                  <IconButton size="small" onClick={handleCancelEdit}>
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </Box>

                                <TextField
                                  label="Card Title *"
                                  fullWidth
                                  size="small"
                                  value={editFormData.title}
                                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                />

                                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                                  <TextField
                                    label="Display Date"
                                    size="small"
                                    value={editFormData.display_date}
                                    onChange={(e) => setEditFormData({ ...editFormData, display_date: e.target.value })}
                                    helperText="e.g. 05 Aug, 2025"
                                  />

                                  <TextField
                                    select
                                    label="Link to Existing Project (Optional)"
                                    size="small"
                                    value={editFormData.linked_resource || ""}
                                    onChange={(e) => handleResourceSelect(e.target.value, true)}
                                    helperText="Select to auto-populate destination link."
                                  >
                                    <MenuItem value="">
                                      <em>-- Custom URL / Not Linked --</em>
                                    </MenuItem>
                                    {projectDetailsList.map((p) => (
                                      <MenuItem key={p.slug} value={p.slug}>
                                        {p.title || p.slug}
                                      </MenuItem>
                                    ))}
                                    {wpProjects.map((p) => (
                                      <MenuItem key={p.post_name} value={p.post_name}>
                                        {p.post_title} (WordPress)
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Box>

                                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" }, gap: 2 }}>
                                  <TextField
                                    label="Destination URL *"
                                    size="small"
                                    value={editFormData.destination_url}
                                    onChange={(e) =>
                                      setEditFormData({ ...editFormData, destination_url: e.target.value })
                                    }
                                    helperText="Internal route or external web link."
                                  />

                                  <TextField
                                    label="Display Order"
                                    type="number"
                                    size="small"
                                    value={editFormData.display_order}
                                    onChange={(e) =>
                                      setEditFormData({ ...editFormData, display_order: Number(e.target.value) || 1 })
                                    }
                                  />
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1 }}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={editFormData.is_active}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            is_active: e.target.checked,
                                            status: e.target.checked ? "active" : "inactive",
                                          })
                                        }
                                        color="success"
                                      />
                                    }
                                    label={
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {editFormData.is_active ? "Status: Active (Visible)" : "Status: Inactive (Hidden)"}
                                      </Typography>
                                    }
                                  />

                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={handleCancelEdit}
                                      sx={{ textTransform: "none", color: "#64748b", borderColor: "#cbd5e1" }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      startIcon={<CheckIcon />}
                                      disabled={!editFormData.title.trim()}
                                      onClick={() => handleCommitEdit(sec.key)}
                                      sx={{
                                        backgroundColor: "#37AB79",
                                        "&:hover": { backgroundColor: "#2d8a62" },
                                        textTransform: "none",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Update Card
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Paper>
                        )}
                      </SortableItem>
                    );
                  })}
                </Box>
              </SortableContainer>
            )}
          </Paper>
        );
      })}

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: { borderRadius: 2.5, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#991b1b" }}>
          Confirm Delete Card
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#334155" }}>
            Are you sure you want to delete the card:
            <Box
              component="span"
              sx={{
                display: "block",
                my: 1,
                p: 1.2,
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 1.5,
                fontWeight: 600,
                color: "#b91c1c",
              }}
            >
              "{deleteDialog.card?.title || "Untitled"}"
            </Box>
            from the{" "}
            <strong>
              {SECTIONS_CONFIG.find((s) => s.key === deleteDialog.sectionKey)?.label || "sidebar"}
            </strong>{" "}
            section? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{ textTransform: "none", color: "#64748b", borderColor: "#cbd5e1" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Delete Card
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
