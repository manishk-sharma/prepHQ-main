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
  technical_learnings: parseJsonField(row.technical_learnings, []),
  practical_learnings: parseJsonField(row.practical_learnings, []),
  common_mistakes: parseJsonField(row.common_mistakes, []),
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

// ── Create Project Details (Admin) ───────────────────────────────────────────
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
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ status: 0, message: 'Title and slug are required.' });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-');

    const result = await query(
      `INSERT INTO project_details (
        project_id, slug, title, subtitle, level, duration, domain, project_type,
        about_text_1, about_text_2, about_text_3,
        prerequisites, objectives, architecture_steps, architecture_details,
        implementation_steps, technologies, dataset_resources,
        technical_learnings, practical_learnings, common_mistakes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        JSON.stringify(dataset_resources || []),
        JSON.stringify(technical_learnings || []),
        JSON.stringify(practical_learnings || []),
        JSON.stringify(common_mistakes || []),
      ]
    );

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
    } = req.body;

    if (!slugOrId) {
      return res.status(400).json({ status: 0, message: 'Identifier is required.' });
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
           common_mistakes = COALESCE(?, common_mistakes)
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
        dataset_resources !== undefined ? JSON.stringify(dataset_resources) : null,
        technical_learnings !== undefined ? JSON.stringify(technical_learnings) : null,
        practical_learnings !== undefined ? JSON.stringify(practical_learnings) : null,
        common_mistakes !== undefined ? JSON.stringify(common_mistakes) : null,
        slugOrId,
      ]
    );

    return res.status(200).json({
      status: 1,
      message: 'Project details updated successfully.',
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
};
