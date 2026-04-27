import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Post from '../models/Post.js';

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own admin account' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Also delete all their posts
        await Post.deleteMany({ user: user._id });
        await user.deleteOne();

        return res.json({ message: `User "${user.name}" and all their posts have been deleted` });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a post (admin)
// @route   DELETE /api/admin/posts/:id
// @access  Admin
const deletePost = asyncHandler(async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.deleteOne();
        return res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Post not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Get all posts (admin)
// @route   GET /api/admin/posts
// @access  Admin
const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = 20;

        const count = await Post.countDocuments();
        const posts = await Post.find({})
            .populate('user', 'name email profilePic role')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        return res.json({ posts, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Promote or demote user role (admin)
// @route   PUT /api/admin/users/:id/role
// @access  Admin
const updateUserRole = asyncHandler(async (req, res) => {
    try {
        const { role } = req.body;

        if (!['student', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be "student" or "admin"' });
        }

        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot change your own role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        return res.json({
            message: `User "${user.name}" is now a ${role}`,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: error.message });
    }
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = asyncHandler(async (req, res) => {
    try {
        const [totalUsers, totalPosts, totalAdmins] = await Promise.all([
            User.countDocuments(),
            Post.countDocuments(),
            User.countDocuments({ role: 'admin' }),
        ]);

        // Recent activity: users joined in last 7 days
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsers = await User.countDocuments({ createdAt: { $gte: weekAgo } });
        const newPosts = await Post.countDocuments({ createdAt: { $gte: weekAgo } });

        return res.json({ totalUsers, totalPosts, totalAdmins, newUsers, newPosts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export { getAllUsers, deleteUser, deletePost, getAllPosts, updateUserRole, getStats };
