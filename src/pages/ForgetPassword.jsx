import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { email, password, confirmPassword } = formData;

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Check if email exists in the users table
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (fetchError || !user) {
        setError("No account found with this email.");
        setLoading(false);
        return;
      }

      // Update password in the users table
      const { error: updateError } = await supabase
        .from("users")
        .update({ password })
        .eq("email", email);

      if (updateError) {
        setError("Failed to reset password. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Password reset successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50 px-4 pt-16">
      <motion.div
        className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Reset Your Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

        <div className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-purple-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;