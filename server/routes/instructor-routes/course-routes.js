const express = require("express");
const { addNewCourse, getAllCourse, getCourseDetailsByID, updateCourseByID } = require("../../controllers/instructor-controller/course-controller.js");
const router = express.Router();

router.post("/add",addNewCourse);
router.get("/get", getAllCourse);
router.get("/get/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

module.exports = router;