import { useContext } from "react";
import AuthPage from "./pages/auth.jsx";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/auth-context.jsx";
import UserProtected from "./components/UserProtected.jsx";
import InstructorDashboard from "./pages/instructor/index.jsx";
import CommonLayout from "./components/student-view/CommonLayout.jsx";
import StudentHomePage from "./pages/student/home/index.jsx";
import AddNewCourse from "./pages/instructor/add-new-course.jsx";
import ExamSubmission from "./components/Exam/ExamSubmission.jsx";
import Results from "./components/Exam/Result.jsx";
import Leaderboard from "./components/Exam/Leaderboard.jsx";
import CreateExam from "./components/Exam/CreateExam.jsx";
import ExamList from "./components/Exam/ExamList.jsx";
import PublishedExam from "./components/Exam/PublishedExam.jsx";
import AllResults from "./components/Exam/AllResults.jsx";
import UpdateExam from "./components/Exam/UpdateExam.jsx";
import HomePage from "./pages/Home.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import NotFound from "./pages/not-found.jsx";
import StudentViewCoursePage from "./pages/student/courses/index.jsx";
import StudentViewCourseDetailsPage from "./pages/student/course-details/index.jsx";
import StudentNotifications from "./components/student-view/StudentNotifications.jsx";
import DueSessions from "./components/instructor-view/DueSessions.jsx";
import StudentCoursesPage from "./pages/student/student-courses/index.jsx";
import StudentViewCourseProgressPage from "./pages/student/course-progress/index.jsx";
import PaymentDone from "./components/Payment/PaymentDone.jsx";
import StudentExamPage from "./pages/student/exam.jsx";
import StartExam from "./pages/student/StartExam.jsx";
import PomodoroFloatingWidget from "./components/Pomodoro/Pomodoro.jsx";
import StudentViewCoursesPage from "./pages/student/courses/index.jsx";
import AskDoubt from "./pages/student/AskDoubt.jsx";
import Footer from "./pages/Footer.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Auth route */}
        <Route
          path="/auth"
          element={
            <UserProtected
              element={<AuthPage />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        />

        {/* Instructor routes */}
        <Route
          path="/instructor"
          element={
            <UserProtected
              element={<InstructorDashboard />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <UserProtected
              element={<AddNewCourse />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <UserProtected
              element={<AddNewCourse />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/createExam"
          element={
            <UserProtected
              element={<CreateExam />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/getExamList"
          element={
            <UserProtected
              element={<ExamList />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/update-exam/:id"
          element={
            <UserProtected
              element={<UpdateExam />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/my-sessions"
          element={
            <UserProtected
              element={<DueSessions />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        />

        {/* Student layout with nested routes */}
        <Route
          path="/student/*"
          element={
            <UserProtected
              element={<CommonLayout />}
              authenticated={auth?.isAuthenticated}
              user={auth?.user}
            />
          }
        >
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentViewCoursesPage />} />
          <Route
            path="course/details/:id"
            element={<StudentViewCourseDetailsPage />}
          />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="PublishedExamList" element={<PublishedExam />} />
          <Route path="exam/:examId/start" element={<ExamSubmission />} />
          <Route path="results/:examId" element={<Results />} />
          <Route path="exam/:examId/leaderboard" element={<Leaderboard />} />
          <Route path="exam/:examId/all-results" element={<AllResults />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="student-courses" element={<StudentCoursesPage />} />
          <Route
            path="course-progress/:id"
            element={<StudentViewCourseProgressPage />}
          />
          <Route path="paymentsuccess" element={<PaymentDone />} />
          <Route path="student-courses/exam" element={<StudentExamPage />} />
          <Route
            path="student-courses/start-exam/:courseId"
            element={<StartExam />}
          />
          <Route path="doubt" element={<AskDoubt />} />
        </Route>

        <Route
          path="/aboutus"
          element={<AboutUs/>}
        />
        <Route
          path="/termsandconditions"
          element={<TermsAndConditions/>}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <PomodoroFloatingWidget />
      <Footer/>
    </>
  );
}

export default App;
