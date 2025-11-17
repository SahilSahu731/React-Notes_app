import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};