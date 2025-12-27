import express from "express";
import { updateUserProfile, changePassword, deleteAccount, getUser } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/profile', protect, getUser);
router.put('/profile', protect, updateUserProfile);
router.put('/profile/password', protect, changePassword);
router.delete('/profile', protect, deleteAccount);

export default router;