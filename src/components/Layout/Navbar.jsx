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

  const getToken = () => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTc4NzE3MX0.Ig-aV0ofrI7srjWX4RLTXZkB0i00PYVxEnGtyjwfsOU"
    );
  };

  useEffect(() => {
    fetchNotifications();
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

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const token = getToken();

      if (!token) {
        setNotifications([]);
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
        if (response.status === 404) {
          setNotifications([]);
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

          let message =
            item.message ||
            `Status tiket ${item.ticket_code || "N/A"} diperbarui`;

          const createdAt = new Date(item.created_at);
          const now = new Date();
          const diffTime = Math.abs(now - createdAt);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          let timestamp;
          if (diffDays === 0) {
            timestamp = createdAt.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          } else if (diffDays === 1) {
            timestamp = "Kemarin";
          } else {
            timestamp = `${diffDays} hari yang lalu`;
          }

          const getIcon = (type) => {
            if (type === "Tiket Dibuat") {
              return (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="57" height="57" rx="8" fill="#113F67" />
                  <path d="M32.5 17.5H24.5V21.5H32.5V17.5Z" fill="white" />
                  <path
                    d="M19.5 19.5H22.5V23.5H34.5V19.5H37.5V39.5H19.5V19.5ZM31.5 29.5V27.5H25.5V29.5H31.5ZM31.5 33.5V31.5H25.5V33.5H31.5Z"
                    fill="white"
                  />
                </svg>
              );
            } else if (type === "Status Tiket Diperbarui") {
              return (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="57" height="57" rx="8" fill="#113F67" />
                  <path d="M32.5 17.5H24.5V21.5H32.5V17.5Z" fill="white" />
                  <path
                    d="M19.5 19.5H22.5V23.5H34.5V19.5H37.5V28.174C36.0037 27.4634 34.3039 27.3065 32.7028 27.731C31.1017 28.1556 29.7031 29.1342 28.7555 30.4929C27.808 31.8515 27.3729 33.5022 27.5277 35.1514C27.6825 36.8006 28.4172 38.3414 29.601 39.5H19.5V19.5Z"
                    fill="white"
                  />
                  <path
                    d="M29 34.5C29 33.7777 29.1423 33.0625 29.4187 32.3952C29.6951 31.728 30.1002 31.1216 30.6109 30.6109C31.1216 30.1002 31.728 29.6951 32.3952 29.4187C33.0625 29.1423 33.7777 29 34.5 29C35.2223 29 35.9375 29.1423 36.6048 29.4187C37.272 29.6951 37.8784 30.1002 38.3891 30.6109C38.8998 31.1216 39.3049 31.728 39.5813 32.3952C39.8577 33.0625 40 33.7777 40 34.5C40 35.9587 39.4205 37.3576 38.3891 38.3891C37.3576 39.4205 35.9587 40 34.5 40C33.0413 40 31.6424 39.4205 30.6109 38.3891C29.5795 37.3576 29 35.9587 29 34.5ZM36.914 35.5L35.5 34.086V32.252H33.5V34.914L35.5 36.914L36.914 35.5Z"
                    fill="white"
                  />
                </svg>
              );
            } else {
              return (
                <svg
                  width="24"
                  height="24"
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
              );
            }
          };

          return {
            id: item.notification_id || `notif-${index}`,
            type: type,
            title: type,
            ticketId: item.ticket_code || "N/A",
            ticket_id: item.ticket_id,
            status: item.status_ticket_pengguna || "telah dibuat",
            sender: sender,
            timestamp: timestamp,
            unread: !item.is_read,
            message: message,
            nama_dinas: item.nama_dinas,
            request_type: item.request_type,
            originalData: item,
            icon: getIcon(type),
            color: "#226597",
            is_read: item.is_read || false,
          };
        });

        setNotifications(formattedNotifications);
        const unread = formattedNotifications.filter(
          (notif) => notif.unread
        ).length;
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
                    {profileData?.full_name || "Pengguna"}
                  </span>
                  <span className="text-xs text-gray-500 leading-tight">
                    {profileData?.role_name === "masyarakat"
                      ? "Publik"
                      : profileData?.role_name || "User"}
                  </span>
                </div>

                <div className="relative h-10 w-10 flex-shrink-0">
                  {profileData?.profile_url ? (
                    <img
                      src={profileData.profile_url}
                      alt="Profile"
                      className="h-full w-full rounded-full border-2 border-[#226597] object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="h-full w-full rounded-full border-2 border-[#226597] bg-gray-100 flex items-center justify-center">
                            <svg class="h-6 w-6 text-[#0F2C59]" fill="currentColor" viewBox="0 0 24 24">
                              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="h-full w-full rounded-full border-2 border-[#226597] bg-gray-100 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-[#0F2C59]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
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
