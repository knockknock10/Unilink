import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper to build a consistent auth response
const buildAuthResponse = (user, token) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
    bannerImage: user.bannerImage,
    department: user.department,
    year: user.year,
    skills: user.skills,
    interests: user.interests,
    followers: user.followers,
    following: user.following,
    role: user.role,
    createdAt: user.createdAt,
    token,
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({
        name,
        email,
        password: hashedPassword
    });
    await user.save();

    // Return response
    res.status(201).json({ message: "User registered successfully" });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    // Return response using the helper to include role and profile data
    res.status(200).json({
        token,
        user: buildAuthResponse(user, token)
    });
});

export { registerUser, loginUser };
