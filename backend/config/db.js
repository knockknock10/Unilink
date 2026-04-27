import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected ✅");
  } catch (error) {
    console.error("DB Error:", error.message);
    // process.exit(1); // Removed to allow UI testing without DB
  }
};

export default connectDB;
