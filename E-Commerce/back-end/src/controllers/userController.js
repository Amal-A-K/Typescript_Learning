import User from "../models/userModel.js";
import { signInValidation } from "../validation/signInValidation.js";
import { signUpValidation } from "../validation/signUpValidation.js";
import { updateUserValidation } from "../validation/updateUserValidation.js";
import { updateUserPasswordValidation } from "../validation/updateUserPasswordValidation.js";
import { forgotPasswordValidation, resetPasswordValidation } from "../validation/passwordResetValidation.js";
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailSender.js";
import Product from "../models/productModel.js";
import { text } from "express";

export const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { errors, isValid } = signUpValidation(req.body);
        if (!isValid) {
            return res.status(400).json({ errors });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            errors.email = "Email already exists";
            return res.status(400).json({ errors });
        }
        const hashedPassword = await bcrypt.hash(password, 10);        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "user",
            cartData: {} // Initialize with empty cart
        });
        await newUser.save();
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        await RegistrationSuccessNotification({ email: newUser.email, name: newUser.name });
        console.log("Regisration success notification sent successfully to ", newUser.email);
        
        return res.status(201).json({
            message: "User created successfully. Please check your email for user registration confirmation.",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,                
                email: newUser.email,
                role: newUser.role,
                cartData: newUser.cartData
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}

const RegistrationSuccessNotification = async ({ email, name }) =>{
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Registration Success Notification",
        text: 'Registration Success Notification',
        html: `
            <div style = "font-family: Times New Roman, sans-serif; ">
            <h1 style = "color: green;">Registration Success Notification</h1>
            <p>Congratulations ${name}!.</p>
            <p>Your registration was successful in E-Commerce.</p>
            <p>If you want any support, please contact our support team.</p>
            <p>Thank you!</p>
            <p>Best regards,</p>
            <p>Your E-Commerce Team</p>
            </div>`
    };
    try {
        await sendEmail(mailOptions);
        console.log("Registration success notification sent successfully to ", email);
        
    } catch (error) {
        console.error("Error sending registration success notification through email : ", error);
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { errors, isValid } = signInValidation(req.body);
        if (!isValid) {
            return res.status(400).json({ errors });
        }
        const user = await User.findOne({ email });
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json({ errors });
        }

        if (user.role !== "user") {
            errors.role = "You are not an user";
            return res.status(403).json({ errors });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            errors.password = "Incorrect password";
            return res.status(400).json({ errors });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        )
        return res.status(200).json({
            message: "Login successful.",
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
};

export const updateUserDetails = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { userId } = req.params;
        const { errors, isValid } = updateUserValidation(req.body);
        if (!isValid) {
            return res.status(400).json({ errors });
        }
        const user = await User.findById(userId);
        if(!user) {
            errors.user = "User not found";
            return res.status(404).json({ errors });
        }        if (req.user.id !== userId && req.user.role !== "admin") {
            errors.role = "You are not authorized to update this user";
            return res.status(403).json({ errors });
        }
        const updateData ={};
        if (name) {
            updateData.name = name;
        }
        if (email) {
            updateData.email =email;
        }
        if(password){
            updateData.password = await bcrypt.hash(password,10);
        }
        
        const updateUser = await User.findByIdAndUpdate(userId,updateData,{ new: true });
        if(!updateUser) {
            errors.user = "User not updated";
            return res.status(400).json({ errors });
        }
        if (email) {
            await UserDetailUpdateNotification({ email: updateUser.email, name: updateUser.name});
            console.log("User detail update success notification sent successfully to ", updateUser.email);
            
        }
        return res.status(200).json({
            message: "User updated successfully.Please check your email for user detail update confirmation.",
            user: {
                id: updateUser._id,
                name: updateUser.name,
                email: updateUser.email,
                role: updateUser.role,
                createdAt: updateUser.createdAt
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const UserDetailUpdateNotification = async ({ email, name }) =>{
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "User Detail Update Success Notification",
        text: "User Detail Update Success Notification",
        html: `
            <div style = "font-family: Times New Roman, sans-serif; ">
            <h1 style = "color: blue;">User Detail Update Success Notification</h1>
            <p>Congratulations ${name}!.</p>
            <p>You successfully updated your account in E-Commerce.</p>
            <p>If you want any support, please contact our support team.</p>
            <p>Thank you!</p>
            <p>Best regards,</p>
            <p>Your E-Commerce Team</p>
            </div>`
    };
    try {
        await sendEmail(mailOptions);
        console.log("User detail update success notification sent successfully to ", email);
        
    } catch (error) {
        console.error("Error sending user detail update success notification through email : ", error);
    }
}

export const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { userId } = req.params;
        const { errors, isValid } = updateUserPasswordValidation(req.body);
        if(!isValid) {
            return res.status(400).json({ errors });
        }

        const user = await User.findById(userId);
        if(!user) {
            errors.user = "User not found";
            return res.status(404).json({ errors });
        }

        // Check authorization
        if(req.user.id !== userId && req.user.role !== "admin") {
            errors.role = "You are not authorized to update this user";
            return res.status(403).json({ errors });
        }

        // Verify current password (skip this check for admin users)
        if(req.user.role !== "admin") {
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if(!isValidPassword) {
                errors.currentPassword = "Current password is incorrect";
                return res.status(400).json({ errors });
            }
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateUser = await User.findByIdAndUpdate(userId,
            { password: hashedPassword },
            { new: true }
        );
        if (!updateUser) {
            errors.user = "User password not updated";
            return res.status(400).json({errors });
        }else{
            await passwordUpdateNotification({ email: user.email, name: user.name })
            return res.status(200).json({ 
                message: "User password updated successfully. Please check your email for password update confirmation." 
            });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const passwordUpdateNotification = async ({ email, name }) =>{
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password Update Notification",
        text: "Password Update Notification",
        html: `
            <div style = "font-family: Times New Roman, sans-serif; ">
            <h1 style = "color: red;">Password Update Notification</h1>
            <p>Hello ${name},</p>
            <p>Your password has been updated successfully.</p>
            <p>If you did not request this change, please contact support immediately.</p>
            <p>Thank you!</p>
            <p>Best regards,</p>
            <p>Your E-Commerce Team</p>
            </div>`
    };
    try {
        await sendEmail(mailOptions);
        console.log("Password update notification sent successfully to ", email);
        
    } catch (error) {
        console.error("Error sending password update notification through email : ", error);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { errors, isValid } = forgotPasswordValidation(req.body);
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        const user = await User.findOne({ email });
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json({ errors });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expiry to 15 minutes
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `Click here to reset your password: ${resetUrl}`
        });

        return res.status(200).json({
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const { errors, isValid } = resetPasswordValidation(req.body);
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            errors.token = "Invalid or expired reset token";
            return res.status(400).json({ errors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Successful',
            html: `Your password has been successfully reset.`
        });

        return res.status(200).json({
            message: "Password reset successful. Please log in with your new password."
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { userid, productid } = req.params;
        const user = await User.findById(userid);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const product = await Product.findById(productid);
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Initialize cart data for this product if it doesn't exist
        if (!user.cartData[productid]) {
            user.cartData[productid] = 0;
        }
        
        user.cartData[productid] += 1;
        const updateCart = await User.findByIdAndUpdate(
            userid,
            { cartData: user.cartData },
            { new: true }
        );

        return res.status(200).json({ 
            message: "Successfully added product to user cart", 
            cartDetails: updateCart.cartData 
        })
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { userid, productid } = req.params;
        const user = await User.findById(userid);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const product = await Product.findById(productid);
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product exists in cart and has quantity greater than 0
        if(!user.cartData[productid] || user.cartData[productid] <= 0) {
            return res.status(400).json({ message: "Product not in cart" });
        }

        user.cartData[productid] -= 1;
        
        // Remove product from cart if quantity becomes 0
        if(user.cartData[productid] === 0) {
            delete user.cartData[productid];
        }

        const updateCart = await User.findByIdAndUpdate(
            userid,
            { cartData: user.cartData },
            { new: true }
        );
        
        return res.status(200).json({ 
            message: "Successfully removed product from cart", 
            cartDetails: updateCart.cartData 
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error",error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findById(userid);
        if(!user){
            return res.status(404).json({ message: "Invalid user" });
        }
        
        // Get the details of all products in the cart
        const cartWithDetails = {};
        let totalPrice = 0;

        for (const [productId, quantity] of Object.entries(user.cartData)) {
            const product = await Product.findById(productId);
            if (product) {
                const itemTotal = product.price * quantity;
                cartWithDetails[productId] = {
                    product: {
                        id: product._id,
                        name: product.name,
                        price: product.price
                    },
                    quantity,
                    itemTotal: itemTotal // Price * quantity for this item
                };
                totalPrice += itemTotal;
            }
        }

        return res.status(200).json({ 
            message: "Your Cart details", 
            cartDetails: cartWithDetails,
            cartSummary: {
                totalItems: Object.values(user.cartData).reduce((sum, quantity) => sum + quantity, 0),
                totalPrice: totalPrice.toFixed(2) // Rounded to 2 decimal places
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}