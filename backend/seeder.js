import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Post from './models/Post.js';
import Profile from './models/Profile.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await Post.deleteMany();
        await Profile.deleteMany();
        await User.deleteMany();

        console.log('Data cleared...');

        // Users
        const usersData = [
            { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', bio: 'B.Tech CS Student | Coding enthusiast', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
            { name: 'Priya Verma', email: 'priya@example.com', password: 'password123', bio: 'Electronics Engineer | Love photography', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
            { name: 'Ankit Patel', email: 'ankit@example.com', password: 'password123', bio: 'Mechanical Student | Formula Student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit' },
            { name: 'Sneha Reddy', email: 'sneha@example.com', password: 'password123', bio: 'Biotech student | Researcher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' },
            { name: 'Arjun Singh', email: 'arjun@example.com', password: 'password123', bio: 'MBA candidate | Strategic thinker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun' },
            { name: 'Neha Gupta', email: 'neha@example.com', password: 'password123', bio: 'Design student | Creative soul', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha' },
            { name: 'Rohit Kumar', email: 'rohit@example.com', password: 'password123', bio: 'Civil Engineering | Building the future', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit' },
            { name: 'Kavya Nair', email: 'kavya@example.com', password: 'password123', bio: 'Literature student | Aspiring writer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya' },
            { name: 'Aditya Joshi', email: 'aditya@example.com', password: 'password123', bio: 'Physics major | Space enthusiast', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya' },
            { name: 'Pooja Mehta', email: 'pooja@example.com', password: 'password123', bio: 'Marketing student | Trend watcher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja' },
        ];

        // We don't hash here manually as pre-save hook in User model takes care of it,
        // but wait, User.model.create or seed often needs it if we use insertMany.
        // Actually User.js has a pre-save hook so it should be fine.

        const createdUsers = await User.create(usersData);

        // Create Profiles
        const profilesData = createdUsers.map(user => ({
            user: user._id,
            department: 'Computer Science',
            year: '3rd Year',
            skills: ['React', 'Node.js', 'MongoDB'],
            interests: ['Web Development', 'AI']
        }));
        await Profile.create(profilesData);

        console.log('Users and Profiles seeded...');

        // Posts
        const postsData = [
            { user: createdUsers[0]._id, text: 'Anyone has DBMS notes for the midterm exam? Need them urgently!' },
            { user: createdUsers[1]._id, text: 'The OS assignment is finally uploaded on the portal. Check it out!' },
            { user: createdUsers[2]._id, text: 'Exam timetable released today. Engineering students, brace yourselves!' },
            { user: createdUsers[3]._id, text: 'Does anyone know when the library closes this weekend?' },
            { user: createdUsers[4]._id, text: 'Just attended a workshop on Cloud Computing. Very insightful!' },
            { user: createdUsers[5]._id, text: 'Anyone interested in a late-night study session for the Math quiz?' },
            { user: createdUsers[6]._id, text: 'Found a great resource for learning React. Sharing the link below!' },
            { user: createdUsers[7]._id, text: 'The cafeteria' + "'" + 's coffee is actually keeping me alive today.' },
            { user: createdUsers[8]._id, text: 'Just started learning Python. The syntax is so clean!' },
            { user: createdUsers[9]._id, text: 'Can someone explain the difference between SQL and NoSQL in simple terms?' },
            { user: createdUsers[0]._id, text: 'Just posted my Discrete Mathematics solutions on the group.' },
            { user: createdUsers[1]._id, text: 'Has anyone seen my calculator? I left it in the canteen.' },
        ];

        await Post.create(postsData);

        console.log('Posts seeded...');
        console.log('All data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
