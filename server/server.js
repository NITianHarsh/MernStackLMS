import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
const app = express();

import cors from "cors";
const PORT = process.env.PORT || 5000;
import connectDB from "./db/db.js";

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(json());

//dB connection
connectDB();

//routes configuration
import authRoutes from "./routes/auth.js";
import mediaRoutes from "./routes/instructor-routes/media-routes.js";
import instructorCourseRoutes from "./routes/instructor-routes/course-routes.js";
import examRoutes from "./routes/exam.js";
import resultRoutes from "./routes/results.js";
import studentViewCourseRoutes from "./routes/student-routes/course-routes.js"
import studentCoursesRoutes from "./routes/student-routes/student-courses-routes.js";


app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);



app.use("/exam", examRoutes);
app.use("/result", resultRoutes);



//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


