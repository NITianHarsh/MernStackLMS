// models/Exam.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: String,
  duration: Number, // in minutes
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublished: { type: Boolean, default: false },
});

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
