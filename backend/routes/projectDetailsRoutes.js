import express from 'express';
import {
  getAllProjectDetails,
  getProjectDetailsBySlug,
  createProjectDetails,
  updateProjectDetails,
  deleteProjectDetails,
} from '../controllers/projectDetailsController.js';
import { verifyAdminToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public: retrieve details
router.get('/', getAllProjectDetails);
router.get('/:slugOrId', getProjectDetailsBySlug);

// Mutations
router.post('/', verifyAdminToken, createProjectDetails);
router.put('/:slugOrId', optionalAuth, updateProjectDetails);
router.delete('/:slugOrId', verifyAdminToken, deleteProjectDetails);

export default router;
