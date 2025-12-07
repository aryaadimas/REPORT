import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOPD";

const RatingKepuasanOPD = () => {
  const [activeTab, setActiveTab] = useState("pelaporan");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDataAset, setFilterDataAset] = useState("");
  const [filterNoSeri, setFilterNoSeri] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const navigate = useNavigate();

  const dummyData = [
    {
      name: "Haikal Saputra",
      dataAset: "Laptop Lenovo ThinkPad X230",
      date: "18/09/2024",
      completionDate: "20/09/2024",
      avatar: "/assets/Haechan.jpg",
      nomorSeri: "LNV-TP-X230-001",
      rating: 4,
    },
    {
      name: "Rio Widoro",
      dataAset: "PC Dell OptiPlex 3020",
      date: "18/09/2024",
      completionDate: "19/09/2024",
      avatar: "/assets/Rio.jpeg",
      nomorSeri: "DELL-OP-3020-001",
      rating: 5,
    },
    {
      name: "Lia Yustia",
      dataAset: "Laptop HP EliteBook 840",
      date: "17/09/2024",
      completionDate: "22/09/2024",
      avatar: "/assets/Lia.jpg",
      nomorSeri: "HP-EB-840-001",
      rating: 3,
    },
    {
      name: "Ridwan Yusuf",
      dataAset: "Printer HP LaserJet Pro P1102w",
      date: "17/09/2024",
      completionDate: "18/09/2024",
      avatar: "/assets/Jaemin.jpg",
      nomorSeri: "HP-LJ-P1102W-001",
      rating: 4,
    },
    {
      name: "Ella Meisya",
      dataAset: "PC Dell OptiPlex 3020",
      date: "17/09/2024",
      completionDate: "20/09/2024",
      avatar: "/assets/Ella.jpg",
      nomorSeri: "DELL-OP-3020-002",
      rating: 5,
    },
  ];

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        const response = await fetch(
          "https://service-desk-be-production.up.railway.app/api/admin-opd/ratings",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.detail && data.detail.includes("admin OPD")) {
            setError("Hanya admin OPD yang dapat mengakses data rating");
            setTableData(dummyData);
            return;
          }
          throw new Error(data.detail || "Gagal mengambil data rating");
        }

        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            name: item.pelapor_nama || "N/A",
            dataAset: item.aset_nama || "-",
            date: item.tanggal_pelaporan || "N/A",
            completionDate: item.tanggal_selesai || "N/A",
            avatar: item.foto_profil || "/assets/default-avatar.jpg",
            nomorSeri: item.nomor_seri || "-",
            rating: item.rating || 0,
            id: item.id,
          }));
          setTableData(formattedData);
        } else {
          setTableData(dummyData);
        }
      } catch (error) {
        console.error("Error fetching rating data:", error);
        setError(error.message);
        setTableData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingData();
  }, []);

  const getFilteredData = () => {
    let filtered = [...tableData];

    if (filterDataAset) {
      filtered = filtered.filter((item) =>
        item.dataAset.toLowerCase().includes(filterDataAset.toLowerCase())
      );
    }

    if (filterNoSeri) {
      filtered = filtered.filter((item) =>
        item.nomorSeri.toLowerCase().includes(filterNoSeri.toLowerCase())
      );
    }

    if (filterRating) {
      filtered = filtered.filter(
        (item) => item.rating === parseInt(filterRating)
      );
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              star <= rating ? "text-[#226597]" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleLihatRating = (item) => {
    navigate("/lihatratingopd", { state: { ratingData: item } });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="pt-4 pb-8">
          {/* Content Container */}
          <div className="px-4 md:px-6">
            {/* Dashboard Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-8">
              <h1 className="text-xl md:text-2xl font-bold text-[#226597] text-left">
                Rating Kepuasan
              </h1>
              {error && (
                <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 text-sm rounded">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card untuk Pelaporan dan Filter Pencarian */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
              {/* Tab Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
                {/* Tab Navigation */}
                <div className="flex space-x-4 md:space-x-8 border-b border-gray-200 pb-0.5 w-full sm:w-auto overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("pelaporan")}
                    className={`pb-3 px-1 font-medium text-xs md:text-sm whitespace-nowrap ${
                      activeTab === "pelaporan"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Pelaporan
                  </button>
                  <button
                    onClick={() => setActiveTab("pelayanan")}
                    className={`pb-3 px-1 font-medium text-xs md:text-sm whitespace-nowrap ${
                      activeTab === "pelayanan"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Pelayanan
                  </button>
                </div>

                {/* Tombol Refresh */}
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 bg-[#226597] hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto justify-center"
                >
                  <svg
                    width="14"
                    height="14"
                    className="md:w-4 md:h-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 0C4.11653 0 0.88012 2.7674 0.15332 6.43749H2.37403C3.05827 3.97008 5.31471 2.15625 8 2.15625C9.61425 2.15625 11.073 2.81219 12.1289 3.87109L9.56251 6.43749H16V0L13.6563 2.34375C12.2087 0.895747 10.2093 0 8 0ZM0 9.56251V16L2.34375 13.6563C3.79128 15.1043 5.79069 16 8 16C11.8835 16 15.1199 13.2326 15.8467 9.56251H13.626C12.9417 12.0299 10.6853 13.8437 8 13.8437C6.38575 13.8437 4.92701 13.1878 3.87109 12.1289L6.43749 9.56251H0Z"
                      fill="white"
                    />
                  </svg>
                  <span className="text-xs md:text-sm font-medium">
                    Refresh
                  </span>
                </button>
              </div>

              {/* Filter Pencarian Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-semibold text-[#226597] mb-6 text-left">
                  Filter pencarian
                </h2>

                {/* Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Filter Data Aset */}
                  <div className="text-left">
                    <div className="flex items-center gap-4">
                      <div className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap w-20">
                        Data Aset
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={filterDataAset}
                          onChange={(e) => setFilterDataAset(e.target.value)}
                          className="w-full text-xs md:text-sm text-gray-700 p-2 bg-white rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Cari data aset..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter No. Seri */}
                  <div className="text-left">
                    <div className="flex items-center gap-4">
                      <div className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap w-20 ml-2">
                        No. Seri
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={filterNoSeri}
                          onChange={(e) => setFilterNoSeri(e.target.value)}
                          className="w-full text-xs md:text-sm text-gray-700 p-2 bg-white rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Cari nomor seri..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Rating */}
                  <div className="text-left">
                    <div className="flex items-center gap-4">
                      <div className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap w-20 ml-4">
                        Rating
                      </div>
                      <div className="relative flex-1">
                        <select
                          value={filterRating}
                          onChange={(e) => setFilterRating(e.target.value)}
                          className="w-full text-xs md:text-sm text-gray-700 p-2 bg-white rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          <option value="">Semua Rating</option>
                          <option value="1">1 Bintang</option>
                          <option value="2">2 Bintang</option>
                          <option value="3">3 Bintang</option>
                          <option value="4">4 Bintang</option>
                          <option value="5">5 Bintang</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="w-3 h-3 md:w-4 md:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  // Loading State
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#226597]"></div>
                    <p className="mt-2 text-gray-600">Memuat data rating...</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table Header */}
                    <div className="bg-[#226597] rounded-t-lg p-3 md:p-4 grid grid-cols-7 gap-2 md:gap-3 text-xs md:text-sm font-medium text-white text-left hidden md:grid">
                      <div className="min-w-[150px]">Pengirim</div>
                      <div className="min-w-[100px]">Tgl. Awal</div>
                      <div className="min-w-[100px]">Tgl. Selesai</div>
                      <div className="min-w-[150px]">Data Aset</div>
                      <div className="min-w-[120px]">No. Seri</div>
                      <div className="min-w-[80px]">Rating</div>
                      <div className="min-w-[60px]">Aksi</div>
                    </div>

                    {/* Table Data */}
                    <div className="rounded-b-lg">
                      {filteredData.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          Tidak ada data rating yang ditemukan
                        </div>
                      ) : (
                        filteredData.map((item, index) => (
                          <div
                            key={index}
                            className={`p-3 md:p-4 grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-3 text-sm text-left items-center ${
                              index !== filteredData.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            {/* Desktop View */}
                            <div className="hidden md:flex font-medium text-gray-800 items-center space-x-3 min-w-[150px]">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.avatar &&
                                item.avatar !== "/assets/default-avatar.jpg" ? (
                                  <img
                                    src={item.avatar}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-bold">
                                      {item.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <span className="truncate">{item.name}</span>
                            </div>

                            <div className="hidden md:block text-gray-600 min-w-[100px]">
                              {item.date}
                            </div>
                            <div className="hidden md:block text-gray-600 min-w-[100px]">
                              {item.completionDate}
                            </div>
                            <div className="hidden md:block text-gray-600 min-w-[150px]">
                              {item.dataAset}
                            </div>
                            <div className="hidden md:block text-gray-600 min-w-[120px]">
                              {item.nomorSeri}
                            </div>
                            <div className="hidden md:block min-w-[80px]">
                              <StarRating rating={item.rating} />
                            </div>
                            <div className="hidden md:block min-w-[60px]">
                              <button
                                onClick={() => handleLihatRating(item)}
                                className="text-[#113F67] hover:text-[#226597] transition-colors duration-200"
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mt-4 p-3 md:p-4 border-t border-gray-200">
                      <div className="text-left order-2 sm:order-1">
                        Menampilkan {filteredData.length} dari{" "}
                        {tableData.length} data
                      </div>

                      {/* Pagination Navigation */}
                      <div className="flex items-center space-x-3 md:space-x-4 order-1 sm:order-2 mb-3 sm:mb-0">
                        <button className="text-[#226597] hover:text-[#113F67] transition-colors duration-200">
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        <div className="flex items-center space-x-2 md:space-x-3">
                          <span className="text-[#226597] font-medium">1</span>
                          <span className="text-gray-700 hover:text-[#226597] cursor-pointer transition-colors duration-200">
                            2
                          </span>
                          <span className="text-gray-700 hover:text-[#226597] cursor-pointer transition-colors duration-200">
                            3
                          </span>
                        </div>

                        <button className="text-[#226597] hover:text-[#113F67] transition-colors duration-200">
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutOpd>
  );
};

export default RatingKepuasanOPD;
