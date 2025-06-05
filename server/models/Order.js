import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: true, // Make this field required to store the Razorpay order ID
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true, // Make userName required as it is passed during checkout
  },
  userEmail: {
    type: String,
    required: true, // Make userEmail required
  },

  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  instructorName: String,

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  courseTitle: String,

  orderStatus: {
    type: String,
    enum: ["Created", "Success", "Failed", "Pending"],
    default: "Created", // Default to "Created" during checkout
  },

  paymentMethod: {
    type: String,
    default: "Razorpay",
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid", "Pending"],
    default: "Pending", // Default to "Pending" during checkout
  },

  paymentId: String,

  amount: {
    type: Number,
    required: true, // Ensure that amount is stored as it's used during checkout
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },

  payerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Order = mongoose.model("Order", orderSchema);
