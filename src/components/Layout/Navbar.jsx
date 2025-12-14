import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  ChevronDownIcon,
  UserIcon,
  SwatchIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

const Navbar = ({ profileData }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Fallback ke localStorage jika profileData belum tersedia
  // ================= USER DATA HANDLER =================
const getUserData = (profileData) => {
  let actualData = profileData;

  // Handle berbagai bentuk response backend
  if (profileData) {
    if (profileData.user) {
      actualData = profileData.user;
    } else if (profileData.data) {
      actualData = profileData.data;
    } else if (profileData.full_name || profileData.name) {
      actualData = profileData;
    }
  }

  // Jika data valid dari backend
  if (actualData && (actualData.full_name || actualData.name)) {
    return actualData;
  }

  // Fallback ke localStorage
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");

  if (localUser && Object.keys(localUser).length > 0) {
    return {
      full_name: localUser.name || "Pengguna",
      role: localUser.role?.nama || localUser.role || "User",
      profile_url: localUser.avatar || "/assets/Lomon.png",
      email: localUser.email,
      role_id: localUser.role_id,
    };
  }

  return null;
};

// Ambil data user yang dipakai UI
const currentUserData = getUserData(profileData);

// ================= TOKEN HANDLER =================
const getToken = () => {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
};

// ================= NOTIFICATION POLLING =================



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Notification Fetcher
  const fetchNotifications = async () => {
  try {
    setLoadingNotifications(true);
    const token = getToken();

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    useEffect(() => {
  fetchNotifications();
  const interval = setInterval(fetchNotifications, 30000);
  return () => clearInterval(interval);
}, []);

    const response = await fetch(
      "https://service-desk-be-production.up.railway.app/api/notifications",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      const formattedNotifications = result.data.map((item, index) => {
        let type = "Status Tiket Diperbarui";
        let sender = "STATUS";

        if (item.status_ticket_pengguna === "Menunggu Diproses") {
          type = "Tiket Dibuat";
          sender = "TIKET";
        }

        const message =
          item.message ||
          `Status tiket ${item.ticket_code || "N/A"} diperbarui`;

        const createdAt = new Date(item.created_at);
        const now = new Date();
        const diffDays = Math.floor(
          Math.abs(now - createdAt) / (1000 * 60 * 60 * 24)
        );

        const timestamp =
          diffDays === 0
            ? createdAt.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : diffDays === 1
            ? "Kemarin"
            : `${diffDays} hari yang lalu`;

        return {
          id: item.notification_id || `notif-${index}`,
          type,
          title: type,
          ticketId: item.ticket_code || "N/A",
          ticket_id: item.ticket_id,
          status: item.status_ticket_pengguna || "telah dibuat",
          sender,
          timestamp,
          unread: !item.is_read,
          message,
          originalData: item,
          is_read: item.is_read || false,
        };
      });

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter((n) => n.unread).length);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    setNotifications([]);
    setUnreadCount(0);
  } finally {
    setLoadingNotifications(false);
  }
};

useEffect(() => {
  const userData = getUserData(profileData);

  if (userData) {
    console.log("Navbar user:", {
      name: userData.full_name,
      role: userData.role,
      email: userData.email,
    });
  } else {
    console.log("Navbar: no user data");
  }
}, [profileData]);





  const handleLogoutClick = () => {
    setShowLogoutWarning(true);
    setShowDropdown(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user_profile");
    setShowLogoutWarning(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutWarning(false);
  };

  const goToProfile = () => {
    // Ambil data dari berbagai sumber dengan fallback
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");

    // profileData bisa punya struktur berbeda:
    // 1. {status: 'success', user: {...}} - dari API response
    // 2. {role_id: 5, role: '...'} - data langsung
    let userData = profileData;

    // Jika profileData punya property 'user', ambil dari sana
    if (profileData?.user) {
      userData = profileData.user;
    }

    // Fallback ke localStorage jika profileData tidak ada
    if (!userData || Object.keys(userData).length === 0) {
      userData = localUser;
    }

    // Ambil role_id dan convert ke string (handle number & string)
    let roleId = String(userData.role_id || localUser.role_id || "");

    // Ambil role dari berbagai kemungkinan lokasi
    // BE structure: data.role.nama (object) → dimapping jadi data.role (string)
    // Extract string value first, then convert to lowercase
    let roleValue = userData.role || localUser.role || "";

    // If role is an object, extract the 'nama' property
    if (typeof roleValue === "object" && roleValue !== null) {
      roleValue = roleValue.nama || "";
    }

    // Now safely convert to lowercase
    let role = String(roleValue).toLowerCase();

    // Debug log untuk melihat data yang digunakan
    console.log("🔍 Debug goToProfile:");
    console.log("- profileData:", profileData);
    console.log("- userData hasil extract:", userData);
    console.log("- localUser dari localStorage:", localUser);
    console.log("- userData.role:", userData.role);
    console.log("- localUser.role:", localUser.role);
    console.log(
      "- roleId yang digunakan:",
      roleId,
      "(type:",
      typeof roleId,
      ")"
    );
    console.log("- role:", role);

    // Routing berdasarkan role_id (sudah diconvert ke string)
    // Backend mapping: 1=diskominfo(Kota), 2=opd(Pegawai), 3=verifikator, 4=auditor,
    // 5=admin dinas(Admin OPD), 6=teknisi, 7=bidang, 8=seksi, 9=masyarakat
    switch (roleId) {
      case "1": // diskominfo = Admin Kota
        console.log("✅ Navigating to /profilkota");
        navigate("/profilkota");
        break;
      case "2": // opd = Pegawai OPD
      case "3": // verifikator = diarahkan ke OPD
        console.log("✅ Navigating to /profilopd (OPD/Pegawai)");
        navigate("/profilopd");
        break;
      case "5": // admin dinas = Admin OPD
        console.log("✅ Navigating to /profilopd (Admin Dinas)");
        navigate("/profilopd");
        break;
      case "6": // teknisi
        console.log("✅ Navigating to /profilteknisi");
        navigate("/profilteknisi");
        break;
      case "7": // bidang
        console.log("✅ Navigating to /profilbidang");
        navigate("/profilbidang");
        break;
      case "8": // seksi
        console.log("✅ Navigating to /profilseksi");
        navigate("/profilseksi");
        break;
      case "9": // masyarakat (database terpisah)
        console.log("✅ Navigating to /profilmasyarakat");
        navigate("/profilmasyarakat");
        break;
      default:
        console.log("⚠️ Masuk ke default case, roleId:", roleId);
        // Fallback: coba detect dari role name
        if (role?.includes("masyarakat")) {
          console.log(
            "✅ Fallback: Navigating to /profilmasyarakat (via role)"
          );
          navigate("/profilmasyarakat");
        } else if (
          role?.includes("opd") ||
          role?.includes("dinas") ||
          role?.includes("verifikator") ||
          role?.includes("admin dinas")
        ) {
          console.log("✅ Fallback: Navigating to /profilopd (via role)");
          navigate("/profilopd");
        } else if (role?.includes("teknisi")) {
          console.log("✅ Fallback: Navigating to /profilteknisi (via role)");
          navigate("/profilteknisi");
        } else if (role?.includes("bidang")) {
          console.log("✅ Fallback: Navigating to /profilbidang (via role)");
          navigate("/profilbidang");
        } else if (role?.includes("seksi")) {
          console.log("✅ Fallback: Navigating to /profilseksi (via role)");
          navigate("/profilseksi");
        } else if (
          role?.includes("kota") ||
          role?.includes("admin kota") ||
          role?.includes("diskominfo")
        ) {
          console.log("✅ Fallback: Navigating to /profilkota (via role)");
          navigate("/profilkota");
        } else {
          // Ultimate fallback
          console.log("⚠️ Ultimate fallback: Navigating to /profilmasyarakat");
          console.log("⚠️ roleId:", roleId, "role:", role);
          navigate("/profilmasyarakat");
        }
        break;
    }
  };

  const goToTampilan = () => {
    navigate("/tampilanmasyarakat");
  };

  const toggleNotification = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowDropdown(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `https://service-desk-be-production.up.railway.app/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, unread: false } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, unread: false } : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/api/notifications/read-all",
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, unread: false }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, unread: false }))
      );
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (notification.unread) {
      await markAsRead(notification.id);
    }

    if (
      notification.type === "Tiket Dibuat" ||
      notification.type === "Status Tiket Diperbarui"
    ) {
      const ticketId =
        notification.ticket_id || notification.originalData?.ticket_id;

      if (ticketId) {
        navigate(`/ndiprosesmasyarakat/`, {
          state: {
            notificationId: notification.id,
            ticketId: ticketId,
            ticketCode: notification.ticketId,
            fromNotification: true,
            notificationType: notification.type,
          },
        });
      } else {
        if (notification.type === "Tiket Dibuat") {
          navigate("/ndibuatmasyarakat", {
            state: {
              notificationId: notification.id,
              fromNotification: true,
            },
          });
        } else {
          navigate("/ndiprosesmasyarakat", {
            state: {
              notificationId: notification.id,
              fromNotification: true,
            },
          });
        }
      }
    } else if (notification.type === "Pengumuman") {
      if (notification.sender === "MAINTENANCE") {
        navigate("/nmaintenancemasyarakat", {
          state: {
            notificationData: notification,
            fromNotification: true,
          },
        });
      } else if (notification.sender === "UMUM") {
        navigate("/numummasyarakat", {
          state: {
            notificationData: notification,
            fromNotification: true,
          },
        });
      } else if (notification.sender === "DARURAT") {
        navigate("/ndaruratmasyarakat", {
          state: {
            notificationData: notification,
            fromNotification: true,
          },
        });
      } else {
        navigate("/numummasyarakat", {
          state: {
            notificationData: notification,
            fromNotification: true,
          },
        });
      }
    }

    setShowNotificationDropdown(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-lg"></div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotification}
                className="relative p-2 text-gray-600 hover:text-[#226597]"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center translate-x-1/4 -translate-y-1/4">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotificationDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Notifikasi
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#226597] hover:text-[#1a5078] font-medium hover:underline"
                      >
                        Tandai semua sudah dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="px-4 py-6 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#226597] mx-auto"></div>
                        <p className="text-xs text-gray-500 mt-2">
                          Memuat notifikasi...
                        </p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-gray-500">
                          Tidak ada notifikasi
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notification.unread ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              {notification.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-gray-700 text-sm">
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex justify-between items-center">
                                <span
                                  className="text-xs font-medium text-white px-2 py-0.5 rounded"
                                  style={{
                                    backgroundColor: notification.color,
                                  }}
                                >
                                  {notification.sender}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {notification.timestamp}
                                </span>
                              </div>
                              {notification.ticketId &&
                                notification.ticketId !== "N/A" && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    Tiket: {notification.ticketId}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
onClick={() => setShowDropdown(!showDropdown)}
className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
>
  <div className="flex flex-col items-end text-right">
    <span className="text-sm font-medium text-gray-800 leading-tight">
      {currentUserData?.full_name || "Pengguna"}
    </span>
    <span className="text-xs text-gray-500 leading-tight">
      {currentUserData?.role === "masyarakat"
        ? "Publik"
        : currentUserData?.role || "User"}
    </span>
  </div>


<img
  src={currentUserData?.profile_url || "/assets/Lomon.png"}
  alt="Profile"
  className="h-10 w-10 rounded-full border-2 border-[#226597] object-cover"
  onError={(e) => {
    e.target.src = "/assets/Lomon.png";
  }}
/>

                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={goToProfile}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Profil Saya
                  </button>
                  <button
                    onClick={goToTampilan}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <SwatchIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Tampilan
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

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
                Anda perlu login kembali untuk mengakses aplikasi!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors"
                >
                  Ya, saya yakin!
                </button>
                <button
                  onClick={handleCancelLogout}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
