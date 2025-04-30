import InstructorCourses from "@/components/instructor-view/courses";
import Dashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { BarChart, Book, ClipboardList, FilePlus, LogOut, Moon, Sun } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CreateExam from "@/components/Exam/CreateExam";
import ExamList from "@/components/Exam/ExamList";

function InstructorDashboardpage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);

  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);
  async function fetchInstructorCourseList() {
    const { data } = await axios.get(`http://localhost:5000/instructor/course/get`);

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
      icon: ClipboardList,
      label: "View Exams",
      value: "exam-list",
      component: <ExamList setActiveTab={setActiveTab} />,
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


  return (
    <div className="flex h-full min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:bg-gray-900 dark:bg-none text-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-green-100 to-green-300 dark:bg-gray-800 dark:bg-none shadow-md hidden md:block">
        <div className="p-4">
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
      <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-green-800 dark:text-green-300">
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
