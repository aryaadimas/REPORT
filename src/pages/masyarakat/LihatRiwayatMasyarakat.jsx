import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

export default function LihatRiwayatMasyarakat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [nik, setNik] = useState("357885380230002");

  const ticketId =
    state?.item?.ticket_id ||
    state?.ticketId ||
    "09635cce-db14-43e9-a1bd-cd3a3fc901cc";

  // Fungsi untuk mengambil token dari localStorage
  const getToken = () => {
    const tokenKeys = ["access_token", "token", "auth_token", "bearer_token"];

    for (const key of tokenKeys) {
      const storedToken = localStorage.getItem(key);
      if (storedToken) {
        console.log(`✅ Token ditemukan di: ${key}`);
        return storedToken;
      }
    }

    console.warn("❌ Token tidak ditemukan di localStorage");
    return null;
  };

  // Fungsi untuk membersihkan token yang tidak valid
  const clearInvalidAuth = () => {
    const authKeys = [
      "access_token",
      "token",
      "auth_token",
      "bearer_token",
      "user",
      "user_profile",
      "profile",
    ];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    console.log("🗑️ Token dan data user telah dibersihkan");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil token dari localStorage
        const token = getToken();

        if (!token) {
          throw new Error(
            "Token autentikasi tidak ditemukan. Silakan login ulang."
          );
        }

        console.log(`🔍 Mengambil data untuk ticketId: ${ticketId}`);
        console.log(`🔐 Menggunakan token: ${token.substring(0, 20)}...`);

        // 1. Fetch data tiket utama
        const ticketResponse = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/${ticketId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle error response
        if (!ticketResponse.ok) {
          if (ticketResponse.status === 401) {
            // Token tidak valid/expired
            clearInvalidAuth();
            throw new Error("Sesi Anda telah habis. Silakan login ulang.");
          } else if (ticketResponse.status === 404) {
            throw new Error("Data tiket tidak ditemukan.");
          } else {
            throw new Error(`HTTP error! status: ${ticketResponse.status}`);
          }
        }

        const ticketData = await ticketResponse.json();
        console.log("✅ Data tiket berhasil diambil:", ticketData);
        setTicketData(ticketData);

        // 2. Fetch data finished untuk mendapatkan NIK
        const finishedResponse = await fetch(
          "https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/finished",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (finishedResponse.ok) {
          const finishedData = await finishedResponse.json();

          // Cari tiket yang sesuai berdasarkan ticket_id
          const matchingTicket = finishedData.data?.find(
            (ticket) => ticket.ticket_id === ticketId
          );

          if (matchingTicket?.nik) {
            console.log(`✅ NIK ditemukan: ${matchingTicket.nik}`);
            setNik(matchingTicket.nik);
          } else {
            console.log(
              "⚠️ NIK tidak ditemukan di data finished, menggunakan nilai default"
            );
          }
        } else {
          console.warn(
            "⚠️ Gagal mengambil data finished, menggunakan NIK default"
          );
        }
      } catch (err) {
        setError(err.message);
        console.error("❌ Error fetching data:", err);

        // Redirect ke login jika token expired
        if (err.message.includes("Sesi Anda telah habis")) {
          setTimeout(() => {
            navigate("/login", {
              state: {
                message: "Sesi Anda telah habis. Silakan login ulang.",
              },
            });
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId, navigate]);

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
          <p className="text-xs text-gray-400 mt-2">
            Ticket ID: {ticketId.substring(0, 8)}...
          </p>
        </div>
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>

          <div className="space-y-3">
            {error.includes("Sesi Anda telah habis") ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Mengarahkan ke halaman login...
                </p>
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
              >
                Kembali
              </button>

              {error.includes("login ulang") && (
                <button
                  onClick={() => {
                    clearInvalidAuth();
                    navigate("/login");
                  }}
                  className="flex-1 bg-[#0F2C59] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0a2147] transition"
                >
                  Login Ulang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilkan jika data tidak ditemukan
  if (!ticketData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Data tiket tidak ditemukan</p>
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

  // Debug info (bisa dihapus di production)
  console.log("📊 Data yang akan ditampilkan:", {
    ticketData,
    nik,
    creator: ticketData.creator,
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

          {/* Informasi Pengguna */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">Nama</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium min-w-[500px] text-center">
                {ticketData.creator?.full_name || "Yono Wirenko"}
              </div>
            </div>

            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">NIK</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium min-w-[500px] text-center">
                {nik}
              </div>
            </div>

            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">Email</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium min-w-[500px] text-center">
                {ticketData.creator?.email || "yonowinarko@legmail.com"}
              </div>
            </div>

            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium min-w-[500px] text-center">
                {ticketData.ticket_code || "LP8321336"}
              </div>
            </div>
          </div>

          {/* Detail Laporan */}
          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Judul Pelaporan</p>
            <input
              type="text"
              value={ticketData.title || "Parkir Nguwawor"}
              readOnly
              className="w-full bg-gray-100 rounded-lg px-3 py-2 text-gray-800 text-sm"
            />
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Rincian Masalah</p>
            <textarea
              readOnly
              value={
                ticketData.description ||
                "Banyak kendaraan yang parkir sembarangan di sepanjang jalan kali anak"
              }
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed"
            />
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Lampiran file</p>
            <div className="flex items-center gap-2 mt-1">
              <FileText size={18} className="text-[#0F2C59]" />
              <span className="text-gray-800">
                {ticketData.files && ticketData.files.length > 0
                  ? ticketData.files[0].filename || "bukti laporan.pdf"
                  : "bukti laporan.pdf"}
              </span>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
            >
              Kembali
            </button>

            {ticketData.status === "Selesai" && (
              <button
                onClick={() =>
                  navigate("/lihatrating", {
                    state: {
                      item: {
                        ticket_id: ticketId,
                        ticket_code: ticketData.ticket_code,
                        creator: ticketData.creator,
                        rating_object: ticketData.rating,
                      },
                    },
                  })
                }
                className="bg-[#0F2C59] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#0a2147] transition"
              >
                Lihat Rating
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
