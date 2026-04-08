import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import path from 'path';
import fs from 'fs';

// Initialize env
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Body Parser & CORS
app.use(express.json());
app.use(cors());

// Serve Static Files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/groups', groupRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('UniLink API is running...');
});

// Setup Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}\x1b[0m`);
});
