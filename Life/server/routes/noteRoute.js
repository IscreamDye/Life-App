import express from "express";
import authMiddleware from "../controllers/authMiddleware.js"; // adjust path
import Note from "../models/noteProfile.js";
import User from "../models/user.js"

const router = express.Router();
/*
// POST /tracker/addCounter
router.post("/addNote", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newNote = new Note({
      user: req.user.id,
      title,
      list: [],  // start with empty list
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (err) {
    console.error("AddNote Error:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});


// PUT /tracker/addEntry/:noteId
router.put("/addEntry/:noteId", authMiddleware, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { entry } = req.body;

    if (!entry.trim()) {
      return res.status(400).json({ error: "Entry cannot be empty" });
    }

    const note = await Note.findOne({ _id: noteId, user: req.user.id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.entries.push(entry.trim());
    await note.save();

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add entry" });
  }
});

router.put("/removeEntry/:noteId/:entryIndex", authMiddleware, async (req, res) => {
  try {
    const { noteId, entryIndex } = req.params;

    const note = await Note.findOne({ _id: noteId, user: req.user.id });
    if (!note) return res.status(404).json({ error: "Note not found" });

    const idx = parseInt(entryIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= note.entries.length) {
      return res.status(400).json({ error: "Invalid entry index" });
    }

    note.entries.splice(idx, 1);
    await note.save();

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove entry" });
  }
});

router.delete("/deleteNote/:noteId", authMiddleware, async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({ _id: noteId, user: req.user.id });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});



router.get("/allNotes", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});*/
router.get("/allNotes", async (req, res) => {
  try {
    const { userId, email } = req.query;

    if (typeof userId !== "string" || typeof email !== "string") {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.email !== email) {
      return res.status(403).json({ error: "Email mismatch" });
    }

    const notes = await Note.find({ user: userId });
    return res.json(notes);
  } catch (err) {
    console.error("Error in /allNotes:", err);
    return res.status(500).json({ error: "Failed to fetch notes" });
  }
});



// POST /tracker/addNote
router.post("/addNote", async (req, res) => {
  try {
    const { title, userId, email } = req.body;

    if (!title || !userId || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const newNote = new Note({
      user: userId,
      title,
      entries: [],
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("AddNote Error:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// PUT /tracker/addEntry/:noteId
router.put("/addEntry/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const { entry, userId, email } = req.body;

    if (!entry || !userId || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) return res.status(404).json({ error: "Note not found" });

    note.entries.push(entry.trim());
    await note.save();

    res.json(note);
  } catch (err) {
    console.error("AddEntry Error:", err);
    res.status(500).json({ error: "Failed to add entry" });
  }
});

// PUT /tracker/removeEntry/:noteId/:entryIndex
router.put("/removeEntry/:noteId/:entryIndex", async (req, res) => {
  try {
    const { noteId, entryIndex } = req.params;
    const { userId, email } = req.body;

    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) return res.status(404).json({ error: "Note not found" });

    const idx = parseInt(entryIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= note.entries.length) {
      return res.status(400).json({ error: "Invalid entry index" });
    }

    note.entries.splice(idx, 1);
    await note.save();

    res.json(note);
  } catch (err) {
    console.error("RemoveEntry Error:", err);
    res.status(500).json({ error: "Failed to remove entry" });
  }
});

// DELETE /tracker/deleteNote/:noteId
router.delete("/deleteNote/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId, email } = req.body; // <-- change here to req.body

    if (!userId || !email) {
      return res.status(400).json({ error: "Missing userId or email" });
    }

    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted successfully", _id: note._id });
  } catch (err) {
    console.error("DeleteNote Error:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});








export default router;