
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#ffffff", // Default white, can be hex or theme name
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null, // null means no folder (root level)
    },
  },
  { timestamps: true }
);

// Index to speed up searching by owner and status
noteSchema.index({ owner: 1, isTrashed: 1, isArchived: 1 });

const Note = mongoose.model("Note", noteSchema);
export default Note;
