import { GraduationCap, Moon, Sun, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    <header className="px-4 py-4 lg:px-4 h-16 flex items-center justify-between border-b border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 shadow">
      <div className="flex items-center space-x-3">
        {/* Show Back Button if not on Home Page */}
        {location.pathname !== "/" && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800 transition cursor-pointer"
          >
            <ArrowLeft className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </button>
        )}

        {/* App Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          <span className="font-extrabold text-2xl text-emerald-800 dark:text-emerald-300">
            Gyaan Path
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800 transition cursor-pointer"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-emerald-600" />
          ) : (
            <Moon className="h-5 w-5 text-emerald-400" />
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
