import InstructorCourses from "@/components/instructor-view/courses";
import Dashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  BarChart,
  Book,
  ClipboardList,
  FilePlus,
  GraduationCap,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import CreateExam from "@/components/Exam/CreateExam";
import ExamList from "@/components/Exam/ExamList";
import axiosInstance from "@/axiosInstance";
import { Link } from "react-router-dom";

function InstructorDashboardpage() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);

  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);
  async function fetchInstructorCourseList() {
    const { data } = await axiosInstance.get(`/instructor/course/get`);

    return data;
  }
  async function fetchAllCourses() {
    const response = await fetchInstructorCourseList();
    if (response?.success) setInstructorCoursesList(response?.data);
  }
  useEffect(() => {
    fetchAllCourses();
  }, []);

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
  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <Dashboard />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: FilePlus,
      label: "Create Exam",
      value: "create-exam",
      component: <CreateExam />,
    },
    {
      icon: ClipboardList, // or another icon like ClipboardList or List
      label: "View Exams",
      value: "exam-list",
      component: <ExamList />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  // console.log(instructorCoursesList, "instructorCoursesList");

  return (
    <div className="flex h-full min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:bg-gray-900 dark:bg-none text-black dark:text-white">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          {/* Sidebar toggle and Logo */}
          <div className="flex items-center space-x-3">
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 rounded shadow-lg"
            >
              <svg
                className="w-8 h-8 text-green-800 dark:text-green-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Logo */}
            <Link to={"/"} className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400" />
          <span className="font-extrabold text-2xl text-green-800 dark:text-green-300">
            LMS LEARN
          </span>
        </Link>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="User"
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:divide-gray-600 z-50">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Neil Sims
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-300">
                    neil.sims@flowbite.com
                  </p>
                </div>
                <ul className="py-1">
                  {["Dashboard", "Settings", "Earnings", "Sign out"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 w-64 h-screen md:h-auto transition-transform transform bg-gradient-to-br from-green-100 to-green-300 dark:bg-gray-800 dark:bg-none shadow-md ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 pt-16">
          <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-300">
            Instructor View
          </h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                className={`w-full justify-start mb-2 ${
                  activeTab === menuItem.value
                    ? "bg-green-600 text-white dark:bg-green-500"
                    : "bg-transparent hover:bg-green-100 dark:hover:bg-gray-700"
                }`}
                variant="ghost"
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
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
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 pt-16 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-green-800 dark:text-green-300">
            Dashboard
          </h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
