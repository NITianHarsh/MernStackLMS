import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/auth-context";
import { toast } from "sonner";

const StudentNotifications = () => {
  const { auth } = useContext(AuthContext);
  const studentId = auth?.user?._id;
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`http://localhost:5000/doubt/notifications/${studentId}`)
      .then((res) => setSessions(res.data.sessions || []))
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch notifications");
      });
  }, [studentId]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl border border-emerald-100">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6">
        📢 Your Doubt Session Notifications
      </h2>
      {sessions.length === 0 ? (
        <p className="text-gray-400">No scheduled sessions yet.</p>
      ) : (
        sessions.map((session) => (
          <div
            key={session._id}
            className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow transition hover:shadow-lg"
          >
            <p className="text-sm font-medium text-emerald-700">
              🕒 {new Date(session.dateTime).toLocaleString()}
            </p>
            <p className="text-gray-800 mt-2">
              {session.note || "You have a scheduled doubt session."}
            </p>
            <a
              href={session.zoomJoinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Join Zoom
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentNotifications;
