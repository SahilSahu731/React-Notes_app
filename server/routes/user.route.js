import express from "express";
import { updateUserProfile, changePassword, deleteAccount, getUser, updateAvatar } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get('/profile', protect, getUser);
router.put('/profile', protect, updateUserProfile);
router.put('/profile/avatar', protect, upload.single('avatar'), updateAvatar);
router.put('/profile/password', protect, changePassword);
router.delete('/profile', protect, deleteAccount);

export default router;