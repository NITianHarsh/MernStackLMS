import dotenv from "dotenv";
import Razorpay from "razorpay";
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
app.use(express.urlencoded({extended: true}));


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
import studentCourseProgressRoutes from "./routes/student-routes/course-progress-routes.js";

import paymentRoute from "./routes/student-routes/paymentRoutes.js";


app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);




app.use("/exam", examRoutes);
app.use("/result", resultRoutes);

app.use("/api",paymentRoute);

app.get("/api/getkey",(req,res)=>res.status(200).json({key:process.env.RAZORPAY_API_KEY}))


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


