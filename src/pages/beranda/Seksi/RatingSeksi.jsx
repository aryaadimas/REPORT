import React, { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  StarIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function RatingSeksi() {
  const [activeTab, setActiveTab] = useState("Pelaporan"); // Tab aktif
  const [filters, setFilters] = useState({
    search: "",
    rating: "",
  });

  const [dataPelaporan, setDataPelaporan] = useState([]);
  const [dataPelayanan, setDataPelayanan] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // === Fetch Pelaporan ===
  const fetchPelaporan = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/seksi/ratings/pelaporan-online`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      setDataPelaporan(result.data || []);
    } catch (error) {
      console.error("Error fetching pelaporan:", error);
    }
    setLoading(false);
  };

  // === Fetch Pelayanan ===
  const fetchPelayanan = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/seksi/ratings/pengajuan-pelayanan`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      setDataPelayanan(result.data || []);
    } catch (error) {
      console.error("Error fetching pelayanan:", error);
    }
    setLoading(false);
  };

  // === Load Data Berdasarkan Tab ===
  useEffect(() => {
    if (activeTab === "Pelaporan") fetchPelaporan();
    if (activeTab === "Pelayanan") fetchPelayanan();
  }, [activeTab]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < (count || 0) ? "text-[#0F2C59]" : "text-gray-300"
        }`}
      />
    ));
  };

  // Data aktif berdasarkan tab
  const activeData = activeTab === "Pelaporan" ? dataPelaporan : dataPelayanan;

  // === Terapkan filter search & rating ===
  const filteredData = activeData.filter((item) => {
    // filter search berdasarkan nama asset
    const searchOk = filters.search
      ? (item.asset?.nama_asset || "")
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      : true;

    // filter rating
    const ratingOk = filters.rating
      ? Number(item.rating) === Number(filters.rating)
      : true;

    return searchOk && ratingOk;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-6xl mx-auto">
        {/* === Judul === */}
        <h1 className="text-3xl font-bold text-[#0F2C59] mb-6">
          Rating Kepuasan
        </h1>

        {/* === Tabs === */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-300">
          <div className="flex gap-8">
            {["Pelaporan", "Pelayanan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-base font-semibold transition ${
                  activeTab === tab
                    ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                    : "text-gray-400 hover:text-[#0F2C59]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tombol Refresh */}
          <button
            onClick={() =>
              activeTab === "Pelaporan" ? fetchPelaporan() : fetchPelayanan()
            }
            className={`flex items-center gap-2 bg-[#0F2C59] text-white px-4 py-2 rounded-lg 
            hover:bg-[#15397A] transition text-sm font-medium shadow-sm -mt-4
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ArrowPathIcon
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* === Filter Pencarian === */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 border shadow-sm">
          <h2 className="text-gray-700 font-semibold mb-4">
            Filter pencarian
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Data Aset -> Search */}
            <div>
              <label className="text-gray-600 text-sm block mb-1">
                Data Aset
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama aset..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange("search", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm w-full bg-white shadow-sm"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange("search", "")}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-gray-600 text-sm block mb-1">
                Rating
              </label>
              <div className="relative">
                <select
                  value={filters.rating}
                  onChange={(e) =>
                    handleFilterChange("rating", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm appearance-none"
                >
                  <option value="">Semua</option>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* === Tabel Rating === */}
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-[#0F2C59] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Pengirim</th>
                <th className="px-4 py-3 text-left">Tgl. Penilaian</th>
                <th className="px-4 py-3 text-left">Data Aset</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Komentar</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}

              {filteredData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <img
                      src={
                        item.creator?.profile || "/assets/default-avatar.png"
                      }
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {item.creator?.full_name || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.rated_at
                      ? new Date(item.rated_at).toLocaleDateString("id-ID")
                      : "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.asset?.nama_asset || "-"}
                  </td>

                  <td className="px-4 py-3 flex">{renderStars(item.rating)}</td>

                  <td className="px-4 py-3">{item.comment || "-"}</td>

                  {/* Aksi: masuk ke DetailRating sesuai ticket_id */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        navigate(`/detailrating/${item.ticket_id}`)
                      }
                      className="text-[#0F2C59] hover:text-[#15397A]"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
