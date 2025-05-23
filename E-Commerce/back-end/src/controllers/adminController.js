import { signInValidation } from "../validation/signInValidation.js";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/emailSender.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Product from "../models/productModel.js";

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

        if (user.role !== "admin") {
            return res.status(403).json({
                errors: { role: "Unauthorized. Admin access only." }
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
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

export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cartItems = [];
        let total = 0;

        if (user.cartData) {
            const cartEntries = user.cartData instanceof Map
                ? Array.from(user.cartData.entries())
                : Object.entries(user.cartData);
            // for (const [productId, quantity] of Object.entries(user.cartData)) {
            for (const [productId, quantity] of cartEntries) {
                try{
                const product = await Product.findById(productId);
                if (product) {
                    const itemTotal = product.price * quantity;
                    total += itemTotal;

                    const imageUrl = (Array.isArray(product.image) && product.image.length > 0)
                        ? product.image[0]
                        : ''; // Default to empty string


                    cartItems.push({
                        productId,
                        name: product.name,
                        price: product.price,
                        quantity,
                        // image: product.image?.[0] || '',
                        image: imageUrl,
                        total: itemTotal
                    });
                } else {
                    // Log if product is not found, but continue processing other items
                    console.warn(`Product with ID ${productId} not found for user ${userId}'s cart.`);
                } 
            }catch(productError){
                console.error(`Error processing product ${productId} in cart for user ${userId}:`, productError);
            }
            
            }
        }
        return res.status(200).json({ message: "Cart Details", cart: { items: cartItems, total } });
    } catch (error) {
        console.error("Error in getUserCart:", error);  
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateUserCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        if (!user.cartData) {
            user.cartData = {};
        }

        if (quantity > 0) {
            user.cartData[productId] = quantity;
        } else {
            delete user.cartData[productId];
        }

        const savedData = await user.save();
        res.json({ message: 'Cart updated successfully', data: savedData });
    } catch (error) {
        return res.status(500).json({ message: " Server error", error: error.message });
    }
};

export const deleteUserCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.cartData && user.cartData[productId]) {
            delete user.cartData[productId];
            const savedData = await user.save();
            return res.status(200).json({ message: "Cart item removed successfully", data: savedData });
        }

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

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
        return res.status(500).json({ message: "Server error", error: error.message })
    }
};

const UserRemovalNotification = async ({ email, name }) => {
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

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Role updated", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleUserBlock = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isBlocked, reason } = req.body;

        // Validate input
        if (typeof isBlocked !== 'boolean') {
            return res.status(400).json({
                message: "isBlocked must be a boolean value"
            });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prevent blocking admins
        if (user.role === 'admin') {
            return res.status(403).json({
                message: "Cannot block admin users"
            });
        }

        // Update user block status
        user.isBlocked = isBlocked;
        if (isBlocked) {
            user.blockedAt = new Date();
            user.blockReason = reason || 'Violation of terms of service';
        } else {
            user.blockedAt = undefined;
            user.blockReason = undefined;
        }

        await user.save();

        // Send notification email
        await sendBlockStatusNotification({
            email: user.email,
            name: user.name,
            isBlocked,
            reason: user.blockReason
        });

        return res.status(200).json({
            message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isBlocked: user.isBlocked,
                blockedAt: user.blockedAt,
                blockReason: user.blockReason
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Email notification function
const sendBlockStatusNotification = async ({ email, name, isBlocked, reason }) => {
    const subject = isBlocked
        ? "Your Account Has Been Blocked"
        : "Your Account Has Been Reactivated";

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>${subject}</h2>
            <p>Dear ${name},</p>
            
            ${isBlocked ? `
                <p>We regret to inform you that your account has been blocked due to:</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p>If you believe this is a mistake, please contact our support team.</p>
            ` : `
                <p>We're pleased to inform you that your account has been reactivated.</p>
                <p>You can now log in and access all features as usual.</p>
            `}
            
            <p>Thank you for your understanding.</p>
            <p>Best regards,</p>
            <p>The Admin Team</p>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject,
        html
    };

    try {
        await sendEmail(mailOptions);
        console.log(`Block status notification sent to ${email}`);
    } catch (error) {
        console.error("Error sending block status email:", error);
    }
};

