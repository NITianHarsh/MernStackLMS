import Course from "../../models/course.js";

// Add a new course
const addNewCourse = async (req, res) => {
  try {
    // Extract course data from the request body
    const courseData = req.body;

    // Validate if course data includes the necessary fields
    if (!courseData.title || !courseData.instructorId || !courseData.exam) {
      return res.status(400).json({
        success: false,
        message: "Course title, instructor ID, and exam details are required"
      });
    }

    // Create the new course
    const newlyCreatedCourse = await Course.create(courseData);

    // Respond with success message
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

// Get all courses (for admin/instructor view)
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

// Get course details by ID
const getCourseDetailsByID = async (req, res) => {
  try {
    const id = req.params.id;
    const courseDetails = await Course.findById(id);

    // Check if the course exists
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

// Update course by ID
const updateCourseByID = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCourseData = req.body;
  console.log(req.body,'reqq.body')
    // Ensure that we don't update critical course fields (like instructorId) unintentionally
    if (updatedCourseData.instructorId) {
      return res.status(400).json({
        success: false,
        message: "Instructor ID cannot be updated"
      });
    }
  console.log('i am hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    // Find and update the course
    const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, {
      new: true, // Returns the updated document
    });

    // Check if course was found and updated
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

// Update exam details within a course
const updateExamForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, duration, passingScore, questions } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: {
          exam: {
            title,
            duration,
            passingScore,
            questions,
            isPublished: false, // Default to unpublished
          },
        },
      },
      { new: true } // Return the updated course
    );

    if (updatedCourse) {
      res.status(200).json({
        success: true,
        message: "Exam updated successfully",
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

export {
  addNewCourse,
  getAllCourse,
  getCourseDetailsByID,
  updateCourseByID,
  updateExamForCourse
};
