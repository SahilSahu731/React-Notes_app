import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import noteRoutes from "./routes/note.route.js";
import folderRoutes from "./routes/folder.route.js";

const app = express();

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL
].filter(Boolean);

console.log("[SERVER] Starting...");
console.log("[SERVER] Allowed CORS Origins:", allowedOrigins);

// CORS Configuration - This MUST be first
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("[CORS] Blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Body parsers
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 
});
app.use(limiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins,
      requestOrigin: req.headers.origin || "none"
    }
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/folders", folderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
  console.log(`[SERVER] API Base URL: http://localhost:${PORT}/api/v1`);
});