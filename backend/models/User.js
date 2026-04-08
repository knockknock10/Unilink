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
        profilePicture: {
            type: String,
            default: '',
        },
        avatar: {
            type: String,
            default: '',
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password || !enteredPassword) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
// Mongoose 9: async pre hooks do NOT receive `next` — just return or throw
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
