import React, { useState, useEffect } from "react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

export default function LihatHistory() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [userData, setUserData] = useState(null);

  const ticketId = state?.item?.ticket_id || state?.ticketId || "";

  // Function to get token
  const getToken = () => {
    const tokenKeys = [
      "access_token",
      "token",
      "jwt_token",
      "auth_token",
      "accessToken",
    ];

    for (const key of tokenKeys) {
      const token = localStorage.getItem(key);
      if (token && token.trim() !== "") {
        console.log(`✅ Token ditemukan di: ${key}`);
        return token;
      }
    }

    console.log("❌ Token tidak ditemukan di localStorage");
    return null;
  };

  // Fungsi format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Fetch data user profile
  const fetchUserProfile = async () => {
    try {
      const token = getToken();

      if (!token) {
        console.warn("⚠️ Token tidak tersedia untuk fetch profile");
        return null;
      }

      const endpoints = [
        "https://service-desk-be-production.up.railway.app/me",
        "https://service-desk-be-production.up.railway.app/api/me",
        "https://service-desk-be-production.up.railway.app/api/user/profile",
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          if (response.ok) {
            const result = await response.json();
            let userData = null;

            if (result && result.user) {
              userData = result.user;
            } else if (result && result.data) {
              userData = result.data;
            } else if (result && (result.name || result.email)) {
              userData = result;
            }

            if (userData) {
              return {
                name:
                  userData.name ||
                  userData.full_name ||
                  userData.username ||
                  "",
                email: userData.email || userData.user_email || "",
                unit_kerja:
                  userData.unit_kerja ||
                  userData.division ||
                  userData.department ||
                  "",
              };
            }
          }
        } catch (err) {
          console.warn(`⚠️ Gagal akses ${endpoint}:`, err.message);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    }
    return null;
  };

  // Fetch data ticket dari API
  const fetchTicketData = async () => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("Token tidak tersedia. Silakan login ulang.");
      }

      // Jika ada ticketId, ambil data dari API tickets/pegawai
      if (ticketId) {
        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/pegawai/${ticketId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Tiket tidak ditemukan");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Data ticket dari API:", data);

        // Validasi response
        if (!data) {
          throw new Error("Data tiket tidak ditemukan");
        }

        // Transform data dari API ke format yang diharapkan komponen
        return {
          ticket_code: data.ticket_code || "UMS:38088",
          title: data.title || "Printer Sekarat",
          description: data.description || "ROUTER DI RUANG AKU BADA AKU",
          // Data aset ada di dalam object 'asset'
          asset_name:
            data.asset?.nama_asset || "Printer HP LaserJet Pro P1102w",
          serial_number: data.asset?.nomor_seri || "HP-LJ-P1102W-001",
          // Kategori aset: "ti" atau "non-ti"
          asset_category: data.asset?.kategori === "ti" ? "TI" : "Non-TI",
          asset_sub_category: data.asset?.subkategori_nama || "Jaringan",
          // Jenis aset: "barang" atau "ruangan"
          asset_type:
            data.asset?.jenis_asset === "barang" ? "Barang" : "Ruangan",
          // Lokasi kejadian field name berbeda
          location: data.lokasi_kejadian || "Binas Pendidikan Kantor Pusat",
          expected_resolution:
            data.expected_resolution || "PROOK SEUMI LAH NAVIK",
          files: data.files || [{ filename: "bukti_laporan.pdf" }],
          // Tambahan field dari API
          status: data.status || "selesai",
          status_ticket_pengguna: data.status_ticket_pengguna || "Selesai",
          priority: data.priority || "Low",
          created_at: data.created_at || "",
          creator: data.creator || null,
          asset: data.asset || null,
          ticket_id: data.ticket_id || ticketId,
        };
      } else {
        // Jika tidak ada ticketId, gunakan data dari state
        return {
          ticket_code: state?.item?.ticket_code || "UMS:38088",
          title: state?.item?.title || "Printer Sekarat",
          description:
            state?.item?.description || "ROUTER DI RUANG AKU BADA AKU",
          asset_name:
            state?.item?.asset_name || "Printer HP LaserJet Pro P1102w",
          serial_number: state?.item?.serial_number || "HP-LJ-P1102W-001",
          asset_category: state?.item?.asset_category || "Non T1",
          asset_sub_category: state?.item?.asset_sub_category || "Jaringan",
          asset_type: state?.item?.asset_type || "Barang",
          location: state?.item?.location || "Binas Pendidikan Kantor Pusat",
          expected_resolution:
            state?.item?.expected_resolution || "PROOK SEUMI LAH NAVIK",
          files: state?.item?.files || [{ filename: "bukti_laporan.pdf" }],
          status: state?.item?.status || "selesai",
          status_ticket_pengguna:
            state?.item?.status_ticket_pengguna || "Selesai",
          priority: state?.item?.priority || "Low",
          created_at: state?.item?.created_at || "",
        };
      }
    } catch (err) {
      console.error("❌ Error fetching ticket data:", err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const userProfile = await fetchUserProfile();
        setUserData(userProfile);

        // Fetch ticket data
        const ticketData = await fetchTicketData();
        setTicketData(ticketData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId, state]);

  if (loading) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  if (error) {
    return (
      <LayoutPegawai>
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
      </LayoutPegawai>
    );
  }

  if (!ticketData) {
    return (
      <LayoutPegawai>
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
      </LayoutPegawai>
    );
  }

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    const statusMap = {
      selesai: "bg-green-500",
      pending: "bg-yellow-500",
      diproses: "bg-blue-500",
      dibatalkan: "bg-red-500",
      ditutup: "bg-gray-500",
    };
    return statusMap[status?.toLowerCase()] || "bg-gray-300";
  };

  // Fungsi untuk mendapatkan warna prioritas
  const getPriorityColor = (priority) => {
    const priorityMap = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
    };
    return priorityMap[priority?.toLowerCase()] || "bg-gray-300";
  };

  return (
    <LayoutPegawai>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              {/* Background wave */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

              <h2 className="text-xl font-semibold mb-6 text-[#0F2C59] border-b pb-3">
                Detail Laporan
              </h2>

              {/* === Informasi Pengirim === */}
              <div className="space-y-4 mb-8">
                {/* Pengirim */}
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Pengirim</p>
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/Anya.jpg"
                      alt="pengirim"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <p className="text-gray-800 font-medium">
                      {userData?.name ||
                        ticketData.creator?.full_name ||
                        "Widya Karim"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Email</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {userData?.email ||
                      ticketData.creator?.email ||
                      "opd@dinaskesehatan.go.id"}
                  </div>
                </div>

                {/* Divisi */}
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Divisi</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {userData?.unit_kerja || "Bidang Kesehatan Masyarakat"}
                  </div>
                </div>

                {/* ID Laporan */}
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">ID Laporan</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {ticketData.ticket_code || "UMS:38088"}
                  </div>
                </div>

                {/* Tanggal Dibuat */}
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">
                    Tanggal Dibuat
                  </p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {formatDate(ticketData.created_at)}
                  </div>
                </div>
              </div>

              {/* Status dan Prioritas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-semibold text-gray-600 mb-1">
                    Status Tiket
                  </p>
                  <div
                    className={`${getStatusColor(
                      ticketData.status
                    )} text-white rounded-lg px-3 py-2 text-sm text-center capitalize`}
                  >
                    {ticketData.status_ticket_pengguna ||
                      ticketData.status ||
                      "Pending"}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Prioritas</p>
                  <div
                    className={`${getPriorityColor(
                      ticketData.priority
                    )} text-white rounded-lg px-3 py-2 text-sm text-center capitalize`}
                  >
                    {ticketData.priority || "Low"}
                  </div>
                </div>
              </div>

              {/* Judul Pelaporan */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Judul Pelaporan
                </p>
                <input
                  type="text"
                  value={ticketData.title || "Printer Sekarat"}
                  readOnly
                  className="w-full bg-gray-100 rounded-lg px-3 py-2 text-gray-800 text-sm"
                />
              </div>

              {/* Data Aset & Nomor Seri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Data Aset</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                    {ticketData.asset_name || "Printer HP LaserJet Pro P1102w"}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Nomor Seri</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                    {ticketData.serial_number || "HP-LJ-P1102W-001"}
                  </div>
                </div>
              </div>

              {/* Kategori - Sub Kategori - Jenis Aset */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="font-semibold text-gray-600 mb-1">
                    Kategori Aset
                  </p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-center">
                    {ticketData.asset_category || "Non T1"}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">
                    Sub-Kategori Aset
                  </p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-center">
                    {ticketData.asset_sub_category || "Jaringan"}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Jenis Aset</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-center">
                    {ticketData.asset_type || "Barang"}
                  </div>
                </div>
              </div>

              {/* Lokasi Kejadian */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Lokasi Kejadian
                </p>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm w-fit">
                  {ticketData.location || "Binas Pendidikan Kantor Pusat"}
                </div>
              </div>

              {/* Rincian Masalah */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Rincian Masalah
                </p>
                <textarea
                  readOnly
                  value={
                    ticketData.description || "ROUTER DI RUANG AKU BADA AKU"
                  }
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed"
                />
              </div>

              {/* Lampiran File */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Lampiran File
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <FileText size={18} className="text-[#0F2C59]" />
                  {ticketData.files && ticketData.files.length > 0
                    ? ticketData.files[0].filename || "bukti_laporan.pdf"
                    : "bukti_laporan.pdf"}
                  {ticketData.files && ticketData.files.length > 1 && (
                    <span className="text-xs text-gray-500 ml-2">
                      +{ticketData.files.length - 1} file lainnya
                    </span>
                  )}
                </div>
              </div>

              {/* Penyelesaian */}
              <div className="mb-8">
                <p className="font-semibold text-gray-600 mb-1">
                  Penyelesaian yang Diharapkan
                </p>
                <textarea
                  readOnly
                  value={
                    ticketData.expected_resolution || "PROOK SEUMI LAH NAVIK"
                  }
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-20 leading-relaxed"
                />
              </div>

              {/* Informasi Tambahan jika ada */}
              {ticketData.asset?.kode_bmd && (
                <div className="mb-6">
                  <p className="font-semibold text-gray-600 mb-1">Kode BMD</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                    {ticketData.asset.kode_bmd}
                  </div>
                </div>
              )}

              {/* Tombol Kembali */}
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
      </div>
    </LayoutPegawai>
  );
}
