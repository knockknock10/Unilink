import dotenv from 'dotenv';
dotenv.config(); // Must be first — before any other imports that read process.env

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import Message from './models/Message.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import seedData from './seed.js';

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import path from 'path';
import fs from 'fs';

// Connect to MongoDB Atlas
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.io Logic 
const users = {}; // userId -> socketId

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      const message = await Message.create({ sender: senderId, receiver: receiverId, text });

      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('getMessage', message);
      }

      socket.emit('messageSent', message);
    } catch (error) {
      console.error('Error saving message:', error.message);
    }
  });

  socket.on('disconnect', () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log('User disconnected');
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve Static Files (local uploads for dev)
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Define all routes on a central router
const mainRouter = express.Router();
mainRouter.use('/auth', authRoutes);
mainRouter.use('/users', userRoutes);
mainRouter.use('/posts', postRoutes);
mainRouter.use('/events', eventRoutes);
mainRouter.use('/groups', groupRoutes);
mainRouter.use('/admin', adminRoutes);
mainRouter.use('/chat', chatRoutes);

mainRouter.get('/seed', async (req, res) => {
  try {
    await seedData();
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
});

mainRouter.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'UniLink API is running...',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: {
      hasMongo: !!process.env.MONGO_URI,
      hasJwt: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      isNetlify: !!process.env.NETLIFY
    }
  });
});

// Mount the router at both /api (for local) and / (for Netlify/production)
app.use('/api', mainRouter);
app.use('/', mainRouter);

//Error Handlers 
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5001;

// Only start the server if not running in a serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL) {
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export { app, server, io };
export default app;
