import axiosInstance from "@/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import React, { useContext, useEffect, useState } from "react";

const DueSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { auth } = useContext(AuthContext);
  const instructorId = auth?.user?._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosInstance.get(
          `/doubt/my-sessions/${instructorId}`
        );
        setSessions(res.data.sessions);
      } catch (err) {
        setError("Failed to fetch scheduled sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 w-3/4 h-full mt-3 mx-auto text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
          Scheduled Doubt Sessions
        </h2>
        <button
          onClick={() => navigate("/instructor")}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow transition"
        >
          Back to Dashboard
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
          <p className="text-lg">No upcoming sessions scheduled.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-700 rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                Student: {session.students[0]?.userName || "Unknown"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Time: {new Date(session.dateTime).toLocaleString()}
              </p>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                {session.note}
              </p>
              <a
                href={session.zoomStartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md font-medium transition"
              >
                Start Zoom Meeting
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DueSessions;
