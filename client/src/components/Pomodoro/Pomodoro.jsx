import React, { useState, useEffect, useRef } from "react";
import { MdOutlineTimer } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PomodoroFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [minutes, setMinutes] = useState(focusDuration);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const intervalRef = useRef(null);

  const toggleWidget = () => setIsOpen(!isOpen);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("pomodoroState");
    if (savedState) {
      const {
        focusDuration,
        breakDuration,
        minutes,
        seconds,
        isRunning,
        isBreak,
        isEnded,
      } = JSON.parse(savedState);

      setFocusDuration(focusDuration);
      setBreakDuration(breakDuration);
      setMinutes(minutes);
      setSeconds(seconds);
      setIsRunning(isRunning);
      setIsBreak(isBreak);
      setIsEnded(isEnded);
    }
  }, []);

  // Save state to localStorage whenever relevant state changes
  useEffect(() => {
    localStorage.setItem(
      "pomodoroState",
      JSON.stringify({
        focusDuration,
        breakDuration,
        minutes,
        seconds,
        isRunning,
        isBreak,
        isEnded,
      })
    );
  }, [focusDuration, breakDuration, minutes, seconds, isRunning, isBreak, isEnded]);

  useEffect(() => {
    if (isRunning) {
      setIsEnded(false);
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(intervalRef.current);
              const nextMinutes = isBreak ? focusDuration : breakDuration;
              setMinutes(nextMinutes);
              setSeconds(0);
              setIsBreak(!isBreak);
              setIsRunning(true);
              setIsEnded(true);

              toast.dark(!isBreak ? "Break Time Started!" : "Focus Time Started!");
              return 0;
            } else {
              setMinutes((prev) => prev - 1);
              return 59;
            }
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, minutes, isBreak, focusDuration, breakDuration]);

  const handleStartPause = () => {
    if (!isRunning && minutes === 0 && seconds === 0) {
      setMinutes(isBreak ? breakDuration : focusDuration);
      setSeconds(0);
      setIsBreak(!isBreak);
      toast.dark(!isBreak ? "Break Time Started!" : "Focus Time Started!");
    } else {
      toast.dark(isBreak ? "Break Time Started!" : "Focus Time Started!");
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(focusDuration);
    setSeconds(0);
    setIsEnded(false);
    localStorage.removeItem("pomodoroState");
    toast.info("Pomodoro Timer Reset!");
  };

  const handleEndSession = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(focusDuration);
    setSeconds(0);
    setIsEnded(false);
    localStorage.removeItem("pomodoroState");
    toast.warning("Pomodoro Session Ended!");
  };

  const handleFocusChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isRunning && value > 0) {
      setFocusDuration(value);
      if (!isBreak) {
        setMinutes(value);
        setSeconds(0);
      }
    }
  };

  const handleBreakChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isRunning && value > 0) {
      setBreakDuration(value);
      if (isBreak) {
        setMinutes(value);
        setSeconds(0);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!isRunning || isEnded) toggleWidget();
        }}
        className="fixed bottom-6 right-6 bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-xl z-50 transition-all duration-300 hover:scale-105"
      >
        <MdOutlineTimer size={24} className="text-white" />
      </button>

      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 sm:right-6 w-[90vw] sm:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 z-50 transition-all duration-300 ${
            isEnded ? "animate-pulse border-red-500 dark:border-red-500" : ""
          }`}
        >
          <h2 className="text-xl font-semibold text-center mb-3 text-gray-800 dark:text-white">
            {isBreak ? "Break Time" : "Focus Session"}
          </h2>

          <div
            className={`text-5xl font-bold text-center mb-6 font-mono ${
              isRunning
                ? isBreak
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
                : "text-gray-800 dark:text-gray-300"
            }`}
          >
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>

          {!isRunning && (
            <div className="flex justify-between mb-6 text-sm">
              <div className="flex items-center">
                <label className="mr-2 text-gray-700 dark:text-gray-300">Focus:</label>
                <input
                  type="number"
                  min="1"
                  value={focusDuration}
                  onChange={handleFocusChange}
                  className="w-16 sm:w-14 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-gray-700 dark:text-gray-300">Break:</label>
                <input
                  type="number"
                  min="1"
                  value={breakDuration}
                  onChange={handleBreakChange}
                  className="w-16 sm:w-14 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={handleStartPause} className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg shadow transition flex items-center">
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={handleReset} className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg shadow border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition flex items-center">
              Reset
            </button>
            <button onClick={handleEndSession} className="px-4 py-2 bg-white hover:bg-gray-100 text-red-600 rounded-lg shadow border border-red-300 dark:border-red-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-400 transition flex items-center">
              End
            </button>
          </div>

          {isEnded && (
            <div className="mt-4 text-center text-red-600 dark:text-red-400 font-bold animate-bounce">
              Time's up!
            </div>
          )}
        </div>
      )}

      <ToastContainer position="bottom-center" autoClose={3000} />
    </>
  );
};

export default PomodoroFloatingWidget;
