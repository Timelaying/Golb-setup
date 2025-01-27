"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordForm() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reset-password",
        {
          token,
          newPassword,
        }
      );
      alert(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to reset password.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-md w-full bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-50">
          Reset Your Password
        </h1>
        <p className="text-sm text-gray-400 text-center">
          Please enter the reset token and your new password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token" className="block text-sm text-gray-400">
              Reset Token
            </label>
            <Input
              id="token"
              type="text"
              placeholder="Enter your reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1 bg-gray-700 text-gray-100"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm text-gray-400">
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 bg-gray-700 text-gray-100"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 focus:ring focus:ring-indigo-300"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
