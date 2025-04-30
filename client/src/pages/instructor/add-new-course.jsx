import CourseCurriculum from "@/components/instructor-view/courses/add-new-courses/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-courses/CourseLanding";
import CourseSettings from "@/components/instructor-view/courses/add-new-courses/CourseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { Moon, Sun } from "lucide-react";
import { use, useContext, useEffect, useState } from "react";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/axiosInstance";

function AddNewCourse() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);
  function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle("dark");
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === null || value === undefined || value === "";
  };
  const validateFormData = () => {
    //make submit button clickable only when all the data is filled
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }
    //check at least 1 video is free preview enabled
    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) {
        hasFreePreview = true;
      }
    }
    return hasFreePreview;
  };

  async function addNewCourse(formData) {
    const { data } = await axiosInstance.post(
      `/instructor/course/add`,
      formData
    );
    return data;
  }
  async function updateCourseById(courseId, formData) {
    const { data } = await axiosInstance.put(
      `/instructor/course/update/${courseId}`,
      formData
    );
    return data;
  };
  const handleCreateCourse = async () => {
    const courseFinalFormData = {
      instructorId: auth?.user?._id, //bring from auth context
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [], //while new course students in that course is no one
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };
    const response =
    currentEditedCourseId !== null ? (await updateCourseById(currentEditedCourseId,courseFinalFormData)) : ( await addNewCourse(courseFinalFormData));
    if (response?.success) {
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      setCourseLandingFormData(courseLandingInitialFormData);
      navigate(-1); //go back to previous page
      setCurrentEditedCourseId(null); // Reset the form data to initial state to create a new course
    }
  };

  const fetchCurrentCourseDetails = async () => {
    if(!currentEditedCourseId) return;
    const response = await axiosInstance.get(
      `/instructor/course/get/${currentEditedCourseId}`
    );
    if (response?.data?.success) {
      //fill all the details in the form so that instructor can edit
      //mapping the data to the form
      const setCourseFormData = Object.keys(courseLandingFormData).reduce(
        (acc, key) => {
          acc[key] = response?.data?.data[key] || courseLandingFormData[key];
          return acc;
        }, {});
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(
        response?.data?.data?.curriculum || courseCurriculumInitialFormData
      );
    }
  };
  useEffect(() => {    
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);
  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-green-100 to-green-300 dark:bg-gray-900 dark:bg-none min-h-screen text-black dark:text-white transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-extrabold text-green-800 dark:text-green-300">
          Create a new course
        </h1>
        <div className="flex gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <Button
            disabled={!validateFormData()}
            className="text-sm tracking-wider font-bold px-8 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
            onClick={handleCreateCourse}
          >
            SUBMIT
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-md">
        <CardContent>
          <div className="p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList className="bg-green-200 dark:bg-gray-700">
                <TabsTrigger
                  value="curriculum"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white"
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="course-landing-page"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white"
                >
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCourse;
