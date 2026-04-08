import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const { image, video, document } = req.files || {};

    if (!text && !image && !video && !document) {
        res.status(400);
        throw new Error('Post cannot be empty');
    }

    const postData = {
        text: text || '',
        user: req.user._id,
    };

    if (image && image.length > 0) {
        postData.image = `/uploads/images/${image[0].filename}`;
    }
    if (video && video.length > 0) {
        postData.video = `/uploads/videos/${video[0].filename}`;
    }
    if (document && document.length > 0) {
        postData.document = `/uploads/docs/${document[0].filename}`;
    }

    const post = await Post.create(postData);
    const populatedPost = await Post.findById(post._id).populate('user', 'name email avatar');
    res.status(201).json(populatedPost);
});

// uploadPost merged into createPost

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Post.countDocuments();
    const posts = await Post.find()
        .populate('user', 'name email avatar')
        .populate('comments.user', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ posts, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('user', 'name email avatar')
        .populate('comments.user', 'name avatar');

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (post) {
        // Check for user
        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        post.text = text || post.text;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        // Check for user
        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Like / Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLikePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        const userId = req.user._id.toString();
        const isLiked = post.likedBy.includes(userId);

        if (isLiked) {
            // Unlike
            post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
            post.likes = Math.max(0, post.likes - 1);
        } else {
            // Like
            post.likedBy.push(userId);
            post.likes = post.likes + 1;
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Get user's own posts
// @route   GET /api/posts/my/all
// @access  Private
const getMyPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ user: req.user._id })
        .populate('user', 'name email avatar')
        .populate('comments.user', 'name avatar')
        .sort({ createdAt: -1 });

    res.json(posts);
});

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.status(400);
        throw new Error('Comment text is required');
    }

    const post = await Post.findById(req.params.id);

    if (post) {
        const comment = {
            user: req.user._id,
            text,
        };

        post.comments.push(comment);
        await post.save();

        const updatedPost = await Post.findById(req.params.id)
             .populate('user', 'name email avatar')
             .populate('comments.user', 'name avatar');

        res.status(201).json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Get user's posts
// @route   GET /api/posts/user/:id
// @access  Public
const getUserPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ user: req.params.id })
        .populate('user', 'name email avatar')
        .populate('comments.user', 'name avatar')
        .sort({ createdAt: -1 });

    res.json(posts);
});

export {
    createPost,
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLikePost,
    getMyPosts,
    addComment,
    getUserPosts
};
