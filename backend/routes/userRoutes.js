import express from 'express';
import { getUserProfile, updateUserProfile, followUser, unfollowUser, getUsers, getUserById } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getUsers);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/:id').get(getUserById);
router.route('/:id/follow').put(protect, followUser);
router.route('/:id/unfollow').put(protect, unfollowUser);

export default router;
