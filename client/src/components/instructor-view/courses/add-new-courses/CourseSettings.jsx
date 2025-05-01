import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext } from "react";
import { InstructorContext } from "@/context/instructor-context";
import MediaProgressbar from "@/components/mediaProgress";
import axiosInstance from "@/axiosInstance";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await axiosInstance.post(
          "/media/upload",
          imageFormData,
          {
            onUploadProgress: (progressEvent) => {
              const total = progressEvent?.total || 0;
              const current = progressEvent?.loaded || 0;
              const percentage = Math.floor((current * 100) / total);
              setMediaUploadProgressPercentage(percentage);
            },
          }
        );

        if (response.data.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <Card className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-md">
      <CardHeader>
        <CardTitle className="text-green-800 text-2xl dark:text-green-300">
          Course Settings
        </CardTitle>
      </CardHeader>
      <div>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className="flex flex-col gap-3">
            <Label className="text-black dark:text-white">
              Upload Course Image
            </Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
