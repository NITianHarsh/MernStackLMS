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
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Leaderboard
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                Score
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                Time Taken (s)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {leaderboard.map((result, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150"
              >
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 font-medium">
                  {idx + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {result.studentName || result.studentId?.name || "Anonymous"}
                </td>
                <td className="px-6 py-4 text-sm text-green-700 dark:text-green-400 font-semibold">
                  {result.score}
                </td>
                <td className="px-6 py-4 text-sm text-blue-700 dark:text-blue-300">
                  {result.timeTaken}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
