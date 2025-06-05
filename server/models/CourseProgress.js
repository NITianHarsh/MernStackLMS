import mongoose from "mongoose";

const LectureProgressSchema = new mongoose.Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date,
});

const CourseProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  completed: Boolean,
  completionDate: Date,
  lecturesProgress: [LectureProgressSchema],
});

export const CourseProgress = mongoose.model("Progress", CourseProgressSchema);
