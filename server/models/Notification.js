import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  meetingLink: String,
  dateTime: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
