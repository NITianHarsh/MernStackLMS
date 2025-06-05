import StudentCourses from "../../models/StudentCourses.js";

const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });
    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student courses",
    });
  }
};

export default getStudentCourses;
