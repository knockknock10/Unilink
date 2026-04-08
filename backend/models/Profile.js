import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
