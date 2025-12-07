import { Plus, Menu, X, Bell, Calendar } from "lucide-react";
import { Calender } from "../../components/beranda/Calender";
import LeftSidebar from "../../components/LeftSidebar";
import SidebarMasyarakat from "./SidebarMasyarakat";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HelpdeskPopup from "../../components/HelpdeskPopup";

export function BerandaMasyarakat() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/me/masyarakat`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data fetched in BerandaMasyarakat:", data);
        setProfileData(data);

        localStorage.setItem("user_profile", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching profile in BerandaMasyarakat:", err);

        const savedProfile = localStorage.getItem("user_profile");
        if (savedProfile) {
          setProfileData(JSON.parse(savedProfile));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
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

    if (item === "Profil Saya") {
      navigate("/profilmasyarakat");
    } else if (item === "Tampilan") {
      navigate("/tampilanmasyarakat");
    } else if (item === "Keluar") {
      setShowLogoutWarning(true);
    }
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_profile");
    setShowLogoutWarning(false);
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutWarning(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false);
  };

  const handlePelaporanOnline = () => {
    navigate("/PelaporanMasyarakat");
  };

  const handleKnowledgeBase = () => {
    navigate("/KBMasyarakat");
  };

  const handlePelacakan = () => {
    navigate("/PelacakanMasyarakat");
  };

  const getUserName = () => {
    if (loading) return "Memuat...";
    if (profileData?.full_name) return profileData.full_name;
    return "Pengguna";
  };

  const getProfilePhoto = () => {
    if (profileData?.profile_url) return profileData.profile_url;
    return "/assets/Lomon.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-72 bg-white animate-pulse">
          <div className="h-16 bg-gray-200 mb-4"></div>
          <div className="space-y-2 px-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-8">
              <div className="relative bg-gray-200 rounded-[2rem] p-8 min-h-[280px] animate-pulse"></div>
            </div>

            <div className="mb-8">
              <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="flex gap-4">
                <div className="w-40 h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="w-40 h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="bg-gray-200 rounded-2xl h-48 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="w-80 bg-gray-200 p-6 space-y-4 animate-pulse">
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-300 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-72">
        <LeftSidebar />
        <div className="h-full">
          <SidebarMasyarakat />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-8">
            <div className="relative bg-[#226597] text-white rounded-[2rem] shadow p-8 min-h-[280px] flex flex-col justify-between text-left overflow-hidden">
              <svg
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                viewBox="0 0 749 208"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M722.619 41.9351C444.934 190.999 254.55 -4.28339 106.773 0.0719757C-45.381 4.58015 -56 80.7703 -56 50.3973V95.823C-56 95.823 -5.95972 77.0332 79.8086 71.2784C391.01 50.3973 409.152 237.166 553.79 217.212C698.428 197.259 799.16 0.847076 722.619 41.9351Z"
                  fill="white"
                  fillOpacity="0.1"
                />
              </svg>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold leading-tight mb-2">
                  Pelaporan Online
                </h2>
                <p className="text-white/80 text-base mt-6">
                  Laporkan persoalan dan permasalahan Anda disini!
                </p>
              </div>

              <button
                onClick={handlePelaporanOnline}
                className="relative z-10 self-start px-6 py-3 border border-white rounded-full font-bold hover:bg-white hover:text-[#226597] transition text-base"
              >
                Buat Laporan <Plus size={16} className="inline ml-2" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-left">Layanan</h2>
            <div className="flex flex-wrap gap-4 justify-start">
              <div className="flex flex-col items-center">
                <div
                  onClick={handleKnowledgeBase}
                  className="w-40 h-40 bg-[#226597] rounded-2xl flex items-center justify-center hover:shadow cursor-pointer transition-transform hover:scale-105"
                >
                  <svg
                    width="50"
                    height="56"
                    viewBox="0 0 60 66"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 h-14"
                  >
                    <path
                      d="M46.8059 0.916626H7.08378C5.39795 0.916626 4.03003 2.28454 4.03003 3.97329V62.0266C4.03003 63.7154 5.39795 65.0833 7.08378 65.0833H46.8088C48.4946 65.0833 49.8625 63.7154 49.8625 62.0266V3.97329C49.8625 2.28454 48.4946 0.916626 46.8059 0.916626Z"
                      fill="#C77F67"
                    />
                    <path
                      d="M37.6389 23.8329C37.6389 24.2382 37.4778 24.6269 37.1912 24.9136C36.9046 25.2002 36.5159 25.3612 36.1105 25.3612H20.833C20.4277 25.3612 20.0389 25.2002 19.7523 24.9136C19.4657 24.6269 19.3047 24.2382 19.3047 23.8329V14.6658C19.3047 14.2604 19.4657 13.8717 19.7523 13.5851C20.0389 13.2985 20.4277 13.1375 20.833 13.1375H36.1105C36.5159 13.1375 36.9046 13.2985 37.1912 13.5851C37.4778 13.8717 37.6389 14.2604 37.6389 14.6658V23.8329Z"
                      fill="white"
                    />
                    <path
                      d="M0.970459 10.0837H10.1375M0.970459 25.3583H10.1375M0.970459 40.6417H10.1375M0.970459 55.9162H10.1375"
                      stroke="#191919"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M59.0296 10.0837V19.2507H49.8625V7.02991H55.973C56.7827 7.03145 57.5588 7.35358 58.1316 7.92585C58.7044 8.49813 59.0273 9.27396 59.0296 10.0837Z"
                      fill="#66E1FF"
                    />
                    <path
                      d="M59.0296 19.2507H49.8625V31.4716H59.0296V19.2507Z"
                      fill="#FFEF5E"
                    />
                    <path
                      d="M59.0296 31.4717H49.8625V43.6925H59.0296V31.4717Z"
                      fill="#FF808C"
                    />
                    <path
                      d="M59.0296 43.6953V52.8624C59.0273 53.6721 58.7044 54.4479 58.1316 55.0202C57.5588 55.5925 56.7827 55.9146 55.973 55.9161H49.8625V43.6953H59.0296Z"
                      fill="#B2FFC0"
                    />
                    <path
                      d="M46.8059 0.916626H7.08378C5.39795 0.916626 4.03003 2.28454 4.03003 3.97329V62.0266C4.03003 63.7154 5.39795 65.0833 7.08378 65.0833H46.8088C48.4946 65.0833 49.8625 63.7154 49.8625 62.0266V3.97329C49.8625 2.28454 48.4946 0.916626 46.8059 0.916626Z"
                      stroke="#191919"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-base leading-snug mt-3 text-center">
                  Knowledge <br /> Base
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  onClick={handlePelacakan}
                  className="w-40 h-40 bg-[#226597] rounded-2xl flex items-center justify-center hover:shadow cursor-pointer transition-transform hover:scale-105"
                >
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 70 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 h-14"
                  >
                    <path
                      d="M49.002 27.501C49.3654 27.5151 49.7106 27.6656 49.9678 27.9229C50.225 28.1801 50.3756 28.5252 50.3896 28.8887C50.4035 29.2482 50.2814 29.599 50.0498 29.874L30.8809 49.0439L20.834 38.9971C20.604 38.7204 20.4856 38.3675 20.502 38.0078C20.5186 37.6444 20.6716 37.3003 20.9307 37.0449C21.1897 36.7897 21.5359 36.6413 21.8994 36.6299C22.2573 36.6187 22.6062 36.7413 22.8789 36.9727L30.8809 44.9746L48.0156 27.8398C48.2906 27.6082 48.6424 27.4871 49.002 27.501Z"
                      fill="#E3E3E3"
                      stroke="black"
                    />
                    <path
                      d="M34.9904 4.37366C36.6063 4.37367 38.1767 4.91112 39.4532 5.90198C40.7297 6.89283 41.6393 8.2809 42.0402 9.84631L42.1368 10.2223H43.3243C43.2768 10.7017 43.2516 11.1837 43.2501 11.6656V11.6686C43.2516 12.1504 43.2768 12.6317 43.3243 13.111H39.3888V11.6666C39.3888 10.5027 38.9267 9.38617 38.1036 8.56311C37.2806 7.74006 36.1641 7.27798 35.0001 7.27795C33.8362 7.27795 32.7197 7.74009 31.8966 8.56311C31.0735 9.38617 30.6115 10.5026 30.6115 11.6666V13.111H23.9747C23.8249 13.111 23.6766 13.1406 23.5382 13.1979C23.3997 13.2553 23.2741 13.3399 23.1681 13.4459C23.0621 13.5519 22.9774 13.6775 22.92 13.816C22.8628 13.9544 22.8332 14.1028 22.8331 14.2526V17.9996H44.6554C45.1331 19.0267 45.7234 19.9959 46.4171 20.8893H19.9445V14.2545C19.9491 13.1865 20.3758 12.164 21.131 11.4088C21.8391 10.7007 22.7822 10.2815 23.7775 10.2281L23.9767 10.2223H27.8439L27.9396 9.84631C28.3404 8.28084 29.2509 6.89285 30.5275 5.90198C31.804 4.91111 33.3744 4.37366 34.9904 4.37366Z"
                      fill="white"
                      stroke="black"
                    />
                    <path
                      d="M12.3248 10.2994C12.7193 10.1864 13.1334 10.1587 13.5396 10.2174L13.5748 10.2223H16.9996V58.4996H53.9996V26.8053C54.1865 26.8037 54.3871 26.8028 54.5953 26.8004C56.0927 26.783 58.0101 26.7487 58.3316 26.7496H58.3345C58.8166 26.7482 59.2984 26.723 59.7779 26.6754V62.8248C59.7754 63.1922 59.7007 63.5555 59.5582 63.8942C59.4152 64.2337 59.2069 64.5424 58.9449 64.8014C58.6829 65.0603 58.372 65.2649 58.0308 65.4039C57.6896 65.5429 57.3241 65.6131 56.9556 65.611H13.0445C12.6761 65.6131 12.3105 65.5429 11.9693 65.4039C11.6281 65.2649 11.3173 65.0604 11.0552 64.8014C10.7932 64.5424 10.5849 64.2337 10.442 63.8942C10.3348 63.6396 10.2665 63.371 10.2379 63.0973L10.2222 62.8219V13.0201C10.2321 12.6099 10.3292 12.2067 10.5064 11.8365C10.6837 11.4664 10.937 11.1376 11.2505 10.8727C11.564 10.6078 11.9302 10.4125 12.3248 10.2994Z"
                      fill="#C77F67"
                      stroke="black"
                    />
                    <path
                      d="M58.3337 2.44446C63.4268 2.44469 67.5554 6.57397 67.5554 11.6671C67.5552 16.7601 63.4267 20.8886 58.3337 20.8888C53.2406 20.8888 49.1113 16.7602 49.1111 11.6671C49.1111 6.57382 53.2404 2.44446 58.3337 2.44446Z"
                      fill="#E3E3E3"
                      stroke="black"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-base leading-snug mt-3 text-center">
                  Cek Status <br /> Laporan
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <hr className="border-gray-300 mb-4" />
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold text-left">
                Riwayat Laporan
              </h2>
              <button
                onClick={() => navigate("/riwayatmasyarakat")}
                className="text-[#226597] text-sm font-semibold hover:underline"
              >
                Tampilkan semua
              </button>
            </div>

            {(() => {
              const riwayatData = [
                {
                  id: "LPR321336",
                  nama: "Gangguan Router",
                  tanggal: "17-07-2025",
                },
                {
                  id: "LYN651289",
                  nama: "Permintaan Printer",
                  tanggal: "17-07-2025",
                },
              ];

              if (riwayatData.length === 0) {
                return (
                  <div className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-gray-200">
                    <div className="w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-full mr-3 font-bold text-gray-600 text-sm">
                      !
                    </div>
                    <p className="text-gray-600 text-base">
                      Tidak ada riwayat laporan untuk ditampilkan
                    </p>
                  </div>
                );
              }

              return (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {riwayatData.map((item, index, arr) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center px-5 py-4 ${
                        index !== arr.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex-1 grid grid-cols-3 text-base">
                        <div>
                          <p className="text-gray-500 font-medium">ID:</p>
                          <p className="text-gray-800 font-semibold">
                            {item.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Nama:</p>
                          <p className="text-gray-800 font-semibold">
                            {item.nama}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">
                            Tanggal Selesai:
                          </p>
                          <p className="text-gray-800 font-semibold">
                            {item.tanggal}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate("/lihatlaporanmasyarakat", {
                            state: { item },
                          })
                        }
                        className="ml-3 p-2 hover:bg-gray-100 rounded-full transition"
                        title="Lihat Detail"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="w-80 bg-[#226597] p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between gap-2">
          <div ref={notificationRef} className="relative">
            <div
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
              onClick={toggleNotification}
            >
              <svg
                width="22"
                height="25"
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

            {isNotificationOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Notifikasi
                  </h3>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div
                    className="px-3 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/ndibuatmasyarakat")}
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 57 57"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="57" height="57" rx="8" fill="#113F67" />
                        <path
                          d="M32.5 17.5H24.5V21.5H32.5V17.5Z"
                          fill="white"
                        />
                        <path
                          d="M19.5 19.5H22.5V23.5H34.5V19.5H37.5V39.5H19.5V19.5ZM31.5 29.5V27.5H25.5V29.5H31.5ZM31.5 33.5V31.5H25.5V33.5H31.5Z"
                          fill="white"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-700 text-xs mb-1">
                          Tiket Dibuat
                        </h5>
                        <p className="text-[10px] text-gray-600 mb-1">
                          Tiket Anda{" "}
                          <span className="font-bold">LYN152672</span> telah
                          dibuat.
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-medium bg-[#226597] text-white px-1.5 py-0.5 rounded">
                            Tiket
                          </span>
                          <span className="text-[10px] text-gray-500">
                            1 jam yang lalu
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="px-3 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/ndiprosesmasyarakat")}
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 57 57"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="57" height="57" rx="8" fill="#113F67" />
                        <path
                          d="M32.5 17.5H24.5V21.5H32.5V17.5Z"
                          fill="white"
                        />
                        <path
                          d="M19.5 19.5H22.5V23.5H34.5V19.5H37.5V28.174C36.0037 27.4634 34.3039 27.3065 32.7028 27.731C31.1017 28.1556 29.7031 29.1342 28.7555 30.4929C27.808 31.8515 27.3729 33.5022 27.5277 35.1514C27.6825 36.8006 28.4172 38.3414 29.601 39.5H19.5V19.5Z"
                          fill="white"
                        />
                        <path
                          d="M29 34.5C29 33.7777 29.1423 33.0625 29.4187 32.3952C29.6951 31.728 30.1002 31.1216 30.6109 30.6109C31.1216 30.1002 31.728 29.6951 32.3952 29.4187C33.0625 29.1423 33.7777 29 34.5 29C35.2223 29 35.9375 29.1423 36.6048 29.4187C37.272 29.6951 37.8784 30.1002 38.3891 30.6109C38.8998 31.1216 39.3049 31.728 39.5813 32.3952C39.8577 33.0625 40 33.7777 40 34.5C40 35.9587 39.4205 37.3576 38.3891 38.3891C37.3576 39.4205 35.9587 40 34.5 40C33.0413 40 31.6424 39.4205 30.6109 38.3891C29.5795 37.3576 29 35.9587 29 34.5ZM36.914 35.5L35.5 34.086V32.252H33.5V34.914L35.5 36.914L36.914 35.5Z"
                          fill="white"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-700 text-xs mb-1">
                          Status Tiket Diperbarui
                        </h5>
                        <p className="text-[10px] text-gray-600 mb-1">
                          Tiket Anda{" "}
                          <span className="font-bold">LPR872390</span> sedang
                          diproses.
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-medium bg-[#226597] text-white px-1.5 py-0.5 rounded">
                            Status
                          </span>
                          <span className="text-[10px] text-gray-500">
                            2 hari yang lalu
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/nmaintenancemasyarakat")}
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 56 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="56" height="56" rx="8" fill="#113F67" />
                        <path
                          d="M34.4401 29.7913L28.9411 20.2063C28.8035 19.9673 28.6202 19.7578 28.4016 19.5896C28.183 19.4215 27.9334 19.298 27.6671 19.2263C27.1253 19.0814 26.5482 19.1551 26.0601 19.4313L24.8641 20.1273C24.8335 20.1405 24.8067 20.1611 24.7861 20.1873L24.7171 20.2743C24.6447 20.3514 24.594 20.4463 24.5701 20.5493C24.1437 21.8511 23.6126 23.1162 22.9821 24.3323C22.539 25.0808 21.941 25.7259 21.2281 26.2243L19.4341 27.8123C19.0705 28.1368 18.8285 28.5757 18.7481 29.0563C18.697 29.3834 18.7172 29.7177 18.8071 30.0363C18.5611 30.1723 18.3471 30.3603 18.1801 30.5863C18.011 30.8078 17.8876 31.0607 17.8171 31.3303C17.7641 31.6055 17.7641 31.8882 17.8171 32.1633C17.8933 32.7163 18.1826 33.2176 18.6231 33.5603C18.8431 33.7283 19.0961 33.8503 19.3661 33.9183C19.5421 33.9657 19.7218 33.9883 19.9051 33.9863C20.0025 33.9963 20.1005 33.9963 20.1991 33.9863C20.4711 33.9533 20.7321 33.8593 20.9631 33.7123C21.1791 33.9553 21.4521 34.1403 21.7571 34.2523C21.9941 34.3453 22.2471 34.3923 22.5021 34.3883C22.6415 34.3917 22.7788 34.3753 22.9141 34.3393L24.5111 37.1923C24.7018 37.5119 24.9715 37.7771 25.2943 37.9624C25.617 38.1477 25.982 38.2468 26.3541 38.2503C26.8193 38.2447 27.27 38.0876 27.6379 37.8029C28.0059 37.5181 28.271 37.1212 28.3931 36.6723C28.5314 36.13 28.4577 35.5553 28.1871 35.0653L26.9911 32.9873C27.3138 32.9153 27.6405 32.876 27.9711 32.8693C29.3661 32.9283 30.7531 33.1053 32.1171 33.3993H32.4601L32.6171 33.3293L32.7641 33.2413L33.8131 32.6343C34.2951 32.3553 34.6481 31.8973 34.7931 31.3603C34.8839 30.8113 34.7573 30.2485 34.4401 29.7913ZM22.5511 32.9483C22.4116 32.9973 22.2596 32.9973 22.1201 32.9483C21.9822 32.8993 21.867 32.8015 21.7961 32.6733L20.3061 30.0663L20.2091 29.8993C20.1337 29.7674 20.1061 29.6134 20.1311 29.4634C20.1561 29.3135 20.232 29.1768 20.3461 29.0763L21.4531 28.0963L21.8651 28.8213L23.9921 32.5463L22.5511 32.9483ZM33.2251 30.9883C33.177 31.1551 33.0687 31.298 32.9211 31.3893L32.3721 31.7033L26.2361 21.0093L26.7951 20.6863C26.8667 20.6437 26.9463 20.6165 27.0289 20.6063C27.1116 20.5962 27.1954 20.6033 27.2751 20.6273C27.3568 20.6477 27.4336 20.6842 27.5009 20.7347C27.5682 20.7852 27.6247 20.8486 27.6671 20.9213L33.1661 30.4973C33.215 30.5792 33.2456 30.6706 33.2558 30.7654C33.266 30.8601 33.2555 30.956 33.2251 31.0463V30.9883ZM32.9701 25.1653C32.8413 25.1675 32.7142 25.1351 32.6021 25.0714C32.4901 25.0077 32.3972 24.9152 32.3331 24.8033C32.2428 24.6373 32.2199 24.4427 32.2693 24.2602C32.3186 24.0777 32.4364 23.9212 32.5981 23.8233L35.0481 22.4013C35.2137 22.3084 35.409 22.2841 35.5923 22.3337C35.7755 22.3832 35.932 22.5027 36.0281 22.6663C36.1185 22.8324 36.1414 23.0269 36.092 23.2094C36.0427 23.3919 35.9249 23.5484 35.7631 23.6463L33.3131 25.0673C33.2092 25.1291 33.091 25.1628 32.9701 25.1653ZM37.4881 28.6353H34.6561C34.5596 28.6353 34.464 28.6163 34.3749 28.5794C34.2857 28.5424 34.2047 28.4883 34.1364 28.4201C34.0682 28.3518 34.014 28.2708 33.9771 28.1816C33.9401 28.0924 33.9211 27.9969 33.9211 27.9003C33.9211 27.8038 33.9401 27.7082 33.9771 27.6191C34.014 27.5299 34.0682 27.4489 34.1364 27.3806C34.2047 27.3124 34.2857 27.2582 34.3749 27.2213C34.464 27.1843 34.5596 27.1653 34.6561 27.1653H37.4881C37.6831 27.1653 37.87 27.2428 38.0079 27.3806C38.1457 27.5184 38.2231 27.7054 38.2231 27.9003C38.2231 28.0953 38.1457 28.2822 38.0079 28.4201C37.87 28.5579 37.6831 28.6353 37.4881 28.6353ZM30.6571 21.6663C30.5295 21.6674 30.4039 21.6335 30.2941 21.5683C30.1291 21.4735 30.0079 21.3177 29.9567 21.1344C29.9055 20.9511 29.9282 20.755 30.0201 20.5883L31.4311 18.1183C31.5326 17.9576 31.6924 17.8424 31.877 17.7969C32.0615 17.7513 32.2565 17.7789 32.4212 17.8739C32.5858 17.9689 32.7073 18.1239 32.7603 18.3065C32.8132 18.489 32.7934 18.685 32.7051 18.8533L31.2941 21.3133C31.2281 21.4228 31.1346 21.513 31.0228 21.5749C30.911 21.6369 30.7849 21.6684 30.6571 21.6663Z"
                          fill="white"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-700 text-xs mb-1">
                          Pengumuman
                        </h5>
                        <p className="text-[10px] text-gray-600 mb-1">
                          Maintenance untuk pemeliharaan sistem.
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-medium bg-[#226597] text-white px-1.5 py-0.5 rounded">
                            Maintenance
                          </span>
                          <span className="text-[10px] text-gray-500">
                            4 hari yang lalu
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={dropdownRef} className="flex-1 relative">
            <div
              className="bg-white rounded-full flex items-center justify-between px-2 py-1.5 shadow-sm cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={getProfilePhoto()}
                    alt="Profil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/assets/Lomon.png";
                    }}
                  />
                </div>
                <p className="text-gray-700 text-xs font-medium truncate">
                  {getUserName()}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`-ml-1 h-4 w-4 text-gray-500 transition-transform ${
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

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                  onClick={() => handleItemClick("Profil Saya")}
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
                        d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
                        fill="#226597"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-800 ml-1.5">
                      Profil Saya
                    </span>
                  </div>
                </div>

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

        <div className="min-h-0">
          <Calender />
        </div>
      </div>

      {/* Modal Konfirmasi Logout */}
      {showLogoutWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 0C77.615 0 100 22.385 100 50C100 77.615 77.615 100 50 100C22.385 100 0 77.615 0 50C0 22.385 22.385 0 50 0ZM50 10C39.3913 10 29.2172 14.2143 21.7157 21.7157C14.2143 29.2172 10 39.3913 10 50C10 60.6087 14.2143 70.7828 21.7157 78.2843C29.2172 85.7857 39.3913 90 50 90C60.6087 90 70.7828 85.7857 78.2843 78.2843C85.7857 70.7828 90 60.6087 90 50C90 39.3913 85.7857 29.2172 78.2843 21.7157C70.7828 14.2143 60.6087 10 50 10ZM50 65C51.3261 65 52.5979 65.5268 53.5355 66.4645C54.4732 67.4021 55 68.6739 55 70C55 71.3261 54.4732 72.5979 53.5355 73.5355C52.5979 74.4732 51.3261 75 50 75C48.6739 75 47.4021 74.4732 46.4645 73.5355C45.5268 72.5979 45 71.3261 45 70C45 68.6739 45.5268 67.4021 46.4645 66.4645C47.4021 65.5268 48.6739 65 50 65ZM50 20C51.3261 20 52.5979 20.5268 53.5355 21.4645C54.4732 22.4021 55 23.6739 55 25V55C55 56.3261 54.4732 57.5979 53.5355 58.5355C52.5979 59.4732 51.3261 60 50 60C48.6739 60 47.4021 59.4732 46.4645 58.5355C45.5268 57.5979 45 56.3261 45 55V25C45 23.6739 45.5268 22.4021 46.4645 21.4645C47.4021 20.5268 48.6739 20 50 20Z"
                    fill="#FF5F57"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apakah Anda yakin ingin keluar?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Anda akan diarahkan ke halaman login.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors"
                >
                  Ya, keluar
                </button>
                <button
                  onClick={handleCancelLogout}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <HelpdeskPopup />
    </div>
  );
}
