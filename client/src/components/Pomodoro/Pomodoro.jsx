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
      <button
  onClick={() => {
    if (!isRunning || isEnded) {
      toggleWidget();
    }
  }}
  className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg z-50"
>
  <MdOutlineTimer size={24} />
</button>

      {isOpen && (
        <div
          className={`fixed bottom-20 right-6 w-80 bg-slate-700 text-white rounded-xl shadow-lg p-4 z-50 
            ${isRunning ? (isBreak ? "bg-green-500" : "bg-blue-500") : "bg-slate-700"} 
            ${isEnded ? "animate-pulse" : ""}`}
        >
          <h2 className="text-lg font-semibold text-center mb-2">
            {isBreak ? "Break Time" : "Focus Time"}
          </h2>

          <div className="text-4xl font-bold text-center mb-4">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>

          {!isRunning && (
            <div className="flex justify-between mb-4 text-sm">
              <div>
                <label className="mr-1">Focus:</label>
                <input
                  type="number"
                  min="1"
                  value={focusDuration}
                  onChange={handleFocusChange}
                  className="w-12 px-1 rounded text-black"
                />
              </div>
              <div>
                <label className="mr-1">Break:</label>
                <input
                  type="number"
                  min="1"
                  value={breakDuration}
                  onChange={handleBreakChange}
                  className="w-12 px-1 rounded text-black"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2">
            <button
              onClick={handleStartPause}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
            >
              Reset
            </button>
            <button
              onClick={handleEndSession}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              End Session
            </button>
          </div>

          {isEnded && (
            <div className="mt-4 text-center text-red-500 font-bold">Time's up!</div>
          )}
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default PomodoroFloatingWidget;
