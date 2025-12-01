import { NavLink, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function LayoutBidang({ children }) {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "/assets/Logo Beranda.png",
      path: "/dashboardbidang",
    },
    {
      name: "Monitoring",
      icon: "/assets/Logo Monitoring.png",
      path: "/monitoringbidang",
    },
    {
      name: "Rating",
      icon: "/assets/Logo Rating.png",
      path: "/ratingkepuasan",
    },
    {
      name: "Kotak Masuk",
      icon: "/assets/Logo Kotak Masuk.png",
      path: "/kotakmasukbidang",
    },
  ];

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
            <h1 className="font-bold text-2xl bg-gradient-to-r from-[#EE1D52] to-[#0F2C59] text-transparent bg-clip-text tracking-wide">
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
                      ? "bg-[#0F2C59] text-white rounded-full shadow-sm"
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
          <Navbar />
        </div>

        {/* Konten utama — biar bisa di-scroll */}
        <main className="pt-20 p-6">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
