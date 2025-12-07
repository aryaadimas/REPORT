import { NavLink, useLocation } from "react-router-dom";

const LeftSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Beranda",
      icon: "/assets/Logo Beranda.png",
      path: "/beranda", 
    },
    {
      name: "Kotak Masuk",
      icon: "/assets/Logo Kotak Masuk.png",
      path: "/kotakmasuk", 
    },
    {
      name: "Riwayat", 
      icon: "/assets/Logo Riwayat.png",
      path: "/riwayat",
    },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-md flex flex-col z-50">
      {/* === Logo === */}
      <div className="flex items-center gap-4 px-6 py-5">
        <img src="/assets/Logo Report.png" alt="Logo" className="w-12 h-12" />
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
                location.pathname === item.path ? "brightness-0 invert" : ""
              }`}
            />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default LeftSidebar;
