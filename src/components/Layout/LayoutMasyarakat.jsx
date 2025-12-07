import { useState, useEffect } from "react";
import SidebarMasyarakat from "./SidebarMasyarakat";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";

export default function LayoutMasyarakat({ children }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/me/masyarakat`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

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
        console.error("Error fetching profile in layout:", error);

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
      <div className="flex min-h-screen bg-slate-50">
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow animate-pulse">
          <div className="p-4">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 ml-64">
          <div className="fixed top-0 left-64 right-0 bg-white shadow z-10">
            <div className="flex items-center justify-between p-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
          <main className="pt-20 p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow">
        <SidebarMasyarakat />
      </div>

      <div className="flex-1 ml-64">
        <div className="fixed top-0 left-64 right-0 bg-white shadow z-10">
          <Navbar profileData={profileData} />
        </div>

        <main className="pt-20 p-6">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
