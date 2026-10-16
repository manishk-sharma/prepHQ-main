import express from 'express';
import {
  loginUser,
  registerUser,
  confirmAccount,
  resendCode,
  requestReset,
  verifyResetCode,
  resetPassword,
  loginAdmin,
  logoutUser,
  logoutAdmin,
} from '../controllers/authController.js';
import { verifyUserToken, verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/loginUser', loginUser);
router.post('/register', registerUser);
router.post('/confirm', confirmAccount);
router.post('/resend-code', resendCode);
router.post('/request_reset', requestReset);
router.post('/verify_code', verifyResetCode);
router.post('/reset_password', resetPassword);

router.post('/admin-login', loginAdmin);
router.post('/admin-logout', verifyAdminToken, logoutAdmin);
router.post('/logout', logoutUser);

export default router;
