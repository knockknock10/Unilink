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

router.route('/').get(getUsers);

router.route('/search').get(searchUsers);

router.route('/recommendations').get(protect, getRecommendations);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/profile-pic').put(protect, handleProfileUpload, updateProfilePic);

router.route('/banner').put(protect, handleProfileUpload, updateBanner);

router.route('/:id').get(getUserById);

router.route('/:id/follow').put(protect, followUser);
router.route('/:id/unfollow').put(protect, unfollowUser);

router.route('/:id/followers').get(getFollowers);
router.route('/:id/following').get(getFollowing);

export default router;

