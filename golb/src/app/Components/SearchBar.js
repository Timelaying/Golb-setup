"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import Next.js router

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Store users
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${searchQuery}`
      );
      setSearchResults(response.data); // Update state with search results
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search users..."
          className="border border-gray-500 rounded p-2 w-full bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Display search results */}
      <div className="mt-4 bg-gray-800 p-4 rounded">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-4 p-2 border-b border-gray-600 cursor-pointer hover:bg-gray-700"
              onClick={() => router.push("../Frontend/Profile/${username}")} // Navigate to user profile
            >
              <img
                src={user.profile_picture || "/default-avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white font-bold">{user.username}</p>
                <p className="text-gray-400">{user.name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No users found</p>
        )}
      </div>
    </div>
  );
}
