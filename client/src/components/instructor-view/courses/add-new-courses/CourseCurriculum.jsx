import axiosInstance from "@/axiosInstance";
import MediaProgressbar from "@/components/mediaProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import React, { useContext } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }
  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value, // will update the title of the current index
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }
  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }
  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);
        const { data } = await axiosInstance.post(
          "/media/upload",
          videoFormData,
          {
            onUploadProgress: (progressEvent) => {
              const total = progressEvent?.total || 0;
              const current = progressEvent?.loaded || 0;
              const percentage = Math.floor((current * 100) / total);
              setMediaUploadProgressPercentage(percentage);
            },
          }
        );

        if (data?.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: data?.data?.url,
            public_id: data?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <Card className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-md">
      <CardHeader>
        <CardTitle className="text-green-800 text-2xl dark:text-green-300">
          Create Course Curriculum
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Button
          onClick={handleNewLecture}
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
        >
          Add Lecture
        </Button>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}

        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-green-50 dark:bg-gray-700"
            >
              <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Lecture {index + 1}
                </h3>

                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter Lecture title"
                  onChange={(e) => handleCourseTitleChange(e, index)}
                  value={courseCurriculumFormData[index]?.title}
                  className="max-w-96 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label
                    htmlFor={`freePreview-${index + 1}`}
                    className="text-black dark:text-white"
                  >
                    Free Preview
                  </Label>
                </div>
              </div>

              <div className="mt-6">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    handleSingleLectureUpload(e, index);
                  }}
                  className="mb-4 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
