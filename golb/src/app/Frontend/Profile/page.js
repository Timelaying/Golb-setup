"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link"; // Import Link for navigation

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter(); // Initialize router

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token not found.");
        }

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
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
      await axios.put("http://localhost:5000/api/update-profile", { ...data, userId: profile.id }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile((prev) => ({ ...prev, ...data }));
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  if (isLoading) return <p>Loading profile...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar src={profile.profile_picture} alt="Profile Picture" />
            <div>
              <CardTitle>{profile.full_name}</CardTitle>
              <p>@{profile.username}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardContent>
          <h2 className="text-xl font-semibold">About Me</h2>
          <p>{profile.bio}</p>
          <p>Email: {profile.email}</p>
          <p>Location: {profile.location}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold">My Stats</h2>
          <p>Posts: {profile.postCount}</p>
          <p>Followers: {profile.followersCount}</p>
          <p>Following: {profile.followingCount}</p>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-4">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label>Location:</label>
            <Input {...register("location")} defaultValue={profile.location} />

            <label>Bio:</label>
            <Textarea {...register("bio")} defaultValue={profile.bio} />

            <label>Profile Picture URL:</label>
            <Input {...register("profile_picture")} defaultValue={profile.profile_picture} />

            <div className="flex space-x-4">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}

        {/* Back to Feeds Button */}
        <Link href="/Frontend/Feeds">
          <Button variant="outline" className="w-full">Back to Feeds</Button>
        </Link>
      </div>
    </div>
  );
}
