import express from "express";
import {
  getFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  reorderFolders,
} from "../controllers/folder.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route("/")
  .get(getFolders)
  .post(createFolder);

router.route("/reorder")
  .put(reorderFolders);

router.route("/:id")
  .get(getFolder)
  .put(updateFolder)
  .delete(deleteFolder);

export default router;
