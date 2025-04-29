import CourseCurriculum from "@/components/instructor-view/courses/add-new-courses/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-courses/CourseLanding";
import CourseSettings from "@/components/instructor-view/courses/add-new-courses/CourseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

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
        <Button className="text-sm tracking-wider font-bold px-8 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400">
          SUBMIT
        </Button></div>
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
