import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landingpage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
      <div className="text-center space-y-6">
        {/* Heading */}
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to the Hub!
        </h1>
        <p className="text-lg text-gray-200">
          Stay updated with the latest gist. Don't miss out!
        </p>

        {/* Button */}
        <Link href="/Frontend">
          <Button
            className="px-6 py-3 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 focus:ring focus:ring-blue-300"
          >
            Want to get in on the gist?
          </Button>
        </Link>
      </div>
    </div>
  );
}
