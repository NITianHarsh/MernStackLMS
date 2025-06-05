import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import Navbar from "@/components/navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/request-reset", { email });
      if (res.data.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
      } else {
        setMessage("Failed to send OTP.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        password,
        confirmPassword,
      });

      if (res.data.success) {
        setMessage("Password reset successfully.");
        setTimeout(() => navigate("/auth"), 1500);
      } else {
        setMessage("Failed to reset password.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh]">
      <Navbar />
      <div className="max-w-md mx-auto mt-30 p-6 border rounded-xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-4 text-green-700 dark:text-gray-200">
          Forgot Password
        </h2>

        {!otpSent ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-green-700 dark:text-gray-200"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={!email || loading}
              className={`w-full p-2 text-white rounded-md ${
                loading
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-green-600 hover:bg-green-700 dark:hover:bg-green-500"
              }`}
            >
              {loading ? "Sending OTP..." : "Verify Email"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block mb-1 font-medium text-green-700 dark:text-gray-200"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-green-700 dark:text-gray-200"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 font-medium text-green-700 dark:text-gray-200"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={!otp || !password || !confirmPassword || loading}
              className={`w-full p-2 text-white rounded-md ${
                loading
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-green-600 hover:bg-green-700 dark:hover:bg-green-500"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-red-700 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
