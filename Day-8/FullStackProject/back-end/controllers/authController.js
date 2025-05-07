import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// import dotenv from 'dotenv';

// const OTP_API = process.env.TWO_FACTOR_API_KEY;
// const JWT_SECRET = process.env.JWT_SECRET;

export const sendOTP = async (req, res) => {
    const OTP_API = process.env.TWO_FACTOR_API_KEY;
  const { phoneNumber } = req.body;
  try {
    const response = await axios.get(
     `https://2factor.in/API/V1/${OTP_API}/SMS/+91${phoneNumber}/AUTOGEN`
    );
    res.status(200).json({ sessionId: response.data.Details });
  } catch (err) {
    console.error('Error sending OTP:', err);
    console.log("api-key",process.env.TWO_FACTOR_API_KEY);
    console.log("PHONE NUMBER",phoneNumber);
    
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
    const OTP_API = process.env.TWO_FACTOR_API_KEY;
  const { sessionId, otp, fullName, phoneNumber, password, confirmPassword } = req.body;

  if (!fullName || !phoneNumber || !password || !confirmPassword || !sessionId || !otp) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const verifyRes = await axios.get(
      `https://2factor.in/API/V1/${OTP_API}/SMS/VERIFY/${sessionId}/${otp}`
    );

    if (verifyRes.data.Details !== 'OTP Matched') {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      phoneNumber,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

export const loginUser = async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, phoneNumber: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  const { phoneNumber } = req.params;
  try {
    const user = await User.findOne({ phoneNumber }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.log("Error fetching user details:",err);
    
    res.status(500).json({ message: 'Failed to get user details', error: err.message });
  }
};
