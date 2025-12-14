import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";
import Navbar from "./Navbar";

export default function LayoutPegawai({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      console.log("=== LayoutPegawai Auth Check ===");
      console.log("Current path:", location.pathname);

      // Daftar rute publik yang tidak memerlukan autentikasi
      const publicRoutes = [
        "/login-sso",
        "/login",
        "/forgot-password",
        "/reset-password",
      ];

      // Jika rute saat ini adalah rute publik, skip pengecekan
      if (publicRoutes.includes(location.pathname)) {
        console.log("Public route, skipping auth check");
        setIsCheckingAuth(false);
        return;
      }

      // Cari token dari berbagai sumber
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("user_token");

      console.log("Token found:", !!token);

      if (!token) {
        console.log("No token found, redirecting to login");
        // Simpan URL yang dituju sebelum redirect ke login
        sessionStorage.setItem("redirectUrl", location.pathname);
        navigate("/login-sso");
        return;
      }

      // Validasi token JWT sederhana (opsional)
      try {
        // Cek jika token adalah JWT valid
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const expiry = payload.exp * 1000; // Convert to milliseconds
          const now = Date.now();

          console.log("Token expiry:", new Date(expiry));
          console.log("Current time:", new Date(now));

          if (expiry < now) {
            console.log("Token expired, clearing storage");
            localStorage.clear();
            sessionStorage.setItem("redirectUrl", location.pathname);
            navigate("/login-sso");
            return;
          }
        }
      } catch (error) {
        console.log("Token validation error (non-JWT token):", error);
        // Token bukan JWT, tetap lanjutkan
      }

      console.log("Auth check passed");
      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, [navigate, location]);

  // Tampilkan loading spinner saat pengecekan autentikasi
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar kiri — tetap di tempat */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow z-40">
        <LeftSidebar />
      </div>

      {/* Bagian kanan */}
      <div className="flex-1 ml-64">
        {/* Navbar atas — tetap di tempat */}
        <div className="fixed top-0 left-64 right-0 bg-white shadow z-30">
          <Navbar />
        </div>

        {/* Konten utama — biar bisa di-scroll */}
        <main className="pt-20 p-6">
          {/* Tambahkan debug info di development mode */}
          {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 p-2 rounded text-xs z-20 opacity-75 hover:opacity-100">
              <div>Path: {location.pathname}</div>
              <div>Token: {localStorage.getItem("token") ? "✓" : "✗"}</div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
