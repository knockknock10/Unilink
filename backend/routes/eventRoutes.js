import express from 'express';
import { createEvent, getEvents, registerForEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleProfileUpload } from '../middleware/profileUploadMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, handleProfileUpload, createEvent)
    .get(protect, getEvents);

router.post('/:id/register', protect, registerForEvent);

export default router;
