import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarBidang from "./SidebarBidang";
import Navbar from "./Navbar";

export default function LayoutBidang({ children }) {
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
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar kiri — tetap di tempat */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow">
        <SidebarBidang />
      </div>

      {/* Bagian kanan */}
      <div className="flex-1 ml-64">
        {/* Navbar atas — tetap di tempat */}
        <div className="fixed top-0 left-64 right-0 bg-white shadow z-10">
          <Navbar profileData={profileData} />
        </div>

        {/* Konten utama — biar bisa di-scroll */}
        <main className="pt-20 p-6">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
