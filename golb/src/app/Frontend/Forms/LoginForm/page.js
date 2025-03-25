"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username: data.username,
        password: data.password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      setMessage("Login successful! Redirecting...");
      router.push("/Frontend/Feeds");
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-4">
      <div className="max-w-md w-full bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <p className="text-sm text-gray-400 text-center">
          Enter your credentials to access your account.
        </p>

        {message && (
          <div className="text-sm text-center text-red-500">{message}</div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 text-gray-50"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Username</FormLabel>
                  <FormControl>
                    <Input
                      aria-label="Username"
                      placeholder="Enter your username"
                      {...field}
                      className="bg-gray-700 text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Password</FormLabel>
                  <FormControl>
                    <Input
                      aria-label="Password"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="bg-gray-700 text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 focus:ring focus:ring-indigo-300 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <h2 className="text-sm text-gray-400">Forgot your password?</h2>
          <Link href="/Frontend/Forms/ForgottenPassword">
            <Button className="mt-2 bg-green-600 hover:bg-green-500 focus:ring focus:ring-green-300">
              Reset Password
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
