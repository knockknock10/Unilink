import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Post from './models/Post.js';
import Profile from './models/Profile.js';
import connectDB from './config/db.js';

dotenv.config();

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

const postTexts = [
  "Finally finished my #ReactJS assignment. The struggles of a #CSStudent are real! 😅",
  "Anyone participating in the upcoming #Hackathon2026? Looking for a frontend teammate.",
  "Just uploaded my notes for #DBMSNotes. Checkout the link in bio. #StudySmart",
  "The new cafeteria pasta is actually decent today. #HostelLife #Foodie",
  "Can someone suggest good resources for #MachineLearning? Thinking of starting with Python.",
  "Mech students: The robotics club meeting is shifted to 5 PM. #Robotics #Update",
  "Who's ready for the midterms? Because I'm definitely not 😭 #ExamFever",
  "Just completed my first #OpenSource contribution! #DevLife",
  "Any seniors here from the #Electronics department? Needed some guidance for projects.",
  "The library is closed on Sundays now? Why do they do this before exams... #Rant #CollegeLife",
  "Finally got placed! Big thanks to my friends for the support ❤️ #Graduation #Placement",
  "Looking for roommates in the north campus block. Hmu! #HostelLife",
  "Our college fest is announced! What events are you guys waiting for? #Fest2026",
  "Can someone share the syllabus for Computer Networks? Lost track of it. #Syllabus #Help",
  "Just wrapped up an amazing seminar on #AI and #FutureTech."
];

const commentsList = [
  "So true! 😭",
  "Congrats!! 🎉",
  "Check your DM, I can help out.",
  "Thanks for sharing!",
  "I was wondering the same thing.",
  "Count me in!",
  "Great job, keep it up!",
  "Same here, completely lost.",
  "That looks awesome.",
  "Does anyone know if attendance is mandatory?"
];

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB...');

        await Post.deleteMany();
        await Profile.deleteMany();
        await User.deleteMany();
        console.log('Data cleared...');

        // Create Users
        const savedUsers = [];
        for (const u of usersData) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(u.password, salt);
            
            const newUser = new User({
                ...u,
                password: hashedPassword
            });
            await newUser.save();
            savedUsers.push(newUser);
        }
        console.log('Users seeded...');

        // Relationships: Add followers randomly
        for (const u of savedUsers) {
            // Pick 3 random followers
            for (let i = 0; i < 3; i++) {
                const randomUser = savedUsers[Math.floor(Math.random() * savedUsers.length)];
                if (u._id.toString() !== randomUser._id.toString() && !u.followers.includes(randomUser._id)) {
                    u.followers.push(randomUser._id);
                    randomUser.following.push(u._id);
                    await randomUser.save();
                }
            }
            await u.save();
        }
        console.log('Followers seeded...');

        // Create Posts
        for (let i = 0; i < postTexts.length; i++) {
            const author = savedUsers[i % savedUsers.length];

            const numLikes = Math.floor(Math.random() * 8) + 2; // 2 to 9 likes
            const likedBy = [];
            for (let l = 0; l < numLikes; l++) {
                const randomLiker = savedUsers[Math.floor(Math.random() * savedUsers.length)];
                if (!likedBy.includes(randomLiker._id)) {
                    likedBy.push(randomLiker._id);
                }
            }

            const numComments = Math.floor(Math.random() * 4) + 1; // 1 to 4 comments
            const comments = [];
            for (let c = 0; c < numComments; c++) {
                comments.push({
                    user: savedUsers[Math.floor(Math.random() * savedUsers.length)]._id,
                    text: commentsList[Math.floor(Math.random() * commentsList.length)],
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
                });
            }

            const post = new Post({
                user: author._id,
                text: postTexts[i],
                likes: likedBy.length,
                likedBy: likedBy,
                comments: comments
            });

            await post.save();
        }

        console.log('Posts seeded...');
        console.log('All UniLink data seeded successfully!');
        return true;
    } catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    }
};

export default seedData;
