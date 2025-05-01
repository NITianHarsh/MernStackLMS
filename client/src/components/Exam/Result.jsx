import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";

const Results = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        const response = await axiosInstance.get(`/result/${examId}/results`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching result", error);
      }
    };

    fetchLatestResult();
  }, [examId]);

  const goToLeaderboard = () => {
    navigate(`/exam/${examId}/leaderboard`);
  };

  const goToAllResults = () => {
    navigate(`/exam/${examId}/all-results`);
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Exam Result
      </h2>

      <div className="mb-8 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
          Latest Result
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Score: <span className="font-medium">{result.score}</span> /{" "}
          {result.totalQuestions}
        </p>
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

      <div className="text-center space-x-4">
        <button
          onClick={goToLeaderboard}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:from-indigo-600 hover:to-purple-700 transition duration-300"
        >
          View Leaderboard
        </button>
        <button
          onClick={goToAllResults}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-teal-700 transition duration-300"
        >
          See All Results
        </button>
      </div>
    </div>
  );
};

export default Results;
