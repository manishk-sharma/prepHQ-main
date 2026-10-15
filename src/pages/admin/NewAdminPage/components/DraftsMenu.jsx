import React from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemText,
  IconButton,
  Chip,
} from "@mui/material";
import DraftsIcon from "@mui/icons-material/Drafts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

/**
 * DraftsMenu — renders the "Drafts (N)" button + dropdown
 *
 * Props come straight from useDraft()
 */
const DraftsMenu = ({
  drafts = [],
  draftsMenuAnchor,
  setDraftsMenuAnchor,
  loadDraft,
  deleteDraft,
}) => {
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DraftsIcon sx={{ fontSize: 18 }} />}
        onClick={(e) => setDraftsMenuAnchor(e.currentTarget)}
        sx={{
          borderColor: "var(--admin-border, #E2E8F0)",
          color: "var(--admin-text, #172B3A)",
          backgroundColor: "#FFFFFF",
          textTransform: "none",
          fontWeight: 500,
          borderRadius: "10px",
          padding: "8px 16px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          "&:hover": {
            borderColor: "var(--admin-border-hover, #CBD5E1)",
            backgroundColor: "var(--admin-bg, #F5F7FA)",
          },
        }}
      >
        <span>Drafts</span>
        {drafts.length > 0 && (
          <Chip
            label={drafts.length}
            size="small"
            sx={{
              ml: 1,
              height: 20,
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "var(--admin-accent-soft, rgba(53, 183, 121, 0.12))",
              color: "var(--admin-accent, #35B779)",
            }}
          />
        )}
      </Button>

      <Menu
        anchorEl={draftsMenuAnchor}
        open={Boolean(draftsMenuAnchor)}
        onClose={() => setDraftsMenuAnchor(null)}
        PaperProps={{
          sx: {
            minWidth: 320,
            maxHeight: 400,
            borderRadius: "12px",
            border: "1px solid var(--admin-border, #E2E8F0)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            p: 1,
          },
        }}
      >
        <div style={{ padding: "8px 12px 6px", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Saved Drafts
        </div>

        {drafts.length === 0 ? (
          <MenuItem disabled sx={{ borderRadius: "8px" }}>
            <ListItemText
              primary="No drafts saved"
              primaryTypographyProps={{ fontSize: 13, color: "#94A3B8" }}
            />
          </MenuItem>
        ) : (
          drafts.map((draft) => (
            <MenuItem
              key={draft.id}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: "8px",
                mb: 0.5,
                p: "10px 12px",
                "&:hover": { backgroundColor: "#F8FAFC" },
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: "#172B3A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {draft.post_title || "Untitled Draft"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                    Last edited: {new Date(draft.updatedAt).toLocaleString()}
                  </div>
                  {draft.category_name && (
                    <div style={{ fontSize: 11, color: "var(--admin-accent, #35B779)", fontWeight: 500, marginTop: 2 }}>
                      {draft.category_name}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 4 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadDraft(draft);
                    }}
                    title="Load Draft"
                    sx={{ color: "var(--admin-primary, #0B4565)", "&:hover": { backgroundColor: "#EBF3F7" } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => deleteDraft(draft.id, e)}
                    title="Delete Draft"
                    sx={{ color: "#EF4444", "&:hover": { backgroundColor: "#FEF2F2" } }}
                  >
                    <DeleteForeverIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default DraftsMenu;