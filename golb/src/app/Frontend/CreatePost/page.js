"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import PageWrapper from "@/app/Components/PageWrapper";
import CardContainer from "@/app/Components/CardContainer";
import PageHeader from "@/app/Components/PageHeader";

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
      router.push("/Frontend/ViewPost");
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        error.response?.data?.error ||
          error.message ||
          "Failed to create post."
      );
    }
  };

  return (
    <PageWrapper>
      <CardContainer>
        <PageHeader>Create a New Post</PageHeader>
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

        <div className="flex justify-between mt-6">
          <Link href="/Frontend/Feeds">
            <Button className="bg-gray-700 hover:bg-gray-600">Back to Feeds</Button>
          </Link>
          <Link href="/Frontend/ViewPost">
            <Button className="bg-green-600 hover:bg-green-700">View Past Posts</Button>
          </Link>
        </div>
      </CardContainer>
    </PageWrapper>
  );
}
