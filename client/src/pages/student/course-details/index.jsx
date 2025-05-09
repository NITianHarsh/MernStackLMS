import axiosInstance from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/VideoPlayer";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {

    const { studentViewCourseDetails, setStudentViewCourseDetails, currentCourseDetailsId, setCurrentCourseDetailsId, loadingState, setLoadingState, DiscountedPrice, setDiscoutedPrice } = useContext(StudentContext);
    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const location = useLocation();
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();



    function handleSetFreePreview(getCurrentVideoInfo) {
        console.log(getCurrentVideoInfo);
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
    }
    async function fetchStudentCoursesDetails(courseId) {
        console.log('hello darling')
        const { data } = await axiosInstance.get(`/student/course/get/details/${courseId}`);

        return data;
    }


    async function fetchStudentViewCoursesDetails() {

        async function checkCoursePurchaseInfo(courseId, studentId) {
            const { data } = await axiosInstance.get(`/student/course/purchase-info/${courseId}/${studentId}`);
            console.log(data, 'raaandhjdbsjjbchinaar')
            return data;
        }
        const checkCoursePurchaseInfoResponse = checkCoursePurchaseInfo(currentCourseDetailsId, auth?.user?._id)
        if (checkCoursePurchaseInfoResponse?.success && checkCoursePurchaseInfoResponse?.data) {
            navigate(`/student/course-progress/${currentCourseDetailsId}`)
            return
        }



        const response = await fetchStudentCoursesDetails(currentCourseDetailsId, auth?.user?._id);
        console.log(response, 'radniingiichinaar');
        if (response?.success) {

            setStudentViewCourseDetails(response?.data);
            setLoadingState(false)
        } else {
            setStudentViewCourseDetails(null);
            setLoadingState(false)
        }
    }

    useEffect(() => {
        console.log('hello baby')
        if (currentCourseDetailsId !== null) fetchStudentViewCoursesDetails()
    }, [currentCourseDetailsId]);

    useEffect(() => {
        if (id) setCurrentCourseDetailsId(id)
    }, [id]);

    useEffect(() => {
        if (!location.pathname.includes('/student/course/details')) (
            setStudentViewCourseDetails(null),
            setCurrentCourseDetailsId(null)

        )

    }, [location.pathname]);

    if (loadingState) return <Skeleton />;




    const getIndexOfFreePreviewUrl =
        studentViewCourseDetails !== null
            ? studentViewCourseDetails?.curriculum?.findIndex(
                (item) => item.freePreview)
            : -1

    console.log(getIndexOfFreePreviewUrl, studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl], 'bro')

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };


    const checkoutHandler = async (amount) => {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert("Failed to load Razorpay.");
            return;
        }

        try {
            // 1. Get Razorpay key
            const { data: { key } } = await axiosInstance.get("/api/getkey");
            console.log(key, 'keyyyyyyyyyy')
            console.log(auth, 'authhhhh')
            console.log(studentViewCourseDetails, 'asdffffffffffffffffffffff')
            // 2. Send full metadata to backend /checkout
            const { data: { order } } = await axiosInstance.post('/api/checkout', {
                amount,
                userId: auth?.user?._id,
                userName: auth?.user?.userName,
                userEmail: auth?.user?.userEmail,
                courseId: studentViewCourseDetails?._id,
                courseTitle: studentViewCourseDetails?.title,
                // courseImage: studentViewCourseDetails?.courseImage,
                // coursePricing: studentViewCourseDetails?.pricing,
                instructorId: studentViewCourseDetails?.instructorId,
                instructorName: studentViewCourseDetails?.instructorName,
            });
            console.log(key, 'keyyyyyyyyyyyyyyy')
            console.log(order, 'orderrrrrrrrrrr')
            // 3. Setup Razorpay checkout
            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Deepank Kujur",
                description: "Course Purchase",
                order_id: order.id,
                callback_url: "http://localhost:5000/api/paymentVerification", // Only required for server-side verification
                prefill: {
                    name: auth?.user?.name,
                    email: auth?.user?.email,
                    contact: "9000090000", // You can replace this with a real contact if available
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
            setDiscoutedPrice("");
        } catch (err) {
            console.error("Checkout error:", err);
            toast.success("Razorpay is opening")
        }
    };




    console.log(studentViewCourseDetails, 'ghjhgjijluijklhuijl')
    console.log(DiscountedPrice, 'discount')


    return <div className=" mx-auto p-4">
        <div className="bg-[#1c1d1f] text-white p-8 rounded-t-lg">
            <h1 className="text-3xl font-bold mb-4">
                {studentViewCourseDetails?.title}
            </h1>
            <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
                <span>Created By {studentViewCourseDetails?.instructorName}</span>
                <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
                <span className="flex items-center">
                    <Globe className="mr-1 h-4 w-4" />
                    {studentViewCourseDetails?.primaryLanguage}
                </span>
                <span>
                    {studentViewCourseDetails?.students.length}{" "}
                    {studentViewCourseDetails?.students.length <= 1
                        ? "Student"
                        : "Students"}
                </span>
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-8">
            <main className="flex-grow">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>What you'll learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {studentViewCourseDetails?.objectives
                                .split(",")
                                .map((objective, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span>{objective}</span>
                                    </li>
                                ))}
                        </ul>
                    </CardContent>
                </Card>



                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Course Description</CardTitle>
                    </CardHeader>
                    <CardContent>{studentViewCourseDetails?.description}</CardContent>
                </Card>
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Course Curriculum</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {studentViewCourseDetails?.curriculum?.map(
                            (curriculumItem, index) => (
                                <li
                                    className={`${curriculumItem?.freePreview
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                        } flex items-center mb-4`}
                                    onClick={
                                        curriculumItem?.freePreview
                                            ? () => handleSetFreePreview(curriculumItem)
                                            : null
                                    }
                                >
                                    {curriculumItem?.freePreview ? (
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Lock className="mr-2 h-4 w-4" />
                                    )}
                                    <span>{curriculumItem?.title}</span>
                                </li>
                            )
                        )}
                    </CardContent>
                </Card>

            </main>
            <aside className="w-full md:w-[500px]">
                <Card className="sticky top-4">
                    <CardContent className="p-6">
                        <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                            <VideoPlayer
                                url={
                                    getIndexOfFreePreviewUrl !== -1
                                        ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                                        : ""
                                }
                                width="450px"
                                height="200px"
                                onProgressUpdate={() => { }} // Empty fallback function to prevent crash
                                progressData={{}}           // Safe default
                            />

                        </div>
                        <div className="mb-4">
                            <span className="text-3xl font-bold">
                                Rs{DiscountedPrice || studentViewCourseDetails?.pricing}
                            </span>
                        </div>
                        <Button
                            onClick={() => checkoutHandler(DiscountedPrice || studentViewCourseDetails?.pricing)}
                            className="w-full">
                            Buy Now
                        </Button>

                    </CardContent>
                </Card>
            </aside>
        </div>
        <Dialog
            open={showFreePreviewDialog}
            onOpenChange={() => {
                setShowFreePreviewDialog(false);
                setDisplayCurrentVideoFreePreview(null);
            }}
        >
            <DialogContent className="w-[800px]">
                <DialogHeader>
                    <DialogTitle>Course Preview</DialogTitle>
                </DialogHeader>
                <div className="aspect-video rounded-lg flex items-center justify-center">
                    <VideoPlayer
                        url={
                            getIndexOfFreePreviewUrl !== -1
                                ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                                : ""
                        }
                        width="450px"
                        height="200px"
                        onEnded={() => {
                            // Prevent redirect or unwanted behavior
                            console.log("Video ended");
                        }}
                    />

                </div>
                <div className="flex flex-col gap-2">
                    {studentViewCourseDetails?.curriculum
                        ?.filter((item) => item.freePreview)
                        .map((filteredItem) => (
                            <p
                                onClick={() => handleSetFreePreview(filteredItem)}
                                className="cursor-pointer text-[16px] font-medium"
                            >
                                {filteredItem?.title}
                            </p>
                        ))}
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <Card className="mt-8 mb-8 bg-[#f8f9fa] dark:bg-[#1a1a1a] shadow-lg rounded-xl transition-all duration-300">
            <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-semibold text-black dark:text-white flex items-center gap-2">
                    💡 Know More, Pay Less!
                </CardTitle>
            </CardHeader>

            <CardContent>
                <p className="mb-3 text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                    Show off your skills and earn a discount by completing a short challenge exam.
                    It’s your knowledge that counts — not just your wallet.
                </p>

                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 italic">
                    Pass the exam to receive a special discount on this course.
                </p>

                <div className="flex justify-center">
                    <Button
                        onClick={() =>
                            navigate(`/student/student-courses/start-exam/${studentViewCourseDetails?._id}`)
                        }
                        disabled={!!DiscountedPrice}
                        className="px-6 py-2 bg-black text-white hover:bg-gray-900 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
                    >
                        🎯 Take the Discount Challenge
                    </Button>
                </div>
            </CardContent>
        </Card>

    </div>
}
export default StudentViewCourseDetailsPage;