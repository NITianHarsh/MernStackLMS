import axiosInstance from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  async function fetchStudentCoursesList(query) {
    const { data } = await axiosInstance.get(`/student/course/get?${query}`);

    return data;
  }
  async function fetchAllStudentCoursesList(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentCoursesList(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters), {
      replace: true,
    });
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentCoursesList(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
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
     <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 space-y-6">
          {Object.keys(filterOptions).map((ketItem) => (
            <div key={ketItem} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center text-sm sm:text-base">
                  <span className="mr-2">
                    {ketItem === "categories" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    )}
                    {ketItem === "level" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    )}
                    {ketItem === "price" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    )}
                  </span>
                  {ketItem.toUpperCase()}
                </h3>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {filterOptions[ketItem].map((option) => (
                  <Label key={option.id} className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-sm sm:text-base">
                    <Checkbox
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[ketItem] &&
                        filters[ketItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() =>
                        handleFilterOnChange(ketItem, option)
                      }
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 sm:gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-3 sm:p-5 w-full sm:w-auto justify-between sm:justify-center"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-sm sm:text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black dark:text-white font-bold w-full sm:w-auto text-right sm:text-left">
              {studentViewCoursesList.length} Results
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="cursor-pointer group transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  key={courseItem?._id}
                >
                  <CardContent className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
                    {/* Image container */}
                    <div className="w-full sm:w-48 h-40 sm:h-32 flex-shrink-0 relative overflow-hidden rounded-md">
                      <img
                        src={courseItem?.image}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        alt={courseItem?.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content section */}
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        {courseItem?.title}
                      </CardTitle>

                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Created by{" "}
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {courseItem?.instructorName}
                        </span>
                      </p>

                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 mt-2 sm:mt-3 mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                          {courseItem?.curriculum?.length} {courseItem?.curriculum?.length <= 1 ? "Lecture" : "Lectures"}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          {courseItem?.level.toUpperCase()} Level
                        </span>
                      </div>

                      <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mt-2 sm:mt-3">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1 className="font-extrabold text-2xl sm:text-4xl text-center sm:text-left">No Courses Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
