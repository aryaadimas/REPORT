import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOPD";
import {
  MoreVertical,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Trash2,
} from "lucide-react";

export default function KotakMasukOPD() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [readItems, setReadItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
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
          notificationData: item 
        } 
      });
    } else if (item.type === "Status Tiket Diperbarui") {
      navigate("/ndiprosesmasyarakat", { 
        state: { 
          notificationData: item 
        } 
      });
    } else if (item.type === "Pengumuman") {
      // Navigasi berdasarkan sender untuk pengumuman
      if (item.sender === "MAINTENANCE") {
        navigate("/nmaintenancemasyarakat", { 
          state: { 
            notificationData: item 
          } 
        });
      } else if (item.sender === "UMUM") {
        navigate("/numummasyarakat", { 
          state: { 
            notificationData: item 
          } 
        });
      } else if (item.sender === "DARURAT") {
        navigate("/ndaruratmasyarakat", { 
          state: { 
            notificationData: item 
          } 
        });
      } else {
        // Default untuk pengumuman lainnya
        navigate("/numummasyarakat", { 
          state: { 
            notificationData: item 
          } 
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
      setShowDeleteConfirm(true);
    }
    setShowDropdown(false);
  };

  const handleConfirmDelete = () => {
    // Hapus item yang dipilih
    const updatedItems = inboxItems.filter(item => !selectedItems.includes(item.id));
    setInboxItems(updatedItems);
    setSelectedItems([]);
    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleSuccessOk = () => {
    setShowDeleteSuccess(false);
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
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="px-4 md:px-6 py-4 md:py-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            {/* Navigation Tabs dan Action Buttons dalam satu baris */}
            <div className="flex justify-between items-center mb-6">
              {/* Tab Navigation dengan card putih */}
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
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons dengan card biru */}
              <div className="flex items-center space-x-2">
                {/* Button Hapus */}
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

                {/* Button Refresh */}
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

                {/* Button Titik Tiga dengan Dropdown */}
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

                  {/* Dropdown Menu */}
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

            {/* Inbox Items */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              {displayedItems.map((item, index) => {
                const isRead = isItemRead(item);
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
                      {/* Checkbox di sebelah kiri */}
                      <div onClick={(e) => e.stopPropagation()}>
                        {" "}
                        {/* Wrapper untuk mencegah propagation */}
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
                          {/* Indikator belum dibaca */}
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

            {/* Footer dengan Pagination */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              {/* Info Menampilkan Data */}
              <div className="text-sm text-gray-500">
                Menampilkan data 1 sampai{" "}
                {Math.min(itemsPerPage, filteredItems.length)} dari {totalData}{" "}
                data
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
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

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
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
                })}

                {/* Next Button */}
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
            </div>
          </div>
        </div>

        {/* Popup Konfirmasi Hapus */}
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
                  Data yang telah Anda hapus tidak dapat dipulihkan kembali
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

        {/* Popup Berhasil Dihapus */}
        {showDeleteSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
              <div className="text-center">
                {/* Logo Success */}
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
                  Data berhasil dihapus!
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
    </LayoutOpd>
  );
}