"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import PostCard from "@/app/Components/PostCard";
import FollowButton from "@/app/Components/FollowButton";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/app/components/PageWrapper";
import CardContainer from "@/app/components/CardContainer";
import PageHeader from "@/app/components/PageHeader";

export default function ProfilePage() {
  const pathname = usePathname();
  const username = pathname.split("/").pop();

  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        const profileRes = await axios.get(`http://localhost:5000/api/users/${username}`);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      }

      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const currentRes = await axios.get("http://localhost:5000/api/current-user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(currentRes.data);
        } catch (err) {
          console.error("Error fetching current user:", err);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [username]);

  if (isLoading) return <p className="text-center text-gray-300 mt-10">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!profile) return <p className="text-center text-gray-400 mt-10">No profile data found.</p>;

  return (
    <PageWrapper>
      <CardContainer>
        {/* Profile Header */}
        <div className="text-center">
          <img
            src={
              profile.profile_picture
                ? `http://localhost:5000/uploads/users/${profile.username}/profile.jpg`
                : "/default-avatar.png"
            }
            alt={`${profile.username}'s avatar`}
            className="w-24 h-24 rounded-full mx-auto mb-3 border border-gray-500"
          />
          <PageHeader title={profile.name} />
          <p className="text-gray-400 text-sm">@{profile.username}</p>
          <p className="text-gray-300 mt-2">{profile.bio || "No bio available."}</p>
          <p className="text-gray-400 text-sm">📧 {profile.email}</p>

          {currentUser && currentUser.id !== profile.id && (
            <div className="mt-4">
              <FollowButton userId={profile.id} currentUserId={currentUser.id} />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h2 className="text-lg font-semibold mb-2">Stats</h2>
          <div className="space-y-1 text-sm text-gray-400">
            <p>📝 Posts: {profile.posts?.length || 0}</p>
            <p>👥 Followers: {profile.followersCount || 0}</p>
            <p>📌 Following: {profile.followingCount || 0}</p>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Posts</h2>
          {profile.posts.length === 0 ? (
            <p className="text-gray-400">This user has not posted anything yet.</p>
          ) : (
            <div className="space-y-4">
              {profile.posts.map((post) => (
                <PostCard key={post.id} post={post} userId={profile.id} />
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Link href="/Frontend/Feeds">
            <Button className="bg-gray-700 hover:bg-gray-600">⬅ Back to Feeds</Button>
          </Link>
        </div>
      </CardContainer>
    </PageWrapper>
  );
}
