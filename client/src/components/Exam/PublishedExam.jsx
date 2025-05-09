import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ClipboardList, Clock, ListChecks, Loader2, PlayCircle } from "lucide-react";
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
    navigate(`/student/exam/${examId}/start`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
  <div className="text-center">
    <Loader2 className="animate-spin w-8 h-8 mx-auto text-gray-500 dark:text-gray-400" />
    <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
      Loading your exams...
    </p>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
      Preparing your challenge
    </p>
  </div>
</div>

    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
      Challenge Your Brain — 30 Minutes to Mastery!
    </h1>
    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
      Test your knowledge and sharpen your skills with our timed challenges
    </p>
  </div>

  {exams.length === 0 ? (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <FileSearch className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No exams found</h3>
      <p className="text-gray-500 dark:text-gray-500 mt-2">Check back later for new challenges</p>
    </div>
  ) : (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <div
          key={exam._id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <ClipboardList className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {exam.title}
              </h2>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <BookOpen className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>Subject: {exam.subject}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>Duration: {exam.duration} mins</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <ListChecks className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>Questions: {exam.questions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <button
              onClick={() => handleStartExam(exam._id)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Challenge
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default PublishedExam;
