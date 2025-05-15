import crypto from "crypto";
import { instance } from "../../server.js";
import { Payment } from "../../models/paymentModel.js";
import { Order } from "../../models/Order.js";
import course from "../../models/course.js";
import StudentCourses from "../../models/StudentCourses.js";

// import Razorpay from 'razorpay';
// import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js'; // for ESM


export const checkout = async (req, res) => {
  const {
    amount,
    courseId,
    courseTitle,
    instructorId,
    instructorName,
    userId,
    userName,
    userEmail,
  } = req.body;

  try {
    const options = {
      amount: Number(amount * 100), // convert to paise
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    await Order.create({
      amount,
      razorpayOrderId: order.id,
      userId,
      userName,
      userEmail,
      instructorId,
      instructorName,
      courseId,
      courseTitle,
      orderStatus: "Created",
      paymentStatus: "Pending",
      paymentMethod: "Razorpay",
      orderDate: new Date(),
    });
   console.log('orderrrrrrrrr createddddddddddd')
   console.log(order.id)
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Checkout failed:", error);
    res.status(500).json({
      success: false,
      message: "Checkout failed",
    });
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Signature mismatch",
    });
  }

  try {
    // Store the verified payment
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
 console.log(razorpay_order_id,'iddddddddorderrrrrrrr'
 )
    // Find the original order
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    console.log(order)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order metadata not found",
      });
    }

    // Update order status
    order.orderStatus = "Success";
    order.paymentStatus = "Paid";
    order.paymentId = razorpay_payment_id;
    await order.save();

    const {
      userId,
      userName,
      userEmail,
      courseId,
      courseTitle,
      instructorId,
      instructorName,
      orderDate,
    } = order;

    // Grant course access
    let studentCourses = await StudentCourses.findOne({ userId });

    const courseEntry = {
      courseId,
      title: courseTitle,
      instructorId,
      instructorName,
      dateOfPurchase: orderDate || new Date(),
    };

    if (studentCourses) {
      studentCourses.courses.push(courseEntry);
      await studentCourses.save();
    } else {
      await StudentCourses.create({
        userId,
        courses: [courseEntry],
      });
    }

    // Add student to course's enrolled list
    await course.findByIdAndUpdate(courseId, {
      $addToSet: {
        students: {
          studentId: userId,
          studentName: userName,
          studentEmail: userEmail,
        },
      },
    });

    // Redirect to frontend success page
    res.redirect(`https://gyaanpath.onrender.com/student/paymentsuccess?reference=${razorpay_payment_id}`);
  } catch (error) {
    console.error("Verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};

// export const paymentVerification =async (req,res)=>{


// const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//     .update(body.toString())
//     .digest("hex");
//     // checking signature is same or not 
// //   console.log("sig received ", razorpay_signature);
// //   console.log("sig generated ", expectedSignature);

//   if (expectedSignature === razorpay_signature) {
//     // res.status(200).json({
//     //   success: true,
//     //   message: "Payment verified successfully",
//     // });
//    // store in database
//     await Payment.create({
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature 
//     });
//     res.redirect(`http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`) // frontend ka url hona chahiye
//   } else {
//     res.status(400).json({
//       success: false,
//       message: "Signature mismatch",
//     });
//   }



// };
