import React from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemText,
  IconButton,
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
  drafts,
  draftsMenuAnchor,
  setDraftsMenuAnchor,
  loadDraft,
  deleteDraft,
}) => {
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DraftsIcon />}
        onClick={(e) => setDraftsMenuAnchor(e.currentTarget)}
        sx={{
          borderColor: "#ff9800",
          color: "#ff9800",
          textTransform: "none",
          fontWeight: 500,
          "&:hover": { borderColor: "#f57c00", backgroundColor: "#fff8e1" },
        }}
      >
        Drafts {drafts.length > 0 && `(${drafts.length})`}
      </Button>

      <Menu
        anchorEl={draftsMenuAnchor}
        open={Boolean(draftsMenuAnchor)}
        onClose={() => setDraftsMenuAnchor(null)}
        PaperProps={{ sx: { minWidth: 300, maxHeight: 400 } }}
      >
        {drafts.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No drafts saved" />
          </MenuItem>
        ) : (
          drafts.map((draft) => (
            <MenuItem
              key={draft.id}
              sx={{ flexDirection: "column", alignItems: "flex-start" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    {draft.post_title || "Untitled Draft"}
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    Last edited: {new Date(draft.updatedAt).toLocaleString()}
                  </div>
                  {draft.category_name && (
                    <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                      Category: {draft.category_name}
                    </div>
                  )}
                </div>

                <div>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadDraft(draft);
                    }}
                    title="Load Draft"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => deleteDraft(draft.id, e)}
                    title="Delete Draft"
                    sx={{ color: "#d32f2f" }}
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