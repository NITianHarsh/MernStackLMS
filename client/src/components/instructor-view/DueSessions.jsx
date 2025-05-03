import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/auth-context";

const DueSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { auth } = useContext(AuthContext);
  const instructorId = auth?.user?._id;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/doubt/my-sessions/${instructorId}`
        );
        console.log("Scheduled sessions:", res);
        setSessions(res.data.sessions);
      } catch (err) {
        setError("Failed to fetch scheduled sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [instructorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Scheduled Doubt Sessions</h2>
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-gray-500">No upcoming sessions scheduled.</p>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="bg-emerald-50 border border-emerald-200 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-emerald-700">
                {session.students[0]?.userName || "Unknown Student"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                📆 {new Date(session.dateTime).toLocaleString()}
              </p>
              <p className="mt-2 text-gray-700">{session.note}</p>
              <div className="mt-4">
                <a
                  href={session.zoomStartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition"
                >
                  🎥 Start Meeting
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DueSessions;
