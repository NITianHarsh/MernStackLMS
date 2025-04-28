import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import React, { createContext, useState } from "react";

export const InstructorContext = createContext(null);

function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData // Array of objects
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]); //to show the list of courses created by the instructor
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null); //to show the course that is being edited by the instructor
  return (
    <InstructorContext.Provider
      value={{
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        courseLandingFormData,
        setCourseLandingFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCoursesList,
        setInstructorCoursesList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}

export default InstructorProvider;
