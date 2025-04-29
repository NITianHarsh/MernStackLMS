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
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}

export default InstructorProvider;
