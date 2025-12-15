import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function LayoutOPD({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      icon: "/assets/Logo Beranda.png",
      path: "/dashboardopd",
    },
    {
      name: "Knowledge Base",
      icon: "/assets/Logo Knowledge Base.png",
      path: "/knowledgebasedraft",
    },
    {
      name: "Statistik",
      icon: "/assets/Logo Statistik.png",
      path: "/StatistikKategori",
    },
    {
      name: "Rating",
      icon: "/assets/Logo Rating.png",
      path: "/ratingkepuasanopd",
    },
    {
      name: "Kotak Masuk",
      icon: "/assets/Logo Kotak Masuk.png",
      path: "/kotakmasukopd",
    },
  ];

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

        // Debug: log response dari API
        console.log("📥 LayoutOPD - Response dari /api/me:", data);
        console.log("📥 LayoutOPD - data.name:", data.name);
        console.log("📥 LayoutOPD - data.role:", data.role);
        console.log("📥 LayoutOPD - data.role?.nama:", data.role?.nama);

        // Map field dari BE structure ke format yang diharapkan frontend
        const mappedData = {
          id: data.id,
          email: data.email,
          full_name: data.name, // BE: "name", FE: "full_name"
          name: data.name,
          username: data.username,
          profile_url: data.avatar || "/assets/Lomon.png", // BE: "avatar", FE: "profile_url"
          avatar: data.avatar,
          alamat: data.alamat,
          unit_kerja_id: data.unit_kerja_id,
          role_id: data.role_id,
          role: data.role?.nama || "", // BE: "role.nama" (object), FE: "role" (string)
          role_object: data.role, // Keep original object for reference
          unit_kerja: data.unit_kerja,
          status: data.status,
        };

        console.log("📤 LayoutOPD - mappedData:", mappedData);
        console.log(
          "📤 LayoutOPD - mappedData.full_name:",
          mappedData.full_name
        );
        console.log("📤 LayoutOPD - mappedData.role:", mappedData.role);

        setProfileData(mappedData);
        localStorage.setItem("user_profile", JSON.stringify(mappedData));
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
              {[1, 2, 3, 4, 5].map((i) => (
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
      {/* Sidebar kiri — tetap di tempat */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow z-50">
        {/* Sidebar Navigation */}
        <div className="h-full bg-white flex flex-col">
          {/* === Logo === */}
          <div className="flex items-center gap-4 px-6 py-5">
            <img
              src="/assets/Logo Report.png"
              alt="Logo"
              className="w-12 h-12"
            />
            <h1 className="font-bold text-2xl bg-gradient-to-r from-[#EE1D52] to-[#507687] text-transparent bg-clip-text tracking-wide">
              REPORT
            </h1>
          </div>

          {/* === Menu Navigasi === */}
          <nav className="flex-1 mt-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 mx-3 mb-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#226597] text-white rounded-full shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 rounded-full"
                  }`
                }
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`w-5 h-5 object-contain transition-all ${
                    location.pathname.includes(item.path)
                      ? "brightness-0 invert"
                      : ""
                  }`}
                />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
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
