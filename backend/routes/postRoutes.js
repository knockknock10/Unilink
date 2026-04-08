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
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), createPost)
  .get(getPosts);

router.get('/my/all', protect, getMyPosts);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like').put(protect, toggleLikePost);
router.route('/:id/comment').post(protect, addComment);

export default router;
