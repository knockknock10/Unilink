import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';


// Helper: safely delete a temp file
const cleanupFile = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (_) {}
};

// Helper to build a safe user response object
const buildUserResponse = (user) => {
    if (!user) return null;
    return {
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
    };
};

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            return res.json(buildUserResponse(user));
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile (name, bio, department, year, skills, interests)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.department = req.body.department !== undefined ? req.body.department : user.department;
        user.year = req.body.year !== undefined ? req.body.year : user.year;
        user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
        user.interests = req.body.interests !== undefined ? req.body.interests : user.interests;

        // Optional: allow password update — pre-save hook handles hashing
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        return res.json(buildUserResponse(updatedUser));
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Update profile picture (avatar)
// @route   PUT /api/users/profile-pic
// @access  Private
const updateProfilePic = asyncHandler(async (req, res) => {
    const filePath = req.file?.path;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            cleanupFile(filePath);
            return res.status(404).json({ message: 'User not found' });
        }

        // Upload to Cloudinary with resource_type auto for safety
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'unilink/profile_pics',
            resource_type: 'auto',
        });

        user.profilePic = result.secure_url;
        const updatedUser = await user.save();

        cleanupFile(filePath);
        return res.json(buildUserResponse(updatedUser));
    } catch (error) {
        cleanupFile(filePath);
        console.error('Profile pic upload error:', error);
        return res.status(500).json({ message: error.message || 'Profile picture upload failed' });
    }
});

// @desc    Update banner image
// @route   PUT /api/users/banner
// @access  Private
const updateBanner = asyncHandler(async (req, res) => {
    const filePath = req.file?.path;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            cleanupFile(filePath);
            return res.status(404).json({ message: 'User not found' });
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'unilink/banners',
            resource_type: 'auto',
        });

        user.bannerImage = result.secure_url;
        const updatedUser = await user.save();

        cleanupFile(filePath);
        return res.json(buildUserResponse(updatedUser));
    } catch (error) {
        cleanupFile(filePath);
        console.error('Banner upload error:', error);
        return res.status(500).json({ message: error.message || 'Banner upload failed' });
    }
});

// @desc    Follow user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user._id;

        if (currentUserId.toString() === targetId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const userToFollow = await User.findByIdAndUpdate(
            targetId,
            { $addToSet: { followers: currentUserId } },
            { new: true }
        );

        if (!userToFollow) {
            return res.status(404).json({ message: 'User to follow not found' });
        }

        const currentUser = await User.findByIdAndUpdate(
            currentUserId,
            { $addToSet: { following: targetId } },
            { new: true }
        );

        return res.json({
            message: 'User followed successfully',
            followersCount: userToFollow.followers.length,
            followingCount: currentUser.following.length,
            updatedCurrentUser: buildUserResponse(currentUser),
        });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Unfollow user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user._id;

        const userToUnfollow = await User.findByIdAndUpdate(
            targetId,
            { $pull: { followers: currentUserId } },
            { new: true }
        );

        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User to unfollow not found' });
        }

        const currentUser = await User.findByIdAndUpdate(
            currentUserId,
            { $pull: { following: targetId } },
            { new: true }
        );

        return res.json({
            message: 'User unfollowed successfully',
            followersCount: userToUnfollow.followers.length,
            followingCount: currentUser.following.length,
            updatedCurrentUser: buildUserResponse(currentUser),
        });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Search users by name (for real-time search)
// @route   GET /api/users/search?query=...
// @access  Public
const searchUsers = asyncHandler(async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length === 0) {
            return res.json([]);
        }

        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const users = await User.find({
            $or: [
                { name: { $regex: escaped, $options: 'i' } },
                { email: { $regex: escaped, $options: 'i' } },
                { department: { $regex: escaped, $options: 'i' } },
            ],
        })
            .select('_id name profilePic department')
            .limit(10);

        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}).select('-password').limit(10);
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            return res.json(buildUserResponse(user));
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Get followers of a user (populated)
// @route   GET /api/users/:id/followers
// @access  Public
const getFollowers = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', '_id name profilePic department year bio')
            .select('followers');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json(user.followers);
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Get following of a user (populated)
// @route   GET /api/users/:id/following
// @access  Public
const getFollowing = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('following', '_id name profilePic department year bio')
            .select('following');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json(user.following);
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Get recommended users based on skills
// @route   GET /api/users/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const skills = currentUser.skills || [];
        const followingIds = currentUser.following.map(id => id.toString());
        
        // Exclude self and already followed users
        const excludeIds = [...followingIds, currentUser._id.toString()];

        const candidates = await User.find({
            _id: { $nin: excludeIds }
        }).select('_id name profilePic department skills followers');

        const scoredCandidates = candidates.map(candidate => {
            let skillMatchCount = 0;
            if (skills.length > 0 && candidate.skills) {
                skillMatchCount = candidate.skills.filter(skill => skills.includes(skill)).length;
            }

            let mutualConnectionsCount = 0;
            if (candidate.followers) {
                // A mutual connection is someone the current user follows, who also follows the candidate
                mutualConnectionsCount = candidate.followers.filter(followerId => 
                    followingIds.includes(followerId.toString())
                ).length;
            }

            return {
                ...candidate.toObject(),
                skillMatchCount,
                mutualConnectionsCount
            };
        });

        // Sort by highest skill match, then mutual connections
        scoredCandidates.sort((a, b) => {
            if (b.skillMatchCount !== a.skillMatchCount) {
                return b.skillMatchCount - a.skillMatchCount;
            }
            return b.mutualConnectionsCount - a.mutualConnectionsCount;
        });

        // Return top 6 recommendations
        res.json(scoredCandidates.slice(0, 6));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export {
    getUserProfile,
    updateUserProfile,
    updateProfilePic,
    updateBanner,
    followUser,
    unfollowUser,
    searchUsers,
    getUsers,
    getUserById,
    getFollowers,
    getFollowing,
    getRecommendations
};
