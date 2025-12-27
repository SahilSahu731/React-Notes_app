
import Note from "../models/note.model.js";
import User from "../models/user.model.js";

// @desc    Get all notes for the logged-in user
// @route   GET /api/v1/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const { isTrashed, isArchived, search } = req.query;
    
    let query = { owner: req.user.id };

    if (isTrashed !== undefined) {
      query.isTrashed = isTrashed === 'true';
    } else {
        // By default, don't show trashed notes unless specifically asked
        query.isTrashed = false;
    }

    if (isArchived !== undefined) {
      query.isArchived = isArchived === 'true';
    }
     // If not querying for archived specifically, usually we show active (non-archived) notes
     // But let's handle that in frontend logic or make it flexible here. 
     // For now, if isArchived is NOT provided, we might want to return everything or just active?
     // Let's assume standard behavior: get main notes (not archived, not trashed) default.
     if (isArchived === undefined && isTrashed === undefined) {
         query.isArchived = false;
         query.isTrashed = false;
     }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Get single note
// @route   GET /api/v1/notes/:id
// @access  Private
export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Create a new note
// @route   POST /api/v1/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, color, isPinned, isArchived } = req.body;

    const note = await Note.create({
      title,
      content,
      tags,
      color,
      isPinned,
      isArchived,
      owner: req.user.id,
    });

    // Update user note count
    await User.findByIdAndUpdate(req.user.id, { $inc: { noteCount: 1 } });

    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Update a note
// @route   PUT /api/v1/notes/:id
// @access  Private
export const updateNote = async (req, res) => {
  try {
    let note = await Note.findOne({ _id: req.params.id, owner: req.user.id });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Delete a note (permanently or soft delete?)
// @route   DELETE /api/v1/notes/:id
// @access  Private
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // If it's already trashed, delete permanently. If not, move to trash.
    // Or we provide a query param ?permanent=true
    
    if (req.query.permanent === 'true') {
        await note.deleteOne();
        await User.findByIdAndUpdate(req.user.id, { $inc: { noteCount: -1 } });
        return res.status(200).json({ success: true, message: "Note permanently deleted" });
    } else {
        note.isTrashed = true;
        await note.save();
        return res.status(200).json({ success: true, message: "Note moved to trash" });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// @desc    Restore a note from trash
// @route   PUT /api/v1/notes/:id/restore
// @access  Private
export const restoreNote = async (req, res) => {
    try {
      const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });
  
      if (!note) {
        return res.status(404).json({ success: false, message: "Note not found" });
      }
  
      note.isTrashed = false;
      await note.save();
  
      res.status(200).json({ success: true, message: "Note restored", note });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
  };
