import express from "express";
import getStudentCourses from "../../controllers/student-controller/student-courses-controller.js";

const router = express.Router();
router.get("/get/:studentId", getStudentCourses);

export default router;
