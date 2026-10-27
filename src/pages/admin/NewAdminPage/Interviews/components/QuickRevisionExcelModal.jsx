import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Paper,
  Chip,
  Alert,
  Checkbox,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import UpdateIcon from "@mui/icons-material/Update";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveIcon from "@mui/icons-material/Save";
import { applyModeA, applyModeB } from "../../../../../utils/quickRevisionExcel";

export default function QuickRevisionExcelModal({
  open,
  onClose,
  importResult,
  existingRows = [],
  onConfirmImport,
  isSaving = false,
  onChangeFile,
}) {
  const [importMode, setImportMode] = useState("mode_a"); // "mode_a" | "mode_b"
  const [confirmReplace, setConfirmReplace] = useState(false);

  if (!importResult) return null;

  const {
    fileName,
    fileSize,
    totalRows = 0,
    validRows = [],
    invalidRows = [],
    updateCount = 0,
    newCount = 0,
    allRows = [],
  } = importResult;

  const isModeB = importMode === "mode_b";
  const canSubmit =
    validRows.length > 0 &&
    (!isModeB || confirmReplace) &&
    !isSaving;

  const handleCommit = () => {
    if (!canSubmit) return;

    if (isModeB) {
      const { replacedRows } = applyModeB(validRows);
      onConfirmImport({
        mode: "mode_b",
        newRows: replacedRows,
        stats: {
          replacedCount: replacedRows.length,
          removedCount: existingRows.length,
        },
      });
    } else {
      const { mergedRows, addedCount, updatedCount } = applyModeA(
        existingRows,
        validRows
      );
      onConfirmImport({
        mode: "mode_a",
        newRows: mergedRows,
        stats: {
          addedCount,
          updatedCount,
          unchangedCount: mergedRows.length - (addedCount + updatedCount),
          totalCount: mergedRows.length,
        },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          overflow: "hidden",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          backgroundColor: "#075174",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1.8,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <FileUploadIcon sx={{ fontSize: 26 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Quick Revision — Excel Import Preview
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
              {fileName} ({fileSize ? `${(fileSize / 1024).toFixed(1)} KB` : ""})
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={isSaving}
          sx={{ color: "rgba(255,255,255,0.85)", "&:hover": { color: "#fff" } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: "#f8fafc" }}>
        {/* Stat Badges Overview */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
              Valid Rows
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#059669" }}>
              {validRows.length}
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#ffffff",
              borderColor: invalidRows.length > 0 ? "#fca5a5" : "#e2e8f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: invalidRows.length > 0 ? "#dc2626" : "#64748b", fontWeight: 600 }}
            >
              Invalid Rows
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: invalidRows.length > 0 ? "#dc2626" : "#64748b" }}
            >
              {invalidRows.length}
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
            }}
          >
            <Typography variant="caption" sx={{ color: "#0284c7", fontWeight: 600 }}>
              Concepts to Update
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0284c7" }}>
              {updateCount}
            </Typography>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
            }}
          >
            <Typography variant="caption" sx={{ color: "#0d9488", fontWeight: 600 }}>
              New Concepts
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d9488" }}>
              {newCount}
            </Typography>
          </Paper>
        </Box>

        {/* Validation Errors Notice */}
        {invalidRows.length > 0 && (
          <Alert
            severity="warning"
            icon={<WarningAmberIcon />}
            sx={{ mb: 2.5, borderRadius: 2 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              {invalidRows.length} invalid row(s) detected — these rows will be skipped during import:
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, m: 0, fontSize: "0.85rem" }}>
              {invalidRows.slice(0, 5).map((inv, idx) => (
                <li key={idx}>
                  <strong>Excel Row {inv.excelRowNum}:</strong> {inv.error}
                </li>
              ))}
              {invalidRows.length > 5 && (
                <li>...and {invalidRows.length - 5} more error(s)</li>
              )}
            </Box>
          </Alert>
        )}

        {/* Import Mode Selector */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 2.5,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            borderColor: "#cbd5e1",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568", mb: 1 }}>
            Select Import Mode
          </Typography>

          <RadioGroup
            value={importMode}
            onChange={(e) => setImportMode(e.target.value)}
          >
            {/* Mode A */}
            <Box
              sx={{
                p: 1.5,
                mb: 1.2,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: importMode === "mode_a" ? "#37AB79" : "#e2e8f0",
                backgroundColor: importMode === "mode_a" ? "#f0fdf4" : "#ffffff",
                cursor: "pointer",
              }}
              onClick={() => setImportMode("mode_a")}
            >
              <FormControlLabel
                value="mode_a"
                control={<Radio size="small" color="success" />}
                label={
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        Mode A: Update Existing + Add New (Recommended)
                      </Typography>
                      <Chip label="Default" size="small" sx={{ height: 20, fontSize: "0.7rem", backgroundColor: "#DEF7EC", color: "#03543F", fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Matches existing rows by concept name (case-insensitive). Updates their explanation if found, appends new concepts, and leaves existing rows not in this file intact.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: "100%", alignItems: "flex-start" }}
              />
            </Box>

            {/* Mode B */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: importMode === "mode_b" ? "#ef4444" : "#e2e8f0",
                backgroundColor: importMode === "mode_b" ? "#fef2f2" : "#ffffff",
                cursor: "pointer",
              }}
              onClick={() => setImportMode("mode_b")}
            >
              <FormControlLabel
                value="mode_b"
                control={<Radio size="small" sx={{ color: "#ef4444", "&.Mui-checked": { color: "#dc2626" } }} />}
                label={
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#991b1b" }}>
                        Mode B: Replace Entire Table
                      </Typography>
                      <Chip label="Destructive" size="small" sx={{ height: 20, fontSize: "0.7rem", backgroundColor: "#fee2e2", color: "#991b1b", fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Replaces all Quick Revision rows with the {validRows.length} valid row(s) from this file. Any existing row not in this file will be permanently deleted.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: "100%", alignItems: "flex-start" }}
              />

              {isModeB && (
                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed #fca5a5" }}>
                  <Alert severity="error" sx={{ mb: 1.5, py: 0.5, borderRadius: 1.5 }}>
                    Warning: All {existingRows.length} existing revision rows will be permanently removed and replaced by {validRows.length} rows.
                  </Alert>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={confirmReplace}
                        onChange={(e) => setConfirmReplace(e.target.checked)}
                        sx={{ color: "#dc2626", "&.Mui-checked": { color: "#dc2626" } }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#991b1b" }}>
                        I understand that all existing revision rows absent from this file will be removed.
                      </Typography>
                    }
                  />
                </Box>
              )}
            </Box>
          </RadioGroup>
        </Paper>

        {/* Data Preview Table */}
        <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#074568" }}>
            Import Data Preview ({allRows.length} rows parsed)
          </Typography>
          <Button
            size="small"
            onClick={onChangeFile}
            sx={{ textTransform: "none", color: "#075174", fontWeight: 600 }}
          >
            Change Excel File
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            maxHeight: 280,
            borderRadius: 2,
            borderColor: "#e2e8f0",
            backgroundColor: "#ffffff",
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, backgroundColor: "#075174", color: "#fff", width: 70 }}>
                  Row #
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: "#075174", color: "#fff", width: 100 }}>
                  Action
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: "#075174", color: "#fff", width: "30%" }}>
                  Concept
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: "#075174", color: "#fff" }}>
                  Concise Explanation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRows.map((row, idx) => {
                const isUpdate = row.status === "UPDATE";
                const isNew = row.status === "NEW";
                const isInvalid = row.status === "INVALID";

                return (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor: isInvalid
                        ? "#fef2f2"
                        : isUpdate
                        ? "#f0f9ff"
                        : idx % 2 === 0
                        ? "#ffffff"
                        : "#f8fafc",
                    }}
                  >
                    <TableCell sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.8rem" }}>
                      {row.excelRowNum}
                    </TableCell>

                    <TableCell>
                      {isUpdate && (
                        <Chip
                          icon={<UpdateIcon sx={{ fontSize: "14px !important" }} />}
                          label="Update"
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            backgroundColor: "#e0f2fe",
                            color: "#0369a1",
                          }}
                        />
                      )}
                      {isNew && (
                        <Chip
                          icon={<AddCircleOutlineIcon sx={{ fontSize: "14px !important" }} />}
                          label="New"
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                          }}
                        />
                      )}
                      {isInvalid && (
                        <Chip
                          icon={<ErrorOutlineIcon sx={{ fontSize: "14px !important" }} />}
                          label="Invalid"
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600, color: isInvalid ? "#dc2626" : "#0f172a" }}>
                      {row.concept || <em style={{ color: "#94a3b8" }}>(empty)</em>}
                    </TableCell>

                    <TableCell sx={{ fontSize: "0.85rem", color: "#334155" }}>
                      {row.explanation || <em style={{ color: "#94a3b8" }}>(empty)</em>}
                      {row.error && (
                        <Typography variant="caption" sx={{ display: "block", color: "#dc2626", fontWeight: 600, mt: 0.5 }}>
                          ⚠️ {row.error}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <Divider />

      {/* Dialog Footer Actions */}
      <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#ffffff", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSaving}
          sx={{ textTransform: "none", color: "#64748b", borderColor: "#cbd5e1" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={handleCommit}
          startIcon={
            isSaving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          sx={{
            backgroundColor: isModeB ? "#dc2626" : "#37AB79",
            "&:hover": {
              backgroundColor: isModeB ? "#b91c1c" : "#2d8a62",
            },
            textTransform: "none",
            fontWeight: 700,
            px: 3,
          }}
        >
          {isSaving
            ? "Saving to Database..."
            : isModeB
            ? `Confirm & Replace Table (${validRows.length} rows)`
            : `Confirm & Save Import (${validRows.length} valid rows)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
