import express from "express";
import { getAllUsers, adminLogin, getUserById, deleteUser, getUserCart, updateUserCart, deleteUserCartItem } from "../controllers/adminController.js";
import { isadmin, authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();

// Admin login route
router.post("/login", adminLogin); 

// All users fetching by admin
router.get('/getAllUsers', authenticateToken, isadmin, getAllUsers);

// Fetching particular user details by using id
router.get('/users/:userId', authenticateToken, isadmin, getUserById);

// Deleting a user
router.delete('/users/:userId', authenticateToken, isadmin, deleteUser);

// fetching user cart details
router.get('/users/:userId/cart', authenticateToken,isadmin,getUserCart);

// updating user cart
router.put('/users/:userId/cart', authenticateToken, isadmin, updateUserCart);

// deleting item from user cart
router.delete('/users/:userId/cart/:productId', authenticateToken, isadmin, deleteUserCartItem);

export default router;