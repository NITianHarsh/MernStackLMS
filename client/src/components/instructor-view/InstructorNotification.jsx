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
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
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
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-gray-800 dark:text-gray-100">
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
          onClick={() => (window.location.href = "/instructor/my-sessions")}
        >
          View My Scheduled Sessions
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Unresolved Doubts</h2>
        <div className="space-y-2">
          {doubts &&
            doubts.map((doubt) => (
              <div
                key={doubt._id}
                className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(doubt.student._id)}
                  onChange={() => handleCheck(doubt.student._id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>
                  <strong>{doubt.student.userName}</strong>:{" "}
                  {doubt.question}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-4">
        <h3 className="text-xl font-semibold">Schedule Zoom Session</h3>
        <input
          type="datetime-local"
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 rounded"
          onChange={(e) => setDateTime(e.target.value)}
        />
        <textarea
          placeholder="Note for students"
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 rounded"
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          onClick={handleCreateSession}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create Zoom Call
        </button>
      </div>
    </div>
  );
};

export default InstructorNotification;
