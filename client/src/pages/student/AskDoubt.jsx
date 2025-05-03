import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "sonner";

const AskDoubt = ({studentId,courseId}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("/doubt/submit", {
        studentId,
        courseId,
        message,
      });
      toast.success("Doubt submitted!");
      setIsOpen(false);
      setMessage("");
    } catch (err) {
      toast.error("Error submitting doubt");
    }
  };

  return (
    <div>
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => setIsOpen(true)}
    >
      Ask Doubt
    </button>

    {isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Submit Your Doubt</h3>
          <textarea
            rows="4"
            className="w-full p-2 border rounded mb-4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your doubt here..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Send
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default AskDoubt;
