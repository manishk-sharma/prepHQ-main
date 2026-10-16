import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'prephq_jwt_dev_secret_key_8f3d99e';

// Helper to verify or auto-upgrade legacy plain-text password to bcrypt
const verifyAndUpgradePassword = async (tableName, id, candidatePassword, storedPassword) => {
  if (!storedPassword) return false;

  const isBcrypt = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');
  if (isBcrypt) {
    return await bcrypt.compare(candidatePassword, storedPassword);
  }

  // Legacy plain-text check
  if (candidatePassword === storedPassword) {
    // Seamlessly upgrade legacy password to bcrypt
    try {
      const hashed = await bcrypt.hash(candidatePassword, 10);
      await query(`UPDATE ${tableName} SET password = ? WHERE id = ?`, [hashed, id]);
    } catch (err) {
      console.warn('Failed to upgrade legacy password:', err.message);
    }
    return true;
  }

  return false;
};

// ── User Login ────────────────────────────────────────────────────────────────
export const loginUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ status: false, message: 'Email/username and password are required.' });
    }

    const users = await query(
      'SELECT * FROM user WHERE email = ? OR username = ? LIMIT 1',
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(404).json({ status: false, message: 'User not found.' });
    }

    const user = users[0];
    const isMatch = await verifyAndUpgradePassword('user', user.id, password, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      lastname: user.lastname || '',
      username: user.username,
      email: user.email,
      status: user.status,
      created_date: user.created_date,
      profile_image: user.profile_image || 'default.png',
      resume: user.resume || null,
      resume_date: user.resume_date || null,
      phone: user.phone || null,
      country: user.country || null,
      bio: user.bio || null,
      github: user.github || null,
      linkedin: user.linkedin || null,
      token,
    };

    return res.status(200).json({
      status: 200,
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

// ── User Register ─────────────────────────────────────────────────────────────
export const registerUser = async (req, res, next) => {
  try {
    const { name, lastname, username, email, password, phone, country } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: false, message: 'Name, email, and password are required.' });
    }

    const generatedUsername = (username || email.split('@')[0] + Math.floor(Math.random() * 1000)).trim();

    // Check existing email or username
    const existing = await query(
      'SELECT id, email, username FROM user WHERE email = ? OR username = ? LIMIT 1',
      [email.trim(), generatedUsername]
    );

    if (existing.length > 0) {
      const isEmail = existing[0].email.toLowerCase() === email.trim().toLowerCase();
      return res.status(400).json({
        status: false,
        message: isEmail ? 'Email already registered.' : 'Username already taken.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await query(
      `INSERT INTO user (name, lastname, username, password, email, status, phone, country)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        name.trim(),
        (lastname || '').trim(),
        generatedUsername,
        hashedPassword,
        email.trim(),
        phone || null,
        country || null,
      ]
    );

    const userId = insertResult.insertId;

    // Generate 6-digit confirmation OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await query(
      `INSERT INTO accountconfirm (user_id, email, code, status, expires_at)
       VALUES (?, ?, ?, 'PENDING', ?)
       ON DUPLICATE KEY UPDATE code = VALUES(code), status = 'PENDING', expires_at = VALUES(expires_at), attempts = 0`,
      [userId, email.trim(), otp, expiresAt]
    );

    const token = jwt.sign(
      { id: userId, username: generatedUsername, email: email.trim(), role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Registration successful.',
      token,
      user: {
        id: userId,
        name,
        lastname: lastname || '',
        username: generatedUsername,
        email: email.trim(),
        status: 1,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Confirm Account OTP ───────────────────────────────────────────────────────
export const confirmAccount = async (req, res, next) => {
  try {
    const { otp, user: userIdentifier } = req.body;
    const email = (userIdentifier || req.user?.email || '').trim();

    if (!otp) {
      return res.status(400).json({ status: 0, message: 'OTP is required.' });
    }

    const records = await query(
      `SELECT * FROM accountconfirm WHERE (email = ? OR user_id = ?) AND status = 'PENDING' ORDER BY id DESC LIMIT 1`,
      [email, req.user?.id || 0]
    );

    if (records.length === 0) {
      return res.status(400).json({ status: 0, message: 'No pending confirmation code found.' });
    }

    const record = records[0];
    if (String(record.code).trim() !== String(otp).trim()) {
      await query('UPDATE accountconfirm SET attempts = attempts + 1 WHERE id = ?', [record.id]);
      return res.status(400).json({ status: 0, message: 'Invalid confirmation code.' });
    }

    await query(`UPDATE accountconfirm SET status = 'CONFIRMED' WHERE id = ?`, [record.id]);
    await query(`UPDATE user SET status = 1 WHERE email = ?`, [record.email]);

    return res.status(200).json({ status: 1, message: 'Account confirmed successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Resend Code ───────────────────────────────────────────────────────────────
export const resendCode = async (req, res, next) => {
  try {
    const email = req.user?.email || req.body.email;
    if (!email) {
      return res.status(400).json({ status: 0, message: 'Email identifier required.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await query(
      `INSERT INTO accountconfirm (email, code, status, expires_at)
       VALUES (?, ?, 'PENDING', ?)
       ON DUPLICATE KEY UPDATE code = VALUES(code), status = 'PENDING', expires_at = VALUES(expires_at), attempts = 0`,
      [email, otp, expiresAt]
    );

    return res.status(200).json({ status: 1, message: 'Verification code resent successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Request Password Reset ────────────────────────────────────────────────────
export const requestReset = async (req, res, next) => {
  try {
    const { username } = req.body;
    const identifier = (username || '').trim();

    if (!identifier) {
      return res.status(400).json({ status: 0, message: 'Username or email is required.' });
    }

    const users = await query(
      'SELECT id, email, username FROM user WHERE email = ? OR username = ? LIMIT 1',
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(404).json({ status: 0, message: 'User not found.' });
    }

    const user = users[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await query(
      `INSERT INTO accountconfirm (user_id, email, code, status, expires_at)
       VALUES (?, ?, ?, 'PENDING', ?)
       ON DUPLICATE KEY UPDATE code = VALUES(code), status = 'PENDING', expires_at = VALUES(expires_at), attempts = 0`,
      [user.id, user.email, otp, expiresAt]
    );

    const resetToken = jwt.sign(
      { id: user.id, username: user.username, email: user.email, action: 'reset' },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    return res.status(200).json({
      status: 1,
      message: 'Reset code generated.',
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// ── Verify Reset Code ─────────────────────────────────────────────────────────
export const verifyResetCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const email = req.user?.email;

    if (!code) {
      return res.status(400).json({ status: 0, message: 'Code is required.' });
    }

    const records = await query(
      `SELECT * FROM accountconfirm WHERE (email = ? OR user_id = ?) AND status = 'PENDING' ORDER BY id DESC LIMIT 1`,
      [email || '', req.user?.id || 0]
    );

    if (records.length === 0 || String(records[0].code).trim() !== String(code).trim()) {
      return res.status(400).json({ status: 0, message: 'Invalid or expired code.' });
    }

    return res.status(200).json({ status: 1, message: 'Code verified successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Reset Password ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { username, new_password } = req.body;
    const identifier = (username || req.user?.username || req.user?.email || '').trim();

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ status: 0, message: 'Password must be at least 6 characters.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    const result = await query(
      'UPDATE user SET password = ? WHERE email = ? OR username = ?',
      [hashedPassword, identifier, identifier]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 0, message: 'User not found.' });
    }

    return res.status(200).json({ status: 1, message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Admin Login ───────────────────────────────────────────────────────────────
export const loginAdmin = async (req, res, next) => {
  try {
    const { adminname, email, password } = req.body;
    const identifier = (adminname || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ status: false, message: 'Admin username/email and password are required.' });
    }

    const admins = await query(
      'SELECT * FROM admin WHERE adminname = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );

    if (admins.length === 0) {
      return res.status(404).json({ status: false, message: 'Admin account not found.' });
    }

    const admin = admins[0];
    const isMatch = await verifyAndUpgradePassword('admin', admin.id, password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, adminname: admin.adminname, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Save token in admin record if token column exists
    try {
      await query('UPDATE admin SET token = ? WHERE id = ?', [token, admin.id]);
    } catch {}

    return res.status(200).json({
      status: 200,
      success: true,
      token,
      admin: {
        id: admin.id,
        adminname: admin.adminname,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────
export const logoutUser = async (req, res) => {
  return res.status(200).json({ status: 200, message: 'Logged out successfully.' });
};

export const logoutAdmin = async (req, res) => {
  return res.status(200).json({ status: 200, message: 'Admin logged out successfully.' });
};

export default {
  loginUser,
  registerUser,
  confirmAccount,
  resendCode,
  requestReset,
  verifyResetCode,
  resetPassword,
  loginAdmin,
  logoutUser,
  logoutAdmin,
};
