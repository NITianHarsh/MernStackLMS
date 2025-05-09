import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/axiosInstance";

const Leaderboard = () => {
  const { examId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axiosInstance.get(
          `/result/${examId}/leaderboard`
        );
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [examId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-500 animate-pulse">
        Loading leaderboard...
      </div>
    );

  if (!leaderboard.length)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        No results yet. Leaderboard will appear once students submit.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800">
    {/* Header */}
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Performance Leaderboard
      </h2>
      <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 mx-auto"></div>
    </div>
  
    {/* Table */}
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Student
            </th>
            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Score
            </th>
            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Time Taken
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {leaderboard.map((result, idx) => (
            <tr
              key={idx}
              className={`transition-colors duration-150 ${
                idx % 2 === 0 
                  ? 'bg-white dark:bg-gray-900' 
                  : 'bg-gray-50 dark:bg-gray-800'
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <td className="px-8 py-5 whitespace-nowrap">
                <div className={`flex items-center ${
                  idx < 3 ? 'font-bold' : 'font-medium'
                }`}>
                  {idx < 3 && (
                    <span className={`mr-3 text-lg ${
                      idx === 0 ? 'text-yellow-500' : 
                      idx === 1 ? 'text-gray-400' : 
                      'text-amber-600'
                    }`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                  <span className="text-gray-900 dark:text-gray-200">
                    {idx + 1}
                  </span>
                </div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {result.studentName || result.studentId?.name || "Anonymous"}
              </td>
              <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                <span className={`px-3 py-1 rounded-full ${
                  result.score >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                  result.score >= 70 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  {result.score}
                </span>
              </td>
              <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {result.timeTaken}s
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {/* Footer */}
    <div className="mt-8 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
      <span>Showing {leaderboard.length} results</span>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-md shadow transition flex items-center"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Refresh
      </button>
    </div>
  </div>
  );
};

export default Leaderboard;
