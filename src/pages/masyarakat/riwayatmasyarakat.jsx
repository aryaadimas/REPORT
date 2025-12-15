import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

export default function LihatRating() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const ticketId =
    state?.item?.ticket_id ||
    state?.ticketId ||
    "09635cce-db14-43e9-a1bd-cd3a3fc901cc";

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);

        const tokenKeys = [
          "access_token",
          "token",
          "auth_token",
          "bearer_token",
        ];
        let token = null;

        for (const key of tokenKeys) {
          const storedToken = localStorage.getItem(key);
          if (storedToken) {
            token = storedToken;
            break;
          }
        }

        if (!token) {
          console.warn("No token found in localStorage");
          token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTY5OTQ0M30.1JAk7yDczD2TwxDv94qz479-F_4ER08gjJipgh1yQVY";
        }

        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/${ticketId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Sesi Anda telah habis. Silakan login ulang.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Ticket data response:", data);

        if (data.rating) {
          console.log("Rating data:", data.rating);
          console.log("Rating value:", data.rating.rating);
          console.log("Rating comment:", data.rating.comment);
        }

        setTicketData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching ticket data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Data tidak ditemukan</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  console.log("Final ticketData:", ticketData);
  console.log("Rating object:", ticketData.rating);
  console.log("Rating value:", ticketData.rating?.rating);
  console.log("Rating comment:", ticketData.rating?.comment);

  let ratingValue = 0;
  let ratingComment = "Belum ada komentar";

  if (ticketData.rating) {
    if (typeof ticketData.rating === "object") {
      ratingValue =
        ticketData.rating.rating || ticketData.rating.rating_value || 0;
      ratingComment =
        ticketData.rating.comment ||
        ticketData.rating.comment_text ||
        "Belum ada komentar";
    } else if (typeof ticketData.rating === "number") {
      ratingValue = ticketData.rating;
      ratingComment = "Belum ada komentar";
    }
  }

  if (state?.item?.rating_object) {
    const ratingObj = state.item.rating_object;
    if (typeof ratingObj === "object") {
      ratingValue = ratingObj.rating || ratingValue;
      ratingComment = ratingObj.comment || ratingComment;
    } else if (typeof ratingObj === "number") {
      ratingValue = ratingObj;
    }
  }

  if (state?.item?.rating) {
    if (typeof state.item.rating === "object") {
      ratingValue = state.item.rating.rating || ratingValue;
      ratingComment = state.item.rating.comment || ratingComment;
    } else if (typeof state.item.rating === "number") {
      ratingValue = state.item.rating;
    }
  }

  console.log("Final rating value:", ratingValue);
  console.log("Final rating comment:", ratingComment);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

          <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
            Detail Rating
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">Pengirim</p>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/Anya.jpg"
                  alt="pengirim"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <p className="text-gray-800 font-medium">
                  {ticketData.creator?.full_name ||
                    state?.item?.creator?.full_name ||
                    "Sri Wulandari"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                {ticketData.ticket_code ||
                  state?.item?.ticket_code ||
                  "LPR321336"}
              </div>
            </div>
          </div>

          <div className="mb-6">
            {showDetail && (
              <div className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Judul Pelaporan
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.title ||
                          state?.item?.title ||
                          "Printer Sekarat"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Data Aset
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.nama_asset ||
                          state?.item?.asset?.nama_asset ||
                          "Printer HP LaserJet Pro P1102w"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Kategori Aset
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.kategori ||
                          state?.item?.asset?.kategori ||
                          "Non TI"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Lokasi Kejadian
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.lokasi_kejadian ||
                          state?.item?.lokasi_kejadian ||
                          "Dinas Pendidikan Kantor Pusat"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Nomor Seri
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.nomor_seri ||
                          state?.item?.asset?.nomor_seri ||
                          "HP-LJ-P1102W-001"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Sub-Kategori Aset
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.subkategori_nama ||
                          state?.item?.asset?.subkategori_nama ||
                          "Jaringan"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Jenis Aset
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.jenis_asset ||
                          state?.item?.asset?.jenis_asset ||
                          "Barang"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">Status</p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.status || state?.item?.status || "Selesai"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <p className="font-semibold text-gray-600 mb-2">
              Rating Kepuasan Pelayanan Kami
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 text-[#0F2C59]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    fill={i < ratingValue ? "#0F2C59" : "#D1D5DB"}
                    stroke={i < ratingValue ? "#0F2C59" : "#D1D5DB"}
                  />
                ))}
              </div>
              <span className="ml-3 text-gray-600 text-sm font-medium">
                {ratingValue}/5
              </span>
              {ratingValue === 0 && (
                <span className="ml-3 text-gray-400 text-sm">
                  (Belum ada rating)
                </span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <p className="font-semibold text-gray-600 mb-1">Komentar</p>
            <textarea
              readOnly
              value={ratingComment}
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed"
            />
          </div>

          <div className="flex justify-start">
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
