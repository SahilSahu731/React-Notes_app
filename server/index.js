import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
app.use(limiter);

app.use("/api/v1/auth", authRoutes);


// Connect to MongoDB database
connectDB();

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});