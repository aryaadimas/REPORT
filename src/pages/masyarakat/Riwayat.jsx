import React, { useState, useEffect } from "react";
import { Paperclip, RefreshCw } from "lucide-react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate } from "react-router-dom";

export default function Riwayat() {
  const navigate = useNavigate();
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== START FETCHING RIWAYAT ===");

      // Token dari curl yang berhasil
      const token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjU1NTczNTksImV4cCI6MTc2NjE2MjE1OSwibmJmIjoxNzY1NTU3MzU5LCJqdGkiOiJpVmdBSkViRHQxMFpnZHFYIiwic3ViIjoiNSJ9.h47mz1YdSa2fevoaPLo6tnds2wvqNy-4cpnLSzTyICA";

      console.log("Using token from curl:", token.substring(0, 50) + "...");

      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/api/tickets/pegawai/finished",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("=== API RESPONSE ===");
      console.log("Total:", result.total);
      console.log("Data length:", result.data?.length);
      console.log("Data samples:", result.data?.slice(0, 2));
      console.log("=== END API RESPONSE ===");

      if (result.data && Array.isArray(result.data)) {
        console.log(`Processing ${result.data.length} tickets...`);

        const formattedData = result.data.map((item) => {
          // Tanggal selesai
          let tanggalSelesai = "Belum selesai";
          if (item.pengerjaan_akhir) {
            tanggalSelesai = new Date(item.pengerjaan_akhir).toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );
          } else if (item.created_at) {
            tanggalSelesai = new Date(item.created_at).toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );
          }

          // Rating
          let rating = null;
          let rating_comment = null;
          if (item.rating && typeof item.rating === "object") {
            rating = item.rating.rating;
            rating_comment = item.rating.comment;
          }

          return {
            id: item.ticket_code || item.ticket_id,
            nama: item.title || "Tanpa Judul",
            tanggalSelesai: tanggalSelesai,
            lampiran: [],
            ajukanKembali:
              item.status === "rejected" || item.status === "selesai",
            status: item.status,
            rating: rating,
            rating_comment: rating_comment,
            ticket_id: item.ticket_id,
            description: item.description,
            priority: item.priority,
            created_at: item.created_at,
            status_ticket_pengguna: item.status_ticket_pengguna,
            rejection_reason_seksi: item.rejection_reason_seksi,
            pengerjaan_awal: item.pengerjaan_awal,
            pengerjaan_akhir: item.pengerjaan_akhir,
            files: [],
          };
        });

        console.log("Formatted data length:", formattedData.length);
        console.log("First formatted item:", formattedData[0]);

        setDataRiwayat(formattedData);
      } else {
        console.log("No data array found in response");
        setDataRiwayat([]);
      }
    } catch (error) {
      console.error("=== FETCH ERROR ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("=== END ERROR ===");

      setError(`Error: ${error.message}`);
      setDataRiwayat([]);
    } finally {
      setLoading(false);
      console.log("=== FETCH COMPLETE ===");
    }
  };

  const handleRefresh = () => {
    console.log("Refreshing data...");
    fetchRiwayat();
  };

  // PERBAIKAN: Hapus API call, langsung navigasi dengan token
  const handleBeriRating = (item) => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjU1NTczNTksImV4cCI6MTc2NjE2MjE1OSwibmJmIjoxNzY1NTU3MzU5LCJqdGkiOiJpVmdBSkViRHQxMFpnZHFYIiwic3ViIjoiNSJ9.h47mz1YdSa2fevoaPLo6tnds2wvqNy-4cpnLSzTyICA";
    
    navigate("/berirating", { 
      state: { 
        item,
        token // Kirim token ke halaman berirating
      } 
    });
  };

  // PERBAIKAN: Hapus API call, langsung navigasi dengan token
  const handleLihatRating = (item) => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjU1NTczNTksImV4cCI6MTc2NjE2MjE1OSwibmJmIjoxNzY1NTU3MzU5LCJqdGkiOiJpVmdBSkViRHQxMFpnZHFYIiwic3ViIjoiNSJ9.h47mz1YdSa2fevoaPLo6tnds2wvqNy-4cpnLSzTyICA";
    
    navigate("/lihatrating", { 
      state: { 
        item,
        token // Kirim token ke halaman lihatrating
      } 
    });
  };

  // Di dalam Riwayat.js, ubah fungsi handleLihatRiwayat:
  const handleLihatRiwayat = (item) => {
    // Gunakan token hardcoded yang sama dengan yang berhasil di fetchRiwayat
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjU1NTczNTksImV4cCI6MTc2NjE2MjE1OSwibmJmIjoxNzY1NTU3MzU5LCJqdGkiOiJpVmdBSkViRHQxMFpnZHFYIiwic3ViIjoiNSJ9.h47mz1YdSa2fevoaPLo6tnds2wvqNy-4cpnLSzTyICA";

    // Kirim token bersama dengan item ke LihatHistory
    navigate("/lihathistory", {
      state: {
        item,
        token, // Ini penting! Token dikirim ke LihatHistory
      },
    });
  };

  // PERBAIKAN: Tambahkan token juga untuk Ajukan Kembali
  const handleAjukanKembali = (item) => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjU1NTczNTksImV4cCI6MTc2NjE2MjE1OSwibmJmIjoxNzY1NTU3MzU5LCJqdGkiOiJpVmdBSkViRHQxMFpnZHFYIiwic3ViIjoiNSJ9.h47mz1YdSa2fevoaPLo6tnds2wvqNy-4cpnLSzTyICA";
    
    navigate("/reopenpegawai", { 
      state: { 
        item,
        token // Kirim token juga
      } 
    });
  };

  if (loading) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50">
          <div className="pt-4 pb-8">
            <div className="px-4">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4 text-[#0F2C59]">
                    Riwayat Laporan
                  </h2>
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59]"></div>
                  </div>
                  <p className="text-center text-gray-500 mt-4">
                    Memuat data...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  return (
    <LayoutPegawai>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-4 pb-8">
          <div className="px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-[#0F2C59]">
                    Riwayat Laporan
                  </h2>
                  <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 bg-[#0F2C59] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#15397A] transition"
                  >
                    <RefreshCw size={16} />
                    Refresh Data
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-red-700 font-medium">Error:</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                        <button
                          onClick={handleRefresh}
                          className="mt-2 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm transition"
                        >
                          Coba Lagi
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {dataRiwayat.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Belum ada riwayat laporan.</p>
                  </div>
                ) : (
                  <>
                    {dataRiwayat.map((item, index) => (
                      <div
                        key={item.ticket_id}
                        className="border border-gray-200 rounded-xl p-4 mb-4 hover:shadow-sm transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="font-semibold text-gray-600">ID:</p>
                              <p className="text-gray-800 font-mono text-sm">
                                {item.id}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-600">
                                Nama:
                              </p>
                              <p className="text-gray-800">{item.nama}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-600">
                                Tanggal Selesai:
                              </p>
                              <p className="text-gray-800">
                                {item.tanggalSelesai}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 ml-4">
                            {item.ajukanKembali && (
                              <button
                                onClick={() => handleAjukanKembali(item)}
                                className="border border-red-400 text-red-500 px-3 py-1 rounded-lg text-xs hover:bg-red-50 transition whitespace-nowrap"
                              >
                                Ajukan Kembali
                              </button>
                            )}

                            {item.rating ? (
                              <button
                                onClick={() => handleLihatRating(item)}
                                className="border border-yellow-400 text-yellow-600 px-3 py-1 rounded-lg text-xs hover:bg-yellow-50 transition whitespace-nowrap"
                              >
                                Lihat Rating
                              </button>
                            ) : item.status === "selesai" ||
                              item.status_ticket_pengguna === "Selesai" ? (
                              <button
                                onClick={() => handleBeriRating(item)}
                                className="border border-yellow-400 text-yellow-600 px-3 py-1 rounded-lg text-xs hover:bg-yellow-50 transition whitespace-nowrap"
                              >
                                Beri Rating
                              </button>
                            ) : null}

                            <button
                              onClick={() => handleLihatRiwayat(item)}
                              className="bg-[#0F2C59] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#15397A] transition whitespace-nowrap"
                            >
                              Lihat Riwayat
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center mt-3">
                          <span className="font-semibold text-gray-600 mr-2">
                            Lampiran:
                          </span>
                          {item.files && item.files.length > 0 ? (
                            item.files.map((_, i) => (
                              <Paperclip
                                key={i}
                                size={16}
                                className="mx-1 text-[#0F2C59] cursor-pointer hover:text-[#15397A]"
                              />
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Tidak ada lampiran
                            </span>
                          )}
                        </div>

                        <div className="flex items-center mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              item.status === "selesai" ||
                              item.status_ticket_pengguna === "Selesai"
                                ? "bg-green-100 text-green-800"
                                : item.status === "rejected" ||
                                  item.status_ticket_pengguna ===
                                    "Tiket Ditolak"
                                ? "bg-red-100 text-red-800"
                                : item.status_ticket_pengguna ===
                                  "Proses Verifikasi"
                                ? "bg-blue-100 text-blue-800"
                                : item.status_ticket_pengguna ===
                                  "Menunggu Diproses"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status_ticket_pengguna || item.status}
                          </span>

                          {item.rating && (
                            <div className="ml-3 flex items-center">
                              <span className="text-xs text-gray-600 mr-1">
                                Rating:
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className="text-yellow-400 text-xs"
                                  >
                                    {i < item.rating ? "★" : "☆"}
                                  </span>
                                ))}
                              </div>
                              {item.rating_comment && (
                                <span className="text-xs text-gray-500 ml-2 max-w-xs truncate">
                                  {item.rating_comment}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {item.rejection_reason_seksi && (
                          <div className="mt-2">
                            <span className="text-xs text-red-600">
                              Alasan penolakan: {item.rejection_reason_seksi}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xs text-gray-500">
                        Menampilkan {dataRiwayat.length} dari{" "}
                        {dataRiwayat.length} data
                      </p>
                      <button
                        onClick={handleRefresh}
                        className="text-xs text-[#0F2C59] hover:text-[#15397A] flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        Refresh
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPegawai>
  );
}
