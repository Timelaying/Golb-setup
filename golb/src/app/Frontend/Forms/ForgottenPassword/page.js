"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        { email }
      );
      alert(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to send reset link.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-md w-full bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-50">
          Forgot Your Password?
        </h1>
        <p className="text-sm text-gray-400 text-center">
          Enter your email, and we’ll send you a password reset link.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-gray-700 text-gray-100"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 focus:ring focus:ring-indigo-300"
          >
            Send Reset Link
          </Button>
        </form>

        {/* Reset Password Section */}
        <div className="space-y-4">
          <h2 className="text-lg text-center font-medium text-gray-50">
            Got the Reset Link?
          </h2>
          <Link href="./ResetPassword">
            <Button className="w-full bg-green-600 hover:bg-green-500 focus:ring focus:ring-green-300">
              Reset Password
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
