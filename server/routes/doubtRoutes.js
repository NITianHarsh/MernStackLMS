import express from "express";
import Doubt from "../models/Doubt.js";
import {
  getUnresolvedDoubts,
  scheduleZoomSession,
  getInstructorSessions,
  getStudentNotifications,
} from "../controllers/doubtController.js";

const router = express.Router();

//post doubt (by student side)
router.post("/:studentId", async (req, res) => {
    const { studentId, courseId, message } = req.body;
    const doubt = new Doubt({ student: studentId, course: courseId, message });
    await doubt.save();
    res.status(201).json({ success: true });
  });

  //by instructor side
  router.get("/unresolved", getUnresolvedDoubts);
  router.post("/schedule", scheduleZoomSession); 
  router.get("/my-sessions", getInstructorSessions); 
  router.get("/notifications/:studentId", getStudentNotifications);
  
export default router;