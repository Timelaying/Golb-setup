"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
            router.push("/posts"); // Redirect to the posts list page
        } catch (error) {
            console.error("Error creating post:", error.response?.data?.error || error.message);
            alert(error.response?.data?.error || "Failed to create post.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-5 border rounded">
            <h1 className="text-2xl font-bold mb-5">Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block font-medium mb-2">
                        Title
                    </label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block font-medium mb-2">
                        Content
                    </label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter post content"
                        required
                        rows={5}
                    />
                </div>
                <Button type="submit" className="w-full">
                    Create Post
                </Button>
            </form>
        </div>
    );
}
