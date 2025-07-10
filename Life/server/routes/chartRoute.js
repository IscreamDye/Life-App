import express from "express";
import Chart from "../models/chartProfile.js";
import authMiddleware from "../controllers/authMiddleware.js";
import User from "../models/user.js"

const router = express.Router();

// Get all charts for logged in user
/*
router.get("/allCharts", authMiddleware, async (req, res) => {
  try {
    const charts = await Chart.find({ user: req.user.id });
    res.json(charts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch charts" });
  }
});*/
/*
router.get("/allCharts", async (req, res) => {
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

    const charts = await Chart.find({ user: userId });
    return res.json(charts);
  } catch (err) {
    console.error("Error in /allCharts:", err);
    return res.status(500).json({ error: "Failed to fetch charts" });
  }
});*/
/*

// Add a chart entry
router.put("/addChartEntry/:chartId", authMiddleware, async (req, res) => {
  const { chartId } = req.params;
  const { entry } = req.body;  // { date: ..., value: ... }
  
  try {
    const chart = await Chart.findOne({ _id: chartId, user: req.user.id });
    if (!chart) return res.status(404).json({ error: "Chart not found" });

    chart.entries.push(entry);
    await chart.save();
    res.json(chart);
  } catch (err) {
    res.status(500).json({ error: "Failed to add entry" });
  }
});

// Update chart entry value
router.put("/updateEntry/:chartId/:entryIndex", authMiddleware, async (req, res) => {
  const { chartId, entryIndex } = req.params;
  const { value } = req.body;

  try {
    const chart = await Chart.findOne({ _id: chartId, user: req.user.id });
    if (!chart) return res.status(404).json({ error: "Chart not found" });
    if (!chart.entries[entryIndex]) return res.status(404).json({ error: "Entry not found" });

    chart.entries[entryIndex].value = value;
    await chart.save();
    res.json(chart);
  } catch (err) {
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// Delete chart entry
router.delete("/deleteEntry/:chartId/:entryIndex", authMiddleware, async (req, res) => {
  const { chartId, entryIndex } = req.params;

  try {
    const chart = await Chart.findOne({ _id: chartId, user: req.user.id });
    if (!chart) return res.status(404).json({ error: "Chart not found" });

    chart.entries.splice(entryIndex, 1);
    await chart.save();
    res.json(chart);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

// Delete whole chart
router.delete("/deleteChart/:chartId", authMiddleware, async (req, res) => {
  const { chartId } = req.params;

  try {
    await Chart.deleteOne({ _id: chartId, user: req.user.id });
    res.json({ message: "Chart deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chart" });
  }
});

// POST /tracker/createChart
router.post("/createChart", authMiddleware, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const newChart = new Chart({
      user: req.user.id,
      title,
      entries: [],
    });
    await newChart.save();
    res.json(newChart);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chart" });
  }
});
*/



// GET /tracker/allCharts
router.get("/allCharts", async (req, res) => {
  try {
    const { userId, email } = req.query;

    if (!userId || !email) {
      return res.status(400).json({ error: "Missing userId or email" });
    }

    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const charts = await Chart.find({ user: userId });
    return res.json(charts);
  } catch (err) {
    console.error("Error in /allCharts:", err);
    return res.status(500).json({ error: "Failed to fetch charts" });
  }
});

// POST /tracker/createChart
router.post("/createChart", async (req, res) => {
  const { title, userId, email } = req.body;

  if (!title || !userId || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const newChart = new Chart({
      user: userId,
      title,
      entries: [],
    });

    await newChart.save();
    res.json(newChart);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chart", details: err.message });
  }
});

// PUT /tracker/addChartEntry/:chartId
router.put("/addChartEntry/:chartId", async (req, res) => {
  const { chartId } = req.params;
  const { entry, userId, email } = req.body;

  if (!entry || !userId || !email) {
    return res.status(400).json({ error: "Missing required data" });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const chart = await Chart.findOne({ _id: chartId, user: userId });
    if (!chart) return res.status(404).json({ error: "Chart not found" });

    chart.entries.push(entry);
    await chart.save();
    res.json(chart);
  } catch (err) {
    res.status(500).json({ error: "Failed to add entry", details: err.message });
  }
});

// PUT /tracker/updateEntry/:chartId/:entryIndex
router.put("/updateEntry/:chartId/:entryIndex", async (req, res) => {
  const { chartId, entryIndex } = req.params;
  const { value, userId, email } = req.body;

  if (typeof value !== "number" || !userId || !email) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const chart = await Chart.findOne({ _id: chartId, user: userId });
    if (!chart) return res.status(404).json({ error: "Chart not found" });

    if (!chart.entries[entryIndex]) {
      return res.status(404).json({ error: "Entry not found" });
    }

    chart.entries[entryIndex].value = value;
    await chart.save();
    res.json(chart);
  } catch (err) {
    res.status(500).json({ error: "Failed to update entry", details: err.message });
  }
});

// DELETE /tracker/deleteEntry/:chartId/:entryIndex
router.delete("/deleteEntry/:chartId/:entryIndex", async (req, res) => {
  const { chartId, entryIndex } = req.params;
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: "Missing user info" });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    const chart = await Chart.findOne({ _id: chartId, user: userId });
    if (!chart) return res.status(404).json({ error: "Chart not found" });

    chart.entries.splice(entryIndex, 1);
    await chart.save();
    res.json(chart);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete entry", details: err.message });
  }
});

// DELETE /tracker/deleteChart/:chartId
router.delete("/deleteChart/:chartId", async (req, res) => {
  const { chartId } = req.params;
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: "Missing user info" });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(403).json({ error: "User validation failed" });
    }

    await Chart.deleteOne({ _id: chartId, user: userId });
    res.json({ message: "Chart deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chart", details: err.message });
  }
});


export default router;
