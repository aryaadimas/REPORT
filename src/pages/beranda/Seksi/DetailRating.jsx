import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailRating() {
  const navigate = useNavigate();
  const { ticket_id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // === FETCH DETAIL RATING ===
  const fetchDetail = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/seksi/ratings/${ticket_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching detail rating:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, [ticket_id]);

  const renderStars = (count) =>
    Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < count ? "text-[#0F2C59]" : "text-gray-300"
        }`}
      />
    ));

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Memuat data...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Gagal memuat data rating
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl mx-auto">
        {/* === Judul === */}
        <h1 className="text-3xl font-bold text-[#0F2C59] text-center mb-8">
          Detail Rating
        </h1>

        {/* === Pengirim + ID Tiket === */}
        <div className="space-y-4 mb-8">
          {/* Pengirim */}
          <div className="flex items-center">
            <label className="text-gray-600 text-sm font-medium w-32">
              Pengirim
            </label>
            <div className="flex items-center gap-2">
              <img
                src={data.creator?.profile || "/assets/default-avatar.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-800">
                {data.creator?.full_name || "-"}
              </span>
            </div>
          </div>

          {/* ID Tiket */}
          <div className="flex items-center">
            <label className="text-gray-600 text-sm font-medium w-32">
              ID Tiket
            </label>
            <div className="bg-gray-200 px-6 py-2 rounded-lg text-gray-700 font-medium">
              {data.ticket_code}
            </div>
          </div>
        </div>

        {/* === Rating Kepuasan === */}
        <div className="mb-6">
          <label className="text-gray-800 font-semibold block mb-2">
            Rating Kepuasan Pelayanan
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

        {/* === Tombol Kembali === */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
