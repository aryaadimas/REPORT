import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeaderMasyarakat = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Menutup dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    console.log(`Menu diklik: ${item}`);
    setIsDropdownOpen(false);

    // Tambahkan logika navigasi di sini
    if (item === "Profil Saya") {
      navigate("/ProfilSaya");
    } else if (item === "Tampilan") {
      navigate("/tampilan");
    } else if (item === "Keluar") {
      // Navigasi ke halaman Login
      navigate("/login");
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-end">
        {/* Card Notifikasi */}
        <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
          <svg
            width="25"
            height="28"
            viewBox="0 0 25 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.96289 23.2275C10.4627 23.1218 13.5075 23.1219 14.0088 23.2275C14.4361 23.3262 14.8983 23.5572 14.8984 24.0605C14.8736 24.54 14.5927 24.9654 14.2041 25.2354C13.7002 25.6281 13.1084 25.8772 12.4902 25.9668C12.1485 26.0111 11.8123 26.0121 11.4824 25.9668C10.8634 25.8771 10.2723 25.628 9.76953 25.2344C9.37994 24.9655 9.09809 24.54 9.07324 24.0605C9.07342 23.5572 9.53566 23.3262 9.96289 23.2275ZM12.0449 6C14.1251 6 16.2505 6.98735 17.5127 8.625C18.3314 9.67935 18.707 10.7327 18.707 12.3701V12.7959C18.707 14.0518 19.0391 14.7925 19.7695 15.6455C20.3231 16.274 20.5 17.0808 20.5 17.9561C20.5 18.8302 20.213 19.6602 19.6377 20.334C18.8844 21.1417 17.8216 21.6574 16.7373 21.7471C15.1662 21.881 13.594 21.9941 12.001 21.9941C10.4068 21.9941 8.83497 21.9263 7.26367 21.7471C6.1784 21.6574 5.11562 21.1417 4.36328 20.334C3.78793 19.6602 3.50001 18.8302 3.5 17.9561C3.5 17.0808 3.67788 16.274 4.23047 15.6455C4.98379 14.7925 5.29395 14.0518 5.29395 12.7959V12.3701C5.29398 10.6883 5.71351 9.58834 6.57715 8.51172C7.86123 6.94165 9.9197 6 11.9561 6H12.0449Z"
              fill="#226597"
            />
            <path
              d="M21 8C23.2091 8 25 6.20914 25 4C25 1.79086 23.2091 0 21 0C18.7909 0 17 1.79086 17 4C17 6.20914 18.7909 8 21 8Z"
              fill="#EE1D52"
            />
          </svg>
        </div>

        {/* Card Profil dengan Dropdown */}
        <div ref={dropdownRef} className="ml-3 md:ml-4 relative">
          <div
            className="w-48 md:w-56 bg-white rounded-full flex items-center justify-between px-3 py-2 shadow-sm border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Avatar Profil */}
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src="/assets/Lomon.png"
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nama */}
              <p className="text-gray-700 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[120px]">
                Lomon Kahiel
              </p>
            </div>

            {/* Icon Dropdown */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-1 h-4 w-4 md:h-5 md:w-5 text-[#226597] transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {/* Item 1: Profil Saya */}
              <div
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                onClick={() => handleItemClick("Profil Saya")}
              >
                <div
                  className="flex items-center cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-md transition"
                  onClick={() => navigate("/profilmasyarakat")}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0786 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
                      fill="#226597"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-800 ml-1.5">
                    Profil Saya
                  </span>
                </div>
              </div>

              {/* Item 2: Tampilan */}
              <div
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                onClick={() => handleItemClick("Tampilan")}
              >
                <div className="flex items-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.847 21.934C5.867 21.362 2 17.133 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.157 18.717 16.733 15.914 16.37C14.296 16.161 12.839 15.973 12.262 16.888C11.867 17.514 12.294 18.294 12.817 18.817C12.9724 18.9724 13.0956 19.1568 13.1797 19.3598C13.2637 19.5627 13.307 19.7803 13.307 20C13.307 20.2197 13.2637 20.4373 13.1797 20.6402C13.0956 20.8432 12.9724 21.0276 12.817 21.183C12.294 21.706 11.582 22.019 10.847 21.934ZM11.085 7C11.085 7.39782 10.927 7.77936 10.6457 8.06066C10.3644 8.34196 9.98282 8.5 9.585 8.5C9.18718 8.5 8.80564 8.34196 8.52434 8.06066C8.24304 7.77936 8.085 7.39782 8.085 7C8.085 6.60218 8.24304 6.22064 8.52434 5.93934C8.80564 5.65804 9.18718 5.5 9.585 5.5C9.98282 5.5 10.3644 5.65804 10.6457 5.93934C10.927 6.22064 11.085 6.60218 11.085 7ZM6.5 13C6.89782 13 7.27936 12.842 7.56066 12.5607C7.84196 12.2794 8 11.8978 8 11.5C8 11.1022 7.84196 10.7206 7.56066 10.4393C7.27936 10.158 6.89782 10 6.5 10C6.10218 10 5.72064 10.158 5.43934 10.4393C5.15804 10.7206 5 11.1022 5 11.5C5 11.8978 5.15804 12.2794 5.43934 12.5607C5.72064 12.842 6.10218 13 6.5 13ZM17.5 13C17.8978 13 18.2794 12.842 18.5607 12.5607C18.842 12.2794 19 11.8978 19 11.5C19 11.1022 18.842 10.7206 18.5607 10.4393C18.2794 10.158 17.8978 10 17.5 10C17.1022 10 16.7206 10.158 16.4393 10.4393C16.158 10.7206 16 11.1022 16 11.5C16 11.8978 16.158 12.2794 16.4393 12.5607C16.7206 12.842 17.1022 13 17.5 13ZM14.5 8.5C14.697 8.5 14.892 8.4612 15.074 8.38582C15.256 8.31044 15.4214 8.19995 15.5607 8.06066C15.6999 7.92137 15.8104 7.75601 15.8858 7.57403C15.9612 7.39204 16 7.19698 16 7C16 6.80302 15.9612 6.60796 15.8858 6.42597C15.8104 6.24399 15.6999 6.07863 15.5607 5.93934C15.4214 5.80005 15.256 5.68956 15.074 5.61418C14.892 5.5388 14.697 5.5 14.5 5.5C14.1022 5.5 13.7206 5.65804 13.4393 5.93934C13.158 6.22064 13 6.60218 13 7C13 7.39782 13.158 7.77936 13.4393 8.06066C13.7206 8.34196 14.1022 8.5 14.5 8.5Z"
                      fill="#226597"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-800 ml-1.5">
                    Tampilan
                  </span>
                </div>
              </div>

              {/* Item 3: Keluar */}
              <div
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleItemClick("Keluar")}
              >
                <div className="flex items-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.138 1.81498C10.5859 1.68062 11.059 1.65282 11.5196 1.73382C11.9802 1.81481 12.4154 1.99735 12.7906 2.28146C13.1658 2.56058 13.4706 2.92354 13.6805 3.34138C13.8905 3.75921 13.9999 4.22035 14 4.68798V19.312C13.9999 19.7796 13.8905 20.2408 13.6805 20.6586C13.4706 21.0764 13.1658 21.4394 12.7906 21.7185C12.4154 21.9976 11.9802 22.1852 11.5196 22.2662C11.059 22.3471 10.5859 22.3194 10.138 22.185L4.138 20.385C3.5201 20.1996 2.97841 19.82 2.59328 19.3025C2.20815 18.785 2.00011 18.1571 2 17.512V6.48798C2.00011 5.84288 2.20815 5.215 2.59328 4.69747C2.97841 4.17994 3.5201 3.80034 4.138 3.61498L10.138 1.81498ZM15 3.99998C15 3.73477 15.1054 3.48041 15.2929 3.29288C15.4804 3.10534 15.7348 2.99998 16 2.99998H19C19.7956 2.99998 20.5587 3.31606 21.1213 3.87866C21.6839 4.44127 22 5.20434 22 5.99998V6.99998C22 7.2652 21.8946 7.51956 21.7071 7.70709C21.5196 7.89463 21.2652 7.99998 21 7.99998C20.7348 7.99998 20.4804 7.89463 20.2929 7.70709C20.1054 7.51956 20 7.2652 20 6.99998V5.99998C20 5.73477 19.8946 5.48041 19.7071 5.29288C19.5196 5.10534 19.2652 4.99998 19 4.99998H16C15.7348 4.99998 15.4804 4.89463 15.2929 4.70709C15.1054 4.51955 15 4.2652 15 3.99998ZM21 16C21.2652 16 21.5196 16.1053 21.7071 16.2929C21.8946 16.4804 22 16.7348 22 17V18C22 18.7956 21.6839 19.5587 21.1213 20.1213C20.5587 20.6839 19.7956 21 19 21H16C15.7348 21 15.4804 20.8946 15.2929 20.7071C15.1054 20.5196 15 20.2652 15 20C15 19.7348 15.1054 19.4804 15.2929 19.2929C15.4804 19.1053 15.7348 19 16 19H19C19.2652 19 19.5196 18.8946 19.7071 18.7071C19.8946 18.5196 20 18.2652 20 18V17C20 16.7348 20.1054 16.4804 20.2929 16.2929C20.4804 16.1053 20.7348 16 21 16ZM9 11C8.73478 11 8.48043 11.1053 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12C8 12.2652 8.10536 12.5196 8.29289 12.7071C8.48043 12.8946 8.73478 13 9 13H9.001C9.26622 13 9.52057 12.8946 9.70811 12.7071C9.89564 12.5196 10.001 12.2652 10.001 12C10.001 11.7348 9.89564 11.4804 9.70811 11.2929C9.52057 11.1053 9.26622 11 9.001 11H9Z"
                      fill="#226597"
                    />
                    <path
                      d="M16 12H21M21 12L19 10M21 12L19 14"
                      stroke="#226597"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-800 ml-1.5">
                    Keluar
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderMasyarakat;
