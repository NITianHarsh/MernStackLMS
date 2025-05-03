import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TimerComponent from "./TimerComponent";
import PreventCheating from "./PreventCheating";
import axiosInstance from "@/axiosInstance";
import { toast } from "sonner";

const ExamSubmission = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60); // default 1 min
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get(`/exam/${examId}/questions`);
        setQuestions(response.data);
        setAnswers(response.data.map(() => ({ selectedOptionIndex: -1 })));
        setStartTime(Date.now());
      } catch (error) {
        console.error("Error fetching exam questions", error);
      }
    };

    fetchQuestions();
  }, [examId]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex].selectedOptionIndex = optionIndex;
      return newAnswers;
    });
  };

  const exitFullScreenIfNeeded = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Error exiting fullscreen:", err);
      }
    }
  };

  const submitExam = async (fromTimer = false) => {
    if (
      !fromTimer &&
      !window.confirm("Are you sure you want to submit the exam?")
    )
      return;

    setIsSubmitting(true);
    const totalTimeTaken = Math.floor((Date.now() - startTime) / 1000);

    const submission = {
      answers,
      timeTaken: totalTimeTaken,
      studentName: "Anonymous", // replace with actual student name
    };

    try {
      await axiosInstance.post(`/result/${examId}/submit`, submission);
      await exitFullScreenIfNeeded(); // exit full screen if active
      navigate(`/results/${examId}`);
    } catch (error) {
      console.error("Error submitting exam", error);
    }
  };

  const handleTimeUp = () => {
    toast.info("Time's up! Submitting exam...");
    submitExam(true); // true to skip confirmation
  };

  if (questions.length === 0)
    return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <PreventCheating />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Exam</h2>
        <TimerComponent timeLimit={timeLimit} onTimeUp={handleTimeUp} />
      </div>

      <p className="mb-4 text-gray-700">Total Questions: {questions.length}</p>

      <div className="space-y-6">
        {questions.map((question, idx) => (
          <div
            key={question._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <p className="font-semibold">
              {idx + 1}. {question.questionText}
            </p>
            <div className="mt-2 space-y-1">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="block cursor-pointer">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={optionIndex}
                    checked={answers[idx]?.selectedOptionIndex === optionIndex}
                    onChange={() => handleOptionChange(idx, optionIndex)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => submitExam(false)}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Exam"}
        </button>
      </div>
    </div>
  );
};

export default ExamSubmission;
