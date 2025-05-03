import express from "express";
import Doubt from "../models/Doubt.js";
import {
  getUnresolvedDoubts,
  scheduleSession,
  getInstructorSessions,
  getStudentNotifications,
} from "../controllers/doubtController.js";

const router = express.Router();

//post doubt (by student side)
router.post("/submit", async (req, res) => {
  const { studentId, courseId, message } = req.body;
  if (!studentId || !courseId || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  const doubt = new Doubt({ student: studentId, course: courseId, message });
  await doubt.save();
  res.status(201).json({ success: true });
});

//by instructor side
router.get("/unresolved", getUnresolvedDoubts);
router.post("/schedule", scheduleSession);
router.get("/my-sessions/:instructorId", getInstructorSessions);
router.get("/notifications/:studentId", getStudentNotifications);

export default router;
