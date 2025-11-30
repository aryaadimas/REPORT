import React from "react";
import Sidebar from "./SidebarSeksi";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function LayoutSeksi() {
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
          <Navbar />
        </div>

        {/* KONTEN (ANTI NÁBRAK) */}
        <div className="flex-1 overflow-y-auto pt-24 px-6 pb-10 h-[calc(100vh-80px)]">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
