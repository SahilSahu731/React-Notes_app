import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const payload = verifyToken(token);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
