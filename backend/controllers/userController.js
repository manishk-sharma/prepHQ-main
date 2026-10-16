import { query } from '../config/db.js';

// ── GET Current User Profile ──────────────────────────────────────────────────
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: false, error: 'User not authenticated.' });
    }

    const users = await query(
      `SELECT id, name, lastname, username, email, status, created_date,
              profile_image, resume, resume_date, phone, country, bio, github, linkedin
       FROM user WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ status: false, error: 'User not found.' });
    }

    const user = users[0];
    return res.status(200).json({
      status: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Profile ────────────────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: 0, error: 'User not authenticated.' });
    }

    const { name, lastname, phone, country, bio, github, linkedin } = req.body;

    await query(
      `UPDATE user
       SET name = COALESCE(?, name),
           lastname = COALESCE(?, lastname),
           phone = COALESCE(?, phone),
           country = COALESCE(?, country),
           bio = COALESCE(?, bio),
           github = COALESCE(?, github),
           linkedin = COALESCE(?, linkedin)
       WHERE id = ?`,
      [name, lastname, phone, country, bio, github, linkedin, userId]
    );

    const updatedUsers = await query(
      `SELECT id, name, lastname, username, email, status, created_date,
              profile_image, resume, resume_date, phone, country, bio, github, linkedin
       FROM user WHERE id = ? LIMIT 1`,
      [userId]
    );

    return res.status(200).json({
      status: 1,
      message: 'Profile updated successfully.',
      user: updatedUsers[0],
    });
  } catch (error) {
    next(error);
  }
};

// ── Upload Profile Image ──────────────────────────────────────────────────────
export const uploadProfileImage = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: 'error', error: 'User not authenticated.' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 'error', error: 'No image file uploaded.' });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    await query('UPDATE user SET profile_image = ? WHERE id = ?', [imageUrl, userId]);

    return res.status(200).json({
      status: 'success',
      image: imageUrl,
      message: 'Profile image updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Upload Resume ─────────────────────────────────────────────────────────────
export const uploadResume = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: 'error', error: 'User not authenticated.' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 'error', error: 'No resume file uploaded.' });
    }

    const filename = req.file.filename;
    const resumeUrl = `/uploads/resumes/${filename}`;
    const resumeDate = new Date();

    await query(
      'UPDATE user SET resume = ?, resume_date = ? WHERE id = ?',
      [filename, resumeDate, userId]
    );

    return res.status(200).json({
      status: 'success',
      resume: filename,
      resume_url: resumeUrl,
      resume_date: resumeDate.toISOString(),
      message: 'Resume uploaded successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Resume ─────────────────────────────────────────────────────────────
export const deleteResume = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: 'error', error: 'User not authenticated.' });
    }

    await query('UPDATE user SET resume = NULL, resume_date = NULL WHERE id = ?', [userId]);

    return res.status(200).json({
      status: 'success',
      message: 'Resume deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserProfile,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  deleteResume,
};
