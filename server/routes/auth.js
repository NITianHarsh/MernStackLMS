import express from "express";
import { registerUser, loginUser } from "../controllers/auth.js";
import authenticate from "../middlewares/auth.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticate, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const checkUser = await User.findOne({
    userEmail: email.trim().toLowerCase(),
  });

  if (!checkUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  checkUser.password = hashPassword;
  await checkUser.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

export default router;
