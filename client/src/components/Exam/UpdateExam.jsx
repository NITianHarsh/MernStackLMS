// src/pages/UpdateExam.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/axiosInstance";

const UpdateExam = () => {
  const { id } = useParams();
  const [exam, setExam] = useState({
    title: "",
    subject: "",
    duration: 0,
    questions: [],
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axiosInstance.get(`/exam/get/${id}`);
        const data = res.data;

        const questionsWithCorrectAnswer = data.questions.map((q) => ({
          ...q,
          correctAnswerIndex: q.correctAnswerIndex ?? 0,
        }));

        setExam({
          title: data.title,
          subject: data.subject,
          duration: data.duration,
          questions: questionsWithCorrectAnswer,
        });
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };

    fetchExam();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExam((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index][field] = value;
    setExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[questionIndex].correctAnswerIndex = optionIndex;
    setExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAddQuestion = () => {
    setExam((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswerIndex: 0,
        },
      ],
    }));
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = exam.questions.filter((_, i) => i !== index);
    setExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    for (let q of exam.questions) {
      if (
        q.questionText.trim() === "" ||
        q.options.length !== 4 ||
        q.options.some((opt) => opt.trim() === "")
      ) {
        alert("❌ Please fill all question fields and options correctly.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await axiosInstance.put(`/exam/update/${id}`, exam);
      alert("✅ Exam updated successfully!");
      navigate("/instructor/getExamList");
    } catch (error) {
      console.error("Error updating exam:", error);
      alert("❌ Failed to update exam.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Update Exam
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={exam.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={exam.subject}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Duration (in minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={exam.duration}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Questions */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Questions
          </h3>
          {exam.questions.map((question, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-md mb-6 bg-gray-50"
            >
              <label className="block font-medium mb-2">
                Question {index + 1}
              </label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
                className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md"
                required
              />

              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, optIndex, e.target.value)
                      }
                      className="w-full border border-gray-300 px-3 py-1 rounded-md"
                      required
                    />
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        name={`correctAnswer-${index}`}
                        checked={question.correctAnswerIndex === optIndex}
                        onChange={() =>
                          handleCorrectAnswerChange(index, optIndex)
                        }
                        className="form-radio"
                      />
                      <span>Correct</span>
                    </label>
                  </div>
                ))}
              </div>

              {/* Delete Question Button */}
              <button
                type="button"
                onClick={() => handleDeleteQuestion(index)}
                className="text-red-600 mt-3"
              >
                Delete Question
              </button>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          >
            Add Question
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 ${
              isSubmitting ? "bg-gray-300 text-gray-600 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Exam"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateExam;
