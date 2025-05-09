import React, { useEffect, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import { toast } from "react-toastify";

const ExamList = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axiosInstance.get("/exam/getExamList");
        setExams(res.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const publishExam = async (id) => {
    setPublishingId(id);
    try {
      await axiosInstance.put(`/exam/publish/${id}`);
      toast.success("✅ Exam published successfully!");
      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam._id === id ? { ...exam, isPublished: true } : exam
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to publish exam.");
    } finally {
      setPublishingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading exams...
      </div>
    );
  }

  return (
    <div className="p-6 bg-emerald-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-center text-emerald-700 dark:text-emerald-300">
        All Exams
      </h1>

      {exams.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No exams found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-1">
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

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => publishExam(exam._id)}
                  disabled={exam.isPublished || publishingId === exam._id}
                  className={`px-4 py-2 rounded-md flex items-center justify-center text-sm font-medium transition ${
                    exam.isPublished
                      ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  }`}
                >
                  {publishingId === exam._id ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {exam.isPublished ? "Published" : "Publish"}
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    navigate(`/instructor/update-exam/${exam._id}`)
                  }
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
                >
                  Update
                </button>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-bold ${
                      exam.isPublished
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500"
                    }`}
                  >
                    {exam.isPublished ? "Published" : "Unpublished"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;
