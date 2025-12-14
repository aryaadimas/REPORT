import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

export default function MonitoringTiketSeksi() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const BASE_URL = "https://service-desk-be-production.up.railway.app";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH DETAIL TIKET
  ============================================================ */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/tickets/seksi/assigned/teknisi/${ticketId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        setData(json); // BE return object langsung, bukan json.data
      } catch (err) {
        console.error("Gagal memuat detail tiket:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [ticketId]);

  /* ============================================================
     PRIORITAS BADGE
  ============================================================ */
  const getPriorityColor = (p) => {
    if (!p) return "bg-gray-400";
    switch (p.toLowerCase()) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Memuat detail laporan...</h2>
      </div>
    );
  }

  /* ============================================================
     DATA TIDAK ADA
  ============================================================ */
  if (!data || !data.ticket_id) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Data laporan tidak ditemukan</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Kembali
        </button>
      </div>
    );
  }

  const asset = data.asset || {};
  const files = data.files || [];

  /* ============================================================
     RENDER UI
  ============================================================ */
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59] mb-4">
        Detail Laporan
      </h1>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-8 space-y-8">


        {/* =======================================================================
            PENGIRIM - ID LAPORAN - STATUS - PRIORITAS
        ======================================================================= */}
        <div className="space-y-4">
          
          {/* Pengirim */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold text-gray-800">Pengirim</label>
            <div className="flex items-center gap-3">
              <img
                src="/assets/default.jpg"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-medium text-gray-700">
                {data.creator?.full_name}
              </span>
            </div>
          </div>

          {/* ID Laporan */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold text-gray-800">ID Laporan</label>
            <div className="bg-gray-300 px-4 py-2 rounded-md text-sm w-48 text-center">
              {data.ticket_code}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold text-gray-800">Status</label>
            <div className="bg-gray-300 px-4 py-2 rounded-md text-sm w-48 text-center">
              {data.status_ticket_seksi || data.status}
            </div>
          </div>

          {/* Prioritas */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold text-gray-800">Prioritas</label>
            <div
              className={`px-4 py-2 rounded-md text-white w-48 text-center text-sm font-semibold ${getPriorityColor(
                data.priority
              )}`}
            >
              {data.priority}
            </div>
          </div>
        </div>

        {/* =======================================================================
            JUDUL PELAPORAN
        ======================================================================= */}
        <div className="border-t pt-4">
          <label className="font-semibold text-gray-800">Judul Pelaporan</label>
          <input
            readOnly
            value={data.title}
            className="w-full bg-gray-300 px-4 py-2 rounded-lg mt-1"
          />
        </div>

        {/* =======================================================================
            DATA ASET UTAMA (Nama Aset & Nomor Seri)
        ======================================================================= */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-gray-700">Nama Aset</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {asset.nama_asset}
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700">Nomor Seri</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {asset.nomor_seri}
            </div>
          </div>
        </div>

        {/* =======================================================================
            KATEGORI - SUBKATEGORI - JENIS ASSET
        ======================================================================= */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-medium text-gray-700">Kategori</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {asset.kategori}
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700">Sub-Kategori</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {asset.subkategori_nama}
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700">Jenis Asset</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {asset.jenis_asset}
            </div>
          </div>
        </div>

        {/* =======================================================================
            LOKASI KEJADIAN
        ======================================================================= */}
        <div>
          <label className="font-semibold text-gray-800">Lokasi Kejadian</label>
          <input
            readOnly
            value={data.lokasi_kejadian}
            className="w-full bg-gray-300 px-4 py-2 rounded-lg mt-1"
          />
        </div>

        {/* =======================================================================
            RINCIAN MASALAH
        ======================================================================= */}
        <div>
          <label className="font-semibold text-gray-800">Rincian Masalah</label>
          <textarea
            readOnly
            rows="3"
            className="w-full bg-gray-300 rounded px-4 py-2 mt-1"
            value={data.description}
          />
        </div>

        {/* =======================================================================
            LAMPIRAN FILE (JIKA ADA)
        ======================================================================= */}
        <div>
          <label className="font-semibold text-gray-800">Lampiran File</label>

          {files.length === 0 ? (
            <div className="text-gray-500 text-sm mt-1">Tidak ada lampiran</div>
          ) : (
            <div className="space-y-2 mt-2">
              {files.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  className="flex items-center gap-2 text-blue-600 underline text-sm"
                >
                  <FileText className="w-5 h-5" />
                  {file.file_name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* =======================================================================
            PENYELESAIAN YANG DIHARAPKAN
        ======================================================================= */}
        <div>
          <label className="font-semibold text-gray-800">
            Penyelesaian yang diharapkan
          </label>
          <textarea
            readOnly
            rows="3"
            className="w-full bg-gray-300 rounded px-4 py-2 mt-1"
            value={data.deskripsi_pengendalian_bidang || "Tidak ada data"}
          />
        </div>

        {/* =======================================================================
            TOMBOL KEMBALI
        ======================================================================= */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Kembali
          </button>
        </div>

      </div>
    </div>
  );
}
