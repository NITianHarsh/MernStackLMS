import Doubt from "../models/Doubt.js";
import ScheduledSession from "../models/ScheduledSession.js";

export const getUnresolvedDoubts = async (req, res) => {
  const doubts = await Doubt.find({ isResolved: false })
    .populate("student")
    .lean();

  const validDoubts = doubts.filter((d) => d.student); // Only include if student exists
  res.json({ doubts: validDoubts });
};

export const scheduleSession = async (req, res) => {
  try {
    const {
      instructorId,
      studentIds,
      doubtIds,
      scheduledAt,
      note,
      zoomJoinUrl,
      zoomStartUrl,
    } = req.body;

    // Save session
    const newSession = new ScheduledSession({
      instructor: instructorId,
      students: studentIds,
      doubtIds,
      note,
      dateTime: scheduledAt,
      zoomJoinUrl,
      zoomStartUrl,
    });

    await newSession.save();

    // Mark doubts as resolved
    await Doubt.updateMany(
      { _id: { $in: doubtIds } },
      { $set: { isResolved: true } }
    );

    res.status(201).json({ success: true, session: newSession });
  } catch (err) {
    console.error("Error scheduling session:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInstructorSessions = async (req, res) => {
  try {
    const { instructorId } = req.params;
    // Get the current date and time
    const now = new Date();

    // Fetch sessions that are scheduled for the future
    const sessions = await ScheduledSession.find({
      instructor: instructorId,
      dateTime: { $gt: now },  // Only future sessions
    })
      .populate("students")
      .exec();

    res.status(200).json({ sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch instructor sessions" });
  }
};

export const getStudentNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const sessions = await ScheduledSession.find({
      students: studentId,
      dateTime: { $gte: new Date() }, // Only future sessions
    }).sort({ dateTime: 1 });
    
    res.status(200).json({ sessions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student sessions" });
  }
};
