import express from 'express';
import {
  handleContactUs,
  handleNewsletterSubscribe,
} from '../controllers/contactController.js';

const router = express.Router();

router.post('/contactus', handleContactUs);
router.post('/newsletterSubscribe', handleNewsletterSubscribe);

export default router;
