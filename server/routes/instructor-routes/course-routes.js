import express from "express";
import {
  addNewCourse,
  getAllCourse,
  getCourseDetailsByID,
  updateCourseByID,
} from "../../controllers/instructor-controller/course-controller.js";

const router = express.Router();

router.post("/add",addNewCourse);
router.get("/get", getAllCourse);
router.get("/get/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

export default router;
