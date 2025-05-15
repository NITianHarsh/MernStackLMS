import { courseCategories } from "@/config";
import axiosInstance from "@/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import React, { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";

function StudentHomePage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

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

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/student/courses");
  }
  async function checkCoursePurchaseInfo(courseId, studentId) {
    const { data } = await axiosInstance.get(
      `/student/course/purchase-info/${courseId}/${studentId}`
    );
    return data;
  }
  async function handleCourseNavigate(getCurrentCourseId) {

    const response = await checkCoursePurchaseInfo(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/student/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/student/course/details/${getCurrentCourseId}`);
      }
    }
  }
  return (
    <div className="h-full w-full bg-gradient-to-br from-green-100 to-emerald-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-10 py-5">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-emerald-700 dark:text-emerald-400">
            Unlock Your Potential <br /> with the Best Courses Available!
          </h1>
          <p className="text-lg md:text-2xl font-medium mt-4 max-w-2xl">
            Start mastering new skills today. Learn from experts, gain
            real-world experience, and level up your career.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-6 md:justify-start justify-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/student/courses")}
              className="text-xl border bg-yellow-400 w-60 h-15 font-bold text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-500 transition"
            >
              Explore Courses
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <img
            src="/Pi7_cropper (1).png"
            alt="Banner"
            className="w-full max-w-md shadow-xl rounded-2xl mx-auto md:mx-20 border border-emerald-200 dark:border-emerald-600"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Explore Course Categories
          </h2>
          <div className="h-1 bg-gray-600 dark:bg-gray-300 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {courseCategories.map((categoryItem) => (
            <button
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              className="px-5 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{categoryItem.icon}</span>
                {categoryItem.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="max-w-7xl mx-auto mt-12 pb-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Featured Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our most popular learning programs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {studentViewCoursesList?.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                key={courseItem._id}
                onClick={() => handleCourseNavigate(courseItem._id)}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={courseItem.image}
                    alt={courseItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-300 mb-2 line-clamp-2">
                    {courseItem.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {courseItem.instructorName}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                      ${courseItem.pricing}
                    </span>
                    <button className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                No Courses Available
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                We're currently updating our course offerings. Please check back
                soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHomePage;
