
import express from "express";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  restoreNote
} from "../controllers/note.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect); // Protect all routes

router.route("/")
  .get(getNotes)
  .post(createNote);

router.route("/:id")
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

router.put("/:id/restore", restoreNote);

export default router;
