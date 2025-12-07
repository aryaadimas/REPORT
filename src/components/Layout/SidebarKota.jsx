import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function SidebarKota() {
  const location = useLocation();

  // Deteksi jika user sedang di salah satu halaman statistik
  const isStatistikActive = location.pathname.startsWith("/statistikkota");

  // Deteksi jika user sedang di halaman kotak masuk
  const isKotakMasukActive = location.pathname.startsWith("/kotakmasukkota");

  const menuItems = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      path: "/dashboardkota",
    },
    {
      name: "Knowledge Base",
      icon: <BookOpenIcon className="w-5 h-5" />,
      path: "/knowledgebasekota",
    },
    {
      name: "Statistik",
      icon: <ChartBarIcon className="w-5 h-5" />,
      path: "/statistikkotakl",
      isActive: isStatistikActive,
    },
    {
      name: "Pengumuman",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      path: "/pengumumankota",
    },
    {
      name: "Rating",
      icon: <StarIcon className="w-5 h-5" />,
      path: "/ratekota",
    },
    {
      name: "Kotak Masuk",
      icon: "image",
      path: "/kotakmasukkota",
      isActive: isKotakMasukActive,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-5">
        <img src="/assets/Logo Report.png" alt="Logo" className="w-12 h-12" />
        <h1 className="font-bold text-2xl bg-gradient-to-r from-[#D32F2F] to-[#0F2C59] text-transparent bg-clip-text tracking-wide">
          REPORT
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 mx-3 mb-2 text-sm font-medium transition-all ${
                isActive || item.isActive
                  ? "bg-[#0F2C59] text-white rounded-full shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 rounded-full"
              }`
            }
          >
            {/* Render ikon atau gambar */}
            {item.icon === "image" ? (
              <img
                src="/assets/Logo Kotak Masuk.png"
                alt="Kotak Masuk"
                className="w-5 h-5"
              />
            ) : (
              item.icon
            )}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Spacer untuk memberi jarak */}
      <div className="flex-1"></div>

      {/* War Room Section */}
      <div className="mt-8 mb-6 px-6">
        {/* Separator */}
        <div className="border-t border-gray-200 mb-4"></div>

        <NavLink
          to="/warroom"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all rounded-full ${
              isActive
                ? "bg-[#EF5350] text-white shadow-sm"
                : "bg-[#EF5350] text-white hover:bg-[#E53935]"
            }`
          }
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <span className="font-semibold">War Room</span>
        </NavLink>
      </div>
    </aside>
  );
}
