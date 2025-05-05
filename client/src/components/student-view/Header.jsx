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
    <header className="bg-gradient-to-r from-teal-400 to-lime-400 shadow-lg sticky top-0 z-50 border-b rounded-b-lg">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div
          onClick={() => navigate("/student/home")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
        >
          <GraduationCap className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">LMS Learn</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-sm font-medium text-white hover:text-teal-300 hover:bg-teal-600 px-4 py-2 rounded-md transition"
            onClick={() => navigate("/PublishedExamList")}
          >
            Mock Tests
          </Button>

          <Button
            onClick={() => navigate('/student-courses')}
          >
            <div className="flex items-center gap-2 cursor-pointer hover:text-teal-300 transition">
              <span className="text-sm font-medium">My Courses</span>
              <TvMinimalPlay className="w-6 h-6 text-white" />
            </div>
          </Button>

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-semibold rounded-md transition"
            onClick={handleLogout}
          >
            LogOut
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white"
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 px-6 pt-6 pb-6 bg-white dark:bg-gray-900 border-t shadow-xl animate-slide-down text-center rounded-b-lg">
          <Button
            variant="ghost"
            onClick={() => {
              location.pathname.includes('/courses')
                ? null
                : navigate("/courses");
            }}
            className="text-sm font-medium text-teal-700 hover:text-teal-600 hover:bg-teal-100 px-4 py-2 rounded-md transition"
          >
            Explore Courses
          </Button>

          {/* My Courses */}
          <Button className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-600 hover:bg-teal-100 px-4 py-2 rounded-md transition"
            onClick={() => navigate('/student-courses')}
          >
            <TvMinimalPlay className="w-5 h-5 text-teal-700" />
            My Courses
          </Button>

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-semibold rounded-md transition"
            onClick={handleLogout}
          >
            LogOut
          </Button>
        </div>
      )}
    </header>
  );
}

export default StudentViewCommonHeader;
