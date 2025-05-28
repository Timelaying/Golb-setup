"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";

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
import PageWrapper from "@/app/Components2/PageWrapper";
import CardContainer from "@/app/Components2/CardContainer";
import PageHeader from "@/app/Components2/PageHeader";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setFeedback("");

    try {
      const response = await axios.post("http://localhost:5000/api/register", data);
      setFeedback("✅ Registration successful! You can now log in.");
      form.reset();
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || "Registration failed.";
      setFeedback("❌ " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <CardContainer className="max-w-lg space-y-6">
        <PageHeader title="Create Your Account" />
        <p className="text-sm text-gray-400 text-center">
          Enter your details to get started!
        </p>

        {feedback && (
          <p
            className={`text-sm text-center ${
              feedback.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {feedback}
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Username</FormLabel>
                  <FormControl>
                    <Input
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
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
                      type="password"
                      placeholder="Enter a strong password"
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 focus:ring focus:ring-indigo-300"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContainer>
    </PageWrapper>
  );
}
