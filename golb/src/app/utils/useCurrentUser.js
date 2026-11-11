// utils/useCurrentUser.js    to keep track of the user and session during thier lifetime 
import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/app/utils/apiBaseUrl";
const API_BASE = getApiBaseUrl();

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get(`${API_BASE}/api/current-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUser(res.data);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchUser();
  }, []);

  return currentUser;
}
