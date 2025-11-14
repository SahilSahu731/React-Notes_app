import express from "express";
import { changeProfilePicture, getUser } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get('/profile', protect, getUser);


export default router;