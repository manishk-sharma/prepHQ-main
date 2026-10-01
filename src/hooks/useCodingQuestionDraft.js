import { useState, useEffect, useCallback } from "react";
import { useNotification } from "../context/useNotificationContext";

/**
 * useCodingQuestionDraft — localStorage draft system for the CodingQuestion form.
 *
 * Same API contract as useDraft, but without image/IndexDB handling since
 * coding questions have no file uploads.
 *
 * @param {string} storageKey — e.g. "coding_question_drafts"
 * @param {object} options
 *   @param {Function} getFormValues — getValues() from react-hook-form
 *   @param {Function} resetForm    — reset() from react-hook-form
 */
export const useCodingQuestionDraft = (storageKey, { getFormValues, resetForm }) => {
  const { showNotification } = useNotification();

  const [drafts, setDrafts] = useState([]);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [draftsMenuAnchor, setDraftsMenuAnchor] = useState(null);

  // ── Load drafts on mount ──────────────────────────────────────────────────
  const loadDrafts = useCallback(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const list = JSON.parse(saved);
      setDrafts(list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    }
  }, [storageKey]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  // ── Persist drafts list ───────────────────────────────────────────────────
  const persistDrafts = useCallback(
    (list) => {
      localStorage.setItem(storageKey, JSON.stringify(list));
      setDrafts(list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    },
    [storageKey],
  );

  // ── Save draft ────────────────────────────────────────────────────────────
  const saveAsDraft = useCallback(
    (silent = false) => {
      const currentValues = getFormValues();
      const hasContent = currentValues.title || currentValues.description;

      if (!hasContent && !currentDraftId) {
        if (!silent) showNotification("No content to save as draft", "info");
        return null;
      }

      const draft = {
        ...currentValues,
        id: currentDraftId || Date.now().toString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
      };

      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const idx = existing.findIndex((d) => d.id === draft.id);
      if (idx >= 0) existing[idx] = draft;
      else existing.push(draft);

      persistDrafts(existing);
      setCurrentDraftId(draft.id);

      if (!silent) showNotification("Draft saved successfully!", "success");
      return draft.id;
    },
    [currentDraftId, getFormValues, showNotification, storageKey, persistDrafts],
  );

  // ── Load a draft into the form ────────────────────────────────────────────
  const loadDraft = useCallback(
    (draft) => {
      resetForm({
        title:       draft.title       || "",
        slug:        draft.slug        || "",
        difficulty:  draft.difficulty  || "",
        domain:      draft.domain      || "",
        topics:      draft.topics      || [],
        description: draft.description || "",
        examples: draft.examples?.length
          ? draft.examples
          : [{ input: "", output: "", explanation: "" }],
        constraints: draft.constraints?.length
          ? draft.constraints
          : [{ value: "" }],
        starterCode: draft.starterCode || {
          javascript: "", python: "", java: "", cpp: "",
        },
        entry_point: draft.entry_point || "",
        param_order: draft.param_order || [],
        testcases: draft.testcases?.length
          ? draft.testcases
          : [{ params: [{ key: "", value: "" }], expected_output: "" }],
      });

      setCurrentDraftId(draft.id);
      setDraftsMenuAnchor(null);
      showNotification("Draft loaded successfully!", "success");
    },
    [resetForm, showNotification],
  );

  // ── Delete a draft ────────────────────────────────────────────────────────
  const deleteDraft = useCallback(
    (draftId, event) => {
      event?.stopPropagation();
      const updated = drafts.filter((d) => d.id !== draftId);
      persistDrafts(updated);
      if (currentDraftId === draftId) setCurrentDraftId(null);
      showNotification("Draft deleted!", "info");
    },
    [drafts, currentDraftId, persistDrafts, showNotification],
  );

  // ── Clear draft after successful publish ──────────────────────────────────
  const clearCurrentDraft = useCallback(() => {
    if (!currentDraftId) return;
    const updated = drafts.filter((d) => d.id !== currentDraftId);
    persistDrafts(updated);
    setCurrentDraftId(null);
  }, [currentDraftId, drafts, persistDrafts]);

  // ── Auto-save every 60s ───────────────────────────────────────────────────
  useEffect(() => {
    if (!autoSaveEnabled) return;
    const timer = setInterval(() => {
      const v = getFormValues();
      if (v.title || v.description) saveAsDraft(true);
    }, 60000);
    return () => clearInterval(timer);
  }, [autoSaveEnabled, getFormValues, saveAsDraft]);

  return {
    drafts,
    currentDraftId,
    autoSaveEnabled,
    setAutoSaveEnabled,
    draftsMenuAnchor,
    setDraftsMenuAnchor,
    saveAsDraft,
    loadDraft,
    deleteDraft,
    clearCurrentDraft,
  };
};
