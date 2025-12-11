import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";


export default function DetailArsip() {
  const { asset_id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/tickets/seksi/finished/${asset_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setDetail(data);
      } catch (error) {
        console.error("Error fetch detail arsip:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [asset_id]);

  if (loading)
    return (
      <div className="p-6 text-center text-lg font-semibold">
        Memuat data...
      </div>
    );

  if (!detail)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Data tidak ditemukan.
      </div>
    );

  const tickets = detail.data || [];
  const namaAsset = tickets[0]?.asset?.nama_asset || "Nama aset tidak ditemukan";

  // Helper tanggal
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("id-ID") : "-";

  return (
    <div className="p-6 space-y-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-[#0F2C59] text-center">
        Detail Arsip Laporan
      </h1>

      {/* SUBTITLE: NAMA ASSET */}
      <h2 className="text-lg font-semibold text-center text-gray-700">
        {namaAsset}
      </h2>

      {/* TABLE WRAPPER */}
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#0F2C59] text-white">
            <tr>
              <th className="p-3 text-left">Kode Ticket</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Tanggal Laporan</th>
              <th className="p-3 text-left">Pelapor</th>
              <th className="p-3 text-left">Deskripsi</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
  {tickets.map((t) => (
    <tr key={t.ticket_id} className="border-b hover:bg-gray-50">
      
      <td className="p-3">{t.ticket_code}</td>

      <td className="p-3 capitalize">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">
          {t.status}
        </span>
      </td>

      <td className="p-3">{formatDate(t.created_at)}</td>

      <td className="p-3">{t.pelapor?.full_name || "-"}</td>

      <td className="p-3">{t.description || "-"}</td>

      {/* 🔥 BUTTON AKSI KE DETAIL TIKET SELESAI */}
      <td className="p-3 text-right">
        <button
          onClick={() =>
            navigate(`/detailtiketselesai/${t.ticket_id}`)
          }
          className="p-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>

        {/* BUTTON KEMBALI */}
        <div className="mt-10">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#0F2C59] hover:bg-[#15397A] text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
