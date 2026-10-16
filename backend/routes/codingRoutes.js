import express from 'express';
import {
  getAllQuestions,
  getQuestionBySlug,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  runCode,
  submitCode,
  getSubmissionResult,
  getUserSubmissions,
  getAdminSubmissions,
} from '../controllers/codingController.js';
import { verifyAdminToken, verifyUserToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Coding Questions
router.get('/questions', getAllQuestions);
router.get('/questions/:slug', getQuestionBySlug);
router.post('/questions', verifyAdminToken, createQuestion);
router.put('/questions/:id', verifyAdminToken, updateQuestion);
router.delete('/questions/:id', verifyAdminToken, deleteQuestion);

// Code Runner & Submissions
router.post('/run', optionalAuth, runCode);
router.post('/submit', optionalAuth, submitCode);
router.get('/submit/:submissionId', getSubmissionResult);

// Submissions History & Dashboard
router.get('/submissions', verifyUserToken, getUserSubmissions);
router.get('/admin/submissions', verifyAdminToken, getAdminSubmissions);

export default router;
