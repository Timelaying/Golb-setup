// utils/useCurrentUser.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/current-user", {
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
