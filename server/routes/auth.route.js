import express from "express";
import { register, login, getUser } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getUser);
// router.post("/logout", logout);

export default router;
