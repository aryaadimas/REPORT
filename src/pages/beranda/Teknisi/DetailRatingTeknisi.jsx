import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailRatingTeknisi() {
  const navigate = useNavigate();
  const { ticket_id } = useParams();

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============== FETCH DETAIL RATING ==============
  const fetchDetail = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/teknisi/ratings/${ticket_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error("Gagal fetch detail rating:", err);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [ticket_id]);

  // ============== RENDER STARS ==============
  const renderStars = (count) =>
    Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < count ? "text-[#0F2C59]" : "text-gray-300"
        }`}
      />
    ));

  // ============== LOADING ==============
  if (loading || !data) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Memuat data...
      </div>
    );
  }

  const creator = data.creator || {};
  const asset = data.asset || {};

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl mx-auto">
        {/* === Judul === */}
        <h1 className="text-3xl font-bold text-[#0F2C59] text-center mb-8">
          Rating
        </h1>

        {/* === Pengirim & ID Tiket === */}
        <div className="space-y-4 mb-8">
          {/* Pengirim */}
          <div className="flex items-center">
            <label className="text-gray-600 text-sm font-medium w-32">
              Pengirim
            </label>
            <div className="flex items-center gap-2">
              <img
                src={creator.profile || "/assets/default.png"}
                alt={creator.full_name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-800">
                {creator.full_name}
              </span>
            </div>
          </div>

          {/* ID Tiket */}
          <div className="flex items-center">
            <label className="text-gray-600 text-sm font-medium w-32">
              ID Tiket
            </label>
            <div className="bg-gray-300 px-14 py-2 rounded-lg text-gray-700 font-medium w-fit">
              {data.ticket_code}
            </div>
          </div>
        </div>

        {/* === Rating Pelayanan === */}
        <div className="mb-6">
          <label className="text-gray-800 font-semibold block mb-2">
            Rating Kepuasan Pelayanan Kami
          </label>
          <div className="flex">{renderStars(data.rating)}</div>
        </div>

        {/* === Komentar === */}
        <div className="mb-6">
          <label className="text-gray-800 font-semibold block mb-2">
            Komentar
          </label>
          <textarea
            className="w-full bg-gray-100 rounded-lg p-3 text-gray-700 text-sm resize-none h-24"
            value={data.comment || "-"}
            readOnly
          />
        </div>

        {/* === Detail Aset === */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-700">Data Aset</p>
            <div className="bg-gray-100 rounded-lg p-2 text-gray-700 text-sm">
              {asset.nama_asset || "-"}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700">Nomor Seri</p>
            <div className="bg-gray-100 rounded-lg p-2 text-gray-700 text-sm">
              {asset.nomor_seri || "-"}
            </div>
          </div>
        </div>

        {/* === Tanggal pengerjaan === */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-700">Pengerjaan Awal</p>
            <div className="bg-gray-100 rounded-lg p-2 text-gray-700 text-sm">
              {new Date(data.pengerjaan_awal).toLocaleDateString("id-ID")}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700">Pengerjaan Akhir</p>
            <div className="bg-gray-100 rounded-lg p-2 text-gray-700 text-sm">
              {new Date(data.pengerjaan_akhir).toLocaleDateString("id-ID")}
            </div>
          </div>
        </div>

        {/* === Lokasi Kejadian === */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700">Lokasi Kejadian</p>
          <div className="bg-gray-100 rounded-lg p-2 text-gray-700 text-sm">
            {data.lokasi_kejadian || "-"}
          </div>
        </div>

        {/* === Deskripsi Masalah === */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700">Deskripsi</p>
          <textarea
            readOnly
            className="w-full bg-gray-100 rounded-lg p-3 text-gray-700 text-sm resize-none h-24"
            value={data.description || ""}
          />
        </div>

        {/* === Penyelesaian yang Diharapkan === */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700">
            Penyelesaian yang Diharapkan
          </p>
          <textarea
            readOnly
            className="w-full bg-gray-100 rounded-lg p-3 text-gray-700 text-sm resize-none h-24"
            value={data.expected_resolution || ""}
          />
        </div>

        {/* === BATALKAN BUTTON === */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
