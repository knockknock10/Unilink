import express from 'express';
import { getMessages, getConversations, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.post('/', protect, sendMessage);
router.get('/:userId', protect, getMessages);

export default router;
