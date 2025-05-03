import mongoose from "mongoose";

const scheduledSessionSchema = new mongoose.Schema({
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  doubtIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doubt", required: true }],
  note: String,
  dateTime: { type: Date, required: true },
  zoomStartUrl: { type: String, required: true },
  zoomJoinUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ScheduledSession", scheduledSessionSchema);
