import React, { useEffect, useState } from "react";
import axios from "axios";

const DueSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get("/doubts/my-sessions").then(res => setSessions(res.data.sessions));
  }, []);

  return (
    <div>
      <h2>Scheduled Doubt Sessions</h2>
      {sessions && sessions.map((session) => (
        <div key={session._id}>
          <p>{session.student.userName}</p>
          <p>{new Date(session.dateTime).toLocaleString()}</p>
          <p>{session.message}</p>
          <a href={session.meetingLink} target="_blank" rel="noreferrer">Join Meeting</a>
        </div>
      ))}
    </div>
  );
};

export default DueSessions;
