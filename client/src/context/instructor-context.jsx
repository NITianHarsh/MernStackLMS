import React, { createContext, useState } from "react";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";

export const InstructorContext = createContext(null);

function InstructorProvider({ children }) {
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]); //to show the list of courses created by the instructor
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null); //to show the course that is being edited by the instructor
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData // Array of objects
  );
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);

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
