import { signInValidation } from "../middleware/validation/signInValidation.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const { errors, isValid } = signInValidation(req.body);
    try {
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        const user = await User.findOne({ email });
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json({ errors });
        }
        
        if(user.role !== "admin"){
            errors.role = "You are not an admin";
            return res.status(403).json({ errors });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            errors.password = "Incorrect password";
            return res.status(400).json({ errors });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user._id, email: user.email,role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        )
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
    return res.status(500).json({ message: "Server error" });
}
}