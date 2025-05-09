import mongoose from "mongoose";

const studentCoursesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One doc per user
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      title: String,
      instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      instructorName: String,
      dateOfPurchase: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const StudentCourses = mongoose.model("StudentCourses", studentCoursesSchema);
export default StudentCourses;
