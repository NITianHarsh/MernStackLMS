import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  //after editing courses the edited course should be shown in the list
  const {setCurrentEditedCourseId,setCourseLandingFormData,setCourseCurriculumFormData}=useContext(InstructorContext);
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md rounded-xl">
      <CardHeader className="flex justify-between flex-row items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
          All Courses
        </CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);// Reset the form data to initial state to create a new course
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="px-6 py-2 bg-green-600 text-white dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600"
        >
          Create New Course
        </Button>
      </CardHeader>

      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
            <TableHeader className="bg-green-100 dark:bg-gray-700">
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0 ? (
                listOfCourses.map((course) => (
                  <TableRow
                    key={course._id}
                    className="bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {course?.title}
                    </TableCell>
                    <TableCell>{course?.students?.length}</TableCell>
                    <TableCell>
                      ${course?.students?.length * course?.pricing}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        onClick={() =>
                          navigate(`/instructor/edit-course/${course?._id}`)
                        }
                        variant="ghost"
                        size="sm"
                        className="text-green-600 dark:text-green-400"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 dark:text-red-400"
                      >
                        <Delete className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="4"
                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    No courses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
