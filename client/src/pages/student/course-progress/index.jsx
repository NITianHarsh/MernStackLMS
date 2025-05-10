import axiosInstance from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/VideoPlayer";

import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
// import {
//   getCurrentCourseProgressService,
//   markLectureAsViewedService,
//   resetCourseProgressService,
// } from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import AskDoubt from "../AskDoubt";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setstudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    async function getCurrentCourseProgressService(userId, courseId) {
      const { data } = await axiosInstance.get(
        `/student/course-progress/get/${userId}/${courseId}`
      );
      return data;
    }

    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setstudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("logging here");
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function markLectureAsViewedService(userId, courseId, lectureId) {
    const { data } = await axiosInstance.post(
      `/student/course-progress/mark-lecture-viewed`,
      {
        userId,
        courseId,
        lectureId,
      }
    );

    return data;
  }

  async function updateCourseProgress() {
    console.log("fsdgsah;ddddddddddddddddddddddddddd");
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }
  async function resetCourseProgressService(userId, courseId) {
    const { data } = await axiosInstance.post(
      `/student/course-progress/reset-progress`,
      {
        userId,
        courseId,
      }
    );

    return data;
  }
  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  console.log(currentLecture, "currentLectureeeeeeeeeeeeeeeeeeee");

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student/student-courses")}
            className="text-yellow-400"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>

          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <div className="flex justify-end items-center gap-4">
          {studentCurrentCourseProgress?.courseDetails && (
            <AskDoubt
              studentId={auth?.user?._id}
              courseId={studentCurrentCourseProgress.courseDetails._id}
            />
          )}
          {/* <Button onClick={() => navigate("/student/doubt")} className="bg-white text-black">Ask Your Doubt</Button> */}
          <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
            {isSideBarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[0px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
            controls
          />
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>

        {isSideBarOpen && (
          <div className="w-full md:w-[400px] bg-[#1c1d1f] border-l border-gray-800 transition-all duration-300 flex-shrink-0 shadow-lg">
            <Tabs defaultValue="content" className="h-full flex flex-col">
              {/* Tabs Navigation */}
              <TabsList className="grid w-full grid-cols-2 h-14 p-0 bg-[#121212] border-b border-gray-800">
                <TabsTrigger
                  value="content"
                  className="rounded-none h-full text-white hover:bg-[#2a2b2d] data-[state=active]:bg-[#2a2b2d] data-[state=active]:text-white transition-colors"
                >
                  Course Content
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="rounded-none h-full text-white hover:bg-[#2a2b2d] data-[state=active]:bg-[#2a2b2d] data-[state=active]:text-white transition-colors"
                >
                  Overview
                </TabsTrigger>
              </TabsList>

              {/* Course Content Tab */}
              <TabsContent value="content" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                      (item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-2 text-sm text-white font-medium cursor-pointer hover:bg-[#2a2b2d] p-2 rounded-md transition"
                        >
                          {studentCurrentCourseProgress?.progress?.find(
                            (progressItem) =>
                              progressItem.lectureId === item._id
                          )?.viewed ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Play className="h-4 w-4 text-yellow-400" />
                          )}
                          <span>{item?.title}</span>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Overview Tab */}
              <TabsContent value="overview" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 text-white">
                    <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                      About this course
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {studentCurrentCourseProgress?.courseDetails?.description}
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <Dialog open={lockCourse} onOpenChange={setLockCourse}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent
          showOverlay={false}
          className="sm:max-w-md rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <DialogHeader className="text-center space-y-4">
            {/* Monochromatic Celebration Icon */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-800 dark:text-gray-200"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              You have successfully completed the course
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/student/student-courses")}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white shadow-sm transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              My Courses Page
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </Button>

            <Button
              onClick={handleRewatchCourse}
              variant="outline"
              className="px-6 py-3 border-gray-900 text-gray-900 hover:bg-gray-100 dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Rewatch Course
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Your progress has been saved
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
