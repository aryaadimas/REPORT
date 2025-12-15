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

  // ================= USER DATA HANDLER =================
  const getUserData = () => {
    // Coba ambil dari props pertama
    if (profileData) {
      // Handle berbagai bentuk response backend
      let actualData = profileData;
      if (profileData.user) {
        actualData = profileData.user;
      } else if (profileData.data) {
        actualData = profileData.data;
      }

      if (actualData && (actualData.full_name || actualData.name)) {
        console.log("✅ User data from props:", actualData);
        return {
          full_name: actualData.full_name || actualData.name || "Pengguna",
          role: actualData.role?.nama || actualData.role || "User",
          // Hanya gunakan profile_url jika ada dan valid
          profile_url: actualData.profile_url || actualData.avatar || null,
          email: actualData.email,
          role_id: actualData.role_id,
        };
      }
    }

    // Fallback ke localStorage
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (localUser && Object.keys(localUser).length > 0) {
      console.log("✅ User data from localStorage:", localUser);
      return {
        full_name: localUser.name || localUser.full_name || "Pengguna",
        role: localUser.role?.nama || localUser.role || "User",
        // Hanya gunakan avatar jika ada dan valid
        profile_url: localUser.avatar || null,
        email: localUser.email,
        role_id: localUser.role_id,
      };
    }

    console.log("❌ No user data found");
    return null;
  };

  // Ambil data user yang dipakai UI
  const currentUserData = getUserData();

  // ================= TOKEN HANDLER =================
  const getToken = () => {
    // Cari token di localStorage
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token");

    console.log("🔍 Token check:", token ? "Token found" : "No token");

    return token;
  };

  // ================= NOTIFICATION HANDLER =================
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const token = getToken();

      if (!token) {
        console.warn("No token found for notifications");
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

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
        if (response.status === 401) {
          console.warn("Token expired or invalid");
          // Clear invalid token
          localStorage.removeItem("access_token");
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
        }
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        const formattedNotifications = result.data.map((item, index) => {
          let type = "Status Tiket Diperbarui";
          let sender = "STATUS";
          let color = "#3B82F6"; // blue

          if (item.status_ticket_pengguna === "Menunggu Diproses") {
            type = "Tiket Dibuat";
            sender = "TIKET";
            color = "#10B981"; // green
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
            color,
          };
        });

        setNotifications(formattedNotifications);
        const unread = formattedNotifications.filter((n) => n.unread).length;
        setUnreadCount(unread);
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

  // ================= USE EFFECTS =================
  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications();

    // Set up polling interval (30 seconds)
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

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

  // ================= EVENT HANDLERS =================
  const handleLogoutClick = () => {
    setShowLogoutWarning(true);
    setShowDropdown(false);
  };

  const handleConfirmLogout = () => {
    // Clear all auth related data
    const authKeys = [
      "access_token",
      "token",
      "auth_token",
      "bearer_token",
      "user",
      "user_profile",
      "profile",
    ];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    setShowLogoutWarning(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutWarning(false);
  };

  const goToProfile = () => {
    console.log("🚀 goToProfile clicked");

    // Ambil data dari localStorage sebagai primary source
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Local user data:", localUser);

    // Jika ada role_id di localStorage, langsung navigasi
    if (localUser && localUser.role_id) {
      console.log("✅ Using role_id from localStorage:", localUser.role_id);

      switch (String(localUser.role_id)) {
        case "1":
          navigate("/profilkota");
          break;
        case "2":
        case "3":
        case "5":
          navigate("/profilopd");
          break;
        case "6":
          navigate("/profilteknisi");
          break;
        case "7":
          navigate("/profilbidang");
          break;
        case "8":
          navigate("/profilseksi");
          break;
        case "9":
        default:
          navigate("/profilmasyarakat");
          break;
      }
      return;
    }

    // Jika tidak ada data di localStorage, coba dari props
    if (profileData) {
      console.log("ℹ️ Using profileData from props");

      // Extract role_id dari profileData
      let roleId = "";
      if (profileData.role_id) {
        roleId = String(profileData.role_id);
      } else if (profileData.user?.role_id) {
        roleId = String(profileData.user.role_id);
      } else if (profileData.data?.role_id) {
        roleId = String(profileData.data.role_id);
      }

      if (roleId) {
        console.log("✅ Found role_id from props:", roleId);

        // Simpan ke localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: profileData.full_name || profileData.name || "Pengguna",
            role_id: roleId,
            role: profileData.role || "User",
          })
        );

        // Navigasi berdasarkan role_id
        switch (roleId) {
          case "1":
            navigate("/profilkota");
            break;
          case "2":
          case "3":
          case "5":
            navigate("/profilopd");
            break;
          case "6":
            navigate("/profilteknisi");
            break;
          case "7":
            navigate("/profilbidang");
            break;
          case "8":
            navigate("/profilseksi");
            break;
          case "9":
          default:
            navigate("/profilmasyarakat");
            break;
        }
        return;
      }
    }

    // Fallback: default ke profil masyarakat
    console.log("⚠️ No user data found, defaulting to profilmasyarakat");
    navigate("/profilmasyarakat");
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
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, unread: false } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
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

    setShowNotificationDropdown(false);

    try {
      const token = getToken();
      const ticketId = notification.ticket_id;

      if (!ticketId) {
        if (notification.type === "Tiket Dibuat") {
          navigate("/ndibuatmasyarakat");
        } else {
          navigate("/ndiprosesmasyarakat");
        }
        return;
      }

      // Coba fetch detail tiket
      const response = await fetch(
        `https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/${ticketId}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ticket: ${response.status}`);
      }

      const ticketData = await response.json();
      const status = ticketData.status_ticket_pengguna || ticketData.status;

      if (status === "rejected" || status === "Ditolak") {
        navigate(`/tiketditolakmasyarakat`, {
          state: {
            ticket_id: ticketId,
            ticket_code: notification.ticketId,
            status: "rejected",
          },
        });
      } else if (status === "selesai" || status === "Selesai") {
        navigate(`/lihatriwayatmasyarakat`, {
          state: {
            ticket_id: ticketId,
            ticket_code: notification.ticketId,
            status: "selesai",
          },
        });
      } else {
        navigate(`/ndiprosesmasyarakat`, {
          state: {
            ticket_id: ticketId,
            ticket_code: notification.ticketId,
            status: status || "Dalam Proses",
          },
        });
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
      // Fallback navigation
      navigate(`/ndiprosesmasyarakat`);
    }
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
                className="relative p-2 text-gray-600 hover:text-[#226597] rounded-full hover:bg-gray-100 transition-colors"
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

                {/* Foto Profil dengan Placeholder */}
                <div className="h-10 w-10 rounded-full border-2 border-[#226597] bg-gray-200 flex items-center justify-center overflow-hidden">
                  {currentUserData?.profile_url ? (
                    <img
                      src={currentUserData.profile_url}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Jika gambar error, tampilkan icon user
                        e.target.style.display = "none";
                        const parent = e.target.parentElement;
                        const userIcon = document.createElement("div");
                        userIcon.className =
                          "h-full w-full flex items-center justify-center";
                        userIcon.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 text-gray-500"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" /></svg>';
                        parent.appendChild(userIcon);
                      }}
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  )}
                </div>

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
