import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    let profile = await Profile.findOne({ user: req.user._id });
    
    if (user) {
        if (!profile) {
            profile = await Profile.create({ user: req.user._id });
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
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    let profile = await Profile.findOne({ user: req.user._id });

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        if (profile) {
            profile.department = req.body.department !== undefined ? req.body.department : profile.department;
            profile.year = req.body.year !== undefined ? req.body.year : profile.year;
            profile.skills = req.body.skills !== undefined ? req.body.skills : profile.skills;
            profile.interests = req.body.interests !== undefined ? req.body.interests : profile.interests;
            await profile.save();
        } else {
            profile = await Profile.create({
                user: req.user._id,
                department: req.body.department || '',
                year: req.body.year || '',
                skills: req.body.skills || [],
                interests: req.body.interests || []
            });
        }

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
            followers: updatedUser.followers,
            following: updatedUser.following,
            department: profile.department,
            year: profile.year,
            skills: profile.skills,
            interests: profile.interests,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Follow user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
    if (req.user._id.toString() === req.params.id) {
        res.status(400);
        throw new Error('You cannot follow yourself');
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (userToFollow && currentUser) {
        if (!userToFollow.followers.includes(currentUser._id)) {
            userToFollow.followers.push(currentUser._id);
            currentUser.following.push(userToFollow._id);

            await userToFollow.save();
            await currentUser.save();
            res.json({ message: 'User followed successfully' });
        } else {
            res.status(400);
            throw new Error('You already follow this user');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Unfollow user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (userToUnfollow && currentUser) {
        if (userToUnfollow.followers.includes(currentUser._id)) {
            userToUnfollow.followers.pull(currentUser._id);
            currentUser.following.pull(userToUnfollow._id);

            await userToUnfollow.save();
            await currentUser.save();
            res.json({ message: 'User unfollowed successfully' });
        } else {
            res.status(400);
            throw new Error('You do not follow this user');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').limit(10);
    res.json(users);
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { getUserProfile, updateUserProfile, followUser, unfollowUser, getUsers, getUserById };
