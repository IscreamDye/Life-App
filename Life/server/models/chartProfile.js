import mongoose from "mongoose";

const ChartEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },  // or Date type if you prefer
  value: { type: Number, required: true },
});

const ChartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  entries: [ChartEntrySchema],
  createdAt: { type: Date, default: Date.now },
});

const Chart = mongoose.model("Chart", ChartSchema);
export default Chart;
