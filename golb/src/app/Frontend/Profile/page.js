"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

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
            const formData = new FormData();
            formData.append("userId", profile.id);
            formData.append("location", data.location);
            formData.append("bio", data.bio);
            if (data.profile_picture[0]) {
                formData.append("profile_picture", data.profile_picture[0]);
            }

            const response = await axios.put(
                "http://localhost:5000/api/update-profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Update profile state with the new profile picture
            setProfile((prev) => ({
                ...prev,
                location: data.location,
                bio: data.bio,
                profile_picture: `${response.data.profile_picture}?t=${new Date().getTime()}`, // Prevent caching
            }));

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.error || "Failed to update profile.");
        }
    };

    if (isLoading) return <p className="text-gray-300 text-center">Loading profile...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
            <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold text-center mb-6">Profile</h1>

                {!isEditing ? (
                    <div className="space-y-4">
                        <div className="text-center">
                            <img
                                src={profile.profile_picture || "/default-profile.png"} // Fallback image
                                alt="Profile"
                                className="w-24 h-24 rounded-full mx-auto mb-3 border border-gray-500"
                            />
                            <h2 className="text-xl font-bold">{profile.full_name}</h2>
                            <p className="text-gray-400">@{profile.username}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-300">About Me</h3>
                            <p className="text-gray-400">{profile.bio}</p>
                            <p className="text-gray-400">📧 {profile.email}</p>
                            <p className="text-gray-400">📍 {profile.location}</p>
                        </div>

                        <Button onClick={() => setIsEditing(true)} className="w-full bg-blue-600 hover:bg-blue-700 transition">
                            Edit Profile
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" encType="multipart/form-data">
                        <div>
                            <label className="block font-medium mb-2 text-gray-300">Location</label>
                            <Input {...register("location")} defaultValue={profile.location} className="text-black" />
                        </div>

                        <div>
                            <label className="block font-medium mb-2 text-gray-300">Bio</label>
                            <Textarea {...register("bio")} defaultValue={profile.bio} rows={3} className="text-black" />
                        </div>

                        <div>
                            <label className="block font-medium mb-2 text-gray-300">Profile Picture</label>
                            <Input type="file" {...register("profile_picture")} className="text-black" />
                        </div>

                        <div className="flex space-x-4">
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 transition">
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full bg-gray-700 hover:bg-gray-600">
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                <div className="flex justify-between mt-6">
                    <Link href="/Frontend/Feeds">
                        <Button className="bg-gray-700 hover:bg-gray-600">Back to Feeds</Button>
                    </Link>
                    <Link href="/Frontend/ViewPost">
                        <Button className="bg-blue-600 hover:bg-blue-700">View Posts</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
