import express from "express";
import { getAllUsers } from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/users", adminMiddleware, getAllUsers);

export default router;