import { useState, useEffect, useCallback } from "react";
import { getImageFromDB, saveImageToDB } from "../utils/indexDB";
import { useNotification } from "../context/useNotificationContext";

/**
 * useDraft — reusable draft hook
 *
 * @param {string} storageKey — unique key per form e.g. "tutorial_drafts" / "blog_drafts"
 * @param {object} options
 *   @param {Function} getFormValues   — getValues from react-hook-form (stable ref, no useEffect needed)
 *   @param {Function} resetForm       — reset from react-hook-form
 *   @param {Function} setFeatureImage — (file) => update UI image preview state
 */
export const useDraft = (storageKey, { getFormValues, resetForm, setFeatureImage }) => {
  const { showNotification } = useNotification();

  const [drafts, setDrafts] = useState([]);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [draftsMenuAnchor, setDraftsMenuAnchor] = useState(null);

  // ─── Load drafts on mount ─────────────────────────────────────────────────
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

  // ─── Persist drafts list ──────────────────────────────────────────────────
  const persistDrafts = useCallback(
    (list) => {
      localStorage.setItem(storageKey, JSON.stringify(list));
      setDrafts(list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    },
    [storageKey],
  );

  // ─── Save draft ───────────────────────────────────────────────────────────
  const saveAsDraft = useCallback(
    async (silent = false) => {
      const currentValues = getFormValues();

      const hasContent =
        currentValues.post_title ||
        currentValues.post_content?.replace(/<(.|\n)*?>/g, "").trim() ||
        currentValues.feature_image;

      if (!hasContent && !currentDraftId) {
        if (!silent) showNotification("No content to save as draft", "info");
        return null;
      }

      let imageId = null;
      if (currentValues.feature_image instanceof File) {
        imageId = await saveImageToDB(currentValues.feature_image);
      } else if (currentValues.feature_image_id) {
        imageId = currentValues.feature_image_id;
      }

      const draft = {
        ...currentValues,
        id: currentDraftId || Date.now().toString(),
        feature_image: undefined,    // never store File in localStorage
        feature_image_id: imageId,
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

  // ─── Load a draft into the form ───────────────────────────────────────────
  const loadDraft = useCallback(
    async (draft) => {
      let featureImageFile = null;
      if (draft.feature_image_id) {
        const file = await getImageFromDB(draft.feature_image_id);
        if (file) featureImageFile = file;
      }

      resetForm({
        post_title: draft.post_title || "",
        post_name: draft.post_name || "",
        category_name: draft.category_name || "",
        category_slug: draft.category_slug || "",
        post_content: draft.post_content || "",
        seo_title: draft.seo_title || "",
        seo_desc: draft.seo_desc || "",
        seo_focus_keyword: draft.seo_focus_keyword || "",
        seo_tags: draft.seo_tags || [],
        author_id: draft.author_id || null,
        feature_image: featureImageFile,
      });

      if (featureImageFile) setFeatureImage(featureImageFile);

      setCurrentDraftId(draft.id);
      setDraftsMenuAnchor(null);
      showNotification("Draft loaded successfully!", "success");
    },
    [resetForm, setFeatureImage, showNotification],
  );

  // ─── Delete a draft ───────────────────────────────────────────────────────
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

  // ─── Clear draft after successful publish ─────────────────────────────────
  const clearCurrentDraft = useCallback(() => {
    if (!currentDraftId) return;
    const updated = drafts.filter((d) => d.id !== currentDraftId);
    persistDrafts(updated);
    setCurrentDraftId(null);
  }, [currentDraftId, drafts, persistDrafts]);

  // ─── Auto-save every 60s ──────────────────────────────────────────────────
  useEffect(() => {
    if (!autoSaveEnabled) return;
    const timer = setInterval(() => {
      const v = getFormValues();
      const hasContent =
        v.post_title ||
        v.post_content?.replace(/<(.|\n)*?>/g, "").trim() ||
        v.feature_image;
      if (hasContent) saveAsDraft(true);
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