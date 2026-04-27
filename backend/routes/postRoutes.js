import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
  getMyPosts,
  addComment,
  getUserPosts,
  getTrendingHashtags,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handlePostUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, handlePostUpload, createPost)
  .get(getPosts);

// Must be before /:id routes to avoid conflict
router.get('/trending', getTrendingHashtags);
router.get('/my/all', protect, getMyPosts);
router.get('/user/:id', getUserPosts);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like').put(protect, toggleLikePost);
router.route('/:id/comment').post(protect, addComment);

export default router;
