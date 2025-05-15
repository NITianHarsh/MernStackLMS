import CourseCurriculum from "@/components/instructor-view/courses/add-new-courses/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-courses/CourseLanding";
import CourseSettings from "@/components/instructor-view/courses/add-new-courses/CourseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { Moon, Sun } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

function AddNewCourse() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle("dark");
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  const [examData, setExamData] = useState({
    title: "",
    duration: "",
    passingScore: "",
    questions: [],
  });

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
  });

  const isEmpty = (value) =>
    Array.isArray(value)
      ? value.length === 0
      : value === null || value === undefined || value === "";

  const validateFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }

    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      )
        return false;
      if (item.freePreview) hasFreePreview = true;
    }

    if (
      isEmpty(examData.title) ||
      isEmpty(examData.duration) ||
      isEmpty(examData.passingScore) ||
      !Array.isArray(examData.questions) ||
      examData.questions.length === 0
    )
      return false;

    return hasFreePreview;
  };

  async function addNewCourse(formData) {
    const { data } = await axiosInstance.post(
      `/instructor/course/add`,
      formData
    );
    return data;
  }

  async function updateCourseById(courseId, formData) {
    const { data } = await axiosInstance.put(
      `/instructor/course/update/${courseId}`,
      formData
    );
    return data;
  }

  const handleCreateCourse = async () => {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      pricing: parseFloat(courseLandingFormData.pricing),
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
      exam: {
        title: examData.title.trim(),
        duration: parseInt(examData.duration),
        passingScore: parseInt(examData.passingScore),
        questions: examData.questions,
      },
    };

    try {
      let response;

      if (currentEditedCourseId !== null) {
        const { data } = await axiosInstance.get(
          `/instructor/course/get/${currentEditedCourseId}`
        );
        const course = data?.data;

        if (course?.instructorId !== auth?.user?._id) {
          toast.error("You are not authorized to edit this course.");
          return;
        }

        response = await updateCourseById(
          currentEditedCourseId,
          courseFinalFormData
        );
      } else {
        response = await addNewCourse(courseFinalFormData);
      }

      if (response?.success) {
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        setCourseLandingFormData(courseLandingInitialFormData);
        setExamData({
          title: "",
          duration: "",
          passingScore: "",
          questions: [],
        });
        navigate(-1);
        setCurrentEditedCourseId(null);
      }
    } catch (error) {
      console.error("Error creating/updating course:", error);
      toast.error("Something went wrong while submitting the course.");
    }
  };

  const fetchCurrentCourseDetails = async () => {
    if (!currentEditedCourseId) return;
    const response = await axiosInstance.get(
      `/instructor/course/get/${currentEditedCourseId}`
    );
    if (response?.data?.success) {
      const setCourseFormData = Object.keys(courseLandingFormData).reduce(
        (acc, key) => {
          acc[key] = response?.data?.data[key] || courseLandingFormData[key];
          return acc;
        },
        {}
      );
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(
        response?.data?.data?.curriculum || courseCurriculumInitialFormData
      );
      setExamData(
        response?.data?.data?.exam || {
          title: "",
          duration: "",
          passingScore: "",
          questions: [],
        }
      );
    }
  };

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  const handleQuestionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const addQuestion = () => {
    const { questionText, options, correctAnswerIndex } = newQuestion;

    if (
      questionText.trim() === "" ||
      options.length !== 4 ||
      options.some((opt) => opt.trim() === "") ||
      correctAnswerIndex < 0 ||
      correctAnswerIndex > 3
    ) {
      toast.error("Please fill all question fields correctly");
      return;
    }

    const cleanedQuestion = {
      questionText: questionText.trim(),
      options: options.map((opt) => opt.trim()),
      correctAnswerIndex: parseInt(correctAnswerIndex),
    };

    setExamData((prev) => ({
      ...prev,
      questions: [...prev.questions, cleanedQuestion],
    }));

    setNewQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    });
  };

  return (
    <div
      className="
    w-full px-4 sm:px-6 md:px-10 lg:px-20 py-6
    bg-gradient-to-br from-green-100 to-green-300
    dark:from-gray-900 dark:to-gray-800
    min-h-screen
    text-black dark:text-white
    transition-all duration-300 ease-in-out
  "
    >
      <div className="relative w-full mb-6">
        {/* Left: Back Button */}
        <div className="absolute left-0 top-1 sm:top-0">
          <button
            className="text-2xl sm:text-3xl font-extrabold text-green-800 dark:text-green-300 hover:scale-110 transition"
            onClick={() => navigate(-1)}
          >
            &#60;
          </button>
        </div>

        {/* Center: Title */}
        <div className="flex justify-center">
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-green-800 dark:text-green-300">
            Create a new course
          </h1>
        </div>

        {/* Right: Actions (on same row in large screens, stacked below on small) */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:right-0 sm:top-0 flex justify-end sm:justify-start w-full sm:w-auto gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <Button
            disabled={!validateFormData()}
            className="text-sm font-bold px-6 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
            onClick={handleCreateCourse}
          >
            SUBMIT
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="px-2 sm:px-4 py-4 text-black dark:text-white">
          <Tabs defaultValue="curriculum" className="space-y-4 relative">
            <TabsList
              className="
                w-full
                grid grid-cols-2 grid-rows-2 gap-2
                sm:grid-cols-2 sm:grid-rows-2
                md:grid-cols-4 md:grid-rows-1
                bg-green-200 dark:bg-gray-700
              "
            >
              <TabsTrigger
                value="curriculum"
                className="w-full text-sm sm:text-base px-4 py-2 sm:py-3 text-center"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="course-landing-page"
                className="w-full text-sm sm:text-base px-4 py-2 sm:py-3 text-center"
              >
                Landing Page
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="w-full text-sm sm:text-base px-4 py-2 sm:py-3 text-center"
              >
                Thumbnail
              </TabsTrigger>
              <TabsTrigger
                value="exam"
                className="w-full text-sm sm:text-base px-4 py-2 sm:py-3 text-center"
              >
                Entrance Test
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <CourseCurriculum />
            </TabsContent>

            <TabsContent value="course-landing-page">
              <CourseLanding />
            </TabsContent>

            <TabsContent value="settings">
              <CourseSettings />
            </TabsContent>

            <TabsContent value="exam">
              <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Exam Title"
                  value={examData.title}
                  onChange={(e) =>
                    setExamData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Duration (min)"
                  value={examData.duration}
                  onChange={(e) =>
                    setExamData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value),
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Passing Score"
                  value={examData.passingScore}
                  onChange={(e) =>
                    setExamData((prev) => ({
                      ...prev,
                      passingScore: parseInt(e.target.value),
                    }))
                  }
                />
                <Textarea
                  placeholder="Question Text"
                  value={newQuestion.questionText}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      questionText: e.target.value,
                    }))
                  }
                />
                {newQuestion.options.map((opt, i) => (
                  <Input
                    key={i}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => handleQuestionChange(i, e.target.value)}
                  />
                ))}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Correct Answer Index
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={3}
                    value={newQuestion.correctAnswerIndex}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        correctAnswerIndex: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Button onClick={addQuestion} className="w-full sm:w-auto">
                    Add Question
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCourse;
