import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  InboxIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

export default function SidebarSeksi() {
  const location = useLocation();

  // Deteksi jika user berada di salah satu halaman Monitoring
  const isMonitoringActive = location.pathname.startsWith("/monitoringseksi");

  const menuItems = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      path: "/berandaseksi",
    },
    {
      name: "Penugasan",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
      path: "/penugasanseksi",
    },
    {
      name: "Monitoring",
      icon: <ChartBarIcon className="w-5 h-5" />,
      path: "/monitoringseksi",
      isActive: isMonitoringActive,
    },
    {
      name: "Arsip",
      icon: <ArchiveBoxIcon className="w-5 h-5" />,
      path: "/arsipseksi",
    },
    {
      name: "Rating",
      icon: <StarIcon className="w-5 h-5" />,
      path: "/ratingseksi",
    },
    {
      name: "Kotak Masuk",
      icon: <InboxIcon className="w-5 h-5" />,
      path: "/kotakmasukseksi",
    },
    {
      name: "Layanan Chat",
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
      path: "/layananchat",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col">
      {/* === Logo === */}
      <div className="flex items-center gap-4 px-6 py-5">
        <img src="/assets/Logo Report.png" alt="Logo" className="w-12 h-12" />
        <h1 className="font-bold text-2xl bg-gradient-to-r from-[#D32F2F] to-[#0F2C59] text-transparent bg-clip-text tracking-wide">
          REPORT
        </h1>
      </div>

      {/* === Menu Navigasi === */}
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
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
