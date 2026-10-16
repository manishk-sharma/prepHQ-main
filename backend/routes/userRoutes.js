import express from 'express';
import {
  getUserProfile,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  deleteResume,
} from '../controllers/userController.js';
import { verifyUserToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/user', verifyUserToken, getUserProfile);
router.post('/profileupdate', verifyUserToken, updateProfile);
router.post(
  '/upload-profile-image',
  verifyUserToken,
  upload.single('profile_image'),
  uploadProfileImage
);
router.post(
  '/upload-resume',
  verifyUserToken,
  upload.single('resume'),
  uploadResume
);
router.delete('/delete-resume', verifyUserToken, deleteResume);

export default router;
