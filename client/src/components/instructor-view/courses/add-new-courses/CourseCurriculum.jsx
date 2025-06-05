import { Upload } from "lucide-react";
import axiosInstance from "@/axiosInstance";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import React, { useContext, useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import MediaProgressbar from "@/components/mediaProgress";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

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

  const isCourseCurriculumFormDataValid = () => {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  };

  async function mediaBulkUploadService(formData, onProgressCallback) {
    const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgressCallback(percentCompleted);
      },
    });

    return data;
  }
  function handleSelectBulkUpload() {
    bulkUploadInputRef.current?.click();
  }
  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }
  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormdata.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await axiosInstance.delete(
      `/media/delete/${getCurrentSelectedVideoPublicId}`
    );
    if (response?.data?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }
  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await axiosInstance.delete(
      `/media/delete/${getCurrentVideoPublicId}`
    );

    if (deleteCurrentMediaResponse?.data?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-md">
      <CardHeader className="flex flex-row justify-between ">
        <CardTitle className="text-green-800 text-2xl dark:text-green-300">
          Create Course Curriculum
        </CardTitle>
        <div>
          <input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleSelectBulkUpload}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
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
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex flex-col items-start gap-3 max-w-full">
                    <div className="w-full max-w-[450px]">
                      <VideoPlayer
                        width="100%"
                        height="200px"
                        url={courseCurriculumFormData[index]?.videoUrl}
                      />
                    </div>
                    <div className="flex flex-row gap-2 w-full max-w-[450px]">
                      <Button
                        onClick={() => handleReplaceVideo(index)}
                        className="flex-1"
                      >
                        Replace Video
                      </Button>
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        className="bg-red-900 flex-1"
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      handleSingleLectureUpload(e, index);
                    }}
                    className="mb-4 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
