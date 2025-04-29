import { useContext } from "react";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import FormControls from "@/components/common-forms/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  return (
    <Card className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-md">
  <CardHeader>
    <CardTitle className="text-green-800 text-2xl dark:text-green-300">
      Course Landing Page
    </CardTitle>
  </CardHeader>

  <CardContent>
    <FormControls
      formControls={courseLandingPageFormControls}
      formData={courseLandingFormData}
      setFormData={setCourseLandingFormData}
    />
  </CardContent>
</Card>

  );
}

export default CourseLanding;
