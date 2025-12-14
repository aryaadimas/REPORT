import React, { useState, useEffect } from "react";
import {
  DocumentIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function DashboardSeksi() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pelaporan");

  const [assetQuery, setAssetQuery] = useState("");
  const [assetSuggestions, setAssetSuggestions] = useState([]);
  const [availableSerials, setAvailableSerials] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedSerial, setSelectedSerial] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  


  const [assets, setAssets] = useState([]);
  const [ticketsPelaporan, setTicketsPelaporan] = useState([]);
  const [ticketsPelayanan, setTicketsPelayanan] = useState([]);


  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const rawTickets =
  activeTab === "pelaporan" ? ticketsPelaporan : ticketsPelayanan;

const filteredTickets = rawTickets.filter(t => {

  const matchAsset =
    !selectedAsset || t.asset?.nama_asset === selectedAsset;

  const matchSerial =
    !selectedSerial || t.asset?.nomor_seri === selectedSerial;

  const matchStatus =
    selectedStatus === "Semua" ||
    t.status_ticket_seksi?.toLowerCase() === selectedStatus.toLowerCase();

  return matchAsset && matchSerial && matchStatus;
});



  

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;
  const totalData = filteredTickets.length;
  const totalPages = Math.ceil(totalData / rowsPerPage);

const currentRows = filteredTickets.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage);


  const [dashboardData, setDashboardData] = useState({
  total_tickets: 0,
  pending_tickets: 0,
  verified_tickets: 0,
  rejected_tickets: 0,
  });


  const getStatusColor = (status) => {
    if (!status) return "bg-gray-400"; // fallback

    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-500";
      case "reopen":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-400 text-black";
      case "ditolak":
      case "rejected":
        return "bg-red-500";
      case "verified by seksi":
      case "terverifikasi":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

 

function handleAssetSearch(e) {
  const query = e.target.value;
  setAssetQuery(query);

  if (!query.trim()) {
    setAssetSuggestions([]);
    setSelectedAsset("");
    setSelectedSerial("");
    setAvailableSerials([]);
    setCurrentPage(1);
    return;
  }

  const matched = [
    ...new Set(
      tickets
        .map(t => t.asset?.nama_asset)
        .filter(Boolean)
        .filter(name =>
          name.toLowerCase().includes(query.toLowerCase())
        )
    )
  ].slice(0, 5);

  setAssetSuggestions(matched);
}

    
  
  async function fetchDashboard() {
    try {
      const res = await fetch(
        "https://service-desk-be-production.up.railway.app/api/dashboard/seksi",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      console.log("Dashboard Data:", data);

      setDashboardData(data);

    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  }

async function fetchPelaporan() {
  try {
    const res = await fetch(
      "https://service-desk-be-production.up.railway.app/api/tickets/seksi/pelaporan-online",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const json = await res.json();
    setTicketsPelaporan(json.data);

  } catch (err) {
    console.error("Error fetch tickets:", err);
  } finally {
    setLoading(false);
  }
}

async function fetchPelayanan() {
  try {
    const res = await fetch(
      "https://service-desk-be-production.up.railway.app/api/tickets/seksi/pengajuan-pelayanan",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const json = await res.json();
    setTicketsPelayanan(json.data);
  } catch (err) {
    console.error("Error fetch pelayanan:", err);
  }
}


async function fetchAssets() {
  try {
    const res = await fetch(
      "https://service-desk-be-production.up.railway.app/api/asset-barang",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const json = await res.json();
    setAssets(json.data.data); // simpan semua data asset  
  } catch (err) {
    console.error("Error fetch assets:", err);
  }
}

function updateSerialList(selectedName) {
  // Ambil nomor seri unik dari tiket yang sesuai aset
  const serialList = [
    ...new Set(
      tickets
        .filter(t => t.asset?.nama_asset === selectedName)
        .map(t => t.asset?.nomor_seri)
        .filter(Boolean)
    )
  ];

  setAvailableSerials(serialList);    // <-- simpan daftar No Seri
}



 useEffect(() => {
    fetchPelaporan();
    fetchPelayanan();
    fetchDashboard();
    fetchAssets();
  }, []);


  const getPaginationRange = (current, total) => {
  const delta = 1;
  const range = [];

  // Selalu tampilkan halaman pertama
  range.push(1);

  // Hitung start & end window
  let start = Math.max(2, current - delta);
  let end = Math.min(total - 1, current + delta);

  // Kalau dekat awal
  if (current <= delta + 2) {
    start = 2;
    end = Math.min(total - 1, 1 + delta * 2);
  }

  // Kalau dekat akhir
  if (current >= total - (delta + 1)) {
    start = Math.max(2, total - delta * 2);
    end = total - 1;
  }

  if (start > 2) range.push("...");

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (end < total - 1) range.push("...");

  // Selalu tampilkan halaman terakhir
  if (total > 1) range.push(total);

  return range;
};



  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59]">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
            { label: "Tiket Masuk", value: dashboardData.total_tickets },
            { label: "Pending", value: dashboardData.pending_tickets },
            { label: "Diverifikasi", value: dashboardData.verified_tickets },
            { label: "Ditolak", value: dashboardData.rejected_tickets },
          ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow border border-gray-100 flex flex-col justify-center items-center py-5"
          >
            <span className="text-3xl font-semibold text-[#0F2C59]">
              {item.value}
            </span>
            <span className="text-sm text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
        {/* Tabs */}
        <div className="flex justify-between items-center border-b mb-4">
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
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setCurrentPage(1);
            fetchDashboard();
            if (activeTab === "pelaporan") fetchPelaporan();
            else fetchPelayanan();
          }}
          className={`flex items-center gap-2 px-4 py-2 mb-3 rounded-lg text-sm font-medium transition
            ${loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#0F2C59] hover:bg-[#15397A] text-white"
            }`}
        >
          <ArrowPathIcon 
            className={`w-4 h-4 transition-transform ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Refreshing..." : "Refresh"}
        </button>


        </div>

        {/* Filter Pencarian */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="text-[#0F2C59] font-semibold mb-6 text-sm">
            Filter pencarian
          </h2>

          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            {/* Baris 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between">
  <label className="w-20 text-sm font-medium text-gray-700">
    Data Aset
  </label>

      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Cari aset..."
          value={assetQuery}
          onChange={handleAssetSearch}
          className="border w-full px-3 py-2 rounded-lg text-sm pr-8" // ← tambahkan pr-8 untuk space X
        />

        {/* Tombol X */}
        {assetQuery && (
          <button
            onClick={() => {
              setAssetQuery("");
              setSelectedAsset("");
              setSelectedSerial("");
              setAvailableSerials([]);
              setAssetSuggestions([]);
              setCurrentPage(1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}

        {/* Dropdown Suggestion */}
        {assetSuggestions.length > 0 && (
          <ul className="absolute bg-white border rounded-lg shadow-lg w-full z-20 max-h-40 overflow-y-auto">
            {assetSuggestions.map((name, i) => (
              <li
                key={i}
                onClick={() => {
                  setAssetQuery(name);
                  setSelectedAsset(name);
                  updateSerialList(name);
                  setSelectedSerial("");
                  setAssetSuggestions([]);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>


    </div>

            </div>
            {/* Baris 2 */}
            <div className="flex items-center justify-between">
              <label className="w-20 text-sm font-medium text-gray-700">
                No Seri
              </label>
              <select
                value={selectedSerial}
                onChange={(e) => {
                  setSelectedSerial(e.target.value);
                  setCurrentPage(1); // kalau ganti no seri, balik ke halaman 1
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                disabled={availableSerials.length === 0}
              >
                <option value="">
                  {availableSerials.length === 0 ? "Tidak ada nomor seri" : "Semua"}
                </option>

                {availableSerials.map((seri, i) => (
                  <option key={i} value={seri}>
                    {seri}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="w-20 text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1); // reset pagination
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="Semua">Semua</option>
                <option value="pending">Pending</option>
                <option value="rejected">Revisi</option>
                <option value="draft">Draft</option>
              </select>

            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-[#0F2C59] text-white text-xs uppercase">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">Pengirim</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Data Aset</th>
                <th className="py-3 px-4">No Seri</th>
                <th className="py-3 px-4">Lampiran</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentRows.map((item) => (
                <tr key={item.ticket_id} className="border-b hover:bg-gray-50">
              
              {/* PENGIRIM */}
              <td className="py-3 px-4 flex items-center gap-2">
                <img
                  src={item.creator.profile || "/default-avatar.png"}
                  alt={item.creator.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{item.creator.full_name}</span>
              </td>

              {/* TANGGAL */}
              <td className="py-3 px-4">
                {new Date(item.created_at).toLocaleDateString()}
              </td>

              {/* DATA ASET */}
              <td className="py-3 px-4">{item.asset.nama_asset || "-"}</td>

              {/* NO SERI */}
              <td className="py-3 px-4">{item.asset.nomor_seri || "-"}</td>

              {/* LAMPIRAN */}
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {item.files.length > 0 ? (
                    item.files.slice(0, 3).map((file, idx) => (
                      <DocumentIcon
                        key={idx}
                        className="w-5 h-5 text-[#0F2C59] cursor-pointer"
                        onClick={() => window.open(file.file_path, "_blank")}
                      />
                    ))
                  ) : (
                    <span className="text-gray-400 italic">Tidak ada</span>
                  )}
                </div>
              </td>

              {/* STATUS */}
              <td className="py-3 px-4">
                <span
                  className={`
                    inline-flex items-center justify-center
                    min-w-[80px]    /* lebar minimum biar seragam */
                    h-[28px]        /* tinggi konsisten */
                    px-3            /* padding horizontal */
                    text-xs font-medium text-white
                    rounded
                    ${getStatusColor(item.status_ticket_seksi)}
                  `}
                >
                  {item.status_ticket_seksi}
                </span>

              </td>

              {/* Aksi */}
              <td className="py-3 px-4">
               <button
  onClick={() => {
    if (activeTab === "pelayanan") {
      // → HALAMAN KHUSUS PELAYANAN
      navigate(`/pelayananbidang/${item.ticket_id}`);
    } else {
      // → HALAMAN LAMA (pelaporan)
      if (item.ticket_source?.toLowerCase() === "pegawai") {
        navigate(`/pengajuanbidang/${item.ticket_id}`);
      } else {
        navigate(`/pengajuanmasyarakat/${item.ticket_id}`);
      }
    }
  }}
  className="text-[#0F2C59] hover:text-[#15397A]"
>
  <PencilSquareIcon className="w-5 h-5" />
</button>


              </td>
            </tr>

              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER PAGINATION */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
        {/* INFO DATA */}
        <p className="text-sm text-gray-500">
          Menampilkan data{" "}
          <span className="font-medium">
            {(currentPage - 1) * rowsPerPage + 1}
          </span>{" "}
          sampai{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, totalData)}
          </span>{" "}
          dari{" "}
          <span className="font-medium">{totalData}</span> data
        </p>

        {/* PAGINATION */}
        <div className="flex items-center gap-1">
          {/* PREV */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            &lt;
          </button>

          {/* PAGE NUMBERS */}
          {getPaginationRange(currentPage, totalPages).map((page, idx) =>
            page === "..." ? (
              <span
                key={idx}
                className="px-3 py-1 text-sm text-gray-400 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-lg border transition
                  ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            )
          )}

          {/* NEXT */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      </div>


      </div>
    </div>
  );
}
