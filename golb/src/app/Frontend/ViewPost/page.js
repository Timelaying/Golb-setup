"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PostsList() {
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");

                const response = await axios.get("http://localhost:5000/api/viewposts", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setPosts(response.data.posts);
                setPostCount(response.data.count);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error.response?.data?.error || error.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <p>Loading posts...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-5">My Posts</h1>
            <p className="mb-4">
                You have created <span className="font-semibold">{postCount}</span> post(s).
            </p>
            <ul>
                {posts.map((post) => (
                    <li key={post.id} className="mb-4">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p>{post.content}</p>
                        <p className="text-sm text-gray-500">Created on: {new Date(post.created_at).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
            <Link href="/Frontend/Feeds">
                <Button>
                    Back to Feeds
                </Button>
            </Link>
        </div>
    );
}
