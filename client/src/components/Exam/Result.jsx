import axiosInstance from "@/axiosInstance";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Results = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        const response = await axiosInstance.get(
          `/result/${examId}/results?latest=true`
        );
        setResult(response.data);
      } catch (error) {
        toast.error("Error fetching result:" + error);
      }
    };

    fetchLatestResult();
  }, [examId]);

  const goToLeaderboard = () => {
    navigate(`/student/exam/${examId}/leaderboard`);
  };

  const goToAllResults = () => {
    navigate(`/student/exam/${examId}/all-results`);
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 mt-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Exam Results
        </h2>
        <div className="w-20 h-0.5 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
      </div>

      {/* Results Card */}
      <div className="mb-10 p-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Latest Attempt
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {/* Completed on {new Date().toLocaleDateString()} */}
            </p>
          </div>
          <div className="mt-4 md:mt-0 px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Score: {result.score} / {result.totalQuestions}
            </p>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {result.answers.map((answer, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-md ${
                answer.isCorrect
                  ? "bg-green-100 dark:bg-green-800"
                  : "bg-red-100 dark:bg-red-800"
              }`}
            >
              <p className="font-medium text-gray-900 dark:text-white">
                Q: {answer.questionTitle}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-300">
                Your Answer: {answer.selectedOption}
              </p>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                {answer.isCorrect ? "✔ Correct" : "✖ Incorrect"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={goToLeaderboard}
          className="px-8 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg shadow-md transition flex items-center justify-center"
        >
          View Leaderboard
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </button>
        <button
          onClick={goToAllResults}
          className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg shadow-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition flex items-center justify-center"
        >
          See All Results
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Results;
