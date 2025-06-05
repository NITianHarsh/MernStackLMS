import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import Razorpay from "razorpay";
import connectDB from "./db/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
export const otpStore = new Map();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//dB connection
connectDB();

//routes configuration
import zoom from "./routes/zoom.js";
import examRoutes from "./routes/exam.js";
import authRoutes from "./routes/auth.js";
import resultRoutes from "./routes/results.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import paymentRoute from "./routes/student-routes/paymentRoutes.js";
import mediaRoutes from "./routes/instructor-routes/media-routes.js";
import studentViewCourseRoutes from "./routes/student-routes/course-routes.js";
import instructorCourseRoutes from "./routes/instructor-routes/course-routes.js";
import studentCoursesRoutes from "./routes/student-routes/student-courses-routes.js";
import studentCourseProgressRoutes from "./routes/student-routes/course-progress-routes.js";

app.use("/zoom", zoom);
app.use("/exam", examRoutes);
app.use("/auth", authRoutes);
app.use("/api", paymentRoute);
app.use("/doubt", doubtRoutes);
app.use("/media", mediaRoutes);
app.use("/result", resultRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//payment integration
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
