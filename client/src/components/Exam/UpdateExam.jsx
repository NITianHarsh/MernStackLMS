// src/pages/UpdateExam.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import { toast } from "sonner";

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
        toast.error("❌ Please fill all question fields and options correctly.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await axiosInstance.put(`/exam/update/${id}`, exam);
      toast.success("✅ Exam updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating exam:", error);
      toast.error("❌ Failed to update exam.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-6 sm:px-12 md:px-20 py-8 bg-emerald-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
  <h2 className="text-3xl font-bold text-center text-emerald-800 dark:text-emerald-300 mb-6">
    Update Exam
  </h2>

  <form
    onSubmit={handleSubmit}
    className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 space-y-6 transition-all duration-300"
  >
    {/* Title */}
    <div>
      <label className="block font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
        Title
      </label>
      <input
        type="text"
        name="title"
        value={exam.title}
        onChange={handleInputChange}
        className="w-full border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg"
        required
      />
    </div>

    {/* Subject */}
    <div>
      <label className="block font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
        Subject
      </label>
      <input
        type="text"
        name="subject"
        value={exam.subject}
        onChange={handleInputChange}
        className="w-full border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg"
        required
      />
    </div>

    {/* Duration */}
    <div>
      <label className="block font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
        Duration (in minutes)
      </label>
      <input
        type="number"
        name="duration"
        value={exam.duration}
        onChange={handleInputChange}
        className="w-full border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg"
        required
      />
    </div>

    {/* Questions */}
    <div>
      <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4">
        Questions
      </h3>
      {exam.questions.map((question, index) => (
        <div
          key={index}
          className="border border-emerald-200 dark:border-emerald-700 p-4 rounded-md mb-6 bg-emerald-100 dark:bg-gray-700 transition"
        >
          <label className="block font-medium text-emerald-800 dark:text-emerald-200 mb-2">
            Question {index + 1}
          </label>
          <input
            type="text"
            value={question.questionText}
            onChange={(e) =>
              handleQuestionChange(index, "questionText", e.target.value)
            }
            className="w-full mb-3 border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-3 py-2 rounded-md"
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
                  className="w-full border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-3 py-1 rounded-md"
                  required
                />
                <label className="flex items-center space-x-1 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="radio"
                    name={`correctAnswer-${index}`}
                    checked={question.correctAnswerIndex === optIndex}
                    onChange={() =>
                      handleCorrectAnswerChange(index, optIndex)
                    }
                    className="form-radio text-emerald-600 dark:text-emerald-400"
                  />
                  <span>Correct</span>
                </label>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleDeleteQuestion(index)}
            className="text-red-600 dark:text-red-400 mt-3 hover:underline"
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
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
      >
        Add Question
      </button>
    </div>

    {/* Submit Button */}
    <div className="text-center">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 ${
          isSubmitting ? "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed" : ""
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
