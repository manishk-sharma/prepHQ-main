import { query } from '../config/db.js';

// ── Helper: Safe JSON Parser ────────────────────────────────────────────────
const parseJsonField = (val, fallback = null) => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val;
  try {
    const parsed = JSON.parse(val);
    return parsed !== null ? parsed : fallback;
  } catch {
    return fallback;
  }
};

// ── Helper: Format Interview Detail Row ─────────────────────────────────────
const formatInterviewDetail = (row) => {
  if (!row) return null;

  const secHeaders = parseJsonField(row.section_headers, {});
  const secOrder = parseJsonField(row.sections_order, [
    'must-know',
    'questions-answers',
    'scenario-based',
    'coding-questions',
    'common-mistakes',
    'quick-revision',
  ]);

  return {
    id: row.id,
    interview_id: row.interview_id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description || '',
    author: row.author || 'PrepHQ Editorial Team',
    publication_date: row.publication_date || '',
    status: row.status || 'published',
    level: row.level || 'All Levels',
    domain: row.domain || 'Machine Learning',
    seo_title: row.seo_title || '',
    meta_description: row.meta_description || '',
    keywords: row.keywords || '',
    must_know_questions: parseJsonField(row.must_know_questions, []),
    qa_questions: parseJsonField(row.qa_questions, []),
    scenario_questions: parseJsonField(row.scenario_questions, []),
    coding_questions: parseJsonField(row.coding_questions, []),
    common_mistakes: parseJsonField(row.common_mistakes, []),
    quick_revision: parseJsonField(row.quick_revision, []),
    section_headers: secHeaders,
    sectionHeaders: secHeaders,
    sections_order: secOrder,
    sectionsOrder: secOrder,
    sidebar_cards: parseJsonField(row.sidebar_cards, {
      related_interviews: [],
      tutorials: [],
      mini_guides: [],
    }),
    sidebarCards: parseJsonField(row.sidebar_cards, {
      related_interviews: [],
      tutorials: [],
      mini_guides: [],
    }),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

// ── Get All Interview Details (Admin / Selector) ────────────────────────────
export const getAllInterviewDetails = async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT id, interview_id, slug, title, subtitle, status, level, domain, updated_at
      FROM interview_details
      ORDER BY updated_at DESC
    `);

    return res.status(200).json({
      status: 1,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Interview Details by Slug or ID ──────────────────────────────
export const getInterviewDetailsBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    if (!slugOrId) {
      return res.status(400).json({ status: 0, error: 'Identifier is required.' });
    }

    const isNumeric = /^\d+$/.test(slugOrId);
    const sql = isNumeric
      ? 'SELECT * FROM interview_details WHERE id = ? OR interview_id = ? LIMIT 1'
      : 'SELECT * FROM interview_details WHERE slug = ? LIMIT 1';

    const params = isNumeric ? [slugOrId, slugOrId] : [slugOrId];
    const rows = await query(sql, params);

    if (rows.length === 0) {
      // Fallback: If specific slug not found, return first record
      const fallback = await query('SELECT * FROM interview_details LIMIT 1');
      if (fallback.length > 0) {
        return res.status(200).json({
          status: 1,
          data: formatInterviewDetail(fallback[0]),
          isFallback: true,
        });
      }
      return res.status(404).json({ status: 0, error: 'Interview page not found.' });
    }

    return res.status(200).json({
      status: 1,
      data: formatInterviewDetail(rows[0]),
    });
  } catch (error) {
    next(error);
  }
};

// ── Create Interview Details (Admin) ────────────────────────────────────────
export const createInterviewDetails = async (req, res, next) => {
  try {
    const {
      interview_id,
      slug,
      title,
      subtitle,
      description,
      author,
      publication_date,
      status,
      level,
      domain,
      seo_title,
      meta_description,
      keywords,
      must_know_questions,
      qa_questions,
      scenario_questions,
      coding_questions,
      common_mistakes,
      quick_revision,
      section_headers,
      sections_order,
      sidebar_cards,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ status: 0, message: 'Title is required.' });
    }

    const rawSlug = slug && slug.trim()
      ? slug.trim()
      : title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

    const cleanSlug = rawSlug || `interview-${Date.now()}`;

    // Verify slug uniqueness
    const existing = await query('SELECT id FROM interview_details WHERE slug = ? LIMIT 1', [cleanSlug]);
    if (existing.length > 0) {
      return res.status(409).json({
        status: 0,
        message: `An interview page with slug "${cleanSlug}" already exists.`,
      });
    }

    const result = await query(
      `INSERT INTO interview_details (
        interview_id, slug, title, subtitle, description, author, publication_date,
        status, level, domain, seo_title, meta_description, keywords,
        must_know_questions, qa_questions, scenario_questions,
        coding_questions, common_mistakes, quick_revision,
        section_headers, sections_order, sidebar_cards
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        interview_id || null,
        cleanSlug,
        title.trim(),
        subtitle || '',
        description || '',
        author || 'PrepHQ Editorial Team',
        publication_date || '',
        status || 'published',
        level || 'All Levels',
        domain || 'Machine Learning',
        seo_title || '',
        meta_description || '',
        keywords || '',
        JSON.stringify(must_know_questions || []),
        JSON.stringify(qa_questions || []),
        JSON.stringify(scenario_questions || []),
        JSON.stringify(coding_questions || []),
        JSON.stringify(common_mistakes || []),
        JSON.stringify(quick_revision || []),
        JSON.stringify(section_headers || {}),
        JSON.stringify(sections_order || []),
        JSON.stringify(sidebar_cards || {}),
      ]
    );

    return res.status(201).json({
      status: 1,
      message: 'Interview page created successfully.',
      data: { id: result.insertId, slug: cleanSlug },
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Interview Details (Admin) ────────────────────────────────────────
export const updateInterviewDetails = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const {
      interview_id,
      slug,
      title,
      subtitle,
      description,
      author,
      publication_date,
      status,
      level,
      domain,
      seo_title,
      meta_description,
      keywords,
      must_know_questions,
      qa_questions,
      scenario_questions,
      coding_questions,
      common_mistakes,
      quick_revision,
      section_headers,
      sections_order,
      sidebar_cards,
    } = req.body;

    if (!slugOrId) {
      return res.status(400).json({ status: 0, message: 'Identifier is required.' });
    }

    let sanitizedQuickRevision = undefined;
    if (quick_revision !== undefined) {
      if (!Array.isArray(quick_revision)) {
        return res.status(400).json({ status: 0, message: 'quick_revision must be an array.' });
      }
      if (quick_revision.length > 2000) {
        return res.status(400).json({ status: 0, message: 'quick_revision cannot exceed 2000 items.' });
      }
      sanitizedQuickRevision = quick_revision.map((item, idx) => ({
        id: item && item.id ? String(item.id).slice(0, 100) : `rev-${idx + 1}-${Date.now()}`,
        concept: String((item && item.concept) || '').trim().slice(0, 500),
        explanation: String((item && item.explanation) || '').trim().slice(0, 10000),
      }));
    }

    const isNumeric = /^\d+$/.test(slugOrId);
    const whereClause = isNumeric ? 'WHERE id = ?' : 'WHERE slug = ?';

    await query(
      `UPDATE interview_details
       SET interview_id = COALESCE(?, interview_id),
           slug = COALESCE(?, slug),
           title = COALESCE(?, title),
           subtitle = COALESCE(?, subtitle),
           description = COALESCE(?, description),
           author = COALESCE(?, author),
           publication_date = COALESCE(?, publication_date),
           status = COALESCE(?, status),
           level = COALESCE(?, level),
           domain = COALESCE(?, domain),
           seo_title = COALESCE(?, seo_title),
           meta_description = COALESCE(?, meta_description),
           keywords = COALESCE(?, keywords),
           must_know_questions = COALESCE(?, must_know_questions),
           qa_questions = COALESCE(?, qa_questions),
           scenario_questions = COALESCE(?, scenario_questions),
           coding_questions = COALESCE(?, coding_questions),
           common_mistakes = COALESCE(?, common_mistakes),
           quick_revision = COALESCE(?, quick_revision),
           section_headers = COALESCE(?, section_headers),
           sections_order = COALESCE(?, sections_order),
           sidebar_cards = COALESCE(?, sidebar_cards)
       ${whereClause}`,
      [
        interview_id ?? null,
        slug ?? null,
        title ?? null,
        subtitle ?? null,
        description ?? null,
        author ?? null,
        publication_date ?? null,
        status ?? null,
        level ?? null,
        domain ?? null,
        seo_title ?? null,
        meta_description ?? null,
        keywords ?? null,
        must_know_questions !== undefined ? JSON.stringify(must_know_questions) : null,
        qa_questions !== undefined ? JSON.stringify(qa_questions) : null,
        scenario_questions !== undefined ? JSON.stringify(scenario_questions) : null,
        coding_questions !== undefined ? JSON.stringify(coding_questions) : null,
        common_mistakes !== undefined ? JSON.stringify(common_mistakes) : null,
        sanitizedQuickRevision !== undefined ? JSON.stringify(sanitizedQuickRevision) : null,
        (section_headers !== undefined || req.body.sectionHeaders !== undefined)
          ? JSON.stringify(section_headers !== undefined ? section_headers : req.body.sectionHeaders)
          : null,
        (sections_order !== undefined || req.body.sectionsOrder !== undefined)
          ? JSON.stringify(sections_order !== undefined ? sections_order : req.body.sectionsOrder)
          : null,
        (sidebar_cards !== undefined || req.body.sidebarCards !== undefined)
          ? JSON.stringify(sidebar_cards !== undefined ? sidebar_cards : req.body.sidebarCards)
          : null,
        slugOrId,
      ]
    );

    const updatedRows = await query(
      isNumeric ? 'SELECT * FROM interview_details WHERE id = ? LIMIT 1' : 'SELECT * FROM interview_details WHERE slug = ? LIMIT 1',
      [slug || slugOrId]
    );

    return res.status(200).json({
      status: 1,
      message: 'Interview page updated successfully.',
      data: updatedRows.length > 0 ? formatInterviewDetail(updatedRows[0]) : null,
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Interview Details (Admin) ────────────────────────────────────────
export const deleteInterviewDetails = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    if (!slugOrId) {
      return res.status(400).json({ status: 0, message: 'Identifier is required.' });
    }

    const isNumeric = /^\d+$/.test(slugOrId);
    const sql = isNumeric
      ? 'DELETE FROM interview_details WHERE id = ?'
      : 'DELETE FROM interview_details WHERE slug = ?';

    const result = await query(sql, [slugOrId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 0, message: 'Interview page not found.' });
    }

    return res.status(200).json({
      status: 1,
      message: 'Interview page deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
