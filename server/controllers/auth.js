import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendWelcomeEmail from "../helper/sendWelcomeEmail.js";

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
    userImage:undefined
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
  if (!checkUser || !bcrypt.compare(password, checkUser.password)) {
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

const resetPassword = async (req, res) => {
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

export { registerUser, loginUser, resetPassword, checkAuth, uploadImage };
