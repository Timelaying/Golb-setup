import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Frontpage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="text-center space-y-8">
        {/* Login Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-50">
            Want to get in on the gist?
          </h1>
          <Link href="Frontend/Forms/LoginForm">
            <Button
              className="px-6 py-3 text-base font-medium bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-500 focus:ring focus:ring-indigo-300"
            >
              Login
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center space-x-2">
          <span className="block h-px w-16 bg-gray-600"></span>
          <span className="text-sm text-gray-400">New User?</span>
          <span className="block h-px w-16 bg-gray-600"></span>
        </div>

        {/* Register Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-50">Create an Account</h1>
          <Link href="Frontend/Forms/RegisterForm">
            <Button
              className="px-6 py-3 text-base font-medium bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 focus:ring focus:ring-green-300"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
