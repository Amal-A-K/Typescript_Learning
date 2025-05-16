import { signInValidation } from "../validation/signInValidation.js";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/emailSender.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { errors, isValid } = signInValidation(req.body);
        
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                errors: { email: "User not found" }
            });
        }
        
        if(user.role !== "admin"){
            return res.status(403).json({ 
                errors: { role: "Unauthorized. Admin access only." }
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ 
                errors: { password: "Incorrect password" }
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

        // const user = await User.findOne({ email });
        // if (!user) {
        //     errors.email = "User not found";
        //     return res.status(404).json({ errors });
        // }
        
        // if(user.role !== "admin"){
        //     errors.role = "You are not an admin";
        //     return res.status(403).json({ errors });
        // }

        // const isMatch = await bcrypt.compare(password, user.password);
        // if(!isMatch) {
        //     errors.password = "Incorrect password";
        //     return res.status(400).json({ errors });
        // }

        // const JWT_SECRET = process.env.JWT_SECRET;
        // const token = jwt.sign(
        //     { id: user._id, email: user.email,role: user.role },
        //     JWT_SECRET,
        //     { expiresIn: "1h" }
        // )
        // return res.status(200).json({
        //     message: "Login successful",
        //     // token,
        //     user: {
        //         // id: user._id,
        //         name: user.name,
        //         email: user.email,
        //         role: user.role
        //     }
        // })
    } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
}
}

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({ role: "user" })
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments({ role: "user" });
        
        if (!users || users.length === 0) {
            return res.status(404).json({ 
                errors: { users: "No users found" }
            });
        }

        return res.status(200).json({
            message: "User list fetched successfully",
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasMore: page * limit < total
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ 
                errors: { userId: "User ID is required" }
            });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ 
                errors: { userId: "User not found" }
            });
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
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                errors: { userId: "User ID is required" }
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                errors: { userId: "User not found" }
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({ 
                errors: { role: "Cannot delete admin users" }
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(400).json({ 
                errors: { user: "Failed to delete user" }
            });
        }

        // Send email notification
        await UserRemovalNotification({ 
            email: user.email, 
            name: user.name 
        });

        return res.status(200).json({ 
            message: "User deleted successfully" 
        });
        
        
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

