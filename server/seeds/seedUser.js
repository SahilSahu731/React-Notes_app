// seedUsers.js
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

const generateRandomUsername = (name) => {
  return name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
};

const generateRandomEmail = (username) => {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "protonmail.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
};

const randomName = () => {
  const firstNames = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Krishna", "Ishaan",
    "Rohan", "Aryan", "Dhruv", "Reyansh", "Saanvi", "Diya", "Ananya", "Aadhya",
    "Pari", "Aarohi", "Mira", "Navya"
  ];
  const lastNames = [
    "Sharma", "Verma", "Gupta", "Patel", "Reddy", "Nair", "Kumar", "Singh",
    "Chopra", "Mehta", "Bansal", "Agarwal", "Joshi", "Pandey", "Sahu", "Yadav"
  ];

  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

const seedUsers = async () => {
  try {
    await connectDB();

    console.log("⚙️ Generating fake users...");

    const users = [];
    const salt = await bcrypt.genSalt(10);

    for (let i = 0; i < 50; i++) {
      const name = randomName();
      const username = generateRandomUsername(name.split(" ")[0]);
      const email = generateRandomEmail(username);
      const hashedPassword = await bcrypt.hash("password123", salt);

      users.push({
        name,
        username,
        email,
        password: hashedPassword,
        bio: "Hey 👋 I love writing notes!",
        isVerified: Math.random() < 0.7, // 70% verified
        plan: Math.random() < 0.8 ? "free" : "pro",
        noteCount: Math.floor(Math.random() * 100),
      });
    }

    // 🧩 Insert in bulk
    await User.insertMany(users);

    console.log(`✅ Inserted ${users.length} users successfully!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

// seedUsers();

const addRoleToUsers = async () => {
  try {
    await connectDB();

    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "user" } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users successfully!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating users:", err);
    process.exit(1);
  }
};

addRoleToUsers();