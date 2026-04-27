import express from 'express';
import {
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
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleProfileUpload } from '../middleware/profileUploadMiddleware.js';

const router = express.Router();

// Get all users
router.route('/').get(getUsers);

// Search users (must be BEFORE /:id to avoid "search" being treated as an id)
router.route('/search').get(searchUsers);

// Get user recommendations
router.route('/recommendations').get(protect, getRecommendations);

// Get / Update own profile
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Profile picture upload — multer error-handled, logs req.file
router.route('/profile-pic').put(protect, handleProfileUpload, updateProfilePic);

// Banner image upload — multer error-handled, logs req.file
router.route('/banner').put(protect, handleProfileUpload, updateBanner);

// Get user by ID
router.route('/:id').get(getUserById);

// Follow / Unfollow
router.route('/:id/follow').put(protect, followUser);
router.route('/:id/unfollow').put(protect, unfollowUser);

// Followers / Following lists
router.route('/:id/followers').get(getFollowers);
router.route('/:id/following').get(getFollowing);

export default router;

