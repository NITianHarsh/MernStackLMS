import { createContext, useState } from "react";
export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [loadingState, setLoadingState] = useState(true);
  const [DiscountedPrice, setDiscountedPrice] = useState("");
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentViewCourseDetails, setStudentViewCourseDetails] =
    useState(null);
  const [studentCurrentCourseProgress, setstudentCurrentCourseProgress] =
    useState({});
    
  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setstudentCurrentCourseProgress,
        DiscountedPrice,
        setDiscountedPrice,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
