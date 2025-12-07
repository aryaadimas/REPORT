import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  StarIcon,
  InboxIcon
} from "@heroicons/react/24/outline";

export default function SidebarTeknisi() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      path: "/dashboardteknisi",
    },
    {
      name: "Rating",
      icon: <StarIcon className="w-5 h-5" />,
      path: "/ratingteknisi",
    },
    {
      name: "RFC",
      icon: <DocumentTextIcon className="w-5 h-5" />,
      path: "/rfcteknisi",
    },
    {
      name: "Kotak Masuk",
      icon: <InboxIcon className="w-5 h-5" />,
      path: "/kotakmasukteknisi",
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
                isActive
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
