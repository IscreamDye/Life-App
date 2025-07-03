import express from "express";
import Chart from "../models/chartProfile.js";
import authMiddleware from "../controllers/authMiddleware.js";

const router = express.Router();

// Get all charts for logged in user
router.get("/allCharts", authMiddleware, async (req, res) => {
  try {
    const charts = await Chart.find({ user: req.user.id });
    res.json(charts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch charts" });
  }
});

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


export default router;
