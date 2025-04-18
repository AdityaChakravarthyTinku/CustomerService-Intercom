import Dashboard from "./Main_dashboard/Dashboard"
import api from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      sessionStorage.setItem("token", token);
      navigate("/home", { replace: true }); // Removes token from URL
    }

  }, [navigate]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("No token found, authentication required.");

       navigate("/");
      }

      try {
        const response = await api.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        navigate("/");
      }
    };

    fetchUserProfile();
  }, []);
  console.log(user?.image);
  
  return (
    
      <Dashboard ></Dashboard>
   
  )
}
