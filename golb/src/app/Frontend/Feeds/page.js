"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FeedPage() {
  const handleSearch = async () => {
    // handles search
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${searchQuery}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const fetchFeed = async () => {
    //handles feed
    try {
      const response = await axios.get(
        `http://localhost:5000/api/feed/${userId}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  const handleFollow = async (userId) => {
    //handles follow
    try {
      await axios.post("http://localhost:5000/api/follow", {
        followerId: currentUserId,
        followingId: userId,
      });
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Follow/unfollow error:", error);
    }
  };

  //const feedItems = Array.from({ length: 20 }, (_, i) => `Post #${i + 1}`); // Mock feed data

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

      {/*}
      <input
        type="text"
        placeholder="Search posts..."
        className="border rounded p-2"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>

      <Button onClick={() => handleFollow(user.id)}>
        {user.isFollowing ? "Unfollow" : "Follow"}
      </Button>

      {/* Scrollable Feed */}
      <main className="flex-1 p-4 overflow-y-auto">
        {feedItems.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-700 p-4 bg-gray-800 rounded-lg shadow mb-4"
          >
            <h2 className="text-lg font-semibold">{item}</h2>
            <p className="text-sm text-gray-400">
              This is a description of {item}.
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
