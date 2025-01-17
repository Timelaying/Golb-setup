"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", { email });
      alert(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to send reset link.";
      alert(errorMessage);
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Send Reset Link</Button>
      </form>
    </div>
  );
}
