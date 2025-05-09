import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const StudentExamPage = () => {
    const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white rounded-2xl">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
              Student Exam Portal
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Welcome! Click the button below to start your exam.
            </p>

            <div className="flex justify-center">
              <Button onClick={() => navigate("/student/student-courses/start-exam")} className="px-6 py-3 text-lg rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentExamPage;
