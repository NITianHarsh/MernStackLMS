import Doubt from "../models/Doubt.js";
import Notification from "../models/Notification.js";
import { createZoomMeeting } from "../helper/zoomMeetings.js";
import ScheduledSession from "../models/ScheduledSession.js";

export const getUnresolvedDoubts = async (req, res) => {
  const doubts = await Doubt.find({ isResolved: false }).populate("student");
  res.json({ doubts });
};

export const scheduleZoomSession = async (req, res) => {
  const { selectedStudentIds, dateTime, note, doubtIds } = req.body;

  try {
    const meetingData = {
      topic: "Doubt Session",
      type: 2,
      start_time: dateTime,
      duration: 60,
      timezone: "Asia/Kolkata",
      settings: {
        join_before_host: true,
        approval_type: 0,
      },
    };

    const meeting = await createZoomMeeting(meetingData);

    await ScheduledSession.create({
      instructor: req.user._id,
      students: selectedStudentIds,
      note,
      dateTime,
      meetingLink: meeting.join_url,
    });

    for (const studentId of selectedStudentIds) {
      await Notification.create({
        student: studentId,
        message: `Doubt session scheduled on ${new Date(
          dateTime
        ).toLocaleString()}.\nNote: ${note}`,
        meetingLink: meeting.join_url,
        dateTime,
      });
    }

    await Doubt.updateMany({ _id: { $in: doubtIds } }, { isResolved: true });

    res
      .status(200)
      .json({ success: true, message: "Zoom session created", meeting });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to schedule session" });
  }
};

export const getInstructorSessions = async (req, res) => {
  const sessions = await Notification.find({
    dateTime: { $gte: new Date() }, // Only future sessions
  }).populate("student");
  res.json({ sessions });
};
export const getStudentNotifications = async (req, res) => {
  const { studentId } = req.params;
  const notifications = await Notification.find({ student: studentId });
  res.json({ notifications });
};
