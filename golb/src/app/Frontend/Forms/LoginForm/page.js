"use client";

import { useRouter } from "next/navigation"; // Use router from next/navigation
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

// Schema for validation
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginForm() {
  const router = useRouter(); // Initialize the router for navigation

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: data.username,
        password: data.password,
      });

      // Store the tokens in localStorage after successful login
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Navigate to the Feeds page upon successful login
      router.push("/Frontend/Feeds");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed.";
      alert(errorMessage); // Display error message if login fails
    }
  };

  return (
    <div>
      <h1>Input your Username and Password</h1>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <div>
        <h1>Forgotten Password?</h1>
        <div>
          <Link href="./ForgottenPassword">
            <Button>Reset password</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
