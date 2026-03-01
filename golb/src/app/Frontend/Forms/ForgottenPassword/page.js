"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/app/Components2/PageWrapper";
import CardContainer from "@/app/Components2/CardContainer";
import PageHeader from "@/app/Components2/PageHeader";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", { email });
      setMessage(response.data.message || "Reset link sent!");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to send reset link.";
      setMessage("❌ " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <CardContainer>
        <PageHeader title="Forgot Your Password?" />
        <p className="text-sm text-gray-400 text-center mb-4">
          Enter your email, and we’ll send you a password reset link.
        </p>

        {message && (
          <p
            className={`text-sm text-center mb-2 ${
              message.startsWith("❌") ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}

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
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 focus:ring focus:ring-indigo-300"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="space-y-4 mt-6">
          <h2 className="text-lg text-center font-medium text-gray-50">Got the Reset Link?</h2>
          <Link href="./ResetPassword">
            <Button className="w-full bg-green-600 hover:bg-green-500 focus:ring focus:ring-green-300">
              Reset Password
            </Button>
          </Link>
        </div>
      </CardContainer>
    </PageWrapper>
  );
}
