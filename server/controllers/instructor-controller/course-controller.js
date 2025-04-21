const Course = require("../../models/course.js");

const addNewCourse = async (req, res) => {
  try {
    //i should be having all the data required in course model from req.body
    const courseData = req.body;
    const newlyCreatedCourse = await Course.create(courseData);
    if (newlyCreatedCourse) {
      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: newlyCreatedCourse,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//implementing this cuz i have only one super admin/intructor else will show the courses by individual instructor here
const getAllCourse = async (req, res) => {
  try {
    const coursesList = await Course.find({});
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const id = req.params.id;
    const courseDetails = await Course.findById(id);
    if (courseDetails) {
      res.status(200).json({
        success: true,
        data: courseDetails,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCourseData = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, {
      new: true,//returns the updated data
    });
    if (updatedCourse) {
      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addNewCourse,
  getAllCourse,
  getCourseDetailsByID,
  updateCourseByID,
};
