import React, { useState, useEffect } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

/**
 * EditableSectionHeader
 * Displays section badge and subtitle matching the reference image styling.
 * When Edit is clicked, provides in-place input fields for heading and subheading
 * with Save, Cancel, validation, and permanent persistence.
 */
export default function EditableSectionHeader({
  sectionId,
  defaultTitle = "",
  defaultSubtitle = "",
  title,
  subtitle,
  onSave,
  editable = false,
  className = "",
}) {
  const displayTitle = title || defaultTitle;
  const displaySubtitle = subtitle !== undefined ? subtitle : defaultSubtitle;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!editable) {
    return (
      <div className={`section-pill-header ${className}`}>
        <span className="section-badge">{displayTitle}</span>
        {displaySubtitle && <p className="section-subtitle">{displaySubtitle}</p>}
      </div>
    );
  }

  useEffect(() => {
    if (isEditing) {
      setEditTitle(displayTitle);
      setEditSubtitle(displaySubtitle);
      setError("");
    }
  }, [isEditing, displayTitle, displaySubtitle]);

  const handleStartEdit = () => {
    setEditTitle(displayTitle);
    setEditSubtitle(displaySubtitle);
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    const trimmedTitle = editTitle.trim();
    const trimmedSubtitle = editSubtitle.trim();

    if (!trimmedTitle) {
      setError("Section heading cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      if (onSave) {
        await onSave(sectionId, trimmedTitle, trimmedSubtitle);
      }
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className={`section-pill-header section-header-editing-box ${className}`} onKeyDown={handleKeyDown}>
        <form className="section-edit-form" onSubmit={handleSave}>
          <div className="section-edit-field">
            <label className="section-edit-label">Section Heading</label>
            <input
              type="text"
              className="section-edit-input section-heading-input"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. 01 · About the Project"
              maxLength={150}
              autoFocus
            />
          </div>

          <div className="section-edit-field">
            <label className="section-edit-label">Section Subheading</label>
            <textarea
              className="section-edit-input section-subheading-input"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              placeholder="e.g. Understand what you'll build and why it matters."
              rows={2}
              maxLength={300}
            />
          </div>

          {error && <span className="section-edit-error">{error}</span>}

          <div className="section-edit-actions">
            <button
              type="submit"
              className="section-edit-save-btn"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner-mini" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheck />
                  <span>Save</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="section-edit-cancel-btn"
              disabled={isSaving}
              onClick={handleCancel}
            >
              <FiX />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`section-pill-header ${className}`}>
      <div className="section-header-title-row">
        <span className="section-badge">{displayTitle}</span>
        <button
          type="button"
          className="section-header-edit-btn"
          onClick={handleStartEdit}
          title="Edit Section Heading & Subheading"
          aria-label={`Edit ${displayTitle}`}
        >
          <FiEdit2 className="edit-pencil-icon" />
          <span className="edit-btn-text">Edit</span>
        </button>
      </div>
      {displaySubtitle && <p className="section-subtitle">{displaySubtitle}</p>}
    </div>
  );
}
