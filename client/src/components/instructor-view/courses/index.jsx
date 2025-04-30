import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-xl rounded-xl">
      <CardHeader className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
          All Courses
        </CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
        >
          Create New Course
        </Button>
      </CardHeader>

      <CardContent className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listOfCourses && listOfCourses.length > 0 ? (
          listOfCourses.map((course) => (
            <div
              key={course._id}
              className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] ring-1 ring-gray-100 dark:ring-gray-700 hover:scale-[1.02] transition-transform"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded-t-2xl"
              />
          
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-md">
                    {course.category}
                  </span>
                  <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-md">
                    {course.level}
                  </span>
                </div>
          
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{course.primaryLanguage}</p>
                </div>
          
                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">Students:</strong>{" "}
                    {course.students?.length || 0}
                  </p>
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">Price:</strong> ${course.pricing}
                  </p>
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">Revenue:</strong> $
                    {course.students?.length * course.pricing || 0}
                  </p>
                </div>
          
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                    variant="ghost"
                    size="sm"
                    className="text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <Delete className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No courses found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
