// models/Result.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedOptionIndex: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
});

const resultSchema = new mongoose.Schema({
  // studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  answers: [answerSchema],
  score: { type: Number, required: true },
  totalQuestions: Number,
  timeTaken: Number, // in seconds
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);
export default Result;
