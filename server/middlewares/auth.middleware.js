import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    console.log('Cookies:', req.cookies);
    const token = req.cookies.token;
    console.log('Token from cookie:', token);
    
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const payload = verifyAccessToken(token);
    console.log('Token payload:', payload);
    
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.log('Auth error:', err.message);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
