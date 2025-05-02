import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/auth-context";
import { toast } from "sonner";

const StudentNotifications = () => {
  const { auth } = useContext(AuthContext);
  const studentId = auth?.user?._id;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!studentId) return;
  
    axios
      .get(`/api/doubts/notifications/${studentId}`)
      .then((res) => setNotifications(res.data.notifications || [])) 
      .catch((err) => {
        toast.error("Failed to fetch notifications:", err);
        setNotifications([]); 
      });
  }, [studentId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Doubt Session Notifications</h2>
      {!notifications || notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        notifications.map((note) => (
          <div key={note._id} className="mb-4 p-4 bg-gray-100 rounded shadow">
            <p className="font-medium text-sm text-gray-600">
              {new Date(note.dateTime).toLocaleString()}
            </p>
            <p className="text-base my-2">{note.message}</p>
            <a
              href={note.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
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

