import express from 'express';
import { sendOTP, verifyOTP, loginUser, getUserDetails } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.get('/user/:phoneNumber', authenticateToken, getUserDetails);

export default router;