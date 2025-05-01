import Course from "../../models/course.js";

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
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      {
        new: true, //returns the updated data
      }
    );
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

const updateCoursePublishStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { isPublished } = req.body;

    if (typeof isPublished !== "boolean") {
      return res.status(400).json({ message: "isPublished must be a boolean" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { isPublished },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course publish status updated",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating publish status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCourseByID = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  addNewCourse,
  getAllCourse,
  getCourseDetailsByID,
  updateCourseByID,
  updateCoursePublishStatus,
  deleteCourseByID,
};
