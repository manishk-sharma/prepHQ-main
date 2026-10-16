import express from 'express';
import { getAllJobs, getJobById } from '../controllers/jobsController.js';

const router = express.Router();

router.get('/get-all-jobs', getAllJobs);
router.get('/get-job', getJobById);
router.get('/get-job/:id', getJobById);

export default router;
