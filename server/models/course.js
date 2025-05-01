import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  freePreview: Boolean,
});

const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  image: String,
  welcomeMessage: String,
  pricing: Number,
  objectives: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
    },
  ],
  curriculum: [LectureSchema],
  isPublished: Boolean,
});

export default mongoose.model("Course", CourseSchema);
