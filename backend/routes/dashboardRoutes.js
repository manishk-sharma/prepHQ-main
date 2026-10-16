import express from 'express';
import { getAllData } from '../controllers/dashboardController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/get-all-data', optionalAuth, getAllData);

export default router;
