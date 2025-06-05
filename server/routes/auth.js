import express from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
  checkAuth,
  uploadImage,
  requestPasswordReset,
} from "../controllers/auth.js";
import authenticate from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticate, checkAuth);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.patch("/update-image", authenticate, uploadImage);
export default router;
