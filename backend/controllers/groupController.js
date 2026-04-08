import asyncHandler from 'express-async-handler';
import Group from '../models/Group.js';

// @desc    Create new group
// @route   POST /api/groups
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    
    if (!name || !description) {
        res.status(400);
        throw new Error('Please provide name and description');
    }

    const group = await Group.create({
        name,
        description,
        creator: req.user._id,
        members: [req.user._id]
    });

    res.status(201).json(group);
});

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
const getGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find()
        .populate('creator', 'name avatar')
        .populate('members', 'name avatar')
        .sort({ createdAt: -1 });
        
    res.json(groups);
});

// @desc    Join group
// @route   POST /api/groups/:id/join
// @access  Private
const joinGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    if (group.members.includes(req.user._id)) {
        res.status(400);
        throw new Error('Already a member of this group');
    }

    group.members.push(req.user._id);
    await group.save();

    res.json({ message: 'Joined successfully', group });
});

export { createGroup, getGroups, joinGroup };
