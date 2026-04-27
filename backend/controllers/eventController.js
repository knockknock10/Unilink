import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Helper: safely delete a temp file
const cleanupFile = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (_) {}
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
    const filePath = req.file?.path;
    try {
        const { title, description, date, location } = req.body;
        
        if (!title || !description || !date || !location) {
            cleanupFile(filePath);
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'unilink/events',
                resource_type: 'auto',
            });
            imageUrl = result.secure_url;
            cleanupFile(filePath);
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            image: imageUrl,
            creator: req.user._id,
            attendees: [req.user._id]
        });

        res.status(201).json(event);
    } catch (error) {
        cleanupFile(filePath);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find()
        .populate('creator', 'name profilePic')
        .populate('attendees', 'name profilePic')
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

    if (event.attendees.some(id => id.toString() === req.user._id.toString())) {
        res.status(400);
        throw new Error('Already registered for this event');
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.json({ message: 'Registered successfully', event });
});

export { createEvent, getEvents, registerForEvent };
