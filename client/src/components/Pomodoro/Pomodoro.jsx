import React, { useState, useEffect, useRef } from "react";
import { MdOutlineTimer } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PomodoroFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const intervalRef = useRef(null);

  const toggleWidget = () => setIsOpen(!isOpen);

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

              // Corrected toast message
              toast.dark(
                !isBreak ? "Break Time Started!" : "Focus Time Started!"
              );
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

    toast.info("Pomodoro Timer Reset!");
  };

  const handleEndSession = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(focusDuration);
    setSeconds(0);
    setIsEnded(false);

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
      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          if (!isRunning || isEnded) {
            toggleWidget();
          }
        }}
        className="fixed bottom-6 right-6 bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-xl z-50 transition-all duration-300 hover:scale-105"
      >
        <MdOutlineTimer size={24} className="text-white" />
      </button>

      {/* Timer Widget */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 z-50 transition-all duration-300 ${
            isEnded ? "animate-pulse border-red-500 dark:border-red-500" : ""
          }`}
        >
          {/* Header */}
          <h2 className="text-xl font-semibold text-center mb-3 text-gray-800 dark:text-white">
            {isBreak ? "Break Time" : "Focus Session"}
          </h2>

          {/* Timer Display */}
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

          {/* Duration Controls (when not running) */}
          {!isRunning && (
            <div className="flex justify-between mb-6 text-sm">
              <div className="flex items-center">
                <label className="mr-2 text-gray-700 dark:text-gray-300">
                  Focus:
                </label>
                <input
                  type="number"
                  min="1"
                  value={focusDuration}
                  onChange={handleFocusChange}
                  className="w-14 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-gray-700 dark:text-gray-300">
                  Break:
                </label>
                <input
                  type="number"
                  min="1"
                  value={breakDuration}
                  onChange={handleBreakChange}
                  className="w-14 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleStartPause}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg shadow transition flex items-center"
            >
              {isRunning ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Start
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg shadow border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Reset
            </button>
            <button
              onClick={handleEndSession}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-red-600 rounded-lg shadow border border-red-300 dark:border-red-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-400 transition flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              End
            </button>
          </div>

          {/* Time's Up Notification */}
          {isEnded && (
            <div className="mt-4 text-center text-red-600 dark:text-red-400 font-bold animate-bounce">
              Time's up!
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default PomodoroFloatingWidget;
