const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Ensure this matches your models folder
require('dotenv').config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for Seeding...");

        // Clear existing test users to avoid duplicates
        await User.deleteMany({ email: { $in: ['test@gmail.com', 'junior@test.com', 'teacher@test.com'] } });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            { name: 'Abdul Senior', email: 'test@gmail.com', password: hashedPassword, role: 'senior' },
            { name: 'Junior Student', email: 'junior@test.com', password: hashedPassword, role: 'junior' },
            { name: 'Teacher User', email: 'teacher@test.com', password: hashedPassword, role: 'teacher' }
        ];

        await User.insertMany(users);
        console.log("Success: Test users created! Use password: password123");
        process.exit();
    } catch (err) {
        console.error("Seeding Error:", err.message);
        process.exit(1);
    }
};

seedUsers();