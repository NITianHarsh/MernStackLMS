import express from "express";
import Doubt from "../models/Doubt.js";

const router = express.Router();

router.post("/:studentId", async (req, res) => {
    const { studentId, courseId, message } = req.body;
    const doubt = new Doubt({ student: studentId, course: courseId, message });
    await doubt.save();
    res.status(201).json({ success: true });
  });

router.get("/unresolved", async (req, res) => {
    const doubts = await Doubt.find({ isResolved: false }).populate("student");
    res.json({ doubts });
  });
  
export default router;