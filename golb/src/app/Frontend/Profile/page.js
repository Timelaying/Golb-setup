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

            const response = await axios.put("http://localhost:5000/api/update-profile", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            setProfile(response.data.user);
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
                                src={`http://localhost:5000${profile.profile_picture}`}
                                alt="Profile"
                                className="w-24 h-24 rounded-full mx-auto mb-3 border border-gray-500"
                            />
                            <h2 className="text-xl font-bold">{profile.name}</h2>
                        </div>
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                        <Input type="text" {...register("location")} defaultValue={profile.location} />
                        <Textarea {...register("bio")} defaultValue={profile.bio} />
                        <Input type="file" {...register("profile_picture")} />
                        <Button type="submit">Save</Button>
                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    </form>
                )}
            </div>
        </div>
    );
}
