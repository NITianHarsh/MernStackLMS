import { Button } from "../ui/button";
import { toast } from "react-toastify";
import axiosInstance from "@/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import React, { useContext, useState, useEffect } from "react";

const InstructorNotification = () => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    note: "",
  });
  const { auth } = useContext(AuthContext);
  const instructorId = auth?.user?._id;
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doubts, setDoubts] = useState([]);
  const [selectedDoubtIds, setSelectedDoubtIds] = useState([]);

  const todayDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isPastTime()) {
      setError("Please select a future time.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/zoom/create-meeting", form);
      const meetingData = res.data;
      setMeeting(meetingData);
      await handleCreateSession(meetingData);
    } catch (err) {
      toast.error("Zoom Error:" + err);
      setError("Error creating Zoom meeting.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setForm({ ...form, date: e.target.value, time: "" });
  };

  const handleTimeChange = (e) => {
    setForm({ ...form, time: e.target.value });
  };

  const isPastTime = () => {
    if (form.date !== todayDate) return false;
    const now = new Date();
    const [hours, minutes] = form.time.split(":").map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes, 0, 0);
    return selectedTime < now;
  };

  const handleCheck = (doubtId) => {
    setSelectedDoubtIds((prev) =>
      prev.includes(doubtId)
        ? prev.filter((id) => id !== doubtId)
        : [...prev, doubtId]
    );
  };

  const handleCreateSession = async (meetingData) => {
    if (!selectedDoubtIds.length) {
      toast.error("Please select at least one doubt.");
      return;
    }

    const selectedDoubts = doubts.filter((d) =>
      selectedDoubtIds.includes(d._id)
    );
    const studentIds = [
      ...new Set(
        selectedDoubts
          .map(
            (d) =>
              d?.student?._id ||
              (typeof d.student === "string" ? d.student : undefined)
          )
          .filter(Boolean)
      ),
    ];
    const dateTime = `${form.date}T${form.time}`;

    const payload = {
      instructorId,
      studentIds,
      doubtIds: selectedDoubtIds,
      scheduledAt: dateTime,
      note: form.note,
      zoomJoinUrl: meetingData.join_url,
      zoomStartUrl: meetingData.start_url,
    };
    try {
      await axiosInstance.post("/doubt/schedule", payload);
      toast.success("Session scheduled & notifications sent to students");
      setSelectedDoubtIds([]);
      setForm({ date: "", time: "", note: "" });
    } catch (err) {
      toast.error("Failed to schedule session");
    }
  };

  useEffect(() => {
    axiosInstance.get("/doubt/unresolved").then((res) => {
      setDoubts(res.data.doubts || []);
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Doubt Selection */}
      <div className="w-full lg:w-1/2 max-h-[500px] overflow-y-auto border border-emerald-300 bg-emerald-50 dark:bg-gray-900 dark:border-gray-700 rounded-2xl p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-4">
          📌 Select Doubts to Group
        </h2>
        {doubts.map((doubt) => (
          <label
            key={doubt._id}
            className="flex items-start gap-3 py-2 px-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-gray-700 cursor-pointer border border-emerald-100 dark:border-gray-600 transition"
          >
            <input
              type="checkbox"
              checked={selectedDoubtIds.includes(doubt._id)}
              onChange={() => handleCheck(doubt._id)}
              className="accent-emerald-600 mt-1"
            />
            <div>
              <div className="font-medium text-gray-800 dark:text-white">
                {doubt.student?.userName}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {doubt.message}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Schedule Form */}
      <div className="bg-emerald-50 dark:bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-md border border-emerald-300 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Create Zoom Meeting
          </h1>
          <Button
            onClick={() => navigate("/instructor/my-sessions")}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-4 py-2 transition"
          >
            My Due Sessions
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={form.date}
            min={todayDate}
            onChange={handleDateChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="time"
            value={form.time}
            onChange={handleTimeChange}
            required
            disabled={!form.date}
            className={`w-full border ${
              isPastTime()
                ? "border-red-400"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
              isPastTime() ? "focus:ring-red-400" : "focus:ring-emerald-500"
            }`}
          />
          {isPastTime() && (
            <p className="text-red-500 text-xs">Please select a future time.</p>
          )}

          <input
            type="text"
            placeholder="Instructor Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            required
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading || isPastTime()}
            className={`w-full ${
              loading || isPastTime()
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            } text-white rounded-lg py-2 font-medium transition`}
          >
            {loading ? "Creating..." : "Generate Zoom Meeting"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default InstructorNotification;
