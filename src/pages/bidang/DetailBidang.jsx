import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import LayoutBidang from "../../components/Layout/LayoutBidang";

export default function DetailBidang() {
  const { id } = useParams(); // ini ticket_id (UUID)
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  const fetchDetail = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/tickets/bidang/assigned/teknisi/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Detail error status:", res.status);
        setDetail(null);
        return;
      }

      const json = await res.json();
      setDetail(json);
    } catch (err) {
      console.error("ERROR FETCH DETAIL:", err);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
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

  if (loading) {
    return (
      <LayoutBidang>
        <div className="p-10 text-center text-gray-500">Loading...</div>
      </LayoutBidang>
    );
  }

  if (!detail) {
    return (
      <LayoutBidang>
        <div className="p-10 text-center text-gray-600">
          <h2 className="text-xl font-semibold">Data laporan tidak ditemukan</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Kembali
          </button>
        </div>
      </LayoutBidang>
    );
  }

  const filesArray = Array.isArray(detail.files) ? detail.files : [];

  return (
    <LayoutBidang>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-[#0F2C59] mb-4">
          Detail Laporan
        </h1>

        <div className="bg-white rounded-2xl shadow border p-8 space-y-8">
          {/* PENGIRIM */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold text-gray-800">
                Pengirim
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {detail.creator?.profile ? (
                    <img
                      src={detail.creator.profile}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#226597] text-white">
                      {detail.creator?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>
                <span className="font-medium text-gray-700">
                  {detail.creator?.full_name}
                </span>
              </div>
            </div>

            {/* ID */}
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold text-gray-800">
                ID Laporan
              </label>
              <div className="bg-gray-200 px-4 py-2 rounded-md w-48 text-center font-medium">
                {detail.ticket_code}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold text-gray-800">Status</label>
              <div className="bg-gray-200 px-4 py-2 rounded-md w-48 text-center font-medium capitalize">
                {detail.status}
              </div>
            </div>

            {/* Prioritas */}
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold text-gray-800">
                Prioritas
              </label>
              <div
                className={`px-4 py-2 rounded-md text-white w-48 text-center font-semibold ${getPriorityColor(
                  detail.priority
                )}`}
              >
                {detail.priority}
              </div>
            </div>
          </div>

          {/* Judul */}
          <div className="pt-4 border-t">
            <label className="font-semibold text-gray-800">
              Judul Laporan
            </label>
            <input
              readOnly
              value={detail.title || "-"}
              className="w-full bg-gray-200 px-4 py-2 rounded-lg mt-1"
            />
          </div>

          {/* Data aset & nomor seri */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-800">Data Aset</label>
              <div className="bg-gray-200 px-4 py-2 rounded-lg mt-1">
                {detail.asset?.nama_asset || "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-800">Nomor Seri</label>
              <div className="bg-gray-200 px-4 py-2 rounded-lg mt-1">
                {detail.asset?.nomor_seri || "-"}
              </div>
            </div>
          </div>

          {/* Kategori / Sub / Jenis */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="font-semibold text-gray-800">Kategori</label>
              <div className="bg-gray-200 px-4 py-2 rounded-lg mt-1">
                {detail.asset?.kategori || "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-800">
                Sub Kategori
              </label>
              <div className="bg-gray-200 px-4 py-2 rounded-lg mt-1">
                {detail.asset?.subkategori_nama || "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-800">Jenis Aset</label>
              <div className="bg-gray-200 px-4 py-2 rounded-lg mt-1">
                {detail.asset?.jenis_asset || "-"}
              </div>
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="font-semibold text-gray-800">
              Lokasi Kejadian
            </label>
            <div className="bg-gray-200 px-4 py-2 rounded-lg mt-1 w-1/2">
              {detail.lokasi_kejadian || "-"}
            </div>
          </div>

          {/* Rincian */}
          <div>
            <label className="font-semibold text-gray-800">
              Rincian Masalah
            </label>
            <textarea
              readOnly
              rows="3"
              className="w-full bg-gray-200 rounded px-4 py-2 mt-1"
              value={detail.description || "-"}
            />
          </div>

          {/* Lampiran */}
          <div>
            <label className="font-semibold text-gray-800">Lampiran</label>

            {filesArray.length === 0 ? (
              <p className="text-gray-500 text-sm mt-2">
                Tidak ada lampiran
              </p>
            ) : (
              filesArray.map((f, i) => (
                <div key={i} className="mt-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0F2C59]" />
                  <a
                    href={f.file_path}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-700"
                  >
                    Lihat Lampiran
                  </a>
                </div>
              ))
            )}
          </div>

          {/* Penyelesaian */}
          <div>
            <label className="font-semibold text-gray-800">Penyelesaian</label>
            <textarea
              readOnly
              rows="2"
              className="w-full bg-gray-200 rounded px-4 py-2 mt-1"
              value={detail.deskripsi_pengendalian_bidang || "-"}
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-end pt-5">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </LayoutBidang>
  );
}
