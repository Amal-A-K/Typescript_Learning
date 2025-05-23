import express from "express";
import { getAllUsers, adminLogin, getUserById, deleteUser, updateUserRole, toggleUserBlock, getUserCart, updateUserCart, deleteUserCartItem } from "../controllers/adminController.js";
import { isadmin, authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();

// Admin login route
router.post("/login", adminLogin); 
router.get('/getAllUsers', authenticateToken, isadmin, getAllUsers); // All users fetching by admin
router.get('/users/:userId', authenticateToken, isadmin, getUserById); // Fetching particular user details by using id
router.delete('/users/:userId', authenticateToken, isadmin, deleteUser); // Deleting a user
router.put('/users/:userId/role', authenticateToken, isadmin, updateUserRole); // updating user role
router.put('/users/:userId/block',authenticateToken,isadmin,toggleUserBlock); // Blocking user

// cart routes
router.get('/users/:userId/cart', authenticateToken,isadmin,getUserCart); // fetching user cart details
router.put('/users/:userId/cart', authenticateToken, isadmin, updateUserCart); // updating user cart
router.delete('/users/:userId/cart/:productId', authenticateToken, isadmin, deleteUserCartItem); // deleting item from user cart

export default router;