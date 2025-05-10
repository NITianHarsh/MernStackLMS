import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import Navbar from "@/components/navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        email,
        password,
      });

      if (response.data.success) {
        setMessage("Password updated successfully. You can now sign in.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/auth");
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
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-4 text-green-700 dark:text-gray-200">
        Reset Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!email || !password || !confirmPassword || loading}
          className={`w-full p-2 text-white rounded-md ${
            loading
              ? "bg-gray-400 dark:bg-gray-600"
              : "bg-green-600 hover:bg-green-700 dark:hover:bg-green-500"
          }`}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </form>

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
