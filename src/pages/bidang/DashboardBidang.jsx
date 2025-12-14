import React, { useState, useEffect } from "react";
import LayoutBidang from "../../components/Layout/LayoutBidang";
import { useNavigate } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

// ICON LAMPIRAN
const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// ICON AKSI
const ActionIcon = () => (
  <svg width="22" height="22" fill="#0F2C59" viewBox="0 0 24 24">
    <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
    <path d="M5 5h5V3H3v7h2V5zm0 14v-5H3v7h7v-2H5z" />
  </svg>
);

// DROPDOWN
const FilterDropdown = ({ placeholder, options = [], value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full text-left text-sm text-gray-700 p-2 bg-white rounded border border-gray-300 appearance-none pr-8"
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>

    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

const FilterRow = ({ label, children }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-gray-700 w-20">{label}</span>
    <div className="flex-1">{children}</div>
  </div>
);

export default function DashboardBidang() {
  const navigate = useNavigate();
  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("pelaporan");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    tiketMasuk: 0,
    diverifikasi: 0,
    revisi: 0,
    ditolak: 0,
  });

  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // filter dummy (biar struktur kamu tetap ada)
  const [filterKategori, setFilterKategori] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterPrioritas, setFilterPrioritas] = useState("");

  // ========================== PAGINATION ==========================
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;

  // ========================== PRIORITY STYLE ==========================
  const getPriorityStyle = (priority) => {
    if (!priority) return "bg-gray-200 text-gray-700";

    const p = String(priority).toLowerCase();
    if (p === "high" || p === "tinggi")
      return "bg-red-100 text-red-700 border border-red-300";
    if (p === "medium" || p === "sedang")
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    if (p === "low" || p === "rendah")
      return "bg-green-100 text-green-700 border border-green-300";

    return "bg-gray-200 text-gray-700";
  };

  // ========================== AMBIL TICKET ID AMAN (FIX UTAMA) ==========================
  const getTicketId = (row) => {
    // paling aman: ticket_id dari backend
    if (row?.ticket_id) return row.ticket_id;

    // jaga-jaga kalau backend bungkus di row.ticket
    if (row?.ticket?.ticket_id) return row.ticket.ticket_id;

    // fallback terakhir
    if (row?.id) return row.id;

    return null;
  };

  // ========================== FETCH DASHBOARD ==========================
  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/dashboard/bidang`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      setStats({
        tiketMasuk: json.total_tickets || 0,
        diverifikasi: json.verified_tickets || 0,
        revisi: json.revisi_tickets || 0,
        ditolak: json.rejected_tickets || 0,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  // ========================== FETCH PELAPORAN ==========================
  const fetchPelaporan = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/tickets/bidang/verified/pelaporan-online`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      setTableData(json.data || []);
    } catch (err) {
      console.error("Pelaporan error:", err);
      setTableData([]);
    }
  };

  // ========================== FETCH PELAYANAN ==========================
  const fetchPelayanan = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/tickets/bidang/verified/pengajuan-pelayanan`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      setTableData(json.data || []);
    } catch (err) {
      console.error("Pelayanan error:", err);
      setTableData([]);
    }
  };

  // ========================== LOAD DATA BERDASARKAN TAB =========================
  useEffect(() => {
    // pindah tab -> balik halaman 1
    setCurrentPage(1);

    const run = async () => {
      setLoading(true);
      try {
        // dashboard selalu update biar konsisten
        await fetchDashboard();

        if (activeTab === "pelaporan") {
          await fetchPelaporan();
        } else {
          await fetchPelayanan();
        }
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ========================== REFRESH BUTTON ==========================
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchDashboard();
      if (activeTab === "pelaporan") await fetchPelaporan();
      else await fetchPelayanan();
    } finally {
      setLoading(false);
    }
  };

  // ========================== FILTER (opsional, aman) ==========================
  const filteredTable = tableData.filter((row) => {
    const kategori = String(row.asset?.kategori || row.kategori || "").toLowerCase();
    const jenis = String(row.asset?.jenis_asset || row.jenis_asset || "").toLowerCase();
    const priority = String(row.priority || "").toLowerCase();

    const okKategori = !filterKategori || kategori === filterKategori.toLowerCase();
    const okJenis = !filterJenis || jenis === filterJenis.toLowerCase();
    const okPrioritas = !filterPrioritas || priority === filterPrioritas.toLowerCase();

    return okKategori && okJenis && okPrioritas;
  });

  const currentData = filteredTable.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredTable.length / itemsPerPage);

  return (
    <LayoutBidang>
      <main className="p-6 bg-gray-50">
        {/* HEADER */}
        <div className="bg-white shadow-sm border rounded-xl p-6 mb-8">
          <h1 className="text-2xl font-bold text-[#226597]">Dashboard</h1>
        </div>

        {/* STATISTIK ATAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { number: stats.tiketMasuk, label: "Tiket Masuk", icon: "/assets/Tiket Masuk.png" },
            { number: stats.diverifikasi, label: "Diverifikasi", icon: "/assets/Diverifikasi.png" },
            { number: stats.revisi, label: "Revisi", icon: "/assets/Revisi.png" },
            { number: stats.ditolak, label: "Ditolak", icon: "/assets/Ditolak.png" },
          ].map((item, i) => (
            <div key={i} className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <img src={item.icon} className="w-8 h-8 object-contain" alt="" />
                <h3 className="font-semibold text-gray-800">{item.label}</h3>
              </div>
              <p className="text-3xl font-bold text-[#0F2C59]">{item.number}</p>
              <p className="text-sm text-gray-500 mt-1">tiket {item.label}</p>
            </div>
          ))}
        </div>

        {/* CARD TABLE */}
        <div className="bg-white shadow-md border rounded-xl p-7">
          {/* TAB + REFRESH */}
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <div className="flex gap-8">
              {["pelaporan", "pelayanan"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-semibold text-sm ${
                    activeTab === tab
                      ? "text-[#0F2C59] border-b-2 border-[#0F2C59]"
                      : "text-gray-500"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#226597] hover:bg-blue-600 text-white"}
              `}
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* FILTER */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Pencarian</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FilterRow label="Kategori">
                <FilterDropdown
                  placeholder="Pilih kategori"
                  options={["ti", "non ti"]}
                  value={filterKategori || ""}
                  onChange={(e) => {
                    setFilterKategori(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </FilterRow>

              <FilterRow label="Jenis">
                <FilterDropdown
                  placeholder="Pilih jenis"
                  options={["barang", "sdm"]}
                  value={filterJenis || ""}
                  onChange={(e) => {
                    setFilterJenis(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </FilterRow>

              <FilterRow label="Prioritas">
                <FilterDropdown
                  placeholder="Pilih prioritas"
                  options={["low", "medium", "high"]}
                  value={filterPrioritas || ""}
                  onChange={(e) => {
                    setFilterPrioritas(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </FilterRow>
            </div>
          </div>

          {/* TABEL */}
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-[#0F2C59] text-white font-medium text-sm p-3 text-center">
              <div className="text-left pl-2">Pengirim</div>
              <div>Tgl. Masuk</div>
              <div>Data Aset</div>
              <div>Nomor Seri</div>
              <div>Lampiran</div>
              <div>Prioritas</div>
              <div>Aksi</div>
            </div>

            {/* BODY */}
            {loading && (
              <div className="p-6 text-center text-gray-500">Memuat data...</div>
            )}

            {!loading && currentData.length === 0 && (
              <div className="p-6 text-center text-gray-500">Tidak ada data.</div>
            )}

            {!loading &&
              currentData.map((row, i) => {
                const ticketId = getTicketId(row);

                return (
                  <div
                    key={ticketId || i}
                    className="grid grid-cols-7 items-center p-3 border-b text-sm hover:bg-gray-50"
                  >
                    {/* Pengirim */}
                    <div className="flex items-center gap-3 pl-2">
                      <img
                        src={row.creator?.profile || "/assets/default.jpg"}
                        className="w-8 h-8 rounded-full object-cover"
                        alt=""
                      />
                      {row.creator?.full_name || "Tidak ada nama"}
                    </div>

                    {/* Tanggal */}
                    <div className="text-center">{row.created_at?.slice(0, 10) || "-"}</div>

                    {/* Data Aset */}
                    <div className="text-center">
                      {activeTab === "pelaporan"
                        ? row.asset?.nama_asset || "-"
                        : row.subkategori_nama || "-"}
                    </div>

                    {/* Nomor Seri */}
                    <div className="text-center">
                      {activeTab === "pelaporan" ? row.asset?.nomor_seri || "-" : "-"}
                    </div>

                    {/* Lampiran */}
                    <div className="flex justify-center items-center gap-1 text-[#0F2C59] underline cursor-pointer">
                      <DocumentIcon />
                      <span className="text-xs">{row.files?.length > 0 ? "lampiran" : "-"}</span>
                    </div>

                    {/* Priority */}
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(
                          row.priority
                        )}`}
                      >
                        {row.priority || "-"}
                      </span>
                    </div>

                    {/* Aksi (FIX: ANTI UNDEFINED) */}
                    <div
                      className={`flex justify-center ${
                        ticketId ? "cursor-pointer" : "cursor-not-allowed opacity-40"
                      }`}
                      onClick={() => {
  if (!ticketId) {
    console.error("ticket_id tidak ada pada row:", row);
    return;
  }

  if (activeTab === "pelaporan") {
    navigate(`/bidang/aksi/${ticketId}`);   // 👉 AksiPelBidang.jsx
  } else {
    navigate(`/aksitiket/${ticketId}`);     // 👉 AksiTiket.jsx
  }
}}

                      title={ticketId ? "Buka Aksi Tiket" : "ticket_id tidak ditemukan"}
                    >
                      <ActionIcon />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end items-center p-4 gap-3">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={`px-3 py-1 rounded ${
                currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#0F2C59] text-white"
              }`}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === num ? "bg-[#0F2C59] text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#0F2C59] text-white"
              }`}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </LayoutBidang>
  );
}
