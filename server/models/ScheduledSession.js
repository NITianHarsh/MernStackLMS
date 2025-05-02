import mongoose from "mongoose";

const scheduledSessionSchema = new mongoose.Schema({
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  note: String,
  dateTime: Date,
  meetingLink: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ScheduledSession", scheduledSessionSchema);
