import Folder from "../models/folder.model.js";
import Note from "../models/note.model.js";

// @desc    Get all folders for the logged-in user
// @route   GET /api/v1/folders
// @access  Private
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.id })
      .populate("noteCount")
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({ success: true, count: folders.length, folders });
  } catch (err) {
    console.error("[FOLDER] Get folders error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Get single folder with notes
// @route   GET /api/v1/folders/:id
// @access  Private
export const getFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ 
      _id: req.params.id, 
      owner: req.user.id 
    }).populate("noteCount");

    if (!folder) {
      return res.status(404).json({ success: false, message: "Folder not found" });
    }

    res.status(200).json({ success: true, folder });
  } catch (err) {
    console.error("[FOLDER] Get folder error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Create a new folder
// @route   POST /api/v1/folders
// @access  Private
export const createFolder = async (req, res) => {
  try {
    const { name, color, icon, parent } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Folder name is required" });
    }

    // Check if folder with same name exists for this user
    const existingFolder = await Folder.findOne({ 
      owner: req.user.id, 
      name: name.trim(),
      parent: parent || null
    });

    if (existingFolder) {
      return res.status(400).json({ success: false, message: "Folder with this name already exists" });
    }

    // Get max order for new folder
    const maxOrder = await Folder.findOne({ owner: req.user.id, parent: parent || null })
      .sort({ order: -1 })
      .select("order");

    const folder = await Folder.create({
      name: name.trim(),
      color: color || "#2383e2",
      icon: icon || "folder",
      owner: req.user.id,
      parent: parent || null,
      order: maxOrder ? maxOrder.order + 1 : 0,
    });

    // Populate noteCount (will be 0 for new folder)
    await folder.populate("noteCount");

    res.status(201).json({ success: true, folder });
  } catch (err) {
    console.error("[FOLDER] Create folder error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Update a folder
// @route   PUT /api/v1/folders/:id
// @access  Private
export const updateFolder = async (req, res) => {
  try {
    let folder = await Folder.findOne({ _id: req.params.id, owner: req.user.id });

    if (!folder) {
      return res.status(404).json({ success: false, message: "Folder not found" });
    }

    const { name, color, icon, parent, order } = req.body;

    // Check for duplicate name if name is being changed
    if (name && name.trim() !== folder.name) {
      const existingFolder = await Folder.findOne({ 
        owner: req.user.id, 
        name: name.trim(),
        parent: parent || folder.parent,
        _id: { $ne: folder._id }
      });

      if (existingFolder) {
        return res.status(400).json({ success: false, message: "Folder with this name already exists" });
      }
    }

    folder = await Folder.findByIdAndUpdate(
      req.params.id,
      { 
        name: name?.trim() || folder.name,
        color: color || folder.color,
        icon: icon || folder.icon,
        parent: parent !== undefined ? parent : folder.parent,
        order: order !== undefined ? order : folder.order,
      },
      { new: true, runValidators: true }
    ).populate("noteCount");

    res.status(200).json({ success: true, folder });
  } catch (err) {
    console.error("[FOLDER] Update folder error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Delete a folder
// @route   DELETE /api/v1/folders/:id
// @access  Private
export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.id });

    if (!folder) {
      return res.status(404).json({ success: false, message: "Folder not found" });
    }

    // Option 1: Move notes to root (no folder)
    // Option 2: Delete notes in folder
    // We'll go with Option 1 - move notes to root
    await Note.updateMany(
      { folder: folder._id, owner: req.user.id },
      { folder: null }
    );

    // Also handle child folders - move them to root
    await Folder.updateMany(
      { parent: folder._id, owner: req.user.id },
      { parent: null }
    );

    await folder.deleteOne();

    res.status(200).json({ success: true, message: "Folder deleted" });
  } catch (err) {
    console.error("[FOLDER] Delete folder error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Reorder folders
// @route   PUT /api/v1/folders/reorder
// @access  Private
export const reorderFolders = async (req, res) => {
  try {
    const { folderOrders } = req.body; // Array of { id, order }

    if (!Array.isArray(folderOrders)) {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    const updatePromises = folderOrders.map(({ id, order }) =>
      Folder.findOneAndUpdate(
        { _id: id, owner: req.user.id },
        { order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    const folders = await Folder.find({ owner: req.user.id })
      .populate("noteCount")
      .sort({ order: 1 });

    res.status(200).json({ success: true, folders });
  } catch (err) {
    console.error("[FOLDER] Reorder folders error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
