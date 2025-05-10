import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AskDoubt = ({ studentId, courseId }) => {
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
      {/* Trigger Button */}
      <button
        className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg shadow-md transition flex items-center"
        onClick={() => setIsOpen(true)}
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        Ask Doubt
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Submit Your Doubt
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Textarea */}
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your doubt here..."
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg shadow border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition flex items-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg shadow transition flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                Send Doubt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskDoubt;
