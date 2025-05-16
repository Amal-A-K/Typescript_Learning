import express from 'express';
import { userSignup, userLogin, updateUserDetails, updateUserPassword, addToCart, removeFromCart, getCart } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//User routes
router.post('/registration', userSignup);
router.post('/login', userLogin);

// User profile routes - Fix the URL patterns to use proper parameter syntax
router.put('/:userId', authenticateToken, updateUserDetails);
router.put('/:userId/password', authenticateToken, updateUserPassword);

// Cart routes - Fix the URL patterns to use proper parameter syntax
router.post('/cart/:userId/products/:productId', authenticateToken, addToCart);
router.delete('/cart/:userId/products/:productId', authenticateToken, removeFromCart);
router.get('/cart/:userId', authenticateToken, getCart);

export default router;