import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { signAccessToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, username } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const user = new User({ name, email, password, username });
    await user.save();

    // Create verification token (one-time token) - use JWT or DB token
    const verifyToken = signAccessToken({ id: user._id }); // or custom token
    // const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${verifyToken}`;

    // await sendEmail({
    //   to: user.email,
    //   subject: "Verify your email",
    //   html: `Click <a href="${verifyUrl}">here</a> to verify your email.`,
    // });
    
    res.cookie("token", verifyToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: process.env.COOKIE_DOMAIN,
    });

    res.status(201).json({ 
        success : true,
        message : "User Registered Successfully",
        user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // if (!user.isVerified) return res.status(403).json({ message: "Please verify your email" });

    const accessToken = signAccessToken({ id: user._id });

    // Set refresh token cookie (HttpOnly)
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: process.env.COOKIE_DOMAIN,
    });

    // Return access token in JSON (or as header)
    res.json({ success: true, accessToken, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const changeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const file = req.file;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(file.path);

    // Update user profile picture
    user.profilePicture = result.secure_url;
    await user.save();

    res.json({ success: true, profilePicture: user.profilePicture });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};