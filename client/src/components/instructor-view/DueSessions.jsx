import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
const DueSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { auth } = useContext(AuthContext);
  const instructorId = auth?.user?._id;
  const navigate=useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/doubt/my-sessions/${instructorId}`
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
    <div className="p-6 max-w-5xl mx-auto text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-700">
          📅 Scheduled Doubt Sessions
        </h2>
        <button
          onClick={() => navigate("/instructor")}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">No upcoming sessions scheduled.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                👤 {session.students[0]?.userName || "Unknown Student"}
              </h3>
              <p className="text-sm text-gray-600">
                🕒 {new Date(session.dateTime).toLocaleString()}
              </p>
              <p className="mt-3 text-gray-700">{session.note}</p>
              <a
                href={session.zoomStartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-rose-500 text-white rounded-md font-medium hover:bg-rose-600 transition"
              >
                🎥 Start Zoom Meeting
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DueSessions;
