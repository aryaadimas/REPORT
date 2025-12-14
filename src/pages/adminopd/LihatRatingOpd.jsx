import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  StarIcon,
  ArrowPathIcon,
  EyeIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import LayoutOpd from "../../components/Layout/LayoutOPD";

const LihatRatingOpd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("pelaporan");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    pengirim: "",
    tanggalAwal: "",
    tanggalSelesai: "",
    dataAset: "",
    nomorSeri: "",
    rating: "",
  });

  // Fetch data rating dari API
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("⚠️ Token tidak ditemukan");
          setRatings([]);
          setFilteredRatings([]);
          setTotalData(0);
          setLoading(false);
          return;
        }

        console.log("📡 Fetching ratings from API...");

        // Try different possible endpoints (prioritas utama: /api/admin-opd/ratings)
        const endpoints = [
          "/api/admin-opd/ratings",
          "/api/ratings/my-ratings",
          "/api/ratings",
          "/api/tickets/ratings",
        ];

        let dataFetched = false;

        for (const endpoint of endpoints) {
          try {
            console.log(`🔍 Trying endpoint: ${endpoint}`);

            const response = await fetch(endpoint, {
              method: "GET",
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              console.log(`✅ Data fetched from ${endpoint}:`, data);

              // Handle array response
              let dataArray = [];
              if (Array.isArray(data)) {
                dataArray = data;
              } else if (data.data && Array.isArray(data.data)) {
                dataArray = data.data;
              }

              if (dataArray.length > 0) {
                const formattedData = dataArray.map((item, index) => ({
                  id: item.id || index + 1,
                  pengirim:
                    item.pelapor_nama || item.user_name || item.name || "N/A",
                  foto_profil:
                    item.pelapor_foto ||
                    item.profile_url ||
                    item.foto_profil ||
                    "/assets/default-avatar.jpg",
                  tanggalAwal:
                    item.tanggal_awal || item.created_at || item.date
                      ? new Date(
                          item.tanggal_awal || item.created_at || item.date
                        ).toLocaleDateString("id-ID")
                      : "N/A",
                  tanggalSelesai:
                    item.tanggal_selesai ||
                    item.completed_at ||
                    item.completion_date
                      ? new Date(
                          item.tanggal_selesai ||
                            item.completed_at ||
                            item.completion_date
                        ).toLocaleDateString("id-ID")
                      : "N/A",
                  dataAset:
                    item.aset_nama ||
                    item.ticket_title ||
                    item.title ||
                    item.asset_name ||
                    "-",
                  nomorSeri:
                    item.nomor_seri ||
                    item.ticket_number ||
                    item.serial_number ||
                    "-",
                  rating: item.rating || item.score || 0,
                  jenisPelaporan:
                    item.jenis_pelaporan || item.type || "pelaporan",
                }));

                setRatings(formattedData);
                setFilteredRatings(formattedData);
                setTotalData(formattedData.length);
                dataFetched = true;
                break;
              }
            } else {
              console.log(`❌ ${endpoint} returned ${response.status}`);
            }
          } catch (endpointError) {
            console.log(`❌ Error with ${endpoint}:`, endpointError.message);
          }
        }

        if (!dataFetched) {
          console.warn("⚠️ All endpoints failed, no data available");
          setRatings([]);
          setFilteredRatings([]);
          setTotalData(0);
        }
      } catch (error) {
        console.error("❌ Error fetching ratings:", error);
        setError("Tidak dapat memuat data rating. Silakan coba lagi nanti.");
        setRatings([]);
        setFilteredRatings([]);
        setTotalData(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = ratings;

    // Filter by active tab
    if (activeTab === "pelaporan") {
      result = result.filter((item) => item.jenisPelaporan === "pelaporan");
    } else if (activeTab === "pelayanan") {
      result = result.filter((item) => item.jenisPelaporan === "pelayanan");
    }

    // Apply other filters
    if (filters.pengirim) {
      result = result.filter((item) =>
        item.pengirim.toLowerCase().includes(filters.pengirim.toLowerCase())
      );
    }

    if (filters.tanggalAwal) {
      result = result.filter(
        (item) => item.tanggalAwal === filters.tanggalAwal
      );
    }

    if (filters.tanggalSelesai) {
      result = result.filter(
        (item) => item.tanggalSelesai === filters.tanggalSelesai
      );
    }

    if (filters.dataAset) {
      result = result.filter((item) =>
        item.dataAset.toLowerCase().includes(filters.dataAset.toLowerCase())
      );
    }

    if (filters.nomorSeri) {
      result = result.filter((item) =>
        item.nomorSeri.toLowerCase().includes(filters.nomorSeri.toLowerCase())
      );
    }

    if (filters.rating) {
      const ratingValue = parseInt(filters.rating);
      result = result.filter((item) => item.rating === ratingValue);
    }

    setFilteredRatings(result);
    setTotalData(result.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, activeTab, ratings]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      pengirim: "",
      tanggalAwal: "",
      tanggalSelesai: "",
      dataAset: "",
      nomorSeri: "",
      rating: "",
    });
  };

  // Refresh data
  const handleRefresh = () => {
    window.location.reload();
  };

  // View detail rating
  const handleViewDetail = (ratingId) => {
    navigate(`/lihatdetailrating/${ratingId}`);
  };

  // Komponen bintang rating
  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < count ? "text-yellow-500" : "text-gray-300"}`}
      />
    ));
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRatings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRatings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format rating text
  const getRatingText = (rating) => {
    switch (rating) {
      case 5:
        return "Sangat Puas";
      case 4:
        return "Puas";
      case 3:
        return "Cukup Puas";
      case 2:
        return "Kurang Puas";
      case 1:
        return "Tidak Puas";
      default:
        return "-";
    }
  };

  // Jika masih loading
  if (loading) {
    return (
      <LayoutOpd>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59]"></div>
                <p className="mt-4 text-gray-600">Memuat data rating...</p>
              </div>
            </div>
          </div>
        </div>
      </LayoutOpd>
    );
  }

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#0F2C59]">
                Rating Kepuasan
              </h1>
            </div>

            {/* Tabs and Refresh Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-1 border-b border-gray-200">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "pelaporan"
                      ? "text-[#0F2C59] border-b-2 border-[#0F2C59]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("pelaporan")}
                >
                  Pelaporan
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "pelayanan"
                      ? "text-[#0F2C59] border-b-2 border-[#0F2C59]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("pelayanan")}
                >
                  Pelayanan
                </button>
              </div>

              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {/* Filter Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Filter pencarian
                </h3>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#0F2C59] text-white rounded-lg text-sm font-medium hover:bg-blue-800"
                >
                  <FunnelIcon className="h-4 w-4" />
                  {showFilter ? "Sembunyikan Filter" : "Tampilkan Filter"}
                </button>
              </div>

              {showFilter && (
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Pengirim */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pengirim
                      </label>
                      <input
                        type="text"
                        value={filters.pengirim}
                        onChange={(e) =>
                          handleFilterChange("pengirim", e.target.value)
                        }
                        placeholder="Cari pengirim..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Tanggal Awal */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tgl. Awal
                      </label>
                      <input
                        type="date"
                        value={filters.tanggalAwal}
                        onChange={(e) =>
                          handleFilterChange("tanggalAwal", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Tanggal Selesai */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tgl. Selesai
                      </label>
                      <input
                        type="date"
                        value={filters.tanggalSelesai}
                        onChange={(e) =>
                          handleFilterChange("tanggalSelesai", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Data Aset */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Aset
                      </label>
                      <input
                        type="text"
                        value={filters.dataAset}
                        onChange={(e) =>
                          handleFilterChange("dataAset", e.target.value)
                        }
                        placeholder="Cari data aset..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Nomor Seri */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Seri
                      </label>
                      <input
                        type="text"
                        value={filters.nomorSeri}
                        onChange={(e) =>
                          handleFilterChange("nomorSeri", e.target.value)
                        }
                        placeholder="Cari nomor seri..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <select
                        value={filters.rating}
                        onChange={(e) =>
                          handleFilterChange("rating", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Semua Rating</option>
                        <option value="5">5 Bintang (Sangat Puas)</option>
                        <option value="4">4 Bintang (Puas)</option>
                        <option value="3">3 Bintang (Cukup Puas)</option>
                        <option value="2">2 Bintang (Kurang Puas)</option>
                        <option value="1">1 Bintang (Tidak Puas)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 mr-2"
                    >
                      <XMarkIcon className="h-4 w-4 inline mr-1" />
                      Hapus Filter
                    </button>
                  </div>
                </div>
              )}

              {/* Error message jika ada */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-red-700 font-medium">
                        {error}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Gagal memuat data rating dari server.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Table - Hanya tampil jika ada data */}
            {filteredRatings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {error ? "Gagal memuat data" : "Tidak ada data rating"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {error
                    ? "Terjadi kesalahan saat memuat data rating."
                    : "Tidak ada data rating untuk ditampilkan."}
                </p>
                <button
                  onClick={handleRefresh}
                  className="bg-[#0F2C59] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pengirim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tgl. Awal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tgl. Selesai
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Aset
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nomor Seri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                                <img
                                  src={item.foto_profil}
                                  alt={item.pengirim}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/default-avatar.jpg";
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {item.pengirim}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.tanggalAwal}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.tanggalSelesai}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.dataAset || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.nomorSeri}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex mr-2">
                                {renderStars(item.rating)}
                              </div>
                              <span className="text-xs text-gray-500">
                                ({item.rating}/5)
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {getRatingText(item.rating)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewDetail(item.id)}
                              className="text-[#0F2C59] hover:text-blue-800 flex items-center gap-1"
                            >
                              <EyeIcon className="h-4 w-4" />
                              Lihat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Menampilkan data {indexOfFirstItem + 1} sampai{" "}
                      {Math.min(indexOfLastItem, totalData)} dari {totalData}{" "}
                      data
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Sebelumnya
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => {
                          // Add ellipsis
                          if (index > 0 && page - array[index - 1] > 1) {
                            return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <span className="px-2">...</span>
                                <button
                                  onClick={() => paginate(page)}
                                  className={`px-3 py-1 rounded text-sm ${
                                    currentPage === page
                                      ? "bg-[#0F2C59] text-white"
                                      : "text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            );
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => paginate(page)}
                              className={`px-3 py-1 rounded text-sm ${
                                currentPage === page
                                  ? "bg-[#0F2C59] text-white"
                                  : "text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutOpd>
  );
};

export default LihatRatingOpd;
