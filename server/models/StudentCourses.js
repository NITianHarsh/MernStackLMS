import { Schema, model } from "mongoose";

const StudentCoursesSchema = new Schema({
  userId: String,
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorName: String,
      dateOfPurchase: Date,
      courseImage: String,
    },
  ],
});

export default model("StudentCourses", StudentCoursesSchema);