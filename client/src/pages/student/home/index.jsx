import axiosInstance from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import { courseCategories } from "@/config";
// import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
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
    <div className="min-h-screen bg-white">
      <section className="bg-white text-black py-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Left: Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Unlock Your Potential <br />
              with the Best Courses Available!
            </h1>
            <p className="text-lg md:text-2xl font-semibold mt-4 max-w-2xl">
              Start mastering new skills today. Learn from experts, gain real-world experience, and level up your career.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-6 md:justify-start justify-center">
              <button className="bg-yellow-400 text-gray-900 font-bold text-xl px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition">
                Start Learning Now
              </button>
              <Button
                variant="ghost"
                onClick={() => navigate('/courses')}
                className="text-xl border w-60 h-15 font-medium text-teal-700 hover:text-teal-600 hover:bg-teal-100 px-4 py-2 rounded-md transition"
              >
                Explore Courses
              </Button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="flex-1 ">
            <img
              src="/Pi7_cropper (1).png"
              alt="banner"
              className="w-full max-w-md border-red-200 shadow-lg rounded-2xl mx-auto md:mx-20"
            />
          </div>
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
            // onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                // onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
