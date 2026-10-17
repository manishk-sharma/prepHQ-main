import { query } from '../config/db.js';

const parseJsonField = (val, fallback = null) => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const formatProjectDetail = (row) => ({
  id: row.id,
  project_id: row.project_id,
  slug: row.slug,
  title: row.title,
  subtitle: row.subtitle,
  level: row.level || 'Intermediate',
  duration: row.duration || '8–12 Hours',
  domain: row.domain || 'Data Science',
  project_type: row.project_type || 'Machine Learning',
  about_text_1: row.about_text_1 || '',
  about_text_2: row.about_text_2 || '',
  about_text_3: row.about_text_3 || '',
  prerequisites: parseJsonField(row.prerequisites, {
    programming: [],
    data: [],
    statistics: [],
    machineLearning: [],
  }),
  objectives: parseJsonField(row.objectives, []),
  architecture_steps: parseJsonField(row.architecture_steps, []),
  architecture_details: parseJsonField(row.architecture_details, []),
  implementation_steps: parseJsonField(row.implementation_steps, []),
  technologies: parseJsonField(row.technologies, []),
  dataset_resources: parseJsonField(row.dataset_resources, []),
  datasetResources: parseJsonField(row.dataset_resources, []),
  technical_learnings: parseJsonField(row.technical_learnings, []),
  technicalLearnings: parseJsonField(row.technical_learnings, []),
  practical_learnings: parseJsonField(row.practical_learnings, []),
  practicalLearnings: parseJsonField(row.practical_learnings, []),
  common_mistakes: parseJsonField(row.common_mistakes, []),
  commonMistakes: parseJsonField(row.common_mistakes, []),
  section_headers: parseJsonField(row.section_headers, {}),
  sectionHeaders: parseJsonField(row.section_headers, {}),
  section_2_design: row.section_2_design || parseJsonField(row.section_headers, {})?.section_2_design || 'grid',
  sidebar_cards: parseJsonField(row.sidebar_cards, {
    related_projects: [],
    tutorials: [],
    mini_guides: [],
  }),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// ── GET List of All Project Details (summary for selector) ───────────────────
export const getAllProjectDetails = async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT id, project_id, slug, title, level, domain, project_type, duration, updated_at
      FROM project_details
      ORDER BY id DESC
    `);

    return res.status(200).json({
      status: 1,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET Single Project Details by Slug or ID ─────────────────────────────────
export const getProjectDetailsBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    if (!slugOrId) {
      return res.status(400).json({ status: 0, error: 'Identifier is required.' });
    }

    const isNumeric = /^\d+$/.test(slugOrId);
    const sql = isNumeric
      ? 'SELECT * FROM project_details WHERE id = ? OR project_id = ? LIMIT 1'
      : 'SELECT * FROM project_details WHERE slug = ? LIMIT 1';

    const params = isNumeric ? [slugOrId, slugOrId] : [slugOrId];
    const rows = await query(sql, params);

    if (rows.length === 0) {
      // Fallback: If not found, check if slug is default or return first record
      const fallback = await query('SELECT * FROM project_details LIMIT 1');
      if (fallback.length > 0) {
        return res.status(200).json({
          status: 1,
          data: formatProjectDetail(fallback[0]),
          isFallback: true,
        });
      }
      return res.status(404).json({ status: 0, error: 'Project details not found.' });
    }

    return res.status(200).json({
      status: 1,
      data: formatProjectDetail(rows[0]),
    });
  } catch (error) {
    next(error);
  }
};

// ── Sync project_sidebar_cards table ──────────────────────────────────────────
export const syncSidebarCardsTable = async (projectId, projectSlug, sidebarCards) => {
  if (!sidebarCards || typeof sidebarCards !== 'object') return;
  try {
    const rel = Array.isArray(sidebarCards.related_projects) ? sidebarCards.related_projects : [];
    const tut = Array.isArray(sidebarCards.tutorials) ? sidebarCards.tutorials : [];
    const mng = Array.isArray(sidebarCards.mini_guides) ? sidebarCards.mini_guides : [];

    const allCards = [
      ...rel.map((c, i) => ({ ...c, section_type: 'related_project', display_order: c.display_order ?? i + 1 })),
      ...tut.map((c, i) => ({ ...c, section_type: 'tutorial', display_order: c.display_order ?? i + 1 })),
      ...mng.map((c, i) => ({ ...c, section_type: 'mini_guide', display_order: c.display_order ?? i + 1 })),
    ];

    const currentCardIds = allCards.map((c) => c.id).filter(Boolean);
    if (currentCardIds.length > 0) {
      await query(
        `DELETE FROM project_sidebar_cards WHERE project_slug = ? AND card_id NOT IN (?)`,
        [projectSlug, currentCardIds]
      );
    } else {
      await query(`DELETE FROM project_sidebar_cards WHERE project_slug = ?`, [projectSlug]);
    }

    for (const c of allCards) {
      const cardId = c.id || `${c.section_type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const isAct = (c.status === 'inactive' || c.is_active === false) ? 0 : 1;
      const status = isAct ? 'active' : 'inactive';
      const destUrl = c.destination_url || c.link || '';
      const dateStr = c.display_date || c.date || '05 Aug, 2025';

      await query(
        `INSERT INTO project_sidebar_cards 
         (card_id, project_id, project_slug, section_type, title, display_date, destination_url, linked_resource, display_order, status, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           project_id = VALUES(project_id),
           section_type = VALUES(section_type),
           title = VALUES(title),
           display_date = VALUES(display_date),
           destination_url = VALUES(destination_url),
           linked_resource = VALUES(linked_resource),
           display_order = VALUES(display_order),
           status = VALUES(status),
           is_active = VALUES(is_active)`,
        [
          cardId,
          projectId || null,
          projectSlug,
          c.section_type,
          c.title || '',
          dateStr,
          destUrl,
          c.linked_resource || '',
          c.display_order || 0,
          status,
          isAct,
        ]
      );
    }
  } catch (err) {
    console.error('Error in syncSidebarCardsTable:', err);
  }
};

