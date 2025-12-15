import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

export default function BeriRatingMasyarakat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  const [mainRating, setMainRating] = useState(0);
  const [easeRating, setEaseRating] = useState(0);
  const [speedRating, setSpeedRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTk1NDYwMH0.j76PzwY6VlFwsSaAHymQeIkpjkZWB_ujrhsXR8B_so4",
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

  const handleSubmit = async () => {
    if (mainRating === 0) {
      alert("Harap berikan rating sebelum mengirim!");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append("rating", mainRating.toString().padStart(2, "0"));
      formData.append("comment", comment);

      const response = await fetch(
        `https://service-desk-be-production.up.railway.app/api/tickets/${ticketId}/rating`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTk1NDYwMH0.j76PzwY6VlFwsSaAHymQeIkpjkZWB_ujrhsXR8B_so4",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        alert("Rating berhasil dikirim!");
        navigate("/riwayatmasyarakat");
      } else {
        throw new Error(result.message || "Gagal mengirim rating");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert(`Gagal mengirim rating: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
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
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  size={24}
                  className="cursor-pointer transition"
                  fill={num <= mainRating ? "#0F2C59" : "none"}
                  stroke="#0F2C59"
                  onClick={() => setMainRating(num)}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="font-semibold text-gray-600 mb-1">Komentar</p>
            <textarea
              placeholder="Ketik di sini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
            />
          </div>

          <div className="flex justify-start gap-3">
            <button
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#0F2C59] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#15397A] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
