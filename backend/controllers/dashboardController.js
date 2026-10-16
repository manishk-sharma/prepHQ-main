import { query } from '../config/db.js';

// ── GET All Dashboard Data ────────────────────────────────────────────────────
export const getAllData = async (req, res, next) => {
  try {
    const [users, contactMessages, newsletterSubscribers, accountConfirm] = await Promise.all([
      query(`
        SELECT id, name, lastname, username, email, status, created_date,
               phone, country, bio, github, linkedin, profile_image, resume
        FROM user
        ORDER BY id DESC
      `),
      query(`
        SELECT id, firstname, lastname, countryCode, phone, email, message, created_at
        FROM contact_messages
        ORDER BY id DESC
      `),
      query(`
        SELECT id, email, status, subscribed_at
        FROM newsletter_subscribers
        ORDER BY id DESC
      `),
      query(`
        SELECT id, user_id, email, code, status, created_at, expires_at, attempts
        FROM accountconfirm
        ORDER BY id DESC
      `),
    ]);

    return res.status(200).json({
      status: 1,
      data: {
        user: users || [],
        contact_messages: contactMessages || [],
        newsletter_subscribers: newsletterSubscribers || [],
        accountconfirm: accountConfirm || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllData,
};
