import { query } from '../config/db.js';

// ── GET All Jobs ──────────────────────────────────────────────────────────────
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await query(
      `SELECT id, position, company, min_year, max_year, location, deadline, description, date_posted, apply_link
       FROM jobs
       ORDER BY id DESC`
    );

    const formattedJobs = jobs.map((job) => ({
      ...job,
      experience: {
        min: job.min_year ?? 0,
        max: job.max_year ?? 0,
      },
    }));

    return res.status(200).json({
      success: true,
      status: true,
      data: formattedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET Single Job ────────────────────────────────────────────────────────────
export const getJobById = async (req, res, next) => {
  try {
    const id = req.query.id || req.params.id;

    if (!id) {
      return res.status(400).json({ status: false, error: 'Job ID is required.' });
    }

    const jobs = await query(
      `SELECT id, position, company, min_year, max_year, location, deadline, description, date_posted, apply_link
       FROM jobs
       WHERE id = ? LIMIT 1`,
      [id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ status: false, error: 'Job not found.' });
    }

    const job = jobs[0];
    job.experience = {
      min: job.min_year ?? 0,
      max: job.max_year ?? 0,
    };

    return res.status(200).json({
      status: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllJobs,
  getJobById,
};
