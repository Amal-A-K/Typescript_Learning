import express from 'express';
import { userSignup, userLogin, updateUserDetails, updateUserPassword, addToCart, removeFromCart, getCart, forgotPassword, resetPassword } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//User routes
router.post('/registration', userSignup);
router.post('/login', userLogin);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

// User profile routes
router.put('/:userId', authenticateToken, updateUserDetails);
router.put('/:userId/password', authenticateToken, updateUserPassword);

// Cart routes
router.post('/cart/:userId/products/:productId', authenticateToken, addToCart);
router.delete('/cart/:userId/products/:productId', authenticateToken, removeFromCart);
router.get('/cart/:userId', authenticateToken, getCart);

export default router;