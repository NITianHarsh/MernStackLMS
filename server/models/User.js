import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
});

export default model("User", UserSchema);