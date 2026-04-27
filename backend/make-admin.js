/**
 * make-admin.js
 * Usage: node make-admin.js <email>
 * Promotes an existing user to the 'admin' role.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const email = process.argv[2];
if (!email) {
    console.error('Usage: node make-admin.js <email>');
    process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

const user = await User.findOne({ email });
if (!user) {
    console.error(`No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
}

user.role = 'admin';
await user.save();

console.log(`"${user.name}" (${user.email}) is now an admin.`);
await mongoose.disconnect();
