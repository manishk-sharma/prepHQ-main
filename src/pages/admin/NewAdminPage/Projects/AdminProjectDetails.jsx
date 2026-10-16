import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
  Alert,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  useProjectDetails,
  useProjectDetailsList,
  useUpdateProjectDetails,
  useCreateProjectDetails,
  useProjectList,
} from "../../../../services/projectsServices";
import { useNotification } from "../../../../context/useNotificationContext";

const DEFAULT_SLUG = "customer-churn-prediction-using-machine-learning";

export default function AdminProjectDetails() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [selectedSlug, setSelectedSlug] = useState(idOrSlug || DEFAULT_SLUG);
  const [tabIndex, setTabIndex] = useState(0);

  const { data: projectDetailsList = [] } = useProjectDetailsList();
  const { data: wpProjects = [] } = useProjectList();
  const { data: currentData, isLoading, isError, refetch } = useProjectDetails(selectedSlug);

  const { mutateAsync: updateDetails, isPending: isUpdating } = useUpdateProjectDetails();
  const { mutateAsync: createDetails, isPending: isCreating } = useCreateProjectDetails();

  const isSaving = isUpdating || isCreating;

  // Local editable state for form
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (idOrSlug && idOrSlug !== selectedSlug) {
      setSelectedSlug(idOrSlug);
    }
  }, [idOrSlug]);

  useEffect(() => {
    if (currentData) {
      setFormData(JSON.parse(JSON.stringify(currentData)));
    }
  }, [currentData]);

  const handleSlugChange = (newSlug) => {
    setSelectedSlug(newSlug);
    navigate(`/admin/projects/details/${newSlug}`);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Prerequisite helpers ──
  const handlePrereqChange = (category, index, value) => {
    setFormData((prev) => {
      const updated = { ...(prev.prerequisites || {}) };
      const list = [...(updated[category] || [])];
      list[index] = value;
      updated[category] = list;
      return { ...prev, prerequisites: updated };
    });
  };

  const addPrereqItem = (category) => {
    setFormData((prev) => {
      const updated = { ...(prev.prerequisites || {}) };
      const list = [...(updated[category] || []), "New requirement"];
      updated[category] = list;
      return { ...prev, prerequisites: updated };
    });
  };

  const removePrereqItem = (category, index) => {
    setFormData((prev) => {
      const updated = { ...(prev.prerequisites || {}) };
      const list = [...(updated[category] || [])];
      list.splice(index, 1);
      updated[category] = list;
      return { ...prev, prerequisites: updated };
    });
  };

  // ── Objectives helpers ──
  const handleObjectiveChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.objectives || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, objectives: list };
    });
  };

  const addObjective = () => {
    setFormData((prev) => {
      const list = [...(prev.objectives || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `obj-${Date.now()}`,
        num: nextNum,
        title: "Objective Title",
        content: "Detailed description of what the learner will accomplish in this objective.",
      });
      return { ...prev, objectives: list };
    });
  };

  const removeObjective = (index) => {
    setFormData((prev) => {
      const list = [...(prev.objectives || [])];
      list.splice(index, 1);
      return { ...prev, objectives: list };
    });
  };

  // ── Architecture Steps helpers ──
  const handleArchStepChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.architecture_steps || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, architecture_steps: list };
    });
  };

  const addArchStep = () => {
    setFormData((prev) => {
      const list = [...(prev.architecture_steps || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({ id: `arch-${Date.now()}`, num: nextNum, title: "New Step" });
      return { ...prev, architecture_steps: list };
    });
  };

  const removeArchStep = (index) => {
    setFormData((prev) => {
      const list = [...(prev.architecture_steps || [])];
      list.splice(index, 1);
      return { ...prev, architecture_steps: list };
    });
  };

  // ── Architecture Details helpers ──
  const handleArchDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.architecture_details || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, architecture_details: list };
    });
  };

  const addArchDetail = () => {
    setFormData((prev) => {
      const list = [...(prev.architecture_details || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({ step: `${nextNum} · Component`, desc: "Description of this component." });
      return { ...prev, architecture_details: list };
    });
  };

  const removeArchDetail = (index) => {
    setFormData((prev) => {
      const list = [...(prev.architecture_details || [])];
      list.splice(index, 1);
      return { ...prev, architecture_details: list };
    });
  };

  // ── Implementation Steps helpers ──
  const handleImplStepChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.implementation_steps || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, implementation_steps: list };
    });
  };

  const addImplStep = () => {
    setFormData((prev) => {
      const list = [...(prev.implementation_steps || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `step-${Date.now()}`,
        num: nextNum,
        title: "Implementation Step Title",
        subtitle: "Short summary subtitle",
        whatYouDo: "Actionable steps taken in this phase.",
        matters: "Why this phase is important.",
        output: "Artifact or output produced.",
        tools: ["Python", "Jupyter"],
        command: "pip install package-name",
      });
      return { ...prev, implementation_steps: list };
    });
  };

  const removeImplStep = (index) => {
    setFormData((prev) => {
      const list = [...(prev.implementation_steps || [])];
      list.splice(index, 1);
      return { ...prev, implementation_steps: list };
    });
  };

  // ── Technologies helpers ──
  const handleTechChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.technologies || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, technologies: list };
    });
  };

  const addTech = () => {
    setFormData((prev) => {
      const list = [...(prev.technologies || [])];
      list.push({ name: "Tool Name", desc: "Purpose/Category" });
      return { ...prev, technologies: list };
    });
  };

  const removeTech = (index) => {
    setFormData((prev) => {
      const list = [...(prev.technologies || [])];
      list.splice(index, 1);
      return { ...prev, technologies: list };
    });
  };

  // ── Datasets helpers ──
  const handleDatasetChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.dataset_resources || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, dataset_resources: list };
    });
  };

  const addDataset = () => {
    setFormData((prev) => {
      const list = [...(prev.dataset_resources || [])];
      list.push({ title: "Dataset Source", desc: "Dataset description", url: "https://" });
      return { ...prev, dataset_resources: list };
    });
  };

  const removeDataset = (index) => {
    setFormData((prev) => {
      const list = [...(prev.dataset_resources || [])];
      list.splice(index, 1);
      return { ...prev, dataset_resources: list };
    });
  };

  // ── Learnings helpers ──
  const handleLearningChange = (category, index, value) => {
    setFormData((prev) => {
      const list = [...(prev[category] || [])];
      list[index] = value;
      return { ...prev, [category]: list };
    });
  };

  const addLearning = (category) => {
    setFormData((prev) => {
      const list = [...(prev[category] || []), "New key takeaway"];
      return { ...prev, [category]: list };
    });
  };

  const removeLearning = (category, index) => {
    setFormData((prev) => {
      const list = [...(prev[category] || [])];
      list.splice(index, 1);
      return { ...prev, [category]: list };
    });
  };

  // ── Common Mistakes helpers ──
  const handleMistakeChange = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, common_mistakes: list };
    });
  };

  const addMistake = () => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      const nextNum = String(list.length + 1).padStart(2, "0");
      list.push({
        id: `mistake-${Date.now()}`,
        num: nextNum,
        title: "Pitfall Title",
        mistake: "Description of the mistake.",
        why: "Why developers make this mistake.",
        avoid: "Best practice to avoid it.",
      });
      return { ...prev, common_mistakes: list };
    });
  };

  const removeMistake = (index) => {
    setFormData((prev) => {
      const list = [...(prev.common_mistakes || [])];
      list.splice(index, 1);
      return { ...prev, common_mistakes: list };
    });
  };

  // ── Submit / Save handler ──
  const handleSave = async () => {
    if (!formData) return;
    try {
      if (formData.id) {
        await updateDetails({ slugOrId: formData.slug || selectedSlug, data: formData });
      } else {
        await createDetails(formData);
      }
      refetch();
    } catch (err) {
      // Error handled by mutation hook
    }
  };

  if (isLoading && !formData) {
    return (
      <Box sx={{ maxWidth: 1200, margin: "40px auto", textAlign: "center" }}>
        <CircularProgress sx={{ color: "#37AB79" }} />
        <Typography sx={{ mt: 2, color: "#666" }}>Loading project details content...</Typography>
      </Box>
    );
  }

  if (isError && !formData) {
    return (
      <Box sx={{ maxWidth: 1200, margin: "40px auto", p: 3 }}>
        <Alert severity="error">
          Failed to load project details for slug: <strong>{selectedSlug}</strong>.
        </Alert>
        <Button
          startIcon={<RefreshIcon />}
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#37AB79" }}
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1280, margin: "0 auto", pb: 8 }}>
      {/* ── Top Header & Actions ── */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate("/admin/projects/list")} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#074568" }}>
              Project Details Editor
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#666", ml: 5 }}>
            Edit, format, and manage the full learning curriculum and guide sections of the project page.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          {/* Project Selector */}
          <TextField
            select
            size="small"
            label="Selected Project"
            value={selectedSlug}
            onChange={(e) => handleSlugChange(e.target.value)}
            sx={{ minWidth: 260 }}
          >
            <MenuItem value={DEFAULT_SLUG}>Customer Churn Prediction</MenuItem>
            {projectDetailsList
              .filter((p) => p.slug !== DEFAULT_SLUG)
              .map((p) => (
                <MenuItem key={p.slug} value={p.slug}>
                  {p.title || p.slug}
                </MenuItem>
              ))}
            {wpProjects.map((p) => (
              <MenuItem key={p.post_name} value={p.post_name}>
                {p.post_title}
              </MenuItem>
            ))}
          </TextField>

          {/* View Live Project */}
          <Tooltip title="View live on website">
            <Button
              variant="outlined"
              size="medium"
              startIcon={<VisibilityIcon />}
              onClick={() => window.open(`/projects-details/${selectedSlug}`, "_blank")}
              sx={{ borderColor: "#37AB79", color: "#37AB79", textTransform: "none" }}
            >
              View Live
            </Button>
          </Tooltip>

          {/* Save Button */}
          <Button
            variant="contained"
            size="medium"
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            disabled={isSaving}
            onClick={handleSave}
            sx={{
              backgroundColor: "#37AB79",
              "&:hover": { backgroundColor: "#2d8a62" },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>

      {/* ── Main Tabbed Card ── */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e6ed", borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #e0e6ed",
            backgroundColor: "#f9fafb",
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: 13.5 },
            "& .Mui-selected": { color: "#37AB79" },
            "& .MuiTabs-indicator": { backgroundColor: "#37AB79", height: 3 },
          }}
        >
          <Tab label="Header & Meta" />
          <Tab label="01 · About Project" />
          <Tab label="02 · Prerequisites" />
          <Tab label="03 · Objectives" />
          <Tab label="04 · Architecture" />
          <Tab label="05 · Implementation" />
          <Tab label="06 · Tools & Datasets" />
          <Tab label="07 · Learnings & Mistakes" />
        </Tabs>

        {formData && (
          <Box sx={{ p: 3 }}>
            {/* ── TAB 0: Header & Meta ── */}
            {tabIndex === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Project Header & Core Metadata
                </Typography>

                <TextField
                  label="Project Title"
                  fullWidth
                  value={formData.title || ""}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  helperText="The main title displayed at the top of the project detail page."
                />

                <TextField
                  label="URL Slug (Unique)"
                  fullWidth
                  value={formData.slug || ""}
                  onChange={(e) => handleFieldChange("slug", e.target.value)}
                  helperText="URL path slug (e.g. customer-churn-prediction-using-machine-learning)"
                />

                <TextField
                  label="Subtitle / Lead Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.subtitle || ""}
                  onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                />

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <TextField
                    select
                    label="Difficulty Level"
                    value={formData.level || "Intermediate"}
                    onChange={(e) => handleFieldChange("level", e.target.value)}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </TextField>

                  <TextField
                    label="Estimated Duration"
                    value={formData.duration || "8–12 Hours"}
                    onChange={(e) => handleFieldChange("duration", e.target.value)}
                    helperText="e.g. 8–12 Hours, 2 Weeks, etc."
                  />

                  <TextField
                    label="Domain"
                    value={formData.domain || "Data Science"}
                    onChange={(e) => handleFieldChange("domain", e.target.value)}
                    helperText="e.g. Data Science, Web Development, IoT & Embedded"
                  />

                  <TextField
                    label="Project Type"
                    value={formData.project_type || "Machine Learning"}
                    onChange={(e) => handleFieldChange("project_type", e.target.value)}
                    helperText="e.g. Machine Learning, Full Stack App, Computer Vision"
                  />
                </Box>
              </Box>
            )}

            {/* ── TAB 1: About Project ── */}
            {tabIndex === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Section 01 · About the Project Content
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  These 3 paragraphs render inside the primary summary card in Section 01.
                </Typography>

                <TextField
                  label="Paragraph 1 (The Problem Context)"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.about_text_1 || ""}
                  onChange={(e) => handleFieldChange("about_text_1", e.target.value)}
                  placeholder="Explain what the project addresses in real-world terms..."
                />

                <TextField
                  label="Paragraph 2 (What the Learner Builds)"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.about_text_2 || ""}
                  onChange={(e) => handleFieldChange("about_text_2", e.target.value)}
                  placeholder="Explain the dataset and models used..."
                />

                <TextField
                  label="Paragraph 3 (Key Takeaway / Final Deliverable)"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.about_text_3 || ""}
                  onChange={(e) => handleFieldChange("about_text_3", e.target.value)}
                  placeholder="Explain the working end-to-end outcome..."
                />
              </Box>
            )}

            {/* ── TAB 2: Prerequisites ── */}
            {tabIndex === 2 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Section 02 · Prerequisites & What to Know Before Starting
                </Typography>

                {["programming", "data", "statistics", "machineLearning"].map((cat) => {
                  const labels = {
                    programming: "Programming Prerequisites",
                    data: "Data Handling Prerequisites",
                    statistics: "Statistics Prerequisites",
                    machineLearning: "Machine Learning Prerequisites",
                  };
                  const items = formData.prerequisites?.[cat] || [];

                  return (
                    <Paper key={cat} sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Typography sx={{ fontWeight: 600, color: "#074568" }}>{labels[cat]}</Typography>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => addPrereqItem(cat)}
                          sx={{ color: "#37AB79", textTransform: "none" }}
                        >
                          Add Item
                        </Button>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {items.map((item, idx) => (
                          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <TextField
                              size="small"
                              fullWidth
                              value={item}
                              onChange={(e) => handlePrereqChange(cat, idx, e.target.value)}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removePrereqItem(cat, idx)}
                              sx={{ color: "#dc2626" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* ── TAB 3: Objectives ── */}
            {tabIndex === 3 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                    Section 03 · Project Objectives
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addObjective}
                    sx={{ borderColor: "#37AB79", color: "#37AB79", textTransform: "none" }}
                  >
                    Add Objective
                  </Button>
                </Box>

                {(formData.objectives || []).map((obj, idx) => (
                  <Paper key={obj.id || idx} sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: "#37AB79" }}>
                        Objective #{idx + 1}
                      </Typography>
                      <IconButton size="small" onClick={() => removeObjective(idx)} sx={{ color: "#dc2626" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "80px 1fr" }, gap: 1.5, mb: 1.5 }}>
                      <TextField
                        size="small"
                        label="No."
                        value={obj.num || String(idx + 1).padStart(2, "0")}
                        onChange={(e) => handleObjectiveChange(idx, "num", e.target.value)}
                      />
                      <TextField
                        size="small"
                        label="Objective Title"
                        value={obj.title || ""}
                        onChange={(e) => handleObjectiveChange(idx, "title", e.target.value)}
                      />
                    </Box>

                    <TextField
                      size="small"
                      label="Content / Description"
                      fullWidth
                      multiline
                      rows={2}
                      value={obj.content || ""}
                      onChange={(e) => handleObjectiveChange(idx, "content", e.target.value)}
                    />
                  </Paper>
                ))}
              </Box>
            )}

            {/* ── TAB 4: Architecture ── */}
            {tabIndex === 4 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Section 04 · Architecture Steps & Breakdown
                </Typography>

                {/* 1. Step Cards Grid */}
                <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                      Architecture Workflow Steps (Circular Grid)
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addArchStep}
                      sx={{ color: "#37AB79", textTransform: "none" }}
                    >
                      Add Step
                    </Button>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 1.5 }}>
                    {(formData.architecture_steps || []).map((step, idx) => (
                      <Box
                        key={step.id || idx}
                        sx={{
                          p: 1.5,
                          border: "1px solid #f0f0f0",
                          borderRadius: 1.5,
                          backgroundColor: "#fafafa",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: 60 }}
                          value={step.num || ""}
                          onChange={(e) => handleArchStepChange(idx, "num", e.target.value)}
                        />
                        <TextField
                          size="small"
                          fullWidth
                          value={step.title || ""}
                          onChange={(e) => handleArchStepChange(idx, "title", e.target.value)}
                        />
                        <IconButton size="small" onClick={() => removeArchStep(idx)} sx={{ color: "#dc2626" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* 2. Architecture Details Breakdown */}
                <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                      Architecture Details Breakdown List
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addArchDetail}
                      sx={{ color: "#37AB79", textTransform: "none" }}
                    >
                      Add Breakdown Item
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {(formData.architecture_details || []).map((item, idx) => (
                      <Box key={idx} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                        <TextField
                          size="small"
                          label="Step Label"
                          sx={{ width: 220 }}
                          value={item.step || ""}
                          onChange={(e) => handleArchDetailChange(idx, "step", e.target.value)}
                        />
                        <TextField
                          size="small"
                          label="Description"
                          fullWidth
                          value={item.desc || ""}
                          onChange={(e) => handleArchDetailChange(idx, "desc", e.target.value)}
                        />
                        <IconButton size="small" onClick={() => removeArchDetail(idx)} sx={{ color: "#dc2626" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            {/* ── TAB 5: Implementation Guide ── */}
            {tabIndex === 5 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                    Section 05 · Step-by-Step Implementation Guide
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addImplStep}
                    sx={{ borderColor: "#37AB79", color: "#37AB79", textTransform: "none" }}
                  >
                    Add Implementation Step
                  </Button>
                </Box>

                {(formData.implementation_steps || []).map((step, idx) => (
                  <Paper key={step.id || idx} sx={{ p: 2.5, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 700, color: "#37AB79" }}>
                        Step #{step.num || idx + 1}
                      </Typography>
                      <IconButton size="small" onClick={() => removeImplStep(idx)} sx={{ color: "#dc2626" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "80px 1fr 1fr" }, gap: 1.5, mb: 1.5 }}>
                      <TextField
                        size="small"
                        label="No."
                        value={step.num || ""}
                        onChange={(e) => handleImplStepChange(idx, "num", e.target.value)}
                      />
                      <TextField
                        size="small"
                        label="Title"
                        value={step.title || ""}
                        onChange={(e) => handleImplStepChange(idx, "title", e.target.value)}
                      />
                      <TextField
                        size="small"
                        label="Subtitle"
                        value={step.subtitle || ""}
                        onChange={(e) => handleImplStepChange(idx, "subtitle", e.target.value)}
                      />
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 1.5 }}>
                      <TextField
                        size="small"
                        label="What you'll do"
                        multiline
                        rows={2}
                        value={step.whatYouDo || ""}
                        onChange={(e) => handleImplStepChange(idx, "whatYouDo", e.target.value)}
                      />
                      <TextField
                        size="small"
                        label="Why it matters"
                        multiline
                        rows={2}
                        value={step.matters || ""}
                        onChange={(e) => handleImplStepChange(idx, "matters", e.target.value)}
                      />
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 1.5 }}>
                      <TextField
                        size="small"
                        label="Expected output"
                        value={step.output || ""}
                        onChange={(e) => handleImplStepChange(idx, "output", e.target.value)}
                      />
                      <TextField
                        size="small"
                        label="Tools Used (comma separated)"
                        value={Array.isArray(step.tools) ? step.tools.join(", ") : step.tools || ""}
                        onChange={(e) =>
                          handleImplStepChange(
                            idx,
                            "tools",
                            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          )
                        }
                      />
                    </Box>

                    <TextField
                      size="small"
                      label="Shell Command / Code snippet"
                      fullWidth
                      multiline
                      rows={2}
                      value={step.command || ""}
                      onChange={(e) => handleImplStepChange(idx, "command", e.target.value)}
                    />
                  </Paper>
                ))}
              </Box>
            )}

            {/* ── TAB 6: Tools & Datasets ── */}
            {tabIndex === 6 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Section 06 & 07 · Technologies Used & Dataset Resources
                </Typography>

                {/* Technologies */}
                <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                      Technologies / Tools (Section 06)
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addTech}
                      sx={{ color: "#37AB79", textTransform: "none" }}
                    >
                      Add Tool
                    </Button>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                    {(formData.technologies || []).map((t, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1.5,
                          border: "1px solid #f0f0f0",
                          borderRadius: 1.5,
                          backgroundColor: "#fafafa",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <TextField
                          size="small"
                          label="Tool Name"
                          value={t.name || ""}
                          onChange={(e) => handleTechChange(idx, "name", e.target.value)}
                        />
                        <TextField
                          size="small"
                          label="Category / Usage"
                          fullWidth
                          value={t.desc || ""}
                          onChange={(e) => handleTechChange(idx, "desc", e.target.value)}
                        />
                        <IconButton size="small" onClick={() => removeTech(idx)} sx={{ color: "#dc2626" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* Dataset Resources */}
                <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                      Where to Get Data / Resources (Section 07)
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addDataset}
                      sx={{ color: "#37AB79", textTransform: "none" }}
                    >
                      Add Resource
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {(formData.dataset_resources || []).map((ds, idx) => (
                      <Paper key={idx} sx={{ p: 1.5, border: "1px solid #f0f0f0", borderRadius: 1.5 }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" }, gap: 1.5, mb: 1 }}>
                          <TextField
                            size="small"
                            label="Provider / Title"
                            value={ds.title || ""}
                            onChange={(e) => handleDatasetChange(idx, "title", e.target.value)}
                          />
                          <TextField
                            size="small"
                            label="External URL"
                            value={ds.url || ""}
                            onChange={(e) => handleDatasetChange(idx, "url", e.target.value)}
                          />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TextField
                            size="small"
                            label="Description"
                            fullWidth
                            value={ds.desc || ""}
                            onChange={(e) => handleDatasetChange(idx, "desc", e.target.value)}
                          />
                          <IconButton size="small" onClick={() => removeDataset(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            {/* ── TAB 7: Learnings & Mistakes ── */}
            {tabIndex === 7 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#074568" }}>
                  Section 08 & 09 · Learnings & Common Mistakes
                </Typography>

                {/* Learnings */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 600, color: "#074568" }}>Technical Learnings</Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addLearning("technical_learnings")}
                        sx={{ color: "#37AB79", textTransform: "none" }}
                      >
                        Add
                      </Button>
                    </Box>
                    {(formData.technical_learnings || []).map((item, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          value={item}
                          onChange={(e) => handleLearningChange("technical_learnings", idx, e.target.value)}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeLearning("technical_learnings", idx)}
                          sx={{ color: "#dc2626" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Paper>

                  <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 600, color: "#074568" }}>Practical Learnings</Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addLearning("practical_learnings")}
                        sx={{ color: "#37AB79", textTransform: "none" }}
                      >
                        Add
                      </Button>
                    </Box>
                    {(formData.practical_learnings || []).map((item, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          value={item}
                          onChange={(e) => handleLearningChange("practical_learnings", idx, e.target.value)}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeLearning("practical_learnings", idx)}
                          sx={{ color: "#dc2626" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Paper>
                </Box>

                {/* Common Mistakes */}
                <Paper sx={{ p: 2, border: "1px solid #e0e6ed", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: "#074568" }}>
                      Common Mistakes to Avoid (Section 09)
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addMistake}
                      sx={{ color: "#37AB79", textTransform: "none" }}
                    >
                      Add Pitfall
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {(formData.common_mistakes || []).map((m, idx) => (
                      <Paper key={m.id || idx} sx={{ p: 2, border: "1px solid #f0f0f0", borderRadius: 1.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                          <Typography sx={{ fontWeight: 700, color: "#dc2626" }}>
                            Pitfall #{idx + 1}
                          </Typography>
                          <IconButton size="small" onClick={() => removeMistake(idx)} sx={{ color: "#dc2626" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "80px 1fr" }, gap: 1.5, mb: 1.5 }}>
                          <TextField
                            size="small"
                            label="No."
                            value={m.num || String(idx + 1).padStart(2, "0")}
                            onChange={(e) => handleMistakeChange(idx, "num", e.target.value)}
                          />
                          <TextField
                            size="small"
                            label="Mistake Title"
                            value={m.title || ""}
                            onChange={(e) => handleMistakeChange(idx, "title", e.target.value)}
                          />
                        </Box>

                        <TextField
                          size="small"
                          label="The Mistake"
                          fullWidth
                          sx={{ mb: 1.5 }}
                          value={m.mistake || ""}
                          onChange={(e) => handleMistakeChange(idx, "mistake", e.target.value)}
                        />
                        <TextField
                          size="small"
                          label="Why It Happens"
                          fullWidth
                          sx={{ mb: 1.5 }}
                          value={m.why || ""}
                          onChange={(e) => handleMistakeChange(idx, "why", e.target.value)}
                        />
                        <TextField
                          size="small"
                          label="How to Avoid It"
                          fullWidth
                          value={m.avoid || ""}
                          onChange={(e) => handleMistakeChange(idx, "avoid", e.target.value)}
                        />
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Bottom Save Action Bar */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => refetch()}
                sx={{ textTransform: "none", color: "#666", borderColor: "#ccc" }}
              >
                Reset to Saved
              </Button>
              <Button
                variant="contained"
                startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                disabled={isSaving}
                onClick={handleSave}
                sx={{
                  backgroundColor: "#37AB79",
                  "&:hover": { backgroundColor: "#2d8a62" },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                }}
              >
                {isSaving ? "Saving..." : "Save Project Details"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
