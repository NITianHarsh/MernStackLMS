// TimerComponent.jsx
import React, { useState, useEffect } from "react";

const TimerComponent = ({ timeLimit, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(); // Trigger submission or action
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div
      style={{
        marginBottom: "1rem",
        fontWeight: "bold",
        color: timeLeft <= 30 ? "red" : "black",
      }}
    >
      Time Left: {formatTime(timeLeft)}
    </div>
  );
};

export default TimerComponent;
