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

export default function KotakMasukKota() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [readItems, setReadItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const itemsPerPage = 10;
  const totalData = 13;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  // Data kotak masuk sesuai gambar dengan teks persis
  const [inboxItems, setInboxItems] = useState([
    {
      id: 1,
      type: "Tiket Dibuat",
      ticketId: "UY8723922",
      status: "telah dibuat",
      sender: "TIKET",
      timestamp: "12:30 PM",
      unread: true,
    },
    {
      id: 2,
      type: "Tiket Dibuat",
      ticketId: "UPR0202893",
      status: "telah dibuat",
      sender: "TIKET",
      timestamp: "11:45 AM",
      unread: true,
    },
    {
      id: 3,
      type: "Status Tiket Diperbarui",
      ticketId: "UY8723140",
      status: "sedang diproses",
      sender: "STATUS",
      timestamp: "10:15 AM",
      unread: true,
    },
    {
      id: 4,
      type: "Tiket Dibuat",
      ticketId: "UYN8567223",
      status: "telah dibuat",
      sender: "TIKET",
      timestamp: "09:30 AM",
      unread: false,
    },
    {
      id: 5,
      type: "Tiket Dibuat",
      ticketId: "UYN8589223",
      status: "telah dibuat",
      sender: "TIKET",
      timestamp: "08:45 AM",
      unread: false,
    },
    {
      id: 6,
      type: "Status Tiket Diperbarui",
      ticketId: "UY8723100",
      status: "sedang diproses",
      sender: "STATUS",
      timestamp: "Yesterday",
      unread: false,
    },
    {
      id: 7,
      type: "Pengumuman",
      message: "Kutamaan, dilakukan pemeliharaan sistem.",
      sender: "MAINTENANCE",
      timestamp: "Yesterday",
      unread: false,
    },
    {
      id: 8,
      type: "Pengumuman",
      message: "Kutamaan, dilakukan pemeliharaan sistem.",
      sender: "UMUM",
      timestamp: "Yesterday",
      unread: false,
    },
    {
      id: 9,
      type: "Pengumuman",
      message: "Harap melakukan update kir-727.",
      sender: "UMUM",
      timestamp: "2 days ago",
      unread: false,
    },
    {
      id: 10,
      type: "Pengumuman",
      message: "Pengingat, deadline registrasi.",
      sender: "DARURAT",
      timestamp: "3 days ago",
      unread: false,
    },
  ]);

  // Fungsi untuk handle klik item dan navigasi
  const handleItemClick = (item) => {
    // Tandai sebagai sudah dibaca
    handleMarkAsRead(item.id);

    // Navigasi berdasarkan jenis item dan sender
    if (item.type === "Tiket Dibuat") {
      navigate("/ndibuatmasyarakat", {
        state: {
          notificationData: item,
        },
      });
    } else if (item.type === "Status Tiket Diperbarui") {
      navigate("/ndiprosesmasyarakat", {
        state: {
          notificationData: item,
        },
      });
    } else if (item.type === "Pengumuman") {
      // Navigasi berdasarkan sender untuk pengumuman
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
        // Default untuk pengumuman lainnya
        navigate("/numummasyarakat", {
          state: {
            notificationData: item,
          },
        });
      }
    }
  };

  // Close dropdown when clicking outside
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

  const filteredItems =
    activeTab === "Semua"
      ? inboxItems
      : inboxItems.filter((item) => {
          if (activeTab === "Tiket") return item.type.includes("Tiket");
          if (activeTab === "Status") return item.type.includes("Status");
          if (activeTab === "Pengumuman") return item.type === "Pengumuman";
          return true;
        });

  const displayedItems = filteredItems.slice(0, itemsPerPage);

  const getStatusText = (item) => {
    if (item.type === "Tiket Dibuat") {
      return `Tiket Anci: ${item.ticketId} ${item.status}.`;
    } else if (item.type === "Status Tiket Diperbarui") {
      return `Tiket Anci: ${item.ticketId} ${item.status}.`;
    } else {
      return item.message;
    }
  };

  const handleRefresh = () => {
    // Logic untuk refresh data
    console.log("Refresh data");
    setShowDropdown(false);
  };

  const handleDeleteClick = () => {
    if (selectedItems.length > 0) {
      Swal.fire({
        title: "Apakah Anda yakin ingin menghapus?",
        text: "Data yang telah Anda hapus tidak dapat dipulihkan kembali",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#226597",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, saya yakin",
        cancelButtonText: "Batalkan",
        customClass: {
          popup: "rounded-xl",
          title: "text-lg font-semibold text-gray-900",
          confirmButton: "rounded-md",
          cancelButton: "rounded-md",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Hapus item yang dipilih
          const updatedItems = inboxItems.filter(
            (item) => !selectedItems.includes(item.id)
          );
          setInboxItems(updatedItems);
          setSelectedItems([]);

          Swal.fire({
            title: "Data berhasil dihapus!",
            icon: "success",
            confirmButtonColor: "#226597",
            confirmButtonText: "Oke",
            customClass: {
              popup: "rounded-xl",
              confirmButton: "rounded-md",
            },
          });
        }
      });
    }
    setShowDropdown(false);
  };

  const handleMarkAsRead = (itemId) => {
    if (!readItems.includes(itemId)) {
      setReadItems([...readItems, itemId]);
    }
  };

  const handleMarkAllAsRead = () => {
    const allItemIds = inboxItems.map((item) => item.id);
    setReadItems(allItemIds);
    setShowDropdown(false);
  };

  const toggleSelectItem = (itemId, e) => {
    e.stopPropagation(); // Mencegah event propagation
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

  const isItemRead = (item) => {
    return readItems.includes(item.id) || !item.unread;
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {/* Main Container dengan gaya seperti versi Kota */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
            {/* Wave background - sama seperti LihatRatingKota */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

            {/* Tab Navigation dengan tombol aksi */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                {/* Tabs - styling rounded-lg seperti versi Kota */}
                <div className="flex flex-wrap gap-2">
                  {["Semua", "Tiket", "Status", "Pengumuman"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? "bg-[#226597] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {/* Hapus Button */}
                  <button
                    onClick={handleDeleteClick}
                    disabled={selectedItems.length === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                      selectedItems.length > 0
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 size={18} />
                    Hapus
                  </button>

                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-[#226597] text-white rounded-lg text-sm font-medium hover:bg-[#1a5078] transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Refresh
                  </button>

                  {/* More Options */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className="p-2 bg-[#226597] text-white rounded-lg hover:bg-[#1a5078] transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={handleMarkAllAsRead}
                          className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 justify-start rounded-t-lg"
                        >
                          <CheckCircle size={16} className="text-[#226597]" />
                          <span>Tandai semua sudah dibaca</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inbox Items List dengan styling rounded-xl */}
              <div className="space-y-3">
                {displayedItems.map((item) => {
                  const isRead = isItemRead(item);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border border-gray-200 hover:border-[#226597] hover:shadow-sm cursor-pointer transition-all ${
                        isRead ? "bg-gray-50 opacity-80" : "bg-white"
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => toggleSelectItem(item.id, e)}
                            className="w-5 h-5 text-[#226597] border-gray-300 rounded focus:ring-[#226597] mt-1"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <span
                                className={`font-semibold ${
                                  isRead ? "text-gray-500" : "text-gray-900"
                                }`}
                              >
                                {item.type}
                              </span>
                              {!isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                isRead ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {item.timestamp}
                            </span>
                          </div>

                          <p
                            className={`text-sm mb-3 ${
                              isRead ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {getStatusText(item)}
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="inline-block bg-[#226597] text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                              {item.sender}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination dan Info dengan border-top seperti LihatRatingKota */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Info Data */}
                <div className="text-sm text-gray-500">
                  Menampilkan data 1 sampai{" "}
                  {Math.min(itemsPerPage, filteredItems.length)} dari{" "}
                  {totalData} data
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? "bg-[#226597] text-white"
                            : "text-gray-600 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${
                      currentPage === totalPages
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
