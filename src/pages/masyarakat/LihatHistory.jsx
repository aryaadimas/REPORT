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
  const [divisiData, setDivisiData] = useState("Bidang Kesehatan Masyarakat");

  const ticketId = state?.item?.ticket_id || state?.ticketId || "";

  const token =
    state?.token ||
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjU1NTczNTksImV4cCI6MTc2NjE2MjE1OSwibmJmIjoxNzY1NTU3MzU5LCJqdGkiOiJpVmdBSkViRHQxMFpnZHFYIiwic3ViIjoiNSJ9.h47mz1YdSa2fevoaPLo6tnds2wvqNy-4cpnLSzTyICA";

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const fetchTicketDetail = async () => {
    if (!ticketId) {
      setError("ID tiket tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://service-desk-be-production.up.railway.app/api/tickets/pegawai/${ticketId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setTicketData({
        ticket_id: data.ticket_id,
        ticket_code: data.ticket_code,
        title: data.title,
        description: data.description,
        asset_name: data.asset?.nama_asset,
        serial_number: data.asset?.nomor_seri,
        asset_category: data.asset?.kategori,
        asset_sub_category: data.asset?.subkategori_nama,
        asset_type: data.asset?.jenis_asset,
        location: data.lokasi_kejadian,
        expected_resolution: data.expected_resolution,
        files: data.files || [],
        status: data.status,
        status_ticket_pengguna: data.status_ticket_pengguna,
        priority: data.priority,
        created_at: data.created_at,
        rejection_reason_seksi: data.rejection_reason_seksi,
        pengerjaan_awal: data.pengerjaan_awal,
        pengerjaan_akhir: data.pengerjaan_akhir,
        status_ticket_seksi: data.status_ticket_seksi,
        status_ticket_teknisi: data.status_ticket_teknisi,
        creator: data.creator,
        asset: data.asset,
      });

      if (data.creator) {
        setUserData({
          name: data.creator.full_name,
          email: data.creator.email,
          profile: data.creator.profile,
        });

        if (data.creator.full_name) {
          if (data.creator.full_name.includes("OPD")) {
            setDivisiData("OPD Dinas Kesehatan");
          } else if (data.creator.full_name.includes("Dinas")) {
            setDivisiData("Dinas Kesehatan");
          } else {
            setDivisiData("Bidang Kesehatan Masyarakat");
          }
        }
      } else {
        setUserData({
          name: "Nama tidak tersedia",
          email: "Email tidak tersedia",
          profile: null,
        });
        setDivisiData("Bidang Kesehatan Masyarakat");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");
      console.error("Error fetching ticket detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetail();
  }, [ticketId]);

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

  return (
    <LayoutPegawai>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Pengirim</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={userData?.profile || "/assets/Anya.jpg"}
                      alt="pengirim"
                      className="w-9 h-9 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "/assets/Anya.jpg";
                      }}
                    />
                    <p className="text-gray-800 font-medium">
                      {userData?.name || "Nama tidak tersedia"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Email</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {userData?.email || "Email tidak tersedia"}
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Divisi</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {divisiData}
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {ticketData.ticket_code || "Tidak ada kode"}
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">
                    Tanggal Dibuat
                  </p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {formatDate(ticketData.created_at)}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Judul Pelaporan
                </p>
                <input
                  type="text"
                  value={ticketData.title || "Tidak ada judul"}
                  readOnly
                  className="w-full bg-gray-100 rounded-lg px-3 py-2 text-gray-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Data Aset</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                    {ticketData.asset_name || "Tidak ada nama aset"}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Nomor Seri</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                    {ticketData.serial_number || "Tidak ada nomor seri"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="font-semibold text-gray-600 mb-1">
                    Kategori Aset
                  </p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-center">
                    {ticketData.asset_category || "Tidak ada kategori"}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">
                    Sub-Kategori Aset
                  </p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-center">
                    {ticketData.asset_sub_category || "Tidak ada sub kategori"}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Jenis Aset</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-center">
                    {ticketData.asset_type || "Tidak ada jenis aset"}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Lokasi Kejadian
                </p>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm w-fit">
                  {ticketData.location || "Tidak ada lokasi"}
                </div>
              </div>

              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Rincian Masalah
                </p>
                <textarea
                  readOnly
                  value={ticketData.description || "Tidak ada deskripsi"}
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed"
                />
              </div>

              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Lampiran File
                </p>
                {ticketData.files && ticketData.files.length > 0 ? (
                  <div className="space-y-2">
                    {ticketData.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FileText size={18} className="text-[#0F2C59]" />
                        <span className="text-sm">
                          {file.filename || `File ${index + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Tidak ada lampiran</p>
                )}
              </div>

              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Penyelesaian yang Diharapkan
                </p>
                <textarea
                  readOnly
                  value={
                    ticketData.expected_resolution || "Tidak ada penyelesaian"
                  }
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-20 leading-relaxed"
                />
              </div>

              {(ticketData.pengerjaan_awal || ticketData.pengerjaan_akhir) && (
                <div className="mb-6">
                  <p className="font-semibold text-gray-600 mb-3">
                    Waktu Pengerjaan
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ticketData.pengerjaan_awal && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Pengerjaan Awal
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                          {formatDate(ticketData.pengerjaan_awal)}
                        </div>
                      </div>
                    )}
                    {ticketData.pengerjaan_akhir && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Pengerjaan Akhir
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                          {formatDate(ticketData.pengerjaan_akhir)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {ticketData.rejection_reason_seksi && (
                <div className="mb-6">
                  <p className="font-semibold text-gray-600 mb-1">
                    Alasan Penolakan
                  </p>
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-3 py-2 text-sm">
                    {ticketData.rejection_reason_seksi}
                  </div>
                </div>
              )}

              {ticketData.asset?.kode_bmd && (
                <div className="mb-6">
                  <p className="font-semibold text-gray-600 mb-1">Kode BMD</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                    {ticketData.asset.kode_bmd}
                  </div>
                </div>
              )}

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
