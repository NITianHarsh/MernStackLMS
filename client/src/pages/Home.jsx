import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Star, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-white via-green-100 to-emerald-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <header className="px-4 py-4 lg:px-6 h-16 flex items-center justify-between border-b border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 shadow">
        <Link to="/" className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          <span className="font-extrabold text-2xl text-emerald-800 dark:text-emerald-300">
            LMS LEARN
          </span>
        </Link>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800 transition"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-emerald-600" />
          ) : (
            <Moon className="h-5 w-5 text-emerald-400" />
          )}
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 py-16">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight"
          >
            Unlock Your{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Learning Potential
            </span>{" "}
            with LMS Learn
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            Join thousands of learners and instructors on the most engaging and
            effective e-learning platform. Build skills, teach what you love,
            and grow your career.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/auth")}
              className="px-6 py-3 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow"
            >
              Get started
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img
            src="\lms_bg1.webp"
            alt="Learning Illustration"
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="mt-16 max-w-6xl mx-auto text-center p-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">
          Why Learn With Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <GraduationCap className="text-emerald-600 w-10 h-10 mx-auto mb-4" />
              ),
              title: "Expert Instructors",
              desc: "Learn from industry professionals with real-world experience.",
            },
            {
              icon: (
                <BookOpen className="text-emerald-500 w-10 h-10 mx-auto mb-4" />
              ),
              title: "Structured Curriculum",
              desc: "Up-to-date and organized content tailored for real outcomes.",
            },
            {
              icon: <Star className="text-yellow-500 w-10 h-10 mx-auto mb-4" />,
              title: "Trusted by Learners",
              desc: "Highly rated by thousands of global learners.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
