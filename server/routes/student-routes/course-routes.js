import express from "express";
import {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
} from "../../controllers/student-controller/course-controller.js";
const router = express.Router();
router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id/", getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

export default router;
