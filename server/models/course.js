// import mongoose from "mongoose";

//   const LectureSchema = new mongoose.Schema({
//     title: String,
//     videoUrl: String,
//     public_id: String,
//     freePreview: Boolean,
//   });

//   const CourseSchema = new mongoose.Schema({
//     instructorId: String,
//     instructorName: String,
//     date: Date,
//     title: String,
//     category: String,
//     level: String,
//     primaryLanguage: String,
//     subtitle: String,
//     description: String,
//     image: String,
//     welcomeMessage: String,
//     pricing: Number,
//     objectives: String,
//     students:[{
//       studentId: String,
//       studentName: String,
//       studentEmail: String,
//     }],
//     curriculum:[LectureSchema],
//     isPublished: Boolean
//   });

// // Change module.exports to default export
// export default mongoose.model("Course", CourseSchema);

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  passingScore: { type: Number, required: true },
  questions: [questionSchema],
  isPublished: { type: Boolean, default: false },
});

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
  students: [{
    studentId: String,
    studentName: String,
    studentEmail: String,
  }],
  curriculum: [LectureSchema],
  exam: examSchema, // Add exam field
  isPublished: Boolean
});

export default mongoose.model("Course", CourseSchema);
