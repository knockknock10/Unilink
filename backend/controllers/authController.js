import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        const profile = await Profile.create({ user: user._id });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar,
            followers: user.followers,
            following: user.following,
            department: profile.department,
            year: profile.year,
            skills: profile.skills,
            interests: profile.interests,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        let profile = await Profile.findOne({ user: user._id });
        if (!profile) {
            profile = await Profile.create({ user: user._id });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar,
            followers: user.followers,
            following: user.following,
            department: profile.department,
            year: profile.year,
            skills: profile.skills,
            interests: profile.interests,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

export { registerUser, loginUser };
