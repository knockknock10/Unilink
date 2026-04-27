import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        bio: {
            type: String,
            default: '',
        },
        profilePic: {
            type: String,
            default: '',
        },
        bannerImage: {
            type: String,
            default: '',
        },
        department: {
            type: String,
            default: '',
        },
        year: {
            type: String,
            default: '',
        },
        skills: {
            type: [String],
            default: [],
        },
        interests: {
            type: [String],
            default: [],
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    
    // If password already looks like a bcrypt hash (starts with $2a$ or $2b$), don't hash again
    if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// matchPassword and other methods remain here if needed
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password || !enteredPassword) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);

export default User;
