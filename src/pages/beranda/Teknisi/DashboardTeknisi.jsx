import React, { useEffect, useState } from "react";
import { FileText, RefreshCcw, X } from "lucide-react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function DashboardTeknisi() {
  const navigate = useNavigate();

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // =====================
  // STATES
  // =====================
  const [summary, setSummary] = useState({
    total_tickets: 0,
    in_progress: 0,
    deadline: 0,
    reopen: 0,
  });

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // FILTERS
  const [searchAset, setSearchAset] = useState("");
  const [selectedSeri, setSelectedSeri] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // NOMOR SERI DEPENDENCY
  const [availableSeri, setAvailableSeri] = useState([]);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // =====================
  // FETCH SUMMARY
  // =====================
  const fetchSummary = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/dashboard/teknisi/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Gagal fetching summary:", err);
    }
  };

  // =====================
  // FETCH TICKETS
  // =====================
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/tickets/teknisi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setTickets(result.data || []);
    } catch (err) {
      console.error("Gagal fetch tiket:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTickets();
  }, []);

  // =====================
  // FILTER LOGIC
  // =====================
  const filteredTickets = tickets.filter((t) => {
    const namaAset = t.asset?.nama_asset || "";
    const nomorSeri = t.asset?.nomor_seri || "";
    const status = t.status_ticket_teknisi || "";

    const matchAset =
      searchAset === "" || namaAset.toLowerCase().includes(searchAset.toLowerCase());

    const matchSeri =
      selectedSeri === "" || nomorSeri.toLowerCase() === selectedSeri.toLowerCase();

    const matchStatus =
      statusFilter === "Semua" ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchAset && matchSeri && matchStatus;
  });

  // =====================
  // HANDLE NOMOR SERI DROPDOWN
  // =====================
  useEffect(() => {
    if (searchAset.trim() === "") {
      setAvailableSeri([]);
      setSelectedSeri("");
      return;
    }

    const seriList = tickets
      .filter((t) =>
        t.asset?.nama_asset?.toLowerCase().includes(searchAset.toLowerCase())
      )
      .map((t) => t.asset?.nomor_seri)
      .filter((seri) => seri);

    setAvailableSeri([...new Set(seriList)]);
  }, [searchAset, tickets]);

  // =====================
  // PAGINATION
  // =====================
  const totalPages = Math.ceil(filteredTickets.length / perPage);
  const indexLast = currentPage * perPage;
  const indexFirst = indexLast - perPage;
  const currentData = filteredTickets.slice(indexFirst, indexLast);

  const gotoPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // =====================
  // STATUS BADGE
  // =====================
  const statusColor = (s) => {
    if (!s) return "bg-gray-200 text-gray-700";
    s = s.toLowerCase();
    if (s === "diproses") return "bg-yellow-100 text-yellow-700";
    if (s === "draft") return "bg-gray-200 text-gray-700";
    if (s === "revisi") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // =====================
  // EDIT BUTTON
  // =====================
  const handleEdit = (id) => navigate(`/updateprogresteknisi/${id}`);

  // =====================
  // RENDER
  // =====================
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#0F2C59]">Dashboard</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { title: "Tiket Masuk", value: summary.total_tickets },
          { title: "Proses", value: summary.in_progress },
          { title: "Deadline", value: summary.deadline },
          { title: "Reopen", value: summary.reopen },
        ].map((item, i) => (
          <div key={i} className="bg-white shadow rounded-xl p-4 text-center">
            <p className="text-gray-600 font-medium">{item.title}</p>
            <h2 className="text-3xl font-bold text-[#0F2C59] mt-2">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* CARD */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-3">
          <p className="font-semibold text-[#0F2C59]">Daftar Tiket Teknisi</p>

          <button
            onClick={() => {
              fetchSummary();
              fetchTickets();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0F2C59] hover:bg-[#15397A] text-white"
            }`}
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-gray-50 p-6 border-b">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">
            Filter Pencarian
          </h3>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            {/* ASET */}
            <div className="flex items-center justify-between">
              <label className="w-1/4 font-semibold text-gray-700">Aset</label>
              <div className="relative w-3/4">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10"
                  placeholder="Cari aset"
                  value={searchAset}
                  onChange={(e) => {
                    setSearchAset(e.target.value);
                    setSelectedSeri("");
                  }}
                />
                {searchAset !== "" && (
                  <button
                    onClick={() => {
                      setSearchAset("");
                      setSelectedSeri("");
                    }}
                    className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* NOMOR SERI */}
            <div className="flex items-center justify-between">
              <label className="w-1/4 font-semibold text-gray-700">
                Nomor Seri
              </label>
              <select
                className="w-3/4 border border-gray-300 rounded-lg px-3 py-2"
                disabled={availableSeri.length === 0}
                value={selectedSeri}
                onChange={(e) => setSelectedSeri(e.target.value)}
              >
                <option value="">Semua</option>
                {availableSeri.map((seri, i) => (
                  <option key={i} value={seri}>
                    {seri}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div className="flex items-center justify-between">
              <label className="w-1/4 font-semibold text-gray-700">Status</label>
              <select
                className="w-3/4 border border-gray-300 rounded-lg px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Semua</option>
                <option>Diproses</option>
                <option>Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#0F2C59] text-white">
                <th className="p-3">Pengirim</th>
                <th className="p-3">Tanggal Masuk</th>
                <th className="p-3">Aset</th>
                <th className="p-3">Nomor Seri</th>
                <th className="p-3 text-center">Lampiran</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}

              {currentData.map((item) => (
                <tr key={item.ticket_id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={item.creator?.profile}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {item.creator?.full_name}
                  </td>

                  <td className="p-3">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </td>

                  <td className="p-3">{item.asset?.nama_asset || "-"}</td>
                  <td className="p-3">{item.asset?.nomor_seri || "-"}</td>

                  <td className="p-3 text-center text-[#0F2C59]">
                    <FileText className="inline w-5 h-5 cursor-pointer" />
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColor(
                        item.status_ticket_teknisi
                      )}`}
                    >
                      {item.status_ticket_teknisi}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(item.ticket_id)}
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

        {/* PAGINATION */}
        {filteredTickets.length > 0 && (
          <div className="flex justify-end items-center gap-2 p-4 border-t text-sm">


            <button
              onClick={() => gotoPage(currentPage - 1)}
              className="px-3 py-1 border rounded-lg hover:bg-gray-100"
            >
              ‹ Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => gotoPage(i + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === i + 1
                    ? "bg-[#0F2C59] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => gotoPage(currentPage + 1)}
              className="px-3 py-1 border rounded-lg hover:bg-gray-100"
            >
              Next ›
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
