import React, { useState, useEffect } from "react";
import { RefreshCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RatingTeknisi() {
  const navigate = useNavigate();

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // ========================= STATES =========================
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchAset, setSearchAset] = useState("");
  const [selectedSeri, setSelectedSeri] = useState("");
  const [ratingFilter, setRatingFilter] = useState("Semua");

  const [availableSeri, setAvailableSeri] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // ========================= FETCH API =========================
  const fetchRatings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/teknisi/ratings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      setRatings(result.data || []);
    } catch (err) {
      console.error("Gagal fetch rating teknisi:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  // ========================= HANDLE SERI BY ASET =========================
  useEffect(() => {
    if (searchAset.trim() === "") {
      setAvailableSeri([]);
      setSelectedSeri("");
      return;
    }

    const seriList = ratings
      .filter((r) =>
        r.asset?.nama_asset?.toLowerCase().includes(searchAset.toLowerCase())
      )
      .map((r) => r.asset?.nomor_seri)
      .filter((v) => v);

    setAvailableSeri([...new Set(seriList)]);
  }, [searchAset, ratings]);

  // ========================= FILTERING =========================
  const filteredData = ratings.filter((item) => {
    const aset = item.asset?.nama_asset || "";
    const seri = item.asset?.nomor_seri || "";

    const matchAset =
      searchAset === "" || aset.toLowerCase().includes(searchAset.toLowerCase());

    const matchSeri =
      selectedSeri === "" || seri.toLowerCase() === selectedSeri.toLowerCase();

    const matchRating =
      ratingFilter === "Semua" || item.rating === Number(ratingFilter);

    return matchAset && matchSeri && matchRating;
  });

  // ========================= PAGINATION =========================
  const totalPages = Math.ceil(filteredData.length / perPage);
  const indexLast = currentPage * perPage;
  const indexFirst = indexLast - perPage;
  const currentData = filteredData.slice(indexFirst, indexLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ========================= UI STAR RENDER =========================
  const renderStars = (count) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );

  // ========================= RENDER =========================
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#0F2C59]">Rating Kepuasan</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {/* HEADER */}
        <div className="border-b flex items-center justify-between px-6">
          <div className="flex">
            <button className="px-5 py-3 text-sm font-semibold border-b-2 border-[#0F2C59] text-[#0F2C59]">
              Pelaporan
            </button>
          </div>

          {/* REFRESH BUTTON */}
          <button
            onClick={fetchRatings}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0F2C59] hover:bg-[#15397A] text-white"
              }
            `}
          >
            <RefreshCcw
              size={16}
              className={`${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* FILTER */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-3 gap-8">

            {/* SEARCH ASET */}
            <div className="flex items-center gap-3">
              <label className="w-24 text-sm font-semibold text-gray-700">Aset</label>
              <input
                type="text"
                placeholder="Cari aset..."
                value={searchAset}
                onChange={(e) => {
                  setSearchAset(e.target.value);
                  setSelectedSeri("");
                }}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* NOMOR SERI */}
            <div className="flex items-center gap-3">
              <label className="w-24 text-sm font-semibold text-gray-700">
                Nomor Seri
              </label>
              <select
                disabled={availableSeri.length === 0}
                value={selectedSeri}
                onChange={(e) => setSelectedSeri(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Semua</option>
                {availableSeri.map((seri, i) => (
                  <option key={i} value={seri}>
                    {seri}
                  </option>
                ))}
              </select>
            </div>

            {/* FILTER RATING */}
            <div className="flex items-center gap-3">
              <label className="w-24 text-sm font-semibold text-gray-700">Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              >
                <option value="Semua">Semua</option>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABEL */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#0F2C59] text-white">
                <th className="p-3">Pengirim</th>
                <th className="p-3">Tgl. Awal</th>
                <th className="p-3">Tgl. Selesai</th>
                <th className="p-3">Data Aset</th>
                <th className="p-3">No Seri</th>
                <th className="p-3">Rating</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                currentData.map((item) => (
                  <tr
                    key={item.ticket_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={item.creator?.profile || "/assets/default.png"}
                        alt={item.creator?.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {item.creator?.full_name}
                    </td>

                    <td className="p-3">
                      {new Date(item.pengerjaan_awal).toLocaleDateString("id-ID")}
                    </td>

                    <td className="p-3">
                      {new Date(item.pengerjaan_akhir).toLocaleDateString("id-ID")}
                    </td>

                    <td className="p-3">{item.asset?.nama_asset}</td>

                    <td className="p-3">{item.asset?.nomor_seri}</td>

                    <td className="p-3">{renderStars(item.rating)}</td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          navigate(`/detailratingteknisi/${item.ticket_id}`, {
                            state: { detail: item },
                          })
                        }
                        className="text-[#0F2C59] hover:text-[#15397A]"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {filteredData.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p>
              Menampilkan {indexFirst + 1}–{Math.min(indexLast, filteredData.length)} dari{" "}
              {filteredData.length} data
            </p>

            <div className="flex gap-2">
              <button onClick={() => goToPage(currentPage - 1)} className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                &lt;
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 border rounded-lg ${
                    currentPage === i + 1
                      ? "bg-[#0F2C59] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button onClick={() => goToPage(currentPage + 1)} className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
