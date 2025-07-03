import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  entries: {          // renamed from enteries to entries
    type: [String],   // array of strings
    default: [],      // default empty array to avoid undefined
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Note = mongoose.model("Note", NoteSchema);

export default Note;