// ── Create New Project Details (Admin) ────────────────────────────────────────
export const createProjectDetails = async (req, res, next) => {
  try {
    const {
      project_id,
      slug,
      title,
      subtitle,
      level,
      duration,
      domain,
      project_type,
      about_text_1,
      about_text_2,
      about_text_3,
      prerequisites,
      objectives,
      architecture_steps,
      architecture_details,
      implementation_steps,
      technologies,
      dataset_resources,
      technical_learnings,
      practical_learnings,
      common_mistakes,
      section_headers,
      section_2_design,
      sidebar_cards,
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ status: 0, message: 'Title and slug are required.' });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-');
    const validSection2Design = ['grid', 'single_column'].includes(section_2_design)
      ? section_2_design
      : 'grid';

    const result = await query(
      `INSERT INTO project_details (
        project_id, slug, title, subtitle, level, duration, domain, project_type,
        about_text_1, about_text_2, about_text_3,
        prerequisites, objectives, architecture_steps, architecture_details,
        implementation_steps, technologies, dataset_resources,
        technical_learnings, practical_learnings, common_mistakes, section_headers,
        section_2_design, sidebar_cards
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id || null,
        cleanSlug,
        title.trim(),
        subtitle || '',
        level || 'Intermediate',
        duration || '8–12 Hours',
        domain || 'Data Science',
        project_type || 'Machine Learning',
        about_text_1 || '',
        about_text_2 || '',
        about_text_3 || '',
        JSON.stringify(prerequisites || {}),
        JSON.stringify(objectives || []),
        JSON.stringify(architecture_steps || []),
        JSON.stringify(architecture_details || []),
        JSON.stringify(implementation_steps || []),
        JSON.stringify(technologies || []),
        JSON.stringify(dataset_resources || req.body.datasetResources || []),
        JSON.stringify(technical_learnings || req.body.technicalLearnings || []),
        JSON.stringify(practical_learnings || req.body.practicalLearnings || []),
        JSON.stringify(common_mistakes || req.body.commonMistakes || []),
        JSON.stringify(section_headers || req.body.sectionHeaders || {}),
        validSection2Design,
        JSON.stringify(sidebar_cards || {}),
      ]
    );

    if (sidebar_cards) {
      await syncSidebarCardsTable(result.insertId, cleanSlug, sidebar_cards);
    }

    return res.status(201).json({
      status: 1,
      message: 'Project details created successfully.',
      data: { id: result.insertId, slug: cleanSlug },
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Project Details (Admin) ───────────────────────────────────────────
export const updateProjectDetails = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const {
      project_id,
      slug,
      title,
      subtitle,
      level,
      duration,
      domain,
      project_type,
      about_text_1,
      about_text_2,
      about_text_3,
      prerequisites,
      objectives,
      architecture_steps,
      architecture_details,
      implementation_steps,
      technologies,
      dataset_resources,
      technical_learnings,
      practical_learnings,
      common_mistakes,
      section_headers,
      section_2_design,
    } = req.body;

    if (!slugOrId) {
      return res.status(400).json({ status: 0, message: 'Identifier is required.' });
    }

    if (section_2_design !== undefined && !['grid', 'single_column'].includes(section_2_design)) {
      return res.status(400).json({
        status: 0,
        message: 'Invalid section_2_design. Must be "grid" or "single_column".',
      });
    }

    const isNumeric = /^\d+$/.test(slugOrId);
    const whereClause = isNumeric ? 'WHERE id = ?' : 'WHERE slug = ?';

    await query(
      `UPDATE project_details
       SET project_id = COALESCE(?, project_id),
           slug = COALESCE(?, slug),
           title = COALESCE(?, title),
           subtitle = COALESCE(?, subtitle),
           level = COALESCE(?, level),
           duration = COALESCE(?, duration),
           domain = COALESCE(?, domain),
           project_type = COALESCE(?, project_type),
           about_text_1 = COALESCE(?, about_text_1),
           about_text_2 = COALESCE(?, about_text_2),
           about_text_3 = COALESCE(?, about_text_3),
           prerequisites = COALESCE(?, prerequisites),
           objectives = COALESCE(?, objectives),
           architecture_steps = COALESCE(?, architecture_steps),
           architecture_details = COALESCE(?, architecture_details),
           implementation_steps = COALESCE(?, implementation_steps),
           technologies = COALESCE(?, technologies),
           dataset_resources = COALESCE(?, dataset_resources),
           technical_learnings = COALESCE(?, technical_learnings),
           practical_learnings = COALESCE(?, practical_learnings),
           common_mistakes = COALESCE(?, common_mistakes),
           section_headers = COALESCE(?, section_headers),
           section_2_design = COALESCE(?, section_2_design),
           sidebar_cards = COALESCE(?, sidebar_cards)
       ${whereClause}`,
      [
        project_id ?? null,
        slug ?? null,
        title ?? null,
        subtitle ?? null,
        level ?? null,
        duration ?? null,
        domain ?? null,
        project_type ?? null,
        about_text_1 ?? null,
        about_text_2 ?? null,
        about_text_3 ?? null,
        prerequisites !== undefined ? JSON.stringify(prerequisites) : null,
        objectives !== undefined ? JSON.stringify(objectives) : null,
        architecture_steps !== undefined ? JSON.stringify(architecture_steps) : null,
        architecture_details !== undefined ? JSON.stringify(architecture_details) : null,
        implementation_steps !== undefined ? JSON.stringify(implementation_steps) : null,
        technologies !== undefined ? JSON.stringify(technologies) : null,
        (dataset_resources !== undefined || req.body.datasetResources !== undefined)
          ? JSON.stringify(dataset_resources !== undefined ? dataset_resources : req.body.datasetResources)
          : null,
        (technical_learnings !== undefined || req.body.technicalLearnings !== undefined)
          ? JSON.stringify(technical_learnings !== undefined ? technical_learnings : req.body.technicalLearnings)
          : null,
        (practical_learnings !== undefined || req.body.practicalLearnings !== undefined)
          ? JSON.stringify(practical_learnings !== undefined ? practical_learnings : req.body.practicalLearnings)
          : null,
        (common_mistakes !== undefined || req.body.commonMistakes !== undefined)
          ? JSON.stringify(common_mistakes !== undefined ? common_mistakes : req.body.commonMistakes)
          : null,
        (section_headers !== undefined || req.body.sectionHeaders !== undefined)
          ? JSON.stringify(section_headers !== undefined ? section_headers : req.body.sectionHeaders)
          : null,
        section_2_design ?? null,
        req.body.sidebar_cards !== undefined ? JSON.stringify(req.body.sidebar_cards) : null,
        slugOrId,
      ]
    );

    if (req.body.sidebar_cards !== undefined) {
      const pRows = await query(`SELECT id, slug FROM project_details ${whereClause} LIMIT 1`, [slugOrId]);
      if (pRows.length > 0) {
        await syncSidebarCardsTable(pRows[0].id, pRows[0].slug, req.body.sidebar_cards);
      }
    }

    return res.status(200).json({
      status: 1,
      message: 'Project details updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ── GET Sidebar Cards for a Project ──────────────────────────────────────────
export const getSidebarCards = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const isNumeric = /^\d+$/.test(slugOrId);
    const sql = isNumeric
      ? 'SELECT id, slug, sidebar_cards FROM project_details WHERE id = ? OR project_id = ? LIMIT 1'
      : 'SELECT id, slug, sidebar_cards FROM project_details WHERE slug = ? LIMIT 1';
    const rows = await query(sql, [slugOrId]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 0, message: 'Project not found.' });
    }
    const cards = parseJsonField(rows[0].sidebar_cards, {
      related_projects: [],
      tutorials: [],
      mini_guides: [],
    });
    return res.status(200).json({ status: 1, data: cards });
  } catch (error) {
    next(error);
  }
};

// ── UPDATE Sidebar Cards for a Project ───────────────────────────────────────
export const updateSidebarCards = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const { sidebar_cards } = req.body;
    if (!sidebar_cards || typeof sidebar_cards !== 'object') {
      return res.status(400).json({ status: 0, message: 'sidebar_cards object is required.' });
    }

    const isNumeric = /^\d+$/.test(slugOrId);
    const whereClause = isNumeric ? 'WHERE id = ? OR project_id = ?' : 'WHERE slug = ?';
    const rows = await query(`SELECT id, slug FROM project_details ${whereClause} LIMIT 1`, [slugOrId]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 0, message: 'Project not found.' });
    }

    const project = rows[0];
    await query(`UPDATE project_details SET sidebar_cards = ? WHERE id = ?`, [
      JSON.stringify(sidebar_cards),
      project.id,
    ]);

    await syncSidebarCardsTable(project.id, project.slug, sidebar_cards);

    return res.status(200).json({
      status: 1,
      message: 'Sidebar content updated successfully.',
      data: sidebar_cards,
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Project Details (Admin) ───────────────────────────────────────────
export const deleteProjectDetails = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const isNumeric = /^\d+$/.test(slugOrId);
    const sql = isNumeric ? 'DELETE FROM project_details WHERE id = ?' : 'DELETE FROM project_details WHERE slug = ?';

    await query(sql, [slugOrId]);

    return res.status(200).json({
      status: 1,
      message: 'Project details deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProjectDetails,
  getProjectDetailsBySlug,
  createProjectDetails,
  updateProjectDetails,
  deleteProjectDetails,
  getSidebarCards,
  updateSidebarCards,
  syncSidebarCardsTable,
};
