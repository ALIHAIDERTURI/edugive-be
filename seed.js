require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/userModel'); // Path to your User model
const {connectDB} = require('./src/configs/dbConfig'); // Path to your MongoDB connection file

const seedUsers = async () => {
  try {
    connectDB();

    // Clear existing data (optional)
    await User.deleteMany();
    console.log('Existing users deleted.');

    // Seed data
    const users = [
      {
        name: 'Admin User',
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10), // Hash the password
        role: 'admin',
        isVerified: true,
      },
      {
        name: 'Test Instructor',
        username: 'instructor',
        email: 'instructor@example.com',
        password: await bcrypt.hash('instructor123', 10),
        role: 'instructor',
        isVerified: true,
      },
      {
        name: 'Student User',
        username: 'student',
        email: 'student@example.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        isVerified: false,
      },
    ];

    // Insert data into the database
    await User.insertMany(users);
    console.log('Users seeded successfully.');

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();
