import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  userImage: {
    type: String,
    default:
      "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg", // Default image URL
  },
  role: String,
});

export default model("User", UserSchema);
