import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { otpStore } from "../server.js"; // Adjust the import path as necessary
import sendWelcomeEmail from "../helper/sendWelcomeEmail.js";
import sendResetOtpEmail from "../helper/sendVerifyOTP.js";

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({ userEmail });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "UserEmail already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role,
    password: hashPassword,
    userImage: undefined,
  });

  await newUser.save();

  try {
    await sendWelcomeEmail(userEmail, userName, role);
  } catch (err) {
    console.log("Failed to send welcome email.");
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });
  const isMatch =
    checkUser && (await bcrypt.compare(password, checkUser.password));

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
      userImage: checkUser.userImage,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
        userImage: checkUser.userImage,
      },
    },
  });
};

const checkAuth = (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  const user = await User.findOne({ userEmail: email.trim().toLowerCase() });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
  });

  // Auto-cleanup after 5 minutes
  setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

  try {
    await sendResetOtpEmail(user.userEmail, user.userName, otp);
    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP." });
  }
};

const resetPassword = async (req, res) => {
  const { email, password, confirmPassword, otp } = req.body;
  const record = otpStore.get(email);
  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  if (!email || !password || !confirmPassword || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  if (otp !== record.otp) {
    return res.status(401).json({ message: "Incorrect OTP" });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match." });
  }

  const user = await User.findOne({ userEmail: email.trim().toLowerCase() });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  user.password = hashPassword;
  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "Password updated successfully." });
};

const uploadImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "No image URL provided" });
    }

    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update image error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  checkAuth,
  uploadImage,
};
