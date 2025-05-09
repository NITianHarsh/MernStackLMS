import React, { useState } from "react";
import axiosInstance from "@/axiosInstance";
import { toast } from "react-toastify";

const CreateExam = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    },
  ]);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, index) => {
    const updated = [...questions];
    updated[qIndex].correctAnswerIndex = index;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/exam/createExam", {
        title,
        subject,
        duration,
        questions,
      });
      toast.success("✅ Exam created successfully!");
      console.log(response.data);
      setTitle("");
      setSubject("");
      setDuration("");
      setQuestions([
        { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
      ]);
    } catch (err) {
      console.error("Error creating exam:", err);
      toast.error("❌ Something went wrong while creating the exam.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl transition-colors duration-300">
      <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">
        Create New Exam
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Exam Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <input
            type="number"
            placeholder="Duration (in minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Questions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Questions
          </h3>
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 mb-6"
            >
              <input
                type="text"
                placeholder={`Question ${qIndex + 1}`}
                value={q.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                    <label className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswerIndex === oIndex}
                        onChange={() =>
                          handleCorrectAnswerChange(qIndex, oIndex)
                        }
                        className="accent-emerald-600"
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-300"
          >
            + Add Question
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition duration-300"
          >
            Create Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
