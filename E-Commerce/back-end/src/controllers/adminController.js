import { signInValidation } from "../validation/signInValidation.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { sendEmail } from "../utils/emailSender.js";
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
    return res.status(500).json({ message: "Server error", error: error.message });
}
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select("-password");
        if(!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({
            message: "User list fetched successfully",
            users
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User fetched successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }else {
            const deleteUser = await User.findByIdAndDelete(id);
            UserRemovalNotification({ email: user.email, name: user.name });
            if(!deleteUser) {
                return res.status(400).json({ message: "Failed to delete user" });
            }else {
                return res.status(200).json({ message: "User deleted successfully" });
            }
        }
        
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message})
    }
};

const UserRemovalNotification = async ({ email, name }) =>{
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "User Removal Notification",
        html: `
            <div style = "font-family: Times New Roman, sans-serif; ">
            <h1 style = "color: red;">User Removal Notification</h1>
            <p>Sorry ${name}!.</p>
            <p>Your account in E-Commerce is removed.</p>
            <p>Sorry for your lose.</p>
            <p>Thank you for your concern for E-Commerce.</p>
            <p>Best regards,</p>
            <p>E-Commerce Team</p>
            </div>`
    };
    try {
        await sendEmail(mailOptions);
        console.log("User removal notification sent successfully to ", email);
        
    } catch (error) {
        console.error("Error sending user removal notification through email : ", error);
    }
};

