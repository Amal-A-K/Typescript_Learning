import express from 'express';
import { userSignup, userLogin, updateUserDetails, updateUserPassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

//User routes
router.post('/registration',userSignup);
router.post('/login',userLogin);

router.put('/user:id',authenticateToken,updateUserDetails);
router.put('/user:id/password',authenticateToken,updateUserPassword);

export default router;