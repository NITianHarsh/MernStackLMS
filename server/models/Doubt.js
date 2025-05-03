import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

doubtSchema.pre("save", function () {
  console.warn("⚠️ WARNING: Doubt is being saved!", this);
});

export default mongoose.model("Doubt", doubtSchema);
