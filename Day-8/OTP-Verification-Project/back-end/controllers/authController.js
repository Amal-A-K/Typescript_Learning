import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import twilio from 'twilio';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Twilio credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Validate Twilio credentials
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Missing Twilio credentials:', {
        TWILIO_ACCOUNT_SID: !!TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN: !!TWILIO_AUTH_TOKEN,
        TWILIO_PHONE_NUMBER: !!TWILIO_PHONE_NUMBER
    });
    throw new Error('Missing required Twilio credentials');
}

// Twilio client initialization
const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const signup = async (req, res) => {
    const { fullName, phoneNumber, password } = req.body;

    try {
        // Format the phone number before using it
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        
        let user = await User.findOne({ phoneNumber: formattedPhoneNumber });

        if (user) {
            return res.status(400).json({ message: "Phone number already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

        user = new User({
            fullName,
            phoneNumber: formattedPhoneNumber,
            password: hashedPassword,
            otp,
            otpExpiresAt
        });

        await user.save();

        // Send OTP via SMS using Twilio
        try {
            console.log('Sending OTP to:', formattedPhoneNumber);
            const message = await client.messages.create({
                body: `Your OTP for registration is ${otp}`,
                from: TWILIO_PHONE_NUMBER,
                to: formattedPhoneNumber
            });
            
            console.log(`OTP sent to ${formattedPhoneNumber}: ${message.sid}`);
            res.status(201).json({ message: "User registered. OTP sent to phone." });
        } catch (twilioError) {
            console.error("Error sending OTP:", twilioError);
            // Delete the saved user since OTP sending failed
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ 
                message: "Failed to send OTP.",
                error: twilioError.message
            });
        }
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update verifyOTP to use formatted phone number
export const verifyOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    try {
        const user = await User.findOne({ phoneNumber: formattedPhoneNumber });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.otp !== otp || user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update login to use formatted phone number
export const login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    try {
        const user = await User.findOne({ phoneNumber: formattedPhoneNumber });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        res.status(200).json({ message: "Login successful." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
