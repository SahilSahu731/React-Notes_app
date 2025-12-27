import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/jwt.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

export const register = async (req, res) => {
  console.log("[AUTH] Register attempt:", req.body.email);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("[AUTH] Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, username } = req.body;
    
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("[AUTH] Email already registered:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("[AUTH] Username already taken:", username);
      return res.status(400).json({ message: "Username already taken" });
    }

    // Create new user
    const user = new User({ name, email, password, username });
    await user.save();
    console.log("[AUTH] User created:", user._id);

    // Generate token
    const token = generateToken({ id: user._id });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("[AUTH] Registration successful:", user.email);
    
    res.status(201).json({ 
      success: true,
      message: "User Registered Successfully",
      accessToken: token,
      user: user.toJSON()
    });
  } catch (err) {
    console.error("[AUTH] Register error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  console.log("[AUTH] Login attempt:", req.body.email);
  
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("[AUTH] User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("[AUTH] Invalid password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("[AUTH] Login successful:", user.email);
    
    res.json({ 
      success: true, 
      accessToken: token, 
      user: user.toJSON() 
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("[AUTH] Get user error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, avatar } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.profilePicture = avatar;

    // Check if email is being updated to an existing one
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    await user.save();

    res.json({ 
      success: true, 
      user: user.toJSON(),
      message: "Profile updated successfully" 
    });
  } catch (err) {
    console.error("[USER] Update profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      // Cleanup local file if user not found
      if (req.file.path) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "User not found" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "my-notes/avatars",
      public_id: `avatar_${user._id}`,
      overwrite: true,
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "face" }
      ]
    });

    // Remove local file
    fs.unlinkSync(req.file.path);

    // Update user
    user.profilePicture = result.secure_url;
    await user.save();

    res.json({
      success: true,
      message: "Avatar updated successfully",
      profilePicture: user.profilePicture
    });
  } catch (err) {
    console.error("[USER] Update avatar error:", err);
    // Try to clean up local file
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("[USER] Change password error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all user's notes and folders?
    // Assuming we have Note and Folder models
    // import Note from "../models/note.model.js";
    // import Folder from "../models/folder.model.js";
    // For now, just delete the user. A real app should cascade delete.
    
    await user.deleteOne();

    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("[USER] Delete account error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  console.log("[AUTH] Logout");
  
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};