"use client";

import Link from "next/link";

export default function FeedPage() {
  const feedItems = Array.from({ length: 20 }, (_, i) => `Post #${i + 1}`); // Mock feed data

  return (
    <div>
      {/* Header with Dropdown */}
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1>Feed</h1>
        <div className="relative">
          <button className="bg-gray-700 px-4 py-2 rounded">Menu</button>
          <ul className="absolute right-0 mt-2 bg-black border rounded shadow-lg">
            <li className="px-4 py-2 hover:bg-gray-100">
              <Link href="/Frontend/Profile">Profile</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <button
                onClick={() => {
                  localStorage.clear(); // Clear tokens on logout
                  window.location.href = "/Frontend";
                }}
              >
                Logout
              </button>
            </li>
            <li>
                <Link href="/Frontend/CreatePost">Post</Link>
            </li>
          </ul>
        </div>
      </header>

      {/* Scrollable Feed */}
      <main className="p-4 overflow-y-auto h-screen">
        {feedItems.map((item, index) => (
          <div key={index} className="border-b p-4">
            {item}
          </div>
        ))}
      </main>
    </div>
  );
}
