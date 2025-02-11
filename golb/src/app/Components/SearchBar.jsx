"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function SearchBar({ onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      console.log("Empty search query, exiting.");
      return;
    }

    console.log("Search button clicked, querying:", searchQuery);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${searchQuery}`
      );
      console.log("Search API response:", response.data);

      onSearchResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="flex space-x-2 p-4">
      {/* Replacing UI component with a standard input */}
      <input
        type="text"
        placeholder="Search posts..."
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
  );
}
