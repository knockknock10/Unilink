import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';

// Helper to build a consistent auth response
const buildAuthResponse = (user, token) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatar: user.avatar,
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
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            return res.status(201).json(buildAuthResponse(user, generateToken(user._id)));
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json(buildAuthResponse(user, generateToken(user._id)));
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

export { registerUser, loginUser };
