import axiosInstance from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import { courseCategories } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AskDoubt from "../AskDoubt";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
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




  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/student/courses");
  }
  async function checkCoursePurchaseInfo(courseId, studentId) {

    const { data } = await axiosInstance.get(`/student/course/purchase-info/${courseId}/${studentId}`);
    return data;
  }
  async function handleCourseNavigate(getCurrentCourseId) {
    console.log(getCurrentCourseId)

    const response = await checkCoursePurchaseInfo(getCurrentCourseId, auth?.user?._id);

    if (response?.success) {
      if (response?.data) {
        navigate(`/student/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/student/course/details/${getCurrentCourseId}`);
      }
    }

  }
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
              {/* <button className="bg-yellow-400 text-gray-900 font-bold text-xl px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition">
                Start Learning Now
              </button> */}
              <Button
                variant="ghost"
                onClick={() => navigate('/student/courses')}
                className="text-xl border bg-yellow-400 w-60 h-15 font-bold text-gray-900  px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-500 transition"
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
      <section className="py-12 px-6 lg:px-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Explore Course Categories
            </h2>
            <div className="w-20 h-1 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
          </div>

          {/* Categories Grid */}
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
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 px-6 lg:px-20 bg-white dark:bg-gray-900">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold mb-3 text-emerald-700 dark:text-emerald-400">
        Featured Courses
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Discover our most popular learning programs
      </p>
    </div>

    {/* Courses Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
        studentViewCoursesList.map((courseItem) => (
          <div
            key={courseItem._id}
            onClick={() => handleCourseNavigate(courseItem._id)}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Course Image */}
            <div className="relative overflow-hidden h-48">
              <img
                src={courseItem.image}
                alt={courseItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Course Details */}
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
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No Courses Available
          </h3>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
            We're currently updating our course offerings. Please check back soon.
          </p>
        </div>
      )}
    </div>
  </div>
</section>

    </div>
  );
}

export default StudentHomePage;
