import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import {
  MoreVertical,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

export default function KotakMasuk() {
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

  const API_BASE_URL = "https://service-desk-be-production.up.railway.app";

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjUzOTM5MzAsImV4cCI6MTc2NTk5ODczMCwibmJmIjoxNzY1MzkzOTMwLCJqdGkiOiJGSW15YU1XZ1Zkck5aTkVPIiwic3ViIjoiNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KSswG95y_yvfNmpH5hLBNXnuVfiaycCD4YN5JMRYQy8"
    );
  };

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      console.log(
        "🔍 [KOTAK MASUK] Fetching tickets with token:",
        token.substring(0, 30) + "..."
      );

      const response = await fetch(
        `${API_BASE_URL}/api/tickets/pegawai/finished`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📡 [KOTAK MASUK] Response status:", response.status);

      if (!response.ok) {
        console.error(
          `❌ [KOTAK MASUK] Error ${response.status}:`,
          await response.text()
        );

        try {
          console.log("🔍 [KOTAK MASUK] Coba endpoint alternatif /api/tickets");
          const altResponse = await fetch(`${API_BASE_URL}/api/tickets`, {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (altResponse.ok) {
            const result = await altResponse.json();
            processTicketData(result);
          } else {
            throw new Error(`Alt endpoint failed: ${altResponse.status}`);
          }
        } catch (altError) {
          console.log(
            "⚠️ [KOTAK MASUK] Semua endpoint gagal, menggunakan data dummy"
          );
          setNotifications(getFallbackData());
          setTotalData(getFallbackData().length);
        }
        return;
      }

      const result = await response.json();
      console.log("📦 [KOTAK MASUK] API Response:", result);
      processTicketData(result);
    } catch (error) {
      console.error("❌ [KOTAK MASUK] Error fetching tickets:", error);
      console.log("🛠️ [KOTAK MASUK] Menggunakan data dummy untuk testing");
      setNotifications(getFallbackData());
      setTotalData(getFallbackData().length);
    } finally {
      setIsLoading(false);
    }
  };

  const processTicketData = (result) => {
    console.log("📦 [KOTAK MASUK] Processing ticket data:", result);

    if (result.data && Array.isArray(result.data)) {
      const formattedNotifications = result.data.map((ticket, index) => {
        let type = "Status Tiket Diperbarui";
        let sender = "STATUS";
        let message = "";
        let status = "";
        let unread = false;

        if (
          ticket.status === "selesai" ||
          ticket.status_ticket_pengguna === "Selesai"
        ) {
          type = "Tiket Selesai";
          sender = "TIKET";
          status = "selesai";
          message = `Tiket ${
            ticket.ticket_code || ticket.ticket_id
          } telah selesai.`;
          unread = true;
        } else if (
          ticket.status === "rejected" ||
          ticket.status_ticket_pengguna === "Tiket Ditolak"
        ) {
          type = "Tiket Ditolak";
          sender = "TIKET";
          status = "ditolak";
          message = `Tiket ${ticket.ticket_code || ticket.ticket_id} ditolak: ${
            ticket.rejection_reason_seksi || "tidak ada alasan"
          }`;
          unread = true;
        } else if (ticket.status === "sedang diproses") {
          type = "Status Tiket Diperbarui";
          sender = "STATUS";
          status = "diproses";
          message = `Tiket ${
            ticket.ticket_code || ticket.ticket_id
          } sedang diproses.`;
          unread = true;
        } else if (ticket.status_ticket_teknisi === "selesai") {
          type = "Tiket Diselesaikan Teknisi";
          sender = "TEKNISI";
          status = "selesai teknisi";
          message = `Teknisi telah menyelesaikan tiket ${
            ticket.ticket_code || ticket.ticket_id
          }.`;
          unread = true;
        }

        let timestamp = "Just now";
        if (ticket.created_at) {
          const createdAt = new Date(ticket.created_at);
          const now = new Date();
          const diffTime = Math.abs(now - createdAt);
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            if (diffHours === 0) {
              timestamp = `${diffMinutes} menit yang lalu`;
            } else {
              timestamp =
                createdAt.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }) + (createdAt.getHours() >= 12 ? " PM" : " AM");
            }
          } else if (diffDays === 1) {
            timestamp = "Kemarin";
          } else if (diffDays < 7) {
            timestamp = `${diffDays} hari yang lalu`;
          } else {
            timestamp = createdAt.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
            });
          }
        }

        let ratingInfo = null;
        if (ticket.rating) {
          ratingInfo = {
            rating: ticket.rating.rating,
            comment: ticket.rating.comment,
            createdAt: ticket.rating.created_at,
          };
        }

        return {
          id: ticket.ticket_id || `ticket-${index}`,
          type: type,
          ticketId: ticket.ticket_code || ticket.ticket_id || "N/A",
          ticket_code: ticket.ticket_code,
          title: ticket.title || "Tidak ada judul",
          description: ticket.description || "Tidak ada deskripsi",
          priority: ticket.priority || "Normal",
          status: status,
          sender: sender,
          timestamp: timestamp,
          unread: unread,
          message: message,
          status_ticket_pengguna: ticket.status_ticket_pengguna,
          status_ticket_seksi: ticket.status_ticket_seksi,
          status_ticket_teknisi: ticket.status_ticket_teknisi,
          pengerjaan_awal: ticket.pengerjaan_awal,
          pengerjaan_akhir: ticket.pengerjaan_akhir,
          rejection_reason_seksi: ticket.rejection_reason_seksi,
          rating: ratingInfo,
          originalData: ticket,
        };
      });

      setNotifications(formattedNotifications);
      setTotalData(result.total || formattedNotifications.length);
      console.log(
        `✅ [KOTAK MASUK] Loaded ${formattedNotifications.length} tickets`
      );
    } else {
      console.log(
        "⚠️ [KOTAK MASUK] Format data tidak sesuai, menggunakan data dummy"
      );
      setNotifications(getFallbackData());
      setTotalData(getFallbackData().length);
    }
  };

  const getFallbackData = () => {
    return [
      {
        id: "8b0239ae-5ac7-4891-ab91-732ea79f1c0c",
        type: "Tiket Selesai",
        ticketId: "SVD-PO-0055-PG",
        ticket_code: "SVD-PO-0055-PG",
        title: "Permintaan perbaikan sistem",
        description: "Sistem lambat saat load data",
        priority: "Low",
        status: "selesai",
        sender: "TIKET",
        timestamp: "2 hari yang lalu",
        unread: true,
        message: "Tiket SVD-PO-0055-PG telah selesai.",
        status_ticket_pengguna: "Selesai",
        status_ticket_seksi: "normal",
        status_ticket_teknisi: "selesai",
        rating: {
          rating: 4,
          comment: "masalah terselesaikan dengan cukup baik dan cepat",
        },
      },
      {
        id: "2b2d89e3-bc3a-4e49-ba23-0d4103e2dd1e",
        type: "Tiket Selesai",
        ticketId: "SVD-PO-0054-PG",
        ticket_code: "SVD-PO-0054-PG",
        title: "Permintaan fitur baru",
        description: "Tambah fitur export PDF",
        priority: "Low",
        status: "selesai",
        sender: "TIKET",
        timestamp: "3 hari yang lalu",
        unread: true,
        message: "Tiket SVD-PO-0054-PG telah selesai.",
        status_ticket_pengguna: "Selesai",
        status_ticket_seksi: "normal",
        status_ticket_teknisi: "selesai",
        rating: {
          rating: 4,
          comment: "penyelesaian nya cukup bagus dan cepat",
        },
      },
      {
        id: "3a0572e7-f934-4ca9-9031-1c1fdfbff2b9",
        type: "Tiket Ditolak",
        ticketId: "SVD-PO-0040-PG",
        ticket_code: "SVD-PO-0040-PG",
        title: "Permintaan data",
        description: "Data tidak lengkap",
        priority: null,
        status: "ditolak",
        sender: "TIKET",
        timestamp: "5 hari yang lalu",
        unread: true,
        message: "Tiket SVD-PO-0040-PG ditolak: jelek lu",
        status_ticket_pengguna: "Tiket Ditolak",
        status_ticket_seksi: "rejected",
        status_ticket_teknisi: null,
        rejection_reason_seksi: "jelek lu",
      },
    ];
  };

  const deleteTicketAPI = async (ticketId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("❌ [KOTAK MASUK] Error deleting ticket:", error);
      throw error;
    }
  };

  const markTicketAsReadAPI = async (ticketId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}/read`,
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
      console.error("❌ [KOTAK MASUK] Error marking ticket as read:", error);
      throw error;
    }
  };

  const markAllTicketsAsReadAPI = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/tickets/read-all`, {
        method: "PATCH",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(
        "❌ [KOTAK MASUK] Error marking all tickets as read:",
        error
      );
      throw error;
    }
  };

  useEffect(() => {
    fetchTickets();
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
    if (activeTab === "Tiket") return item.type.includes("Tiket");
    if (activeTab === "Status") return item.type.includes("Status");
    if (activeTab === "Pengumuman") return item.type === "Pengumuman";
    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = filteredItems.slice(startIndex, endIndex);

  const getStatusText = (item) => {
    if (item.type === "Tiket Selesai") {
      return `Tiket ${item.ticketId} telah ${item.status}.`;
    } else if (item.type === "Tiket Ditolak") {
      return `Tiket ${item.ticketId} ditolak.`;
    } else if (item.type === "Status Tiket Diperbarui") {
      return `Status tiket ${item.ticketId} ${item.status}.`;
    } else if (item.type === "Tiket Diselesaikan Teknisi") {
      return `Teknisi telah menyelesaikan tiket ${item.ticketId}.`;
    } else {
      return item.message || "Tidak ada pesan.";
    }
  };

  const handleRefresh = () => {
    fetchTickets();
    setShowDropdown(false);
    Swal.fire({
      icon: "success",
      title: "Memperbarui...",
      text: "Data tiket sedang diperbarui",
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
        const ticket = notifications.find((ticket) => ticket.id === itemId);
        if (ticket && ticket.id) {
          try {
            await deleteTicketAPI(ticket.id);
            console.log(`✅ [KOTAK MASUK] Deleted ticket: ${ticket.id}`);
          } catch (error) {
            console.error(`⚠️ [KOTAK MASUK] Failed to delete from API:`, error);
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

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `${selectedItems.length} tiket berhasil dihapus`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("❌ [KOTAK MASUK] Error deleting tickets:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus tiket. Silakan coba lagi.",
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

      try {
        await markAllTicketsAsReadAPI();
        console.log("✅ [KOTAK MASUK] Marked all as read in API");
      } catch (apiError) {
        console.log(
          "⚠️ [KOTAK MASUK] API mark all as read failed, continuing locally"
        );
      }

      const updatedNotifications = notifications.map((item) => ({
        ...item,
        unread: false,
      }));

      setNotifications(updatedNotifications);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Semua tiket telah ditandai sebagai sudah dibaca",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("❌ [KOTAK MASUK] Error marking all as read:", error);
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
        await markTicketAsReadAPI(item.id);

        const updatedNotifications = notifications.map((ticket) =>
          ticket.id === item.id ? { ...ticket, unread: false } : ticket
        );
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("❌ [KOTAK MASUK] Error marking as read:", error);

        const updatedNotifications = notifications.map((ticket) =>
          ticket.id === item.id ? { ...ticket, unread: false } : ticket
        );
        setNotifications(updatedNotifications);
      }
    }

    if (item.type === "Tiket Selesai") {
      navigate("/tiket-selesai", {
        state: {
          ticketData: item,
        },
      });
    } else if (item.type === "Tiket Ditolak") {
      navigate("/tiket-ditolak", {
        state: {
          ticketData: item,
        },
      });
    } else if (item.type === "Status Tiket Diperbarui") {
      navigate("/tiket-diproses", {
        state: {
          ticketData: item,
        },
      });
    } else if (item.type === "Tiket Diselesaikan Teknisi") {
      navigate("/tiket-selesai-teknisi", {
        state: {
          ticketData: item,
        },
      });
    } else {
      navigate("/tiket-detail", {
        state: {
          ticketData: item,
        },
      });
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (isLoading) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 pt-4">
          <div className="px-4 md:px-6 py-4 md:py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mb-4"></div>
                <p className="text-gray-600">Memuat tiket...</p>
              </div>
            </div>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  if (!isLoading && notifications.length === 0) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 pt-4">
          <div className="px-4 md:px-6 py-4 md:py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
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

                <div className="flex items-center space-x-2">
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

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Belum Ada Tiket
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Tidak ada tiket yang perlu ditampilkan saat ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  return (
    <LayoutPegawai>
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="px-4 md:px-6 py-4 md:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
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

              <div className="flex items-center space-x-2">
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

            <div className="bg-white rounded-lg shadow-md border border-gray-200">
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

                        <div className="mt-2 flex items-center space-x-2">
                          {item.priority && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                item.priority === "High"
                                  ? "bg-red-100 text-red-800"
                                  : item.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.priority}
                            </span>
                          )}
                          {item.rating && (
                            <span className="text-xs text-yellow-600">
                              ⭐ {item.rating.rating}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
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
                  {selectedItems.length} tiket akan dihapus. Data yang telah
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
                  Tiket berhasil dihapus!
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
    </LayoutPegawai>
  );
}
