"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const accessToken = localStorage.getItem("accessToken");

            const response = await axios.post(
                "http://localhost:5000/api/posts",
                { title, content },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            alert(response.data.message);
            router.push("/Frontend/ViewPost"); // Redirect to the posts list page
        } catch (error) {
            console.error("Error creating post:", error.response?.data?.error || error.message);
            alert(error.response?.data?.error || "Failed to create post.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
            <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold text-center mb-6">Create a New Post</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="block font-medium mb-2 text-gray-300">
                            Title
                        </label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter post title"
                            required
                            className="text-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block font-medium mb-2 text-gray-300">
                            Content
                        </label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter post content"
                            required
                            rows={5}
                            className="text-black"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition">
                        Create Post
                    </Button>
                </form>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <Link href="/Frontend/Feeds">
                        <Button className="bg-gray-700 hover:bg-gray-600">Back to Feeds</Button>
                    </Link>
                    <Link href="/Frontend/ViewPost">
                        <Button className="bg-green-600 hover:bg-green-700">View Past Posts</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
