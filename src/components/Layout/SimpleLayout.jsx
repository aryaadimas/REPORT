import React from "react";
import { Outlet } from "react-router-dom";

// Simple layout wrapper tanpa fetch - untuk digunakan oleh halaman yang sudah fetch sendiri
export default function SimpleLayout({
  children,
  sidebar: Sidebar,
  navbar: NavbarComponent,
  profileData,
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      {Sidebar && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow z-50">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        {NavbarComponent && (
          <div className="fixed top-0 left-64 right-0 bg-white shadow z-10">
            <NavbarComponent profileData={profileData} />
          </div>
        )}

        {/* Content */}
        <main className="pt-20 p-6">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
