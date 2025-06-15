"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/app/Components2/PageWrapper";
import CardContainer from "@/app/Components2/CardContainer";
import PageHeader from "@/app/Components2/PageHeader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading reset form…</div>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}

function ResetPasswordFormInner() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const queryToken = searchParams.get("token");
    if (queryToken) setToken(queryToken);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reset-password",
        { token, newPassword }
      );
      setMessage(response.data.message || "Password reset successfully!");
    } catch (error) {
      const err = error.response?.data?.error || "Failed to reset password.";
      setMessage("❌ " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <CardContainer className="max-w-md space-y-6">
        <PageHeader title="Reset Your Password" />
        <p className="text-sm text-gray-400 text-center">
          Enter the reset token and your new password.
        </p>

        {message && (
          <p
            className={`text-sm text-center ${
              message.startsWith("❌") ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}

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
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 focus:ring focus:ring-indigo-300"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContainer>
    </PageWrapper>
  );
}
