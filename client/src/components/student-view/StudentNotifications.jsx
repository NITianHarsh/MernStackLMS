import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { toast } from "react-toastify";
import axiosInstance from "@/axiosInstance";

// Utility to extract meeting ID and password from Zoom Join URL
const extractZoomDetails = (url) => {
  const idMatch = url.match(/\/j\/(\d+)/);
  const pwdMatch = url.match(/[\?&]pwd=([^&]+)/);
  return {
    meetingId: idMatch?.[1] || "N/A",
    password: pwdMatch?.[1] || "N/A",
  };
};

const StudentNotifications = () => {
  const { auth } = useContext(AuthContext);
  const studentId = auth?.user?._id;
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!studentId) return;

    axiosInstance
      .get(`/doubt/notifications/${studentId}`)
      .then((res) => setSessions(res.data.sessions || []))
      .catch((err) => {
        toast.error("Failed to fetch notifications");
      });
  }, [studentId]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-emerald-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">
        📢 Your Doubt Session Notifications
      </h2>
      {sessions.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500">
          No scheduled sessions yet.
        </p>
      ) : (
        sessions.map((session) => {
          const { meetingId, password } = extractZoomDetails(
            session.zoomJoinUrl
          );

          return (
            <div
              key={session._id}
              className="mb-4 p-4 bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-gray-700 rounded-xl shadow-md transition hover:shadow-lg hover:-translate-y-1"
            >
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                🕒 {new Date(session.dateTime).toLocaleString()}
              </p>
              <p className="text-gray-800 dark:text-gray-300 mt-2">
                {session.note || "You have a scheduled doubt session."}
              </p>

              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                📌 If Zoom app is installed, click <strong>"Join Zoom"</strong>.
                Otherwise, join manually using:
              </div>

              <div className="mt-1 text-sm text-gray-700 dark:text-gray-500">
                <p>
                  <strong>Meeting ID:</strong> {meetingId}
                </p>
                <p>
                  <strong>Password:</strong> {password}
                </p>
              </div>

              <a
                href={session.zoomJoinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                🎥 Join Zoom
              </a>
            </div>
          );
        })
      )}
    </div>
  );
};

export default StudentNotifications;
