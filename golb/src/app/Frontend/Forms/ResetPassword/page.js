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
      const response = await axios.post("http://localhost:5000/api/reset-password", {
        token,
        newPassword,
      });
      alert(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to reset password.";
      alert(errorMessage);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter your reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button type="submit">Reset Password</Button>
      </form>
    </div>
  );
}
