import express from 'express';
import { createGroup, getGroups, joinGroup } from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createGroup)
    .get(protect, getGroups);

router.post('/:id/join', protect, joinGroup);

export default router;
