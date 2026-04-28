import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Atlas Connected: ${db.connection.host} ✅`);
  } catch (error) {
    console.error("MongoDB Connection Error: ❌", error.message);
    if (!process.env.MONGO_URI) {
        console.error("CRITICAL: MONGO_URI is missing from environment variables!");
    }
    // Don't exit process in serverless!
  }
};

export default connectDB;
