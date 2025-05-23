import express from 'express';
import { userSignup, userLogin, updateUserDetails, updateUserPassword, addToCart, removeFromCart, updateCartQuantity, getCartDetails, forgotPassword, resetPassword } from '../controllers/userController.js';
import { authenticateToken, checkUserBlocked } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

//User routes
router.post('/registration',upload.array('image'), userSignup);
router.post('/login', userLogin);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

// User profile routes
router.put('/:userId', authenticateToken, checkUserBlocked, upload.array('image'), updateUserDetails);
router.put('/:userId/password', authenticateToken,checkUserBlocked, updateUserPassword);

// User Cart routes
router.post('/cart/add', authenticateToken, checkUserBlocked, addToCart);
router.post('/cart/remove', authenticateToken, checkUserBlocked, removeFromCart); // Use POST for idempotent action or DELETE if it's purely for removal
router.put('/cart/update', authenticateToken, checkUserBlocked, updateCartQuantity); // For changing quantity of an existing item
router.get('/cart', authenticateToken, checkUserBlocked, getCartDetails); // Get user's cart details


export default router;