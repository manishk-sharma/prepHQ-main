import express from 'express';
import {
  getAllProjectDetails,
  getProjectDetailsBySlug,
  createProjectDetails,
  updateProjectDetails,
  deleteProjectDetails,
  getSidebarCards,
  updateSidebarCards,
} from '../controllers/projectDetailsController.js';
import { verifyAdminToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public: retrieve details
router.get('/', getAllProjectDetails);
router.get('/:slugOrId', getProjectDetailsBySlug);
router.get('/:slugOrId/sidebar-cards', getSidebarCards);

// Mutations
router.post('/', verifyAdminToken, createProjectDetails);
router.put('/:slugOrId', optionalAuth, updateProjectDetails);
router.put('/:slugOrId/sidebar-cards', optionalAuth, updateSidebarCards);
router.delete('/:slugOrId', verifyAdminToken, deleteProjectDetails);

export default router;
