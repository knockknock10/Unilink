import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
    getAllUsers,
    deleteUser,
    deletePost,
    getAllPosts,
    updateUserRole,
    getStats,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.get('/posts', getAllPosts);
router.delete('/posts/:id', deletePost);

export default router;
