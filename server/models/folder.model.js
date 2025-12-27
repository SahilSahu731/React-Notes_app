import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    color: {
      type: String,
      default: "#2383e2", // Default blue
    },
    icon: {
      type: String,
      default: "folder", // Default icon name
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null, // null means root level folder
    },
    order: {
      type: Number,
      default: 0, // For custom ordering
    },
  },
  { timestamps: true }
);

// Index for faster queries
folderSchema.index({ owner: 1, parent: 1 });

// Virtual for note count (populated when needed)
folderSchema.virtual("noteCount", {
  ref: "Note",
  localField: "_id",
  foreignField: "folder",
  count: true,
});

// Ensure virtuals are included in JSON
folderSchema.set("toJSON", { virtuals: true });
folderSchema.set("toObject", { virtuals: true });

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;
