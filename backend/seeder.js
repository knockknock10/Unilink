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
            { name: 'Aarav Patel', email: 'aarav@example.com', password: 'password123', department: 'Computer Science', year: '3rd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav' },
            { name: 'Vivaan Sharma', email: 'vivaan@example.com', password: 'password123', department: 'Electronics', year: '2nd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vivaan' },
            { name: 'Aditya Singh', email: 'aditya@example.com', password: 'password123', department: 'Information Technology', year: '4th Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya' },
            { name: 'Vihaan Gupta', email: 'vihaan@example.com', password: 'password123', department: 'Mechanical', year: '3rd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vihaan' },
            { name: 'Arjun Kumar', email: 'arjun@example.com', password: 'password123', department: 'Computer Science', year: '1st Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun' },
            { name: 'Sai Krishna', email: 'sai@example.com', password: 'password123', department: 'Civil', year: '2nd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sai' },
            { name: 'Ayaan Desai', email: 'ayaan@example.com', password: 'password123', department: 'Computer Science', year: '4th Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayaan' },
            { name: 'Krishna Reddy', email: 'krishna@example.com', password: 'password123', department: 'Information Technology', year: '3rd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Krishna' },
            { name: 'Ishaan Joshi', email: 'ishaan@example.com', password: 'password123', department: 'Electronics', year: '1st Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ishaan' },
            { name: 'Shaurya Mehta', email: 'shaurya@example.com', password: 'password123', department: 'Mechanical', year: '4th Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shaurya' },
            { name: 'Ananya Iyer', email: 'ananya@example.com', password: 'password123', department: 'Computer Science', year: '2nd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya' },
            { name: 'Diya Bhatia', email: 'diya@example.com', password: 'password123', department: 'Civil', year: '3rd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diya' },
            { name: 'Myra Nair', email: 'myra@example.com', password: 'password123', department: 'Information Technology', year: '2nd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Myra' },
            { name: 'Riya Menon', email: 'riya@example.com', password: 'password123', department: 'Electronics', year: '3rd Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya' },
            { name: 'Sneha Dubey', email: 'sneha@example.com', password: 'password123', department: 'Computer Science', year: '4th Year', profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' }
        ];

        // Hash passwords before creating users
        const hashedUsersData = await Promise.all(usersData.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        const createdUsers = await User.create(hashedUsersData);

        // Create Profiles
        const profilesData = createdUsers.map(user => ({
            user: user._id,
            department: user.department,
            year: user.year,
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
