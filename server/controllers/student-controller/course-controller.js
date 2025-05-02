import course from "../../models/course.js";
import StudentCourses from "../../models/StudentCourses.js";


const getAllStudentViewCourses = async (req, res) => {
    try {

        const {
            category = [],
            level = [],
            primaryLanguage = [],
            sortBy = "price-lowtohigh",
        } = req.query;

        let filters={};
        if(category.length){
            filters.category={$in : category.split(',')}
        }
        if(level.length){
            filters.level={$in : level.split(',')}
        }
        if(primaryLanguage.length){
            filters.primaryLanguage={$in : primaryLanguage.split(',')}
        }

        let sortParam={};
        switch (sortBy) {
            case 'price-lowtohigh':
                sortParam.pricing=1
            break;
            case 'price-hightolow':
                sortParam.pricing=-1
            break;
            case 'title-atoz':
                sortParam.title=1
            break;
            case 'price-ztoa':
                sortParam.title=-1
            break;
        
            default:
                sortParam.pricing=1
            break;
        }
        const courseList = await course.find(filters).sort(sortParam);
        res.status(200).json({
            success: true,
            data: courseList,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })

    }
}

const getStudentViewCourseDetails = async (req, res) => {
    try {
        const { id,studentId } = req.params;
        const courseDetails = await course.findById(id);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'No course deatils found',
                data: null,
            });

        }

        //we will check if current student has purchased this course or not
        const studentCourses = await StudentCourses.findOne({
            userId: studentId
        });
        console.log(studentCourses, "studentcourses");
        const ifStudentAlreadyBoughtCurrentCourse = studentCourses.courses.findIndex(item => item.courseId === id) > -1
        
        
        res.status(200).json({
            success: true,
            data: courseDetails,
            coursePurchasedId:ifStudentAlreadyBoughtCurrentCourse?id:null,
        });


    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })

    }

}

export { getAllStudentViewCourses, getStudentViewCourseDetails };