import express from "express";
import Counter from "../models/counterProfile.js";
import authMiddleware from "../controllers/authMiddleware.js"; // adjust path

const router = express.Router();

// POST /tracker/addCounter
router.post("/addCounter", authMiddleware, async (req, res) => {
  try {
    const { title, value } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newCounter = new Counter({
      user: req.user.id,  // attach user id here
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
router.get("/allCounters", async (req, res) => {
  try {
    const { userId, email } = req.query;

    if (!userId || !email) {
      return res.status(400).json({ error: "Missing userId or email" });
    }

    // Find user by _id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare emails
    if (user.email !== email) {
      return res.status(403).json({ error: "Email mismatch" });
    }

    // Emails match, find counters
    const counters = await Counter.find({ user: userId });
    res.json(counters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch counters" });
  }
});


// PUT /tracker/updateCounter/:id
router.put("/updateCounter/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (typeof value !== "number") {
      return res.status(400).json({ error: "Value must be a number" });
    }

    // Make sure the counter belongs to the user before updating
    const updatedCounter = await Counter.findOneAndUpdate(
      { _id: id, user: req.user.id },
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
router.delete("/deleteCounter/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Only delete if counter belongs to user
    const deletedCounter = await Counter.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deletedCounter) {
      return res.status(404).json({ error: "Counter not found or not authorized" });
    }

    res.json({ message: "Counter deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete counter", details: err.message });
  }
});


router.get("/debug-token", (req, res) => {
  console.log("Cookies received:", req.cookies);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "No token in cookies" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    res.json({ success: true, user: decoded });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
});


export default router;
