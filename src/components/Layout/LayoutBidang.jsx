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

        // first try to use cached user from localStorage (from SSO or login)
        const cachedUser = localStorage.getItem("user") || localStorage.getItem("userData");
        if (cachedUser) {
          const userData = JSON.parse(cachedUser);
          setProfileData(userData);
          localStorage.setItem("user_profile", JSON.stringify(userData));
          setLoading(false);
          return;
        }

        const response = await fetch(`https://arise-app.my.id/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error("Fetch profile gagal");
        }

        const data = await response.json();
        setProfileData(data);
        localStorage.setItem("user_profile", JSON.stringify(data));
      } catch (error) {
        console.error(error);
        const cached = localStorage.getItem("user_profile") || localStorage.getItem("user") || localStorage.getItem("userData");
        if (cached) {
          setProfileData(JSON.parse(cached));
        } else {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow z-20">
        <SidebarBidang />
      </div>

      {/* Konten kanan */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 right-0 bg-white shadow z-10">
          <Navbar profileData={profileData} />
        </div>

        {/* Main */}
        <main className="pt-20 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597]" />
            </div>
          ) : (
            children || <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
