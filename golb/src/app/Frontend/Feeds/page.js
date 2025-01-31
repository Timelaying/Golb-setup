"use client";

import Link from "next/link";

export default function FeedPage() {
  const feedItems = Array.from({ length: 20 }, (_, i) => `Post #${i + 1}`); // Mock feed data

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header with Dropdown */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold">Feed</h1>
        <div className="relative group">
          <button className="bg-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition">
            Menu
          </button>
          <ul className="absolute right-0 mt-2 w-40 bg-gray-700 border border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all transform duration-300">
            <li className="px-4 py-2 hover:bg-gray-600 rounded-t">
              <Link href="/Frontend/Profile" className="block text-sm">
                Profile
              </Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-600">
              <button
                onClick={() => {
                  localStorage.clear(); // Clear tokens on logout
                  window.location.href = "/Frontend";
                }}
                className="block text-sm w-full text-left"
              >
                Logout
              </button>
            </li>
            <li className="px-4 py-2 hover:bg-gray-600 rounded-b">
              <Link href="/Frontend/CreatePost" className="block text-sm">
                Create Post
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {/* Scrollable Feed */}
      <main className="flex-1 p-4 overflow-y-auto">
        {feedItems.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-700 p-4 bg-gray-800 rounded-lg shadow mb-4"
          >
            <h2 className="text-lg font-semibold">{item}</h2>
            <p className="text-sm text-gray-400">This is a description of {item}.</p>
          </div>
        ))}
      </main>
    </div>
  );
}
