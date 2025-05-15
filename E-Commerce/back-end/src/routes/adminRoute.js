import express from "express";
import { getAllUsers, adminLogin, getUserById, deleteUser } from "../controllers/adminController";
import { isadmin, authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Admin login route
router.post("/login",isadmin, adminLogin);

// All users fetching by admin
router.get('/getAllUsers',authenticateToken,isadmin,getAllUsers);

// Fetching particular user details by using id
router.get('/getUserById/user:id',authenticateToken,isadmin,getUserById);

// Deleting a user
router.delete('/deleteUser/user:id',authenticateToken,isadmin,deleteUser);

export default router;