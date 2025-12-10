import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./SidebarSeksi";
import Navbar from "./Navbar";

export default function LayoutSeksi() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`/api/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfileData(data);
        localStorage.setItem("user_profile", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching profile:", error);
        const savedProfile = localStorage.getItem("user_profile");
        if (savedProfile) {
          setProfileData(JSON.parse(savedProfile));
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* SIDEBAR FIXED */}
      <div className="w-64 fixed inset-y-0 left-0 bg-white shadow z-20">
        <Sidebar />
      </div>

      {/* AREA KANAN */}
      <div className="flex-1 flex flex-col ml-64">
        {/* NAVBAR FIXED */}
        <div className="fixed left-64 right-0 top-0 h-20 bg-white shadow z-30">
          <Navbar profileData={profileData} />
        </div>

        {/* KONTEN (ANTI NÁBRAK) */}
        <div className="flex-1 overflow-y-auto pt-24 px-6 pb-10 h-[calc(100vh-80px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
