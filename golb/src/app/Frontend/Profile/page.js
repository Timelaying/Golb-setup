"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import PageWrapper from "@/app/components/PageWrapper";
import CardContainer from "@/app/components/CardContainer";
import PageHeader from "@/app/components/PageHeader";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Access token not found.");

        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("userId", profile.id);
      formData.append("location", data.location);
      formData.append("bio", data.bio);
      if (data.profile_picture[0]) {
        formData.append("profile_picture", data.profile_picture[0]);
      }

      const res = await axios.put("http://localhost:5000/api/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile((prev) => ({
        ...prev,
        location: data.location,
        bio: data.bio,
        profile_picture: `${res.data.profile_picture}?t=${Date.now()}`,
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.error || "Failed to update profile.");
    }
  };

  if (isLoading) return <p className="text-center text-gray-300">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profile) return <p className="text-center text-gray-400">No profile data available.</p>;

  return (
    <PageWrapper>
      <CardContainer>
        <PageHeader title="Profile" />

        {!isEditing ? (
          <div className="space-y-4">
            {/* Avatar */}
            <div className="text-center">
              <img
                src={
                  profile.profile_picture
                    ? `http://localhost:5000/uploads/users/${profile.username}/profile.jpg`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-3 border border-gray-500"
              />
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-400">@{profile.username}</p>
            </div>

            {/* About Me */}
            <div>
              <h3 className="text-lg font-semibold">About Me</h3>
              <p className="text-gray-400">{profile.bio || "No bio yet."}</p>
              <p className="text-gray-400">📧 {profile.email}</p>
              <p className="text-gray-400">📍 {profile.location || "No location"}</p>
            </div>

            {/* Stats */}
            <div>
              <h3 className="text-lg font-semibold">Stats</h3>
              <p className="text-gray-400">📝 Posts: {profile.postCount || 0}</p>
              <p className="text-gray-400">👥 Followers: {profile.followersCount || 0}</p>
              <p className="text-gray-400">📌 Following: {profile.followingCount || 0}</p>
            </div>

            <Button onClick={() => setIsEditing(true)} className="w-full bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" encType="multipart/form-data">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Location</label>
              <Input {...register("location")} defaultValue={profile.location} className="text-black" />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Bio</label>
              <Textarea {...register("bio")} defaultValue={profile.bio} rows={3} className="text-black" />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Profile Picture</label>
              <Input type="file" {...register("profile_picture")} className="text-black" />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)} className="w-full bg-gray-700 hover:bg-gray-600">
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Link href="/Frontend/Feeds">
            <Button className="bg-gray-700 hover:bg-gray-600">⬅ Back to Feeds</Button>
          </Link>
          <Link href="/Frontend/ViewPost">
            <Button className="bg-blue-600 hover:bg-blue-700">📄 View Posts</Button>
          </Link>
        </div>
      </CardContainer>
    </PageWrapper>
  );
}
