import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, location } = req.body;
    
    if (!title || !description || !date || !location) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    const event = await Event.create({
        title,
        description,
        date,
        location,
        creator: req.user._id,
        attendees: [req.user._id]
    });

    res.status(201).json(event);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find()
        .populate('creator', 'name avatar')
        .populate('attendees', 'name avatar')
        .sort({ date: 1 });
    res.json(events);
});

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (event.attendees.includes(req.user._id)) {
        res.status(400);
        throw new Error('Already registered for this event');
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.json({ message: 'Registered successfully', event });
});

export { createEvent, getEvents, registerForEvent };
