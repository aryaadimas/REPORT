import React, { useState, useEffect } from "react";
import {
  DocumentIcon,
  PencilSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function PenugasanSeksi() {
  const navigate = useNavigate();

  // === STATE ===
  const [activeTab, setActiveTab] = useState("pelaporan");
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const [dataPelaporan, setDataPelaporan] = useState([]);
  const [dataPelayanan, setDataPelayanan] = useState([]);

  // Filter states
  const [filterSeri, setFilterSeri] = useState("Semua");
  const [filterPrioritas, setFilterPrioritas] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedAset, setSelectedAset] = useState("");

  // Dropdown search
  const [searchAset, setSearchAset] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // === PRIORITY COLOR ===
  const getPriorityColor = (level) => {
    switch (level?.toLowerCase()) {
      case "tinggi":
        return "bg-red-500";
      case "sedang":
        return "bg-yellow-400";
      case "rendah":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  // === STATUS COLOR ===
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "draft":
        return "bg-gray-400";
      case "diproses":
        return "bg-yellow-400";
      case "pending":
        return "bg-orange-400";
      case "verified by bidang":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  // === FETCH DATA FROM BACKEND (SEKALI DI AWAL) ===
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchPelaporan(), fetchPelayanan()]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const fetchPelaporan = async () => {
    try {
      const res = await fetch(
        "https://service-desk-be-production.up.railway.app/api/tickets/seksi/verified-bidang/pelaporan-online",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const json = await res.json();
      const arr = json.data || [];

      const mapped = arr.map((item) => ({
        id: item.ticket_id,
        nama: item.creator?.full_name || "-",
        foto: item.creator?.profile || "/assets/default.png",
        aset: item.asset?.nama_asset || "-",
        seri: item.asset?.nomor_seri || "-",
        lampiran: item.files || [],
        prioritas:
          item.priority === "High"
            ? "Tinggi"
            : item.priority === "Medium"
            ? "Sedang"
            : "Rendah",
        status: item.status_ticket_seksi || item.status || "-",
      }));

      setDataPelaporan(mapped);
    } catch (err) {
      console.error("FETCH PELAPORAN ERROR:", err);
    }
  };

  const fetchPelayanan = async () => {
    try {
      const res = await fetch(
        "https://service-desk-be-production.up.railway.app/api/tickets/seksi/verified-bidang/pengajuan-layanan",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const json = await res.json();
      const arr = json.data || [];

      const mapped = arr.map((item) => ({
        id: item.ticket_id,
        nama: item.creator?.full_name || "-",
        foto: item.creator?.profile || "/assets/default.png",
        aset: item.asset?.nama_asset || "-",
        seri: item.asset?.nomor_seri || "-",
        lampiran: item.files || [],
        prioritas:
          item.priority === "High"
            ? "Tinggi"
            : item.priority === "Medium"
            ? "Sedang"
            : "Rendah",
        status: item.status_ticket_seksi || item.status || "-",
      }));

      setDataPelayanan(mapped);
    } catch (err) {
      console.error("FETCH PELAYANAN ERROR:", err);
    }
  };

  const handleRefresh = async () => {
    setLoadingRefresh(true);

    // reset filter
    setSearchAset("");
    setSelectedAset("");
    setFilterSeri("Semua");
    setFilterPrioritas("Semua");
    setFilterStatus("Semua");
    setShowDropdown(false);
    setCurrentPage(1);

    await Promise.all([fetchPelaporan(), fetchPelayanan()]);

    setLoadingRefresh(false);
  };

  // === DATA AKTIF SESUAI TAB ===
  const data = activeTab === "pelaporan" ? dataPelaporan : dataPelayanan;

  // === UNIQUE ASET UNTUK AUTOCOMPLETE (BERDASARKAN DATA AKTIF) ===
  const uniqueAset = [
    ...new Set(data.map((i) => i.aset).filter((v) => v && v !== "-")),
  ];

  const filteredAsetOptions = uniqueAset.filter((item) =>
    item.toLowerCase().includes(searchAset.toLowerCase())
  );

  // === FILTER DATA ===
  const filteredData = data.filter((item) => {
    const matchAset = selectedAset === "" || item.aset === selectedAset;
    const matchSeri = filterSeri === "Semua" || item.seri === filterSeri;
    const matchPrioritas =
      filterPrioritas === "Semua" || item.prioritas === filterPrioritas;
    const matchStatus =
      filterStatus === "Semua" || item.status === filterStatus;

    return matchAset && matchSeri && matchPrioritas && matchStatus;
  });

  // === PAGINATION USING FILTERED DATA ===
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage || 1);

  // reset page saat ganti tab
  useEffect(() => {
    setCurrentPage(1);
    // juga reset filter aset/seri biar nggak nyangkut dari tab sebelumnya
    setSearchAset("");
    setSelectedAset("");
    setFilterSeri("Semua");
  }, [activeTab]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0F2C59]">Penugasan</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b mb-4">
        <div className="flex">
          {["pelaporan", "pelayanan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-semibold capitalize rounded-t-lg ${
                activeTab === tab
                  ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                  : "text-gray-400 hover:text-[#0F2C59]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={handleRefresh}
          disabled={loadingRefresh}
          className={`flex items-center gap-2 px-4 py-2 mb-3 rounded-lg text-sm font-medium transition
            ${
              loadingRefresh
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0F2C59] hover:bg-[#15397A] text-white"
            }
          `}
        >
          <ArrowPathIcon
            className={`w-4 h-4 transition-transform ${
              loadingRefresh ? "animate-spin" : ""
            }`}
          />
          {loadingRefresh ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-5">
        <h2 className="text-[#0F2C59] font-semibold mb-6 text-sm">
          Filter pencarian
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* DATA ASET — Search + Clear Button */}
          <div className="flex items-center justify-between relative">
            <label className="w-24 text-sm text-gray-700">Data Aset</label>

            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8"
                placeholder="Cari data aset..."
                value={searchAset}
                onChange={(e) => {
                  setSearchAset(e.target.value);
                  setFilterSeri("Semua");
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (searchAset.length > 0) setShowDropdown(true);
                }}
              />

              {searchAset && (
                <button
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setSearchAset("");
                    setSelectedAset("");
                    setFilterSeri("Semua");
                    setShowDropdown(false);
                  }}
                >
                  ✕
                </button>
              )}

              {showDropdown &&
                searchAset.length > 0 &&
                filteredAsetOptions.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {filteredAsetOptions.map((item, idx) => (
                      <li
                        key={idx}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setSearchAset(item);
                          setSelectedAset(item);
                          setShowDropdown(false);
                          setFilterSeri("Semua");
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>

          {/* PRIORITAS */}
          <div className="flex items-center justify-between">
            <label className="w-24 text-sm text-gray-700">Prioritas</label>
            <select
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterPrioritas}
              onChange={(e) => setFilterPrioritas(e.target.value)}
            >
              <option>Semua</option>
              <option>Rendah</option>
              <option>Sedang</option>
              <option>Tinggi</option>
            </select>
          </div>

          {/* NOMOR SERI */}
          <div className="flex items-center justify-between">
            <label className="w-24 text-sm text-gray-700">No Seri</label>
            <select
              disabled={selectedAset === ""}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterSeri}
              onChange={(e) => setFilterSeri(e.target.value)}
            >
              <option>Semua</option>
              {[
                ...new Set(
                  data
                    .filter((i) => i.aset === selectedAset)
                    .map((i) => i.seri)
                    .filter((v) => v !== "-")
                ),
              ].map((seri, idx) => (
                <option key={idx}>{seri}</option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between">
            <label className="w-24 text-sm text-gray-700">Status</label>
            <select
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Semua</option>
              <option>Draft</option>
              <option>diproses</option>
              <option>pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-[#0F2C59] text-white text-xs uppercase">
            <tr>
              <th className="py-3 px-4 rounded-tl-lg">Pengirim</th>
              <th className="py-3 px-4">Data Aset</th>
              <th className="py-3 px-4">No Seri</th>
              <th className="py-3 px-4">Lampiran</th>
              <th className="py-3 px-4">Prioritas</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-tr-lg">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  Loading data...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              currentRows.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{item.nama}</span>
                  </td>

                  <td className="py-3 px-4">{item.aset}</td>
                  <td className="py-3 px-4">{item.seri}</td>

                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {item.lampiran.length > 0 ? (
                        item.lampiran.map((_, idx) => (
                          <DocumentIcon
                            key={idx}
                            className="w-5 h-5 text-[#0F2C59]"
                          />
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          Tidak ada
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center justify-center min-w-[80px] h-[28px] px-3 text-xs font-medium text-white rounded ${getPriorityColor(
                        item.prioritas
                      )}`}
                    >
                      {item.prioritas}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center justify-center min-w-[80px] h-[28px] px-3 text-xs font-medium text-white rounded ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        if (activeTab === "pelaporan") {
                          navigate(`/formpenugasanseksi/${item.id}`);
                        } else {
                          navigate(`/formpelayanan/${item.id}`);
                        }
                      }}
                      className="text-[#0F2C59] hover:text-[#15397A]"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>
          Menampilkan data {filteredData.length === 0 ? 0 : indexOfFirst + 1}{" "}
          sampai {Math.min(indexOfLast, filteredData.length)} dari{" "}
          {filteredData.length} data
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`px-3 py-1 border rounded-lg ${
              currentPage === 1 ? "opacity-50" : "hover:bg-gray-100"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded-lg ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            className={`px-3 py-1 border rounded-lg ${
              currentPage === totalPages
                ? "opacity-50"
                : "hover:bg-gray-100"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
