import { query } from '../config/db.js';

// ── Contact Us Submission ─────────────────────────────────────────────────────
export const handleContactUs = async (req, res, next) => {
  try {
    const { firstname, lastname, countryCode, phone, email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ status: 0, message: 'Email and message are required.' });
    }

    await query(
      `INSERT INTO contact_messages (firstname, lastname, countryCode, phone, email, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        (firstname || '').trim(),
        (lastname || '').trim(),
        (countryCode || '+91').trim(),
        (phone || '').trim(),
        email.trim(),
        message.trim(),
      ]
    );

    return res.status(200).json({
      status: 1,
      message: 'Your message has been sent successfully. We will get back to you shortly!',
    });
  } catch (error) {
    next(error);
  }
};

// ── Newsletter Subscribe ──────────────────────────────────────────────────────
export const handleNewsletterSubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ status: 0, message: 'A valid email address is required.' });
    }

    await query(
      `INSERT INTO newsletter_subscribers (email, status)
       VALUES (?, 'active')
       ON DUPLICATE KEY UPDATE status = 'active', subscribed_at = CURRENT_TIMESTAMP`,
      [email.trim().toLowerCase()]
    );

    return res.status(200).json({
      status: 1,
      message: 'Thank you for subscribing to our newsletter!',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  handleContactUs,
  handleNewsletterSubscribe,
};
