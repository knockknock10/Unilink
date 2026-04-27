import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get message history between two users
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get list of users the current user has chatted with
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find all unique users who have sent messages to or received messages from the current user
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        }).sort({ createdAt: -1 });

        const chattedUserIds = new Set();
        messages.forEach((msg) => {
            if (msg.sender.toString() !== currentUserId.toString()) {
                chattedUserIds.add(msg.sender.toString());
            }
            if (msg.receiver.toString() !== currentUserId.toString()) {
                chattedUserIds.add(msg.receiver.toString());
            }
        });

        const users = await User.find({ _id: { $in: Array.from(chattedUserIds) } }).select('name profilePic bio');
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user._id;

        if (!receiverId || !text) {
            return res.status(400).json({ message: 'Receiver and text are required' });
        }

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            text,
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export { getMessages, getConversations, sendMessage };
