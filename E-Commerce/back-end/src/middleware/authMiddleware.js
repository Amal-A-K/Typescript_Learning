import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
// token authentication
export const authenticateToken = (req,res,next) => {    
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: "Authorization token missing or invalid" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error){
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
// checking is admin or not
export const isadmin = (req,res,next) => {
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
};

// checking blocked user or not
export const checkUserBlocked = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.isBlocked) {
            return res.status(403).json({
                message: `Your account is blocked. Reason: ${user.blockReason || 'Not specified'}`,
                blockedAt: user.blockedAt
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

