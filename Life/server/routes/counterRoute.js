import express from "express";
import Counter from "../models/counterProfile.js";
import authMiddleware from "../controllers/authMiddleware.js"; // adjust path

const router = express.Router();

// POST /tracker/addCounter
router.post("/addCounter", async (req, res) => {
  try {
    const { title, value, userId } = req.body;
    if (!title || !userId) return res.status(400).json({ error: "Title and userId are required" });

    const newCounter = new Counter({
      user: userId,
      title,
      value: value || 0,
      
    });

    await newCounter.save();
    res.status(201).json(newCounter);
  } catch (err) {
    console.error("AddCounter Error:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});


// GET /tracker/allCounters (user-specific) --- req - request Contains everything about 
// the incoming request: body,params, headers, cookies (from authMiddleware).
// res - response Used to send data back to the frontend, like res.json(...), or res.status(...).send(...).
router.get("/allCounters", authMiddleware, async (req, res) => {
  try {
    const counters = await Counter.find({ user: req.user.id });
    res.json(counters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counters" });
  }
});

// PUT /tracker/updateCounter/:id
router.put("/updateCounter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { value, userId } = req.body;

    if (!userId || typeof value !== "number") {
      return res.status(400).json({ error: "userId and value are required" });
    }

    const updatedCounter = await Counter.findOneAndUpdate(
      { _id: id, user: userId },
      { value },
      { new: true }
    );

    if (!updatedCounter) {
      return res.status(404).json({ error: "Counter not found or not authorized" });
    }

    res.json(updatedCounter);
  } catch (err) {
    res.status(500).json({ error: "Failed to update counter", details: err.message });
  }
});


// DELETE /tracker/deleteCounter/:id
router.delete("/deleteCounter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const deletedCounter = await Counter.findOneAndDelete({ _id: id, user: userId });

    if (!deletedCounter) {
      return res.status(404).json({ error: "Counter not found or not authorized" });
    }

    res.json({ message: "Counter deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete counter", details: err.message });
  }
});


export default router;
