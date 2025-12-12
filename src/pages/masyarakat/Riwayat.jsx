import React, { useState, useEffect } from "react";
import { Paperclip } from "lucide-react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate } from "react-router-dom";

export default function Riwayat() {
  const navigate = useNavigate();
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cari token dari localStorage
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
            console.log(`Token found in localStorage with key: ${key}`);
            break;
          }
        }

        if (!token) {
          console.warn(
            "No token found in localStorage, using example token for testing"
          );
          token =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjUzOTM5MzAsImV4cCI6MTc2NTk5ODczMCwibmJmIjoxNzY1MzkzOTMwLCJqdGkiOiJGSW15YU1XZ1Zkck5aTkVPIiwic3ViIjoiNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KSswG95y_yvfNmpH5hLBNXnuVfiaycCD4YN5JMRYQy8";
        }

        // Fetch daftar ticket yang selesai untuk pegawai
        const response = await fetch(
          "https://service-desk-be-production.up.railway.app/api/tickets/pegawai/finished",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            console.warn("Token expired or invalid, redirecting to login");
            tokenKeys.forEach((key) => localStorage.removeItem(key));
            throw new Error("Sesi Anda telah habis. Silakan login ulang.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response (finished tickets):", result);

        if (result.data && result.data.length > 0) {
          // Ambil detail untuk setiap ticket
          const ticketsWithDetails = await Promise.all(
            result.data.map(async (item) => {
              try {
                const detailResponse = await fetch(
                  `https://service-desk-be-production.up.railway.app/api/tickets/pegawai/${item.ticket_id}`,
                  {
                    method: "GET",
                    headers: {
                      accept: "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (detailResponse.ok) {
                  const detailData = await detailResponse.json();
                  console.log(
                    `Detail for ticket ${item.ticket_id}:`,
                    detailData
                  );

                  // Periksa apakah ada rating
                  let rating = null;
                  let ratingComment = null;
                  let ratingCreatedAt = null;

                  // Jika ada endpoint khusus untuk rating, fetch rating
                  try {
                    const ratingResponse = await fetch(
                      `https://service-desk-be-production.up.railway.app/api/rating/${item.ticket_id}`,
                      {
                        method: "GET",
                        headers: {
                          accept: "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    if (ratingResponse.ok) {
                      const ratingData = await ratingResponse.json();
                      if (ratingData.data) {
                        rating = ratingData.data.rating;
                        ratingComment = ratingData.data.comment;
                        ratingCreatedAt = ratingData.data.created_at;
                      }
                    }
                  } catch (ratingError) {
                    console.warn(
                      `No rating found for ticket ${item.ticket_id}:`,
                      ratingError
                    );
                  }

                  return {
                    ...item,
                    rating: rating,
                    rating_comment: ratingComment,
                    rating_created_at: ratingCreatedAt,
                    files: detailData.files || [],
                    asset: detailData.asset,
                    creator: detailData.creator,
                    pengerjaan_awal: detailData.pengerjaan_awal,
                    pengerjaan_akhir: detailData.pengerjaan_akhir,
                  };
                }
                return item;
              } catch (error) {
                console.error(
                  `Error fetching detail for ticket ${item.ticket_id}:`,
                  error
                );
                return item;
              }
            })
          );

          // Format data untuk komponen
          const formattedData = ticketsWithDetails.map((item) => ({
            id: item.ticket_code || item.ticket_id,
            nama: item.title || "Tanpa Judul",
            tanggalSelesai: item.pengerjaan_akhir
              ? new Date(item.pengerjaan_akhir).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : item.created_at
              ? new Date(item.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "N/A",
            lampiran: item.files ? item.files.map((_, i) => i + 1) : [],
            ajukanKembali:
              item.status === "selesai" ||
              item.status === "rejected" ||
              item.status_ticket_pengguna === "Selesai",
            status: item.status,
            rating: item.rating || null,
            rating_comment: item.rating_comment || null,
            rating_created_at: item.rating_created_at || null,
            ticket_id: item.ticket_id,
            description: item.description,
            priority: item.priority,
            created_at: item.created_at,
            status_ticket_pengguna: item.status_ticket_pengguna,
            rejection_reason_seksi: item.rejection_reason_seksi,
            asset: item.asset,
            creator: item.creator,
            pengerjaan_awal: item.pengerjaan_awal,
            pengerjaan_akhir: item.pengerjaan_akhir,
            files: item.files || [],
          }));

          setDataRiwayat(formattedData);
        } else {
          setDataRiwayat([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error.message || "Gagal memuat data riwayat. Silakan coba lagi."
        );

        // Fallback data untuk development
        if (process.env.NODE_ENV === "development") {
          console.log("Using fallback data for development");
          setDataRiwayat([
            {
              id: "LPR321336",
              nama: "Gangguan Router",
              tanggalSelesai: "17-07-2025",
              lampiran: [1],
              ajukanKembali: true,
              status: "selesai",
              rating: 4,
              ticket_id: "8b0239ae-5ac7-4891-ab91-732ea79f1c0c",
              description: "string",
              priority: "Low",
              created_at: "2025-12-08T05:07:51.607302",
              status_ticket_pengguna: "Selesai",
              rejection_reason_seksi: null,
              asset: {
                asset_id: 1052,
                nama_asset: "Laptop Dell Latitude 5420",
                kode_bmd: "BRG-001",
                nomor_seri: "DL5420-001",
                kategori: "ti",
                subkategori_id: 1,
                subkategori_nama: "Server",
                jenis_asset: "barang",
                lokasi_asset: null,
                opd_id_asset: 1,
              },
              creator: {
                user_id: "8a762f5a-8fb1-43af-b912-991a58a372cc",
                full_name: "OPD Dinas Kesehatan",
                email: "opd@dinaskesehatan.go.id",
                profile: null,
              },
              pengerjaan_awal: "2025-12-08T05:09:02.779980",
              pengerjaan_akhir: "2025-12-08T05:09:09.020061",
              files: [],
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, [navigate]);

  const handleBeriRating = (item) => {
    navigate("/berirating", { state: { item } });
  };

  const handleLihatRating = (item) => {
    navigate("/lihatrating", { state: { item } });
  };

  const handleLihatRiwayat = (item) => {
    navigate("/lihathistory", { state: { item } });
  };

  const handleAjukanKembali = (item) => {
    navigate("/reopenpegawai", { state: { item } });
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

  if (error && dataRiwayat.length === 0) {
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
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{error}</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-[#0F2C59] text-white px-4 py-2 rounded-lg hover:bg-[#15397A] transition"
                      >
                        Coba Lagi
                      </button>
                      <button
                        onClick={() => navigate("/login")}
                        className="border border-[#0F2C59] text-[#0F2C59] px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        Login Ulang
                      </button>
                    </div>
                  </div>
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
                <h2 className="text-lg font-semibold mb-6 text-[#0F2C59]">
                  Riwayat Laporan
                </h2>

                {dataRiwayat.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Belum ada riwayat laporan.</p>
                  </div>
                ) : (
                  <>
                    {dataRiwayat.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 mb-4 hover:shadow-sm transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="font-semibold text-gray-600">ID:</p>
                              <p className="text-gray-800">{item.id}</p>
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

                          <div className="flex gap-2 ml-4">
                            {(item.status === "selesai" ||
                              item.status === "rejected" ||
                              item.status_ticket_pengguna === "Selesai") && (
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
                                : item.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.status === "selesai" ||
                            item.status_ticket_pengguna === "Selesai"
                              ? "Selesai"
                              : item.status === "rejected"
                              ? "Ditolak"
                              : item.status_ticket_pengguna || "Dalam Proses"}
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
                                <span className="text-xs text-gray-500 ml-2">
                                  ({item.rating_comment})
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {item.asset && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-600">
                              Asset: {item.asset.nama_asset} (
                              {item.asset.kode_bmd})
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    <p className="text-xs text-gray-500 mt-4">
                      Menampilkan data 1 sampai {dataRiwayat.length} dari{" "}
                      {dataRiwayat.length} data
                    </p>
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
