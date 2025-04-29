import { useContext } from "react";
import AuthPage from "./pages/auth.jsx";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/auth-context.jsx";
import UserProtected from "./components/UserProtected.jsx";
import InstructorDashboard from "./pages/instructor/index.jsx";
import CommonLayout from "./components/student-view/CommonLayout.jsx";
import StudentHomePage from "./pages/student/home.jsx";
import AddNewCourse from "./pages/instructor/add-new-course.jsx";

function App() {
  const { auth } = useContext(AuthContext);
  
  return (
    <Routes>
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
        path="/"
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
        
      </Route>
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
