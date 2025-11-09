import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import User model
import User from '../models/User.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Fake users data
const fakeUsers = [
  {
    firstName: 'Hamza',
    lastName: 'ben hnia',
    email: 'hamza.benhnia@example.com',
    password: 'Password123!',
    work: 'Developer',
    role: 'admin'
  },
  {
    firstName: 'Taieb',
    lastName: 'jlassi',
    email: 'taieb.jlassi@example.com',
    password: 'Password123!',
    work: 'Designer',
    role: 'user'
  }
];

// Seed users
const seedUsers = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('\n🌱 Starting to seed users...\n');

    // Optional: Clear existing users (uncomment to delete all users first)
    // await User.deleteMany({});
    // console.log('🗑️  Existing users deleted\n');

    // Check if users already exist and create them
    for (const userData of fakeUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.firstName} ${userData.lastName} already exists, skipping...`);
        continue;
      }

      // Create user (password will be hashed by the User model pre-save hook)
      const user = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        work: userData.work,
        role: userData.role
      });

      console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
    }

    console.log('\n🎉 Seeding completed successfully!\n');
    console.log('📋 Login credentials:\n');
    fakeUsers.forEach(user => {
      console.log(`   👤 ${user.firstName} ${user.lastName}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Password: ${user.password}`);
      console.log(`      Role: ${user.role}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

// Run seeder
seedUsers();
