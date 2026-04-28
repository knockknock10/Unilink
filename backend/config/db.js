import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Atlas Connected ✅");
  } catch (error) {
    console.error("DB Error:", error.message);
    if (!process.env.MONGO_URI) {
        console.error("CRITICAL: MONGO_URI is not defined!");
    }
  }
};

export default connectDB;
