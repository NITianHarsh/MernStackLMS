import axiosInstance from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import { courseCategories } from "@/config";
// import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AskDoubt from "../AskDoubt";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  //const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  // Fetch courses from API
  async function fetchStudentCoursesList(query) {
    const { data } = await axiosInstance.get(`/student/course/get?${query}`);

    return data;
  }
  async function fetchAllStudentCoursesList() {
    const response = await fetchStudentCoursesList();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }
  useEffect(() => {
    fetchAllStudentCoursesList();
  }, []);

  // function handleNavigateToCoursesPage(getCurrentId) {
  //   console.log(getCurrentId);
  //   sessionStorage.removeItem("filters");
  //   const currentFilter = {
  //     category: [getCurrentId],
  //   };

  //   sessionStorage.setItem("filters", JSON.stringify(currentFilter));

  //   navigate("/courses");
  // }

  // async function handleCourseNavigate(getCurrentCourseId) {
  //   const response = await checkCoursePurchaseInfoService(
  //     getCurrentCourseId,
  //     auth?.user?._id
  //   );

  //   if (response?.success) {
  //     if (response?.data) {
  //       navigate(`/course-progress/${getCurrentCourseId}`);
  //     } else {
  //       navigate(`/course/details/${getCurrentCourseId}`);
  //     }
  //   }
  // }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-100 to-emerald-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left: Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-emerald-700 dark:text-emerald-400">
              Unlock Your Potential <br />
              with the Best Courses Available!
            </h1>
            <p className="text-lg md:text-2xl font-medium mt-4 max-w-2xl">
              Start mastering new skills today. Learn from experts, gain
              real-world experience, and level up your career.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-6 md:justify-start justify-center">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition">
                Start Learning Now
              </button>
              <Button
                variant="ghost"
                onClick={() => navigate("/student/courses")}
                className="text-lg border border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900 w-60 h-12 font-medium rounded-md transition"
              >
                Explore Courses
              </Button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="flex-1">
            <img
              src="/Pi7_cropper (1).png"
              alt="Banner"
              className="w-full max-w-md shadow-xl rounded-2xl mx-auto md:mx-20 border border-emerald-200 dark:border-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10 px-6 lg:px-20 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">
          Course Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              key={categoryItem.id}
              variant="outline"
              className="border-emerald-400 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 justify-start"
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 px-6 lg:px-20">
        <h2 className="text-2xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">
          Featured Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                key={courseItem._id}
                // onClick={() => handleCourseNavigate(courseItem?._id)}
                className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-600 rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer transition"
              >
                <img
                  src={courseItem?.image}
                  alt={courseItem?.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                    {courseItem?.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 text-base">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-gray-500 dark:text-gray-400 col-span-full">
              No Courses Found
            </h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
