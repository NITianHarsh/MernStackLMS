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
import { Toaster } from "sonner";
import HomePage from "./pages/Home.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import NotFound from "./pages/not-found.jsx";

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
          <Route path="courses" element={<div>Courses</div>} />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="PublishedExamList" element={<PublishedExam />} />
          <Route path="exam/:examId/start" element={<ExamSubmission />} />
          <Route path="results/:examId" element={<Results />} />
          <Route path="exam/:examId/leaderboard" element={<Leaderboard />} />
          <Route path="exam/:examId/all-results" element={<AllResults />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
