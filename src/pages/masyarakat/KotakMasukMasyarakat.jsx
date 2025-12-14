import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

export default function KotakMasukMasyarakat() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const dropdownRef = useRef(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const getToken = () => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTc4NzE3MX0.Ig-aV0ofrI7srjWX4RLTXZkB0i00PYVxEnGtyjwfsOU"
    );
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

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
          setTotalData(0);
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

          let message = item.message;

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

          return {
            id: item.notification_id || `notif-${index}`,
            type: type,
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
          };
        });

        setNotifications(formattedNotifications);
        setTotalData(result.count || formattedNotifications.length);
      } else {
        setNotifications([]);
        setTotalData(0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setTotalData(0);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotificationAPI = async (notificationId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `https://service-desk-be-production.up.railway.app/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  };

  const markNotificationAsReadAPI = async (notificationId) => {
    try {
      const token = getToken();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };

  const markAllNotificationsAsReadAPI = async () => {
    try {
      const token = getToken();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredItems = notifications.filter((item) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Tiket") return item.type === "Tiket Dibuat";
    if (activeTab === "Status") return item.type === "Status Tiket Diperbarui";
    if (activeTab === "Pengumuman") return item.type === "Pengumuman";
    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = filteredItems.slice(startIndex, endIndex);

  const getStatusText = (item) => {
    if (item.type === "Tiket Dibuat") {
      return `Tiket ${item.ticketId} ${item.status.toLowerCase()}.`;
    } else if (item.type === "Status Tiket Diperbarui") {
      return item.message || `Status tiket ${item.ticketId} telah diperbarui.`;
    } else {
      return item.message || "Pengumuman terbaru.";
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
    setShowDropdown(false);
    Swal.fire({
      icon: "success",
      title: "Memperbarui...",
      text: "Data sedang diperbarui",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const handleDeleteClick = () => {
    if (selectedItems.length > 0) {
      setShowDeleteConfirm(true);
    }
    setShowDropdown(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);

      for (const itemId of selectedItems) {
        const notification = notifications.find((notif) => notif.id === itemId);
        if (
          notification &&
          notification.originalData &&
          notification.originalData.notification_id
        ) {
          try {
            await deleteNotificationAPI(
              notification.originalData.notification_id
            );
          } catch (error) {
            console.error(
              `Failed to delete notification ${notification.originalData.notification_id}:`,
              error
            );
          }
        }
      }

      const updatedItems = notifications.filter(
        (item) => !selectedItems.includes(item.id)
      );
      setNotifications(updatedItems);
      setTotalData(updatedItems.length);
      setSelectedItems([]);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
    } catch (error) {
      console.error("Error deleting notifications:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus notifikasi. Silakan coba lagi.",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleSuccessOk = () => {
    setShowDeleteSuccess(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsLoading(true);

      await markAllNotificationsAsReadAPI();

      const updatedNotifications = notifications.map((item) => ({
        ...item,
        unread: false,
      }));

      setNotifications(updatedNotifications);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Semua notifikasi telah ditandai sebagai sudah dibaca",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menandai semua sebagai sudah dibaca",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }

    setShowDropdown(false);
  };

  const toggleSelectItem = (itemId, e) => {
    e.stopPropagation();
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemClick = async (item) => {
    if (item.unread) {
      try {
        await markNotificationAsReadAPI(
          item.originalData?.notification_id || item.id
        );

        const updatedNotifications = notifications.map((notif) =>
          notif.id === item.id ? { ...notif, unread: false } : notif
        );
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    if (item.type === "Tiket Dibuat") {
      navigate("/ndiprosesmasyarakat", {
        state: {
          notificationId: item.originalData?.notification_id || item.id,
        },
      });
    } else if (item.type === "Status Tiket Diperbarui") {
      navigate("/ndiprosesmasyarakat", {
        state: {
          notificationId: item.originalData?.notification_id || item.id,
        },
      });
    } else if (item.type === "Pengumuman") {
      if (item.sender === "MAINTENANCE") {
        navigate("/nmaintenancemasyarakat", {
          state: {
            notificationData: item,
          },
        });
      } else if (item.sender === "UMUM") {
        navigate("/numummasyarakat", {
          state: {
            notificationData: item,
          },
        });
      } else if (item.sender === "DARURAT") {
        navigate("/ndaruratmasyarakat", {
          state: {
            notificationData: item,
          },
        });
      } else {
        navigate("/numummasyarakat", {
          state: {
            notificationData: item,
          },
        });
      }
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 pt-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat notifikasi...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && notifications.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-50 pt-4">
        <div className="px-4 md:px-6 py-4 md:py-8 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {["Semua", "Tiket", "Status", "Pengumuman"].map((tab) => (
                  <div
                    key={tab}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-full h-full ${
                        activeTab === tab
                          ? "bg-[#226597] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setActiveTab(tab);
                        setCurrentPage(1);
                      }}
                    >
                      {tab}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                <div className="bg-[#226597] rounded-lg shadow-sm border border-[#226597] p-1">
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-transparent text-white hover:bg-white hover:text-[#226597] rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                    title="Refresh"
                  >
                    <RefreshCw size={18} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full p-8 text-center">
              <div className="mb-6"></div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Belum Ada Notifikasi
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/pelaporanmasyarakat")}
                  className="bg-[#0F2C59] text-white px-6 py-2 rounded-lg hover:bg-[#15397A] transition inline-flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Buat Laporan Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-4">
      <div className="px-4 md:px-6 py-4 md:py-8 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {["Semua", "Tiket", "Status", "Pengumuman"].map((tab) => (
                <div
                  key={tab}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-full h-full ${
                      activeTab === tab
                        ? "bg-[#226597] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                  >
                    {tab}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <div className="bg-[#226597] rounded-lg shadow-sm border border-[#226597] p-1">
                <button
                  onClick={handleDeleteClick}
                  disabled={selectedItems.length === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedItems.length > 0
                      ? "bg-transparent text-white hover:bg-white hover:text-[#226597]"
                      : "bg-transparent text-gray-300 cursor-not-allowed"
                  }`}
                  title="Hapus"
                >
                  <Trash2 size={18} />
                  <span>Hapus</span>
                </button>
              </div>

              <div className="bg-[#226597] rounded-lg shadow-sm border border-[#226597] p-1">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-transparent text-white hover:bg-white hover:text-[#226597] rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                  title="Refresh"
                >
                  <RefreshCw size={18} />
                  <span>Refresh</span>
                </button>
              </div>

              <div
                className="bg-[#226597] rounded-lg shadow-sm border border-[#226597] p-1 relative"
                ref={dropdownRef}
              >
                <button
                  onClick={toggleDropdown}
                  className="p-2 bg-transparent text-white hover:bg-white hover:text-[#226597] rounded-md transition-colors"
                >
                  <MoreVertical size={18} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 justify-start"
                    >
                      <CheckCircle size={16} className="text-[#226597]" />
                      <span className="text-left">
                        Tandai semua sudah dibaca
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full">
            {displayedItems.map((item, index) => {
              const isRead = !item.unread;
              return (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    index < displayedItems.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  } ${isRead ? "opacity-70" : "opacity-100"}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-start space-x-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => toggleSelectItem(item.id, e)}
                        className="w-4 h-4 text-[#226597] border-gray-300 rounded focus:ring-[#226597] mt-1 flex-shrink-0"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-sm font-medium ${
                            isRead ? "text-gray-500" : "text-gray-700"
                          }`}
                        >
                          {item.type}
                        </span>
                        <span
                          className={`text-xs ${
                            isRead ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {item.timestamp}
                        </span>
                      </div>
                      <p
                        className={`text-sm mb-2 ${
                          isRead ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {getStatusText(item)}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="inline-block bg-[#226597] text-white text-xs px-2 py-1 rounded font-medium">
                          {item.sender}
                        </span>

                        {!isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 w-full">
            <div className="text-sm text-gray-500">
              Menampilkan data {startIndex + 1} sampai{" "}
              {Math.min(endIndex, filteredItems.length)} dari{" "}
              {filteredItems.length} data
            </div>

            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded border ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded text-sm font-medium ${
                          currentPage === page
                            ? "bg-[#226597] text-white"
                            : "text-gray-600 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded border ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
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
                Apakah Anda yakin ingin menghapus?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {selectedItems.length} notifikasi akan dihapus. Data yang telah
                dihapus tidak dapat dipulihkan kembali.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors"
                >
                  Ya, saya yakin
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 90 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M44.6667 86.3333C56.1725 86.3333 66.5892 81.6696 74.1294 74.1294C81.6696 66.5892 86.3333 56.1725 86.3333 44.6667C86.3333 33.1608 81.6696 22.7442 74.1294 15.2039C66.5892 7.66371 56.1725 3 44.6667 3C33.1608 3 22.7442 7.66371 15.2039 15.2039C7.66371 22.7442 3 33.1608 3 44.6667C3 56.1725 7.66371 66.5892 15.2039 74.1294C22.7442 81.6696 33.1608 86.3333 44.6667 86.3333Z"
                    fill="white"
                    stroke="#27C840"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28 46.3333L39.6667 58L62 35.6667"
                    stroke="#27C840"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Notifikasi berhasil dihapus!
              </h3>

              <div className="flex justify-center">
                <button
                  onClick={handleSuccessOk}
                  className="px-6 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors mt-6"
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
