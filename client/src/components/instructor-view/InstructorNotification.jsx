import React, { useState, useEffect } from "react";
import axios from "axios";

const InstructorNotification = () => {
  const [doubts, setDoubts] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dateTime, setDateTime] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    axios.get("/doubts/unresolved").then((res) => setDoubts(res.data.doubts));
  }, []);

  const handleCheck = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleCreateSession = async () => {
    const doubtIds = doubts
      .filter((d) => selectedStudents.includes(d.student._id))
      .map((d) => d._id);

    await axios.post("/doubts/schedule", {
      selectedStudentIds: selectedStudents,
      dateTime,
      note,
      doubtIds,
    });

    alert("Zoom meeting created & notifications sent");
  };

  return (
    <div>
      <h2>Unresolved Doubts</h2>
      {doubts.map((doubt) => (
        <div key={doubt._id}>
          <input
            type="checkbox"
            checked={selectedStudents.includes(doubt.student._id)}
            onChange={() => handleCheck(doubt.student._id)}
          />
          {doubt.student.userName}: {doubt.question}
        </div>
      ))}

      <h3>Schedule Zoom Session</h3>
      <input type="datetime-local" onChange={(e) => setDateTime(e.target.value)} />
      <textarea placeholder="Note for students" onChange={(e) => setNote(e.target.value)} />
      <button onClick={handleCreateSession}>Create Zoom Call</button>
    </div>
  );
};

export default InstructorNotification;
