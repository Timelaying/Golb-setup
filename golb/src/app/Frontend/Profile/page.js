// Frontend: Profile Page using React and Next.js
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <p>Loading profile...</p>;

  if (!profile) return <p>Failed to load profile data.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar src={profile.profilePicture} alt="Profile Picture" />
            <div>
              <CardTitle>{profile.fullName}</CardTitle>
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

      <div className="mt-6">
        <Button onClick={() => alert("Edit Profile coming soon!")}>Edit Profile</Button>
      </div>
    </div>
  );
}
