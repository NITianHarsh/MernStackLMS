import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, PlayCircle } from "lucide-react";
import axiosInstance from "@/axiosInstance";

const PublishedExam = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axiosInstance.get("/exam/published");
        setExams(res.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleStartExam = (examId) => {
    navigate(`/exam/${examId}/start`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-600 dark:text-gray-300">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading exams...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-700 dark:text-green-400">
        Available Exams
      </h1>

      {exams.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No exams found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {exam.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Subject:</strong> {exam.subject}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Duration:</strong> {exam.duration} mins
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Questions:</strong> {exam.questions.length}
                </p>
              </div>

              <button
                onClick={() => handleStartExam(exam._id)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center transition"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Exam
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishedExam;
