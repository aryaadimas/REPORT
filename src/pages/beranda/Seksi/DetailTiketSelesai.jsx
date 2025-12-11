import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailTiketSelesai() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/tickets/seksi/finished/ticket/${ticket_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetch ticket selesai:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [ticket_id]);

  if (loading)
    return (
      <div className="p-6 text-center text-lg font-semibold">Memuat...</div>
    );

  if (!data)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Ticket tidak ditemukan.
      </div>
    );

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("id-ID") : "-";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59]">
        Detail Ticket Selesai
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <table className="w-full border-collapse">
          <tbody className="text-sm">

            <tr className="border-b">
              <td className="w-48 font-semibold text-[#0F2C59] p-3">
                Kode Ticket
              </td>
              <td className="p-3">{data.ticket_code}</td>
            </tr>

            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">Judul</td>
              <td className="p-3">{data.title}</td>
            </tr>

            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">Deskripsi</td>
              <td className="p-3">{data.description || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">Status</td>
              <td className="p-3 capitalize">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">
                  {data.status}
                </span>
              </td>
            </tr>

            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">Prioritas</td>
              <td className="p-3">{data.priority || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">
                Lokasi Kejadian
              </td>
              <td className="p-3">{data.lokasi_kejadian || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">
                Tanggal Dibuat
              </td>
              <td className="p-3">{formatDate(data.created_at)}</td>
            </tr>

            {/* DURASI PENGERJAAN */}
            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">
                Pengerjaan Mulai
              </td>
              <td className="p-3">{formatDate(data.pengerjaan_awal)}</td>
            </tr>

            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">
                Pengerjaan Selesai
              </td>
              <td className="p-3">{formatDate(data.pengerjaan_akhir)}</td>
            </tr>

            {/* PELAPOR */}
            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">Pelapor</td>
              <td className="p-3">{data.pelapor?.full_name || "-"}</td>
            </tr>

            {/* ASSET */}
            <tr className="border-b">
              <td className="font-semibold text-[#0F2C59] p-3">Asset</td>
              <td className="p-3">{data.asset?.nama_asset || "-"}</td>
            </tr>

          </tbody>
        </table>

        {/* BUTTON KEMBALI */}
        <div className="mt-10">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#0F2C59] text-white rounded-lg hover:bg-[#15397A]"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
