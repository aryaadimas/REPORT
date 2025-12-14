import React, { useState, useEffect } from "react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

export default function LihatRating() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [ratingData, setRatingData] = useState(null);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    const getData = () => {
      console.log("=== DEBUG LihatRating ===");
      console.log("State dari navigasi:", state);

      let ticketItem = null;

      // 1. Coba ambil dari state navigasi
      if (state?.item) {
        ticketItem = state.item;
        console.log("Item dari state:", ticketItem);
        // Simpan juga ke localStorage sebagai backup
        localStorage.setItem("ticketData", JSON.stringify(ticketItem));
      }
      // 2. Coba ambil dari localStorage
      else {
        const storedItem = localStorage.getItem("ticketData");
        if (storedItem) {
          try {
            ticketItem = JSON.parse(storedItem);
            console.log("Item dari localStorage:", ticketItem);
          } catch (error) {
            console.error("Error parsing stored item:", error);
          }
        }
      }

      // 3. Jika masih tidak ada data, tampilkan error
      if (!ticketItem || !ticketItem.ticket_id) {
        console.log("Tidak ada data dari state atau localStorage");
        setDataError(
          "Data tiket tidak ditemukan. Silakan kembali ke halaman riwayat."
        );
        setLoading(false);
        return;
      }

      setItem(ticketItem);

      // Set rating data
      if (ticketItem.rating && ticketItem.rating_comment) {
        setRatingData({
          rating: ticketItem.rating,
          comment: ticketItem.rating_comment,
        });
      } else if (ticketItem.rating) {
        setRatingData({
          rating: ticketItem.rating,
          comment: "Tidak ada komentar",
        });
      } else {
        // Jika tidak ada rating, mungkin data salah
        setDataError("Data rating tidak tersedia untuk tiket ini.");
      }

      setLoading(false);
      console.log("=== END DEBUG ===");
    };

    getData();
  }, [state]);

  const handleBack = () => {
    localStorage.removeItem("ticketData");
    navigate("/riwayat");
  };

  // Tampilkan error jika ada masalah dengan data
  if (dataError) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Data Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-6">{dataError}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/riwayat")}
                className="bg-[#0F2C59] text-white px-6 py-2 rounded-lg hover:bg-[#15397A] transition"
              >
                Kembali ke Riwayat
              </button>
              <button
                onClick={() => window.location.reload()}
                className="border border-gray-400 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  // Loading state
  if (loading) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59]"></div>
            </div>
            <p className="text-center text-gray-500 mt-4">
              Memuat data rating...
            </p>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  const rating = ratingData?.rating || item.rating || 0;
  const comment =
    ratingData?.comment || item.rating_comment || "Belum ada komentar";

  return (
    <LayoutPegawai>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              {/* Debug Info */}
              {process.env.NODE_ENV === "development" && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Debug Info:</strong> ID Tiket:{" "}
                    {item.ticket_id || item.id} | Rating: {rating}/5
                  </p>
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-50 to-transparent opacity-30 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
                ⭐ Detail Rating & Ulasan
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium font-mono">
                    {item.id || item.ticket_id || "TKT-0000-000"}
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">
                    Judul Tiket
                  </p>
                  <p className="text-gray-800 font-medium">
                    {item.nama || item.title || "Tidak ada judul"}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => setShowDetail(!showDetail)}
                  className="flex items-center justify-between w-full text-left mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#0F2C59]">
                      📋 Detail Tiket Lengkap
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {showDetail ? "Sembunyikan" : "Tampilkan"}
                    </span>
                  </div>
                  {showDetail ? (
                    <ChevronUp className="text-[#0F2C59]" size={20} />
                  ) : (
                    <ChevronDown className="text-[#0F2C59]" size={20} />
                  )}
                </button>

                {showDetail && (
                  <div className="mt-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-gray-600 mb-1 flex items-center gap-1">
                            <span>📝 Deskripsi Masalah</span>
                          </p>
                          <div className="bg-white text-gray-800 rounded-lg p-3 text-sm border">
                            {item.description || "Tidak ada deskripsi"}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            🚨 Prioritas
                          </p>
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              item.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : item.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.priority || "Normal"}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            📅 Tanggal Dibuat
                          </p>
                          <div className="bg-white text-gray-800 rounded-lg p-3 text-sm border">
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Tidak tersedia"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            ✅ Status
                          </p>
                          <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {item.status_ticket_pengguna ||
                              item.status ||
                              "Belum diproses"}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            🏁 Tanggal Selesai
                          </p>
                          <div className="bg-white text-gray-800 rounded-lg p-3 text-sm border">
                            {item.tanggalSelesai
                              ? new Date(
                                  item.tanggalSelesai
                                ).toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Belum selesai"}
                          </div>
                        </div>
                        {item.pengerjaan_awal && (
                          <div>
                            <p className="font-semibold text-gray-600 mb-1">
                              ⏱️ Pengerjaan Dimulai
                            </p>
                            <div className="bg-white text-gray-800 rounded-lg p-3 text-sm border">
                              {new Date(
                                item.pengerjaan_awal
                              ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <p className="font-semibold text-gray-700 mb-3 text-lg">
                  ⭐ Rating Kepuasan Pelayanan
                </p>
                <div className="flex gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={28}
                      fill={i < rating ? "#F59E0B" : "#E5E7EB"}
                      stroke={i < rating ? "#F59E0B" : "#9CA3AF"}
                      className="transition-transform hover:scale-110"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-gray-800">
                    Rating: {rating}/5
                  </p>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${(rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="font-semibold text-gray-700 mb-3 text-lg">
                  💬 Ulasan & Komentar
                </p>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <textarea
                    readOnly
                    value={comment}
                    className="w-full bg-transparent text-gray-800 text-base resize-none min-h-[120px] leading-relaxed focus:outline-none"
                  />
                  <div className="text-right text-sm text-gray-500 mt-2">
                    {comment.length} karakter
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={handleBack}
                  className="border border-gray-400 text-gray-700 px-6 py-3 rounded-lg text-sm hover:bg-gray-100 transition flex items-center gap-2"
                >
                  ← Kembali ke Riwayat
                </button>

                {!state?.item && !localStorage.getItem("ticketData") && (
                  <div className="text-sm text-gray-500 italic">
                    Untuk data real, akses halaman ini melalui Riwayat Tiket
                  </div>
                )}
              </div>

              {process.env.NODE_ENV === "development" && (
                <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-600">
                  <p>
                    <strong>Rating Data:</strong>{" "}
                    {rating ? `${rating}/5` : "Tidak ada"}
                  </p>
                  <p>
                    <strong>Comment:</strong> {comment.substring(0, 50)}...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutPegawai>
  );
}
