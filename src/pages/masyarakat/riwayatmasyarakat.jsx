import React, { useState, useEffect } from "react";
import { Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RiwayatMasyarakat() {
  const navigate = useNavigate();
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoading(true);
        setError(null);

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
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTk1NDYwMH0.j76PzwY6VlFwsSaAHymQeIkpjkZWB_ujrhsXR8B_so4";
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/tickets/masyarakat/finished`,
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
        console.log("API Response:", result);

        if (result.data && result.data.length > 0) {
          const ticketsWithDetails = await Promise.all(
            result.data.map(async (item) => {
              try {
                const detailResponse = await fetch(
                  `https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/${item.ticket_id}`,
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
                  return {
                    ...item,
                    rating: detailData.rating,
                    files: detailData.files || [],
                    creator: detailData.creator || item.creator,
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
              item.status === "selesai" || item.status === "rejected",
            status: item.status,
            rating: item.rating ? item.rating.rating : null,
            ticket_id: item.ticket_id,
            description: item.description,
            priority: item.priority,
            created_at: item.created_at,
            status_ticket_pengguna: item.status_ticket_pengguna,
            rejection_reason_seksi: item.rejection_reason_seksi,
            rating_object: item.rating || null,
            creator: item.creator || null,
            ticket_code: item.ticket_code,
            full_item: item,
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

        if (process.env.NODE_ENV === "development") {
          console.log("Using fallback data for development");
          setDataRiwayat([
            {
              id: "SVD-PO-0014-MA",
              nama: "Laporan Pengaduan",
              tanggalSelesai: "01-12-2025",
              lampiran: [],
              ajukanKembali: true,
              status: "selesai",
              rating: 2,
              ticket_id: "7d1022f9-e47a-4c1e-b354-3ccc82b1d12e",
              description: "string",
              priority: null,
              created_at: "2025-12-01T17:24:00.362405",
              status_ticket_pengguna: "selesai",
              rejection_reason_seksi: "Alasan penolakan contoh",
              rating_object: {
                rating: 2,
                comment: "tes",
                created_at: "2025-12-10T13:06:38.701389",
              },
              creator: {
                full_name: "Yono Wirenko",
                email: "yonowinarko@legmail.com",
              },
              ticket_code: "SVD-PO-0014-MA",
              full_item: {
                ticket_id: "7d1022f9-e47a-4c1e-b354-3ccc82b1d12e",
                title: "Laporan Pengaduan",
                description: "string",
                status: "selesai",
                creator: {
                  full_name: "Yono Wirenko",
                  email: "yonowinarko@legmail.com",
                },
              },
            },
            {
              id: "SVD-PO-0015-MA",
              nama: "Laporan Parkir Liar",
              tanggalSelesai: "05-12-2025",
              lampiran: [],
              ajukanKembali: true,
              status: "rejected",
              rating: null,
              ticket_id: "8e1022f9-e47a-4c1e-b354-3ccc82b1d12f",
              description: "Parkir sembarangan di jalan utama",
              priority: null,
              created_at: "2025-12-05T10:24:00.362405",
              status_ticket_pengguna: "rejected",
              rejection_reason_seksi:
                "Bukti foto tidak jelas dan lokasi tidak spesifik",
              rating_object: null,
              creator: {
                full_name: "Budi Santoso",
                email: "budi.santoso@gmail.com",
              },
              ticket_code: "SVD-PO-0015-MA",
              full_item: {
                ticket_id: "8e1022f9-e47a-4c1e-b354-3ccc82b1d12f",
                title: "Laporan Parkir Liar",
                description: "Parkir sembarangan di jalan utama",
                status: "rejected",
                creator: {
                  full_name: "Budi Santoso",
                  email: "budi.santoso@gmail.com",
                },
              },
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
    navigate("/beriratingmasyarakat", { state: { item } });
  };

  const handleLihatRating = (item) => {
    navigate("/lihatratingmasyarakat", { state: { item } });
  };

  const handleLihatRiwayat = (item) => {
    if (item.status === "rejected") {
      navigate("/tiketditolakmasyarakat", { state: { item } });
    } else {
      navigate("/lihatriwayatmasyarakat", { state: { item } });
    }
  };

  const handleAjukanKembali = (item) => {
    navigate("/reopenmasyarakat", { state: { item } });
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 p-6">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-[#0F2C59]">
              Riwayat Laporan
            </h2>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59]"></div>
            </div>
            <p className="text-center text-gray-500 mt-4">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && dataRiwayat.length === 0) {
    return (
      <div className="w-full bg-gray-50 p-6">
        <div className="mx-auto">
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
    );
  }

  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="mx-auto">
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
                        <p className="font-semibold text-gray-600">Nama:</p>
                        <p className="text-gray-800">{item.nama}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">
                          Tanggal Selesai:
                        </p>
                        <p className="text-gray-800">{item.tanggalSelesai}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 ml-0 sm:ml-4 mt-3 sm:mt-0">
                      {(item.status === "selesai" ||
                        item.status === "rejected") && (
                        <button
                          onClick={() => handleAjukanKembali(item)}
                          className="border border-red-400 text-red-500 px-3 py-1.5 rounded-lg text-xs hover:bg-red-50 transition whitespace-nowrap"
                        >
                          Ajukan Kembali
                        </button>
                      )}

                      {item.rating ? (
                        <button
                          onClick={() => handleLihatRating(item)}
                          className="border border-yellow-400 text-yellow-600 px-3 py-1.5 rounded-lg text-xs hover:bg-yellow-50 transition whitespace-nowrap"
                        >
                          Lihat Rating
                        </button>
                      ) : item.status === "selesai" ? (
                        <button
                          onClick={() => handleBeriRating(item)}
                          className="border border-yellow-400 text-yellow-600 px-3 py-1.5 rounded-lg text-xs hover:bg-yellow-50 transition whitespace-nowrap"
                        >
                          Beri Rating
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleLihatRiwayat(item)}
                        className="bg-[#0F2C59] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#15397A] transition whitespace-nowrap"
                      >
                        {item.status === "rejected"
                          ? "Lihat Detail Ditolak"
                          : "Lihat Riwayat"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center mt-3">
                    <span className="font-semibold text-gray-600 mr-2">
                      Lampiran:
                    </span>
                    {item.lampiran.map((_, i) => (
                      <Paperclip
                        key={i}
                        size={16}
                        className="mx-1 text-[#0F2C59] cursor-pointer hover:text-[#15397A]"
                      />
                    ))}
                    {item.lampiran.length === 0 && (
                      <span className="text-gray-400 text-sm">
                        Tidak ada lampiran
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.status === "selesai"
                            ? "bg-green-100 text-green-800"
                            : item.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "selesai"
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
                              <span key={i} className="text-yellow-400 text-xs">
                                {i < item.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          {item.rating_object?.comment && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({item.rating_object.comment})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {item.status === "rejected" &&
                      item.rejection_reason_seksi && (
                        <div className="text-xs text-gray-600 mt-1 sm:mt-0 sm:text-right max-w-md">
                          <span className="font-medium">Alasan: </span>
                          <span className="text-red-600">
                            {item.rejection_reason_seksi.length > 60
                              ? `${item.rejection_reason_seksi.substring(
                                  0,
                                  60
                                )}...`
                              : item.rejection_reason_seksi}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2 sm:mb-0">
                  Menampilkan data 1 sampai {dataRiwayat.length} dari{" "}
                  {dataRiwayat.length} data
                </p>

                <div className="flex items-center text-xs text-gray-500">
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300 mr-1"></div>
                    <span>Selesai</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300 mr-1"></div>
                    <span>Ditolak</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 mr-1"></div>
                    <span>Proses</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
