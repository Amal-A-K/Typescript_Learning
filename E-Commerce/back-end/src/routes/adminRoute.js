import express from "express";
import { getAllUsers, adminLogin, getUserById, deleteUser } from "../controllers/adminController.js";
import { isadmin, authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login route
router.post("/login", adminLogin);  // Remove isadmin middleware from login

// All users fetching by admin
router.get('/getAllUsers', authenticateToken, isadmin, getAllUsers);

// Fetching particular user details by using id
router.get('/users/:userId', authenticateToken, isadmin, getUserById);

// Deleting a user
router.delete('/users/:userId', authenticateToken, isadmin, deleteUser);

export default router;