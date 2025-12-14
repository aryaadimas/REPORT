import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarMasyarakat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const path = location.pathname;
    console.log("Current path:", path);

    if (
      path === "/" ||
      path === "/BerandaMasyarakat" ||
      path === "/berandamasyarakat" ||
      path === "/BerandaMasyarakat.jsx"
    ) {
      setActiveItem("berandamasyarakat");
    } else if (path === "/kotakmasuk" || path === "/KotakMasuk") {
      setActiveItem("kotakmasuk");
    } else if (
      path === "/riwayatmasyarakat" ||
      path === "/riwayatrmasyarakat"
    ) {
      setActiveItem("riwayatmasyarakat");
    } else {
      setActiveItem("");
    }
  }, [location.pathname]);

  const navItems = [
    {
      id: "berandamasyarakat",
      label: "Beranda",
      icon: "/assets/Logo Beranda.png",
      path: "/BerandaMasyarakat",
    },
    {
      id: "kotakmasuk",
      label: "Kotak Masuk",
      icon: "/assets/Logo Kotak Masuk.png",
      path: "/kotakmasuk",
    },
    {
      id: "riwayatmasyarakat",
      label: "Riwayat",
      icon: "/assets/Logo Riwayat.png",
      path: "/riwayatmasyarakat",
    },
  ];

  const handleNavigation = (item) => {
    console.log("Navigating to:", item.path);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-sm border-r p-6 fixed left-0 top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/Logo Report.png"
              alt="Logo Report"
              className="w-16 h-16 object-contain shadow-md rounded-full"
            />
          </div>

          <div className="w-[80px] h-[20px] -translate-y-3">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 67 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.608 11.5L4.368 7.34H4.032V11.5H0.896V0.219999H5.84C6.74667 0.219999 7.51467 0.379999 8.144 0.7C8.77333 1.00933 9.248 1.44133 9.568 1.996C9.888 2.54 10.048 3.15333 10.048 3.836C10.048 4.604 9.83467 5.28133 9.408 5.868C8.992 6.444 8.37867 6.85467 7.568 7.1L10.112 11.5H6.608ZM4.032 5.196H5.584C6.01067 5.196 6.33067 5.09467 6.544 4.892C6.75733 4.68933 6.864 4.396 6.864 4.012C6.864 3.64933 6.752 3.36667 6.528 3.164C6.31467 2.95067 6 2.844 5.584 2.844H4.032V5.196ZM15.4101 2.732V4.572H19.0101V6.956H15.4101V8.988H19.4901V11.5H12.2741V0.219999H19.4901V2.732H15.4101ZM30.7518 3.98C30.7518 4.66267 30.5918 5.28667 30.2718 5.852C29.9624 6.40667 29.4878 6.85467 28.8478 7.196C28.2184 7.52667 27.4451 7.692 26.5278 7.692H24.9758V11.5H21.8398V0.219999H26.5278C27.4344 0.219999 28.2024 0.379999 28.8318 0.7C29.4718 1.02 29.9518 1.46267 30.2718 2.028C30.5918 2.59333 30.7518 3.244 30.7518 3.98ZM26.2238 5.196C27.1091 5.196 27.5518 4.79067 27.5518 3.98C27.5518 3.15867 27.1091 2.748 26.2238 2.748H24.9758V5.196H26.2238ZM38.2196 11.612C37.1636 11.612 36.193 11.3667 35.3076 10.876C34.4223 10.3747 33.7183 9.68667 33.1956 8.812C32.6836 7.92667 32.4276 6.92933 32.4276 5.82C32.4276 4.71067 32.6836 3.71867 33.1956 2.844C33.7183 1.95867 34.4223 1.27067 35.3076 0.78C36.193 0.289333 37.1636 0.0439997 38.2196 0.0439997C39.2863 0.0439997 40.257 0.289333 41.1316 0.78C42.017 1.27067 42.7156 1.95867 43.2276 2.844C43.7396 3.71867 43.9956 4.71067 43.9956 5.82C43.9956 6.92933 43.7396 7.92667 43.2276 8.812C42.7156 9.68667 42.017 10.3747 41.1316 10.876C40.2463 11.3667 39.2756 11.612 38.2196 11.612ZM38.2196 8.7C39.0196 8.7 39.649 8.43867 40.1076 7.916C40.577 7.39333 40.8116 6.69467 40.8116 5.82C40.8116 4.924 40.577 4.22 40.1076 3.708C39.649 3.18533 39.0196 2.924 38.2196 2.924C37.409 2.924 36.7743 3.18533 36.3156 3.708C35.857 4.22 35.6276 4.924 35.6276 5.82C35.6276 6.70533 35.857 7.40933 36.3156 7.932C36.7743 8.444 37.409 8.7 38.2196 8.7ZM51.9174 11.5L49.6774 7.34H49.3414V11.5H46.2054V0.219999H51.1494C52.056 0.219999 52.824 0.379999 53.4534 0.7C54.0827 1.00933 54.5574 1.44133 54.8774 1.996C55.1974 2.54 55.3574 3.15333 55.3574 3.836C55.3574 4.604 55.144 5.28133 54.7174 5.868C54.3014 6.444 53.688 6.85467 52.8774 7.1L55.4214 11.5H51.9174ZM49.3414 5.196H50.8934C51.32 5.196 51.64 5.09467 51.8534 4.892C52.0667 4.68933 52.1734 4.396 52.1734 4.012C52.1734 3.64933 52.0614 3.36667 51.8374 3.164C51.624 2.95067 51.3094 2.844 50.8934 2.844H49.3414V5.196ZM66.0795 0.219999V2.716H63.0715V11.5H59.9355V2.716H56.9595V0.219999H66.0795Z"
                fill="url(#paint0_linear_49_3042)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_49_3042"
                  x1="0"
                  y1="5.5"
                  x2="80"
                  y2="5.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#EE1D52" />
                  <stop offset="0.9999" stopColor="#507687" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center gap-3 px-3 py-4 rounded-full transition-all duration-200 ${
                activeItem === item.id
                  ? "bg-[#226597] text-white"
                  : "bg-white text-[#226597] hover:bg-[#507687]/10"
              }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={`w-5 h-5 object-contain transition-all ${
                  activeItem === item.id ? "brightness-0 invert" : ""
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 ml-64"></div>
    </div>
  );
};

export default SidebarMasyarakat;
