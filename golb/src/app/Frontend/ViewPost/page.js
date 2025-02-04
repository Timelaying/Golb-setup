"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading effect

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(
          "http://localhost:5000/api/viewposts",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setPosts(response.data.posts);
        setPostCount(response.data.count);
      } catch (error) {
        console.error(
          "Error fetching posts:",
          error.response?.data?.error || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
      <div className="max-w-3xl w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-4">My Posts</h1>
        <p className="text-gray-400 text-center mb-6">
          You have created <span className="font-bold text-white">{postCount}</span> post(s).
        </p>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        ) : postCount === 0 ? (
          <p className="text-center text-gray-400">You haven’t created any posts yet.</p>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.id} className="p-4 border border-gray-700 rounded-lg bg-gray-700 shadow">
                <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                <p className="text-gray-300">{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created on: {new Date(post.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-center">
          <Link href="/Frontend/Feeds">
            <Button className="bg-blue-600 hover:bg-blue-700 transition">Back to Feeds</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
