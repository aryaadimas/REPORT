import { Plus } from "lucide-react";
import { Calender } from "../../components/beranda/Calender";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HelpdeskPopup from "../../components/HelpdeskPopup";

export default function BerandaMasyarakat() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riwayatLoading, setRiwayatLoading] = useState(true);
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
    const fetchRiwayatData = async () => {
      try {
        setRiwayatLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/tickets/masyarakat/finished`,
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
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Riwayat data fetched:", data);

        const latestData = data.data?.slice(0, 2) || [];
        setRiwayatData(latestData);
      } catch (err) {
        console.error("Error fetching riwayat data:", err);
        setRiwayatData([]);
      } finally {
        setRiwayatLoading(false);
      }
    };

    fetchRiwayatData();
  }, []);

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

  const handleViewDetail = async (ticketId, ticketCode) => {
    console.log(
      "Icon mata diklik - ticketId:",
      ticketId,
      "ticketCode:",
      ticketCode
    );

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/tickets/masyarakat/${ticketId}`,
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const ticketDetail = await response.json();
      console.log("Ticket detail dari API:", ticketDetail);

      navigate("/lihatriwayatmasyarakat", {
        state: {
          ticketDetail: ticketDetail.data || ticketDetail,
          ticketId: ticketId,
          ticketCode: ticketCode,
          item: {
            ticket_id: ticketId,
            ticket_code: ticketCode,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching ticket detail:", error);

      navigate("/lihatriwayatmasyarakat", {
        state: {
          ticketId: ticketId,
          ticketCode: ticketCode,
          item: {
            ticket_id: ticketId,
            ticket_code: ticketCode,
          },
        },
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      selesai: "Selesai",
      rejected: "Ditolak",
      Selesai: "Selesai",
      "tiket ditolak": "Ditolak",
    };
    return statusMap[status] || status || "-";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="mb-6">
              <div className="relative bg-gray-200 rounded-[2rem] p-6 md:p-8 min-h-[200px] md:min-h-[280px] animate-pulse"></div>
            </div>

            <div className="mb-6">
              <div className="h-7 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="flex gap-3 md:gap-4">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
            </div>

            <div className="mt-6">
              <div className="h-7 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="bg-gray-200 rounded-2xl h-40 md:h-48 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-72 md:w-80 bg-gray-200 p-4 md:p-6 space-y-4 animate-pulse">
          <div className="bg-gray-300 rounded-lg h-56 md:h-64"></div>
          <div className="bg-gray-300 rounded-lg h-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <div className="relative bg-[#226597] text-white rounded-2xl md:rounded-[2rem] shadow p-6 md:p-8 min-h-[200px] md:min-h-[280px] flex flex-col justify-between text-left overflow-hidden">
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
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
                  Pelaporan Online
                </h2>
                <p className="text-white/80 text-sm md:text-base mt-4 md:mt-6">
                  Laporkan persoalan dan permasalahan Anda disini!
                </p>
              </div>

              <button
                onClick={handlePelaporanOnline}
                className="relative z-10 self-start px-5 py-2.5 md:px-6 md:py-3 border border-white rounded-full font-bold hover:bg-white hover:text-[#226597] transition text-sm md:text-base mt-4"
              >
                Buat Laporan <Plus size={16} className="inline ml-2" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-left">
              Layanan
            </h2>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex flex-col items-center">
                <div
                  onClick={handleKnowledgeBase}
                  className="w-32 h-32 md:w-40 md:h-40 bg-[#226597] rounded-2xl flex items-center justify-center hover:shadow cursor-pointer transition-transform hover:scale-105"
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
                  className="w-32 h-32 md:w-40 md:h-40 bg-[#226597] rounded-2xl flex items-center justify-center hover:shadow cursor-pointer transition-transform hover:scale-105"
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

          <div className="mt-6">
            <hr className="border-gray-300 mb-4" />

            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl md:text-2xl font-semibold text-left">
                Riwayat Laporan
              </h2>
              <button
                onClick={() => navigate("/riwayatmasyarakat")}
                className="text-[#226597] text-sm font-semibold hover:underline"
              >
                Tampilkan semua
              </button>
            </div>

            {riwayatLoading ? (
              <div className="bg-white rounded-xl p-4 flex items-center shadow-sm border border-gray-200">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#226597] mr-3"></div>
                <p className="text-gray-600 text-sm">
                  Memuat riwayat laporan...
                </p>
              </div>
            ) : riwayatData.length === 0 ? (
              <div className="bg-white rounded-xl p-4 flex items-center shadow-sm border border-gray-200">
                <div className="w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-full mr-3 font-bold text-gray-600 text-sm">
                  !
                </div>
                <p className="text-gray-600 text-sm">
                  Tidak ada riwayat laporan untuk ditampilkan
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {riwayatData.map((item, index, arr) => (
                  <div
                    key={item.ticket_id}
                    className={`flex justify-between items-center px-4 md:px-5 py-3 md:py-4 ${
                      index !== arr.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0 text-sm md:text-base">
                      <div>
                        <p className="text-gray-500 font-medium">ID:</p>
                        <p className="text-gray-800 font-semibold">
                          {item.ticket_code || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Nama:</p>
                        <p className="text-gray-800 font-semibold">
                          {item.title || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">
                          Tanggal Selesai:
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {formatDate(item.pengerjaan_akhir) ||
                            formatDate(item.created_at) ||
                            "-"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleViewDetail(item.ticket_id, item.ticket_code)
                      }
                      className="ml-2 p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
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
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-72 md:w-80 bg-[#226597] p-4 md:p-6 space-y-4 overflow-y-auto flex-col flex-shrink-0">
        <div className="min-h-0 flex-1">
          <Calender />
        </div>
      </div>

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