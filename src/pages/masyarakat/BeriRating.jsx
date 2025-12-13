import React, { useState, useEffect } from "react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

export default function BeriRating() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({});
  const [token, setToken] = useState("");
  const [mainRating, setMainRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      // Cek token dari berbagai sumber
      let storedToken =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("user_token");

      // Prioritas 1: Token dari state
      if (!storedToken && state?.token) {
        storedToken = state.token;
      }

      // Jika masih tidak ada token, redirect ke login
      if (!storedToken) {
        alert("Anda harus login terlebih dahulu");
        navigate("/login-sso");
        return;
      }

      setToken(storedToken);

      // Ambil data tiket
      let ticketItem = null;

      // Prioritas 1: Dari state navigasi
      if (state?.item) {
        ticketItem = state.item;
      }
      // Prioritas 2: Dari localStorage
      else {
        const storedItem = localStorage.getItem("ticketData");
        if (storedItem) {
          try {
            ticketItem = JSON.parse(storedItem);
          } catch (error) {
            console.error("Error parsing stored item:", error);
          }
        }
      }

      // Jika tidak ada data, tampilkan error
      if (!ticketItem || !ticketItem.ticket_id) {
        setDataError(
          "Data tiket tidak ditemukan. Silakan kembali ke halaman riwayat."
        );
      }

      setItem(ticketItem || {});
      setLoading(false);
    };

    getData();
  }, [state, navigate]); // Hapus dependency token jika menyebabkan loop
  const handleSubmit = async () => {
    if (mainRating === 0) {
      alert("Silakan beri rating terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        rating: mainRating,
        comment: comment,
      };

      const response = await fetch(
        `https://service-desk-be-production.up.railway.app/api/rating/${item.ticket_id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          alert("Sesi telah berakhir. Silakan login kembali.");
          navigate("/login-sso");
          return;
        }
        throw new Error(`Gagal mengirim rating: ${response.status}`);
      }

      alert("Rating berhasil dikirim!");
      localStorage.removeItem("ticketData");
      navigate("/riwayat");
    } catch (error) {
      alert(`Gagal mengirim rating: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("ticketData");
    navigate("/riwayat");
  };

  if (!token && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Token Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">Silakan login terlebih dahulu.</p>
          <button
            onClick={() => navigate("/login-sso")}
            className="bg-[#0F2C59] text-white px-6 py-2 rounded-lg hover:bg-[#15397A] transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59]"></div>
          </div>
          <p className="text-center text-gray-500 mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Tambahkan state untuk error
  const [dataError, setDataError] = useState(null);

  // ... di dalam useEffect, ganti bagian if (!ticketItem):
  if (!ticketItem || !ticketItem.ticket_id) {
    console.warn("Data tiket tidak lengkap");
    setDataError(
      "Data tiket tidak ditemukan. Silakan kembali ke halaman riwayat dan coba lagi."
    );
    setLoading(false);
    return;
  }

  // ... sebelum render utama, tambahkan pengecekan:
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
  return (
    <LayoutPegawai>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
                Beri Rating
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {item.id || "N/A"}
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Judul</p>
                  <p className="text-gray-800 font-medium">
                    {item.nama || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => setShowDetail(!showDetail)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <p className="font-semibold text-gray-600 mb-1">
                    Detail Tiket
                  </p>
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
                            Deskripsi
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            {item.description || "Tidak ada deskripsi"}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Prioritas
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            {item.priority || "N/A"}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Tanggal Dibuat
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString(
                                  "id-ID"
                                )
                              : "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Status
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            {item.status_ticket_pengguna ||
                              item.status ||
                              "N/A"}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Tanggal Selesai
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            {item.tanggalSelesai || "Belum selesai"}
                          </div>
                        </div>
                        {item.pengerjaan_awal && (
                          <div>
                            <p className="font-semibold text-gray-600 mb-1">
                              Pengerjaan Dimulai
                            </p>
                            <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                              {new Date(
                                item.pengerjaan_awal
                              ).toLocaleDateString("id-ID")}
                            </div>
                          </div>
                        )}
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
                  placeholder="Berikan komentar Anda tentang pelayanan ini..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                />
              </div>

              <div className="flex justify-start gap-3">
                <button
                  onClick={handleCancel}
                  className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || mainRating === 0}
                  className={`px-5 py-2 rounded-lg text-sm transition ${
                    isSubmitting || mainRating === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0F2C59] hover:bg-[#15397A] text-white"
                  }`}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Rating"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPegawai>
  );
}
