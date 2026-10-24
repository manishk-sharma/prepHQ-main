import express from 'express';
import {
  getAllInterviewDetails,
  getInterviewDetailsBySlug,
  createInterviewDetails,
  updateInterviewDetails,
  deleteInterviewDetails,
} from '../controllers/interviewDetailsController.js';
import { verifyAdminToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public: retrieve details
router.get('/', getAllInterviewDetails);
router.get('/:slugOrId', getInterviewDetailsBySlug);

// Mutations (Admin)
router.post('/', verifyAdminToken, createInterviewDetails);
router.put('/:slugOrId', optionalAuth, updateInterviewDetails);
router.delete('/:slugOrId', verifyAdminToken, deleteInterviewDetails);

export default router;
