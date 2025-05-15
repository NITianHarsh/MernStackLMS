import { toast } from "react-toastify";
import axiosInstance from "@/axiosInstance";
import TimerComponent from "./TimerComponent";
import PreventCheating from "./PreventCheating";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";

const ExamSubmission = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60 * 30); // default 30 min
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // <-- New state
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get(`/exam/${examId}/questions`);
        console.log("Exam questions:", response);
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

  // Actual submit logic, called after user confirms
  const doSubmitExam = async (fromTimer = false) => {
    setIsSubmitting(true);
    const totalTimeTaken = Math.floor((Date.now() - startTime) / 1000);

    const submission = {
      answers,
      timeTaken: totalTimeTaken,
      studentName: auth.user.userName, 
    };

    try {
      await axiosInstance.post(`/result/${examId}/submit`, submission);
      await exitFullScreenIfNeeded(); // exit full screen if active
      setIsSubmitting(false);
      setIsDialogOpen(false);
      navigate(`/student/results/${examId}`);
    } catch (error) {
      console.error("Error submitting exam", error);
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  const handleTimeUp = () => {
    toast.info("Time's up! Submitting exam...");
    doSubmitExam(true);
  };

  if (questions.length === 0)
    return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PreventCheating />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Exam</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Total Questions: {questions.length}
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <TimerComponent timeLimit={timeLimit} onTimeUp={handleTimeUp} />
        </div>
      </div>

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
                <label
                  key={optionIndex}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-150 ${
                    answers[idx]?.selectedOptionIndex === optionIndex
                      ? "bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"
                      : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={optionIndex}
                    checked={answers[idx]?.selectedOptionIndex === optionIndex}
                    onChange={() => handleOptionChange(idx, optionIndex)}
                    className="h-5 w-5 text-gray-900 dark:text-gray-300 focus:ring-gray-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-3 text-gray-800 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => setIsDialogOpen(true)} // <-- Open dialog on click
          disabled={isSubmitting}
          className={`relative px-8 py-3 font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
            isSubmitting
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-gray-800 dark:hover:bg-gray-200"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-gray-900 inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit Exam
              <svg
                className="w-5 h-5 ml-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submit</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit the exam? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={() => doSubmitExam(false)} disabled={isSubmitting}>
              Yes, Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamSubmission;
