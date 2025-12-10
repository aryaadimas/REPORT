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
        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/${ticketId}`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTY5OTQ0M30.1JAk7yDczD2TwxDv94qz479-F_4ER08gjJipgh1yQVY",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

  const hasRating = ticketData.rating && ticketData.rating.rating;
  const ratingValue = hasRating ? ticketData.rating.rating : 5;

  return (
    <div className="w-full bg-[#F9FAFB] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

          <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
            Rating
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
                  {ticketData.creator?.full_name || "Sri Wulandari"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                {ticketData.ticket_code || "LPR321336"}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowDetail(!showDetail)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <p className="font-semibold text-gray-600 w-40">Detail Tiket</p>
              {showDetail ? (
                <ChevronUp className="text-[#0F2C59]" size={20} />
              ) : (
                <ChevronDown className="text-[#0F2C59]" size={20} />
              )}
            </button>

            {showDetail && (
              <div className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Judul Pelaporan
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.title || "Printer Sekarat"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Data Aset
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.nama_asset ||
                          "Printer HP LaserJet Pro P1102w"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Kategori Aset
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.kategori || "Non TI"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Lokasi Kejadian
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.lokasi_kejadian ||
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
                        {ticketData.asset?.nomor_seri || "HP-LJ-P1102W-001"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Sub-Kategori Aset
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.subkategori_nama || "Jaringan"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Jenis Aset
                      </p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.asset?.jenis_asset || "Barang"}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-1">Status</p>
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                        {ticketData.status || "-"}
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
            <div className="flex gap-1 text-[#0F2C59]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  fill={i < ratingValue ? "#0F2C59" : "#D1D5DB"}
                  stroke={i < ratingValue ? "#0F2C59" : "#D1D5DB"}
                />
              ))}
              {hasRating && (
                <span className="ml-3 text-gray-600 text-sm">
                  ({ratingValue}/5)
                </span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <p className="font-semibold text-gray-600 mb-1">Komentar</p>
            <textarea
              readOnly
              value={ticketData.rating?.comment || "yayayayayap"}
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
