// "use client"; // This ensures this file is treated as a Client Component

// import Link from "next/link";
// import { useRouter } from "next/navigation"; 
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useState } from "react";
// import axios from "axios";

// import { Button } from "@/components/ui/button";  // Ensure Button is a Client Component
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// // Schema for validation
// const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   password: z.string().min(8, {
//     message: "Password must be at least 8 characters.",
//   }),
// });

// export default function LoginForm() {
//   const router = useRouter();
//   const [message, setMessage] = useState("");
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       username: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/login", {
//         username: data.username,
//         password: data.password,
//       });

//       localStorage.setItem("accessToken", response.data.accessToken);
//       localStorage.setItem("refreshToken", response.data.refreshToken);

//       setMessage("Login successful! Redirecting...");
//       router.push("../Feeds");
//     } catch (error) {
//       setMessage(error.response?.data?.error || "Login failed.");
//     }
//   };

//   return (
//     <div>
//       <h1>Input your Username and Password</h1>
//       {message && <p>{message}</p>}
//       <div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             {/* Username Field */}
//             <FormField
//               control={form.control}
//               name="username"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter your username" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     This is your public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Password Field */}
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="password"
//                       placeholder="Enter your password"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Submit Button */}
//             <Button type="submit">Submit</Button>
//           </form>
//         </Form>
//       </div>
//       <div>
//         <h1>Forgotten Password?</h1>
//         <div>
//           <Link href="./ForgottenPassword">
//             <Button>Reset password</Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"; // This ensures this file is treated as a Client Component

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";

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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: data.username,
        password: data.password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      setMessage("Login successful! Redirecting...");
      router.push("../Feeds");
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Input your Username and Password</h1>
      
      {message && <p className="text-center text-red-500 mb-4">{message}</p>}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...form.register("username")}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-500 mt-1">{form.formState.errors.username?.message}</p>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...form.register("password")}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-500 mt-1">{form.formState.errors.password?.message}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>

      <div className="mt-4 text-center">
        <h2 className="text-sm">Forgotten Password?</h2>
        <a href="./ForgottenPassword" className="text-blue-500 hover:underline">
          Reset password
        </a>
      </div>
    </div>
  );
}
