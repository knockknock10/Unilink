import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        text: {
            type: String,
            maxlength: [1000, 'Text cannot exceed 1000 characters'],
        },
        image: {
            type: String, // Store file URL
        },
        video: {
            type: String, // Store file URL
        },
        document: {
            type: String, // Store file URL for PDFs/Docs
        },
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                text: String,
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
