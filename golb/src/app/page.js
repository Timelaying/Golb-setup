import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landingpage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="text-center space-y-6">
        {/* Heading */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-50">
          Welcome to the Hub
        </h1>
        <p className="text-base text-gray-400">
          Discover the latest updates and stay informed with ease.
        </p>

        {/* Call-to-Action Button */}
        <Link href="/Frontend">
          <Button
            className="px-5 py-3 text-base font-medium bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-500 focus:ring focus:ring-indigo-300"
          >
            Want to get in on the gist?
          </Button>
        </Link>
      </div>
    </div>
  );
}
