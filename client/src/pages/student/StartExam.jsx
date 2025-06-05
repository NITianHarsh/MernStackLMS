import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import TimerComponent from "@/components/Exam/TimerComponent";
import PreventCheating from "@/components/Exam/PreventCheating";
import { StudentContext } from "@/context/student-context";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const StartExam = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { DiscountedPrice, setDiscountedPrice } = useContext(StudentContext);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [discount, setDiscount] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(); // Replace with actual price if needed
  const [eligible, setEligible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axiosInstance.get(
          `/student/course/get/details/${courseId}`
        );
        const courseData = response.data.data;
        if (courseData?.exam && courseData.exam.questions) {
          setQuestions(courseData.exam.questions);
          setTimeLimit(courseData.exam.duration * 60);
          setAnswers(
            courseData.exam.questions.map(() => ({ selectedOptionIndex: -1 }))
          );
          setStartTime(Date.now());
          setOriginalPrice(courseData.pricing || 1000);
        } else {
          console.error("Exam details not found for course");
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };

    fetchExam();
  }, [courseId]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex].selectedOptionIndex = optionIndex;
      return newAnswers;
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, idx) => {
      if (answers[idx]?.selectedOptionIndex === question.correctAnswerIndex) {
        correct += 1;
      }
    });
    return correct;
  };

  const submitExam = async (fromTimer = false) => {
    if (!fromTimer && !isDialogOpen) return;

    setIsSubmitting(true);

    const totalTimeTaken = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = calculateScore();
    const percentage = (correctAnswers / questions.length) * 100;

    if (percentage >= 70) {
      const randomDiscount = Math.floor(Math.random() * (30 - 10 + 1)) + 10; // 10% to 30%
      const discountedPrice = Math.floor(
        originalPrice - (originalPrice * randomDiscount) / 100
      );
      setDiscount(randomDiscount);
      setFinalPrice(discountedPrice);
      setDiscountedPrice(discountedPrice);
      setEligible(true);
    } else {
      setDiscount(0);
      setFinalPrice(originalPrice);
      setEligible(false);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const handleTimeUp = () => {
    toast.warn("Time's up! Submitting exam...");
    submitExam(true);
  };

  if (discount !== null) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        {eligible ? (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border border-green-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-100 dark:bg-green-900/50 rounded-full">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Exam Completed!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Congratulations! You scored above 70%.
            </p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700 mb-6">
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg mb-2">
                You've earned a {discount}% discount!
              </p>
              <div className="flex items-center justify-center space-x-4">
                <span className="line-through text-red-500 text-xl">
                  ₹{originalPrice}
                </span>
                <span className="text-2xl font-bold text-green-700 dark:text-green-500">
                  ₹{finalPrice}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/student/course/details/${courseId}`)}
              className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Avail the Offer
              <svg
                className="w-5 h-5 ml-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gray-100 dark:bg-gray-700 rounded-full">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Exam Completed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              You scored less than 70%.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No discount applied. Try again later.
            </p>

            <button
              onClick={() => navigate(`/student/course/details/${courseId}`)}
              className="mt-4 bg-gradient-to-r from-gray-600 to-blue-600 hover:from-gray-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300"
            >
              Go to Courses
              <svg
                className="w-5 h-5 ml-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (questions.length === 0)
    return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PreventCheating />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
            Exam
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Total Questions: {questions.length}
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-lg shadow-inner">
          <TimerComponent timeLimit={timeLimit} onTimeUp={handleTimeUp} />
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, idx) => (
          <div
            key={question._id || idx}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-all duration-200"
          >
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {idx + 1}.
              </span>{" "}
              {question.questionText}
            </p>
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex items-start p-4 rounded-lg cursor-pointer transition-all duration-150 ${
                    answers[idx]?.selectedOptionIndex === optionIndex
                      ? "bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-600"
                      : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={optionIndex}
                    checked={answers[idx]?.selectedOptionIndex === optionIndex}
                    onChange={() => handleOptionChange(idx, optionIndex)}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={isSubmitting}
          className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-indigo-500/50 group"
        >
          <span className="relative">Submit Exam</span>
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submit</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit the exam? You will not be able to
              change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={submitExam} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Yes, Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartExam;
