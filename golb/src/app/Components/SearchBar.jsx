"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar({ onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${searchQuery}`
      );
      onSearchResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="flex space-x-2 p-4">
      <Input
        type="text"
        placeholder="Search posts..."
        className="border rounded p-2 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
