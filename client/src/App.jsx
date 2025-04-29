import {Routes, Route } from "react-router-dom";
import StudentViewCommonHeader from "./components/student-view/Header";
import StudentHomePage from "./pages/student/home";

function App() {
  return (
   <>
   <StudentViewCommonHeader />
    <Routes>    
      <Route path="/home" element={<StudentHomePage/>} />
      </Routes>
      </>
  );
}

export default App;
