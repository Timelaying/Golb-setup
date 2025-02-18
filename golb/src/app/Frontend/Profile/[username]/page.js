"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!router.query?.username) return;
    setUsername(router.query.username);
  }, [router.query]);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Access token not found.");

        const response = await axios.get(`http://localhost:5000/api/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [username]);

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{profile.full_name} (@{profile.username})</h1>
      <p>{profile.bio}</p>
      <p>Email: {profile.email}</p>
    </div>
  );
}
