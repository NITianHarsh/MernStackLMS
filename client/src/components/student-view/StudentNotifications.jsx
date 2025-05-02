import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentNotifications = ({ studentId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`/api/doubts/notifications/${studentId}`).then((res) =>
      setNotifications(res.data.notifications)
    );
  }, [studentId]);

  return (
    <div>
      <h2>Your Doubt Session Notifications</h2>
      {notifications.map((note) => (
        <div key={note._id}>
          <p>{new Date(note.dateTime).toLocaleString()}</p>
          <p>{note.message}</p>
          <a href={note.meetingLink} target="_blank" rel="noreferrer">Join Zoom</a>
        </div>
      ))}
    </div>
  );
};

export default StudentNotifications;

