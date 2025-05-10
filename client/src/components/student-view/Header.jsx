import React, { useContext, useEffect, useState } from "react";
import {
  GraduationCap,
  TvMinimalPlay,
  Menu,
  X,
  BellDotIcon,
  BellDot,
  LucideBellDot,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { resetCredentials } = useContext(AuthContext);
  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    console.log("Logout successful");
  }
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
    <header className="bg-gradient-to-r from-teal-500 to-green-400 dark:from-gray-800 dark:to-gray-900 shadow-md sticky top-0 z-50 border-b border-green-300 dark:border-gray-700">
      <div className="flex items-center justify-between px-8 py-4">
        <div
          onClick={() => navigate("/student/home")}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all duration-300"
        >
          <GraduationCap className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white tracking-wide">
            LMS Learn
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Button
            className="text-sm font-medium text-white dark:text-gray-300 hover:text-teal-200 dark:hover:text-teal-400 bg-black dark:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => navigate("/student/PublishedExamList")}
          >
            Mock Tests
          </Button>

          <Button
            className="flex items-center gap-2 text-sm font-medium text-white dark:text-gray-300 hover:text-teal-200 dark:hover:text-teal-400 bg-black dark:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => navigate("/student/student-courses")}
          >
            My Courses
            <TvMinimalPlay className="w-5 h-5 text-white" />
          </Button>

          <Button
            className="text-sm font-medium text-white dark:text-gray-300 hover:text-teal-200 dark:hover:text-teal-400 bg-black dark:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => navigate("/student/notifications")}
          >
            <LucideBellDot />
          </Button>

          <Button
            className="bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-800 text-white px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
            onClick={handleLogout}
          >
            LogOut
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden flex flex-col items-center gap-4 px-6 py-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 rounded-b-lg shadow-md transition-all duration-500 ${
          menuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <Button
          className="text-sm font-medium text-teal-700 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-500 hover:bg-teal-100 dark:hover:bg-gray-800 w-full px-4 py-2 rounded-lg transition-all duration-300"
          onClick={() => navigate("/student/PublishedExamList")}
        >
          Mock Tests
        </Button>

        <Button
          className="text-sm font-medium text-teal-700 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-500 hover:bg-teal-100 dark:hover:bg-gray-800 w-full px-4 py-2 rounded-lg transition-all duration-300"
          onClick={() => navigate("/student/student-courses")}
        >
          My Courses
        </Button>

        <Button
          className="bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-800 text-white px-4 py-2 w-full text-sm font-semibold rounded-lg transition-all duration-300"
          onClick={handleLogout}
        >
          LogOut
        </Button>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
