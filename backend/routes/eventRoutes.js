import express from 'express';
import { createEvent, getEvents, registerForEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createEvent)
    .get(protect, getEvents);

router.post('/:id/register', protect, registerForEvent);

export default router;
