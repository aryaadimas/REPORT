import React, { useState, useEffect } from "react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload } from "lucide-react";
import Swal from "sweetalert2";

export default function ReopenPegawai() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const laporan = state?.item || {};

  const [alasan, setAlasan] = useState("");
  const [penyelesaian, setPenyelesaian] = useState("");
  const [lampiran, setLampiran] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  // Ambil ticket ID dari laporan
  const ticketId = laporan.ticket_id || laporan.id || "UPS23336";

  // Fungsi untuk mendapatkan token
  const getToken = () => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjUzOTM5MzAsImV4cCI6MTc2NTk5ODczMCwibmJmIjoxNzY1MzkzOTMwLCJqdGkiOiJGSW15YU1XZ1Zkck5aTkVPIiwic3ViIjoiNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KSswG95y_yvfNmpH5hLBNXnuVfiaycCD4YN5JMRYQy8"
    );
  };

  // Fetch data ticket saat komponen dimuat
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const token = getToken();

        // Fetch data ticket dari API (sesuaikan endpoint untuk pegawai)
        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/${ticketId}`,
          {
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
        setTicketData(data);

        // Jika ada data dari state laporan, gunakan itu sebagai fallback
        if (laporan && Object.keys(laporan).length > 0) {
          setTicketData((prev) => ({ ...prev, ...laporan }));
        }
      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError(err.message);

        // Jika gagal fetch, gunakan data dari state sebagai fallback
        if (laporan && Object.keys(laporan).length > 0) {
          setTicketData(laporan);
          setError(null); // Reset error karena kita punya fallback data
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketId, laporan]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File terlalu besar",
          text: "Ukuran file maksimal 5MB",
          confirmButtonColor: "#0F2C59",
        });
        e.target.value = "";
        return;
      }

      // Validasi tipe file
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Format file tidak didukung",
          text: "Hanya mendukung JPG, PNG, PDF, dan DOC",
          confirmButtonColor: "#0F2C59",
        });
        e.target.value = "";
        return;
      }
      setLampiran(file);
    }
  };

  // === Kirim data dengan API ===
  const handleSubmit = async () => {
    if (!alasan || !penyelesaian) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Form!",
        text: "Harap isi alasan dan penyelesaian sebelum mengirim.",
        confirmButtonColor: "#0F2C59",
      });
      return;
    }

    Swal.fire({
      title: "Yakin Kirim Pengajuan?",
      text: "Pastikan data yang kamu isi sudah benar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim",
      cancelButtonText: "Batal",
      confirmButtonColor: "#0F2C59",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setSubmitting(true);
          const token = getToken();

          // Siapkan FormData sesuai dengan API
          const formData = new FormData();
          formData.append("alasan_reopen", alasan);
          formData.append("expected_resolution", penyelesaian);

          if (lampiran) {
            formData.append("file", lampiran);
          }

          console.log("Mengirim request reopen untuk ticket:", ticketId);
          console.log("Data yang dikirim:", {
            alasan_reopen: alasan,
            expected_resolution: penyelesaian,
            lampiran: lampiran?.name || "Tidak ada file",
          });

          // Kirim request PATCH ke API
          const response = await fetch(
            `https://service-desk-be-production.up.railway.app/api/tickets/reopen/${ticketId}`,
            {
              method: "PATCH",
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          console.log("Response status:", response.status);

          if (response.ok) {
            const resultData = await response.json();
            console.log("Success response:", resultData);

            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: resultData.message || "Pengajuan kembali berhasil dikirim.",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              navigate("/riwayat");
            });
          } else {
            const errorText = await response.text();
            console.error("API Error:", errorText);

            let errorMessage = "Terjadi kesalahan saat mengirim pengajuan";
            if (response.status === 400) {
              errorMessage = "Data yang dikirim tidak valid";
            } else if (response.status === 401) {
              errorMessage = "Sesi Anda telah habis, silakan login ulang";
            } else if (response.status === 404) {
              errorMessage = "Tiket tidak ditemukan";
            } else if (response.status === 422) {
              errorMessage = "Data tidak lengkap atau format salah";
            }

            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: errorMessage,
              confirmButtonColor: "#0F2C59",
            });
          }
        } catch (error) {
          console.error("Network error:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Terjadi kesalahan jaringan. Silakan coba lagi.",
            confirmButtonColor: "#0F2C59",
          });
        } finally {
          setSubmitting(false);
        }
      }
    });
  };

  // === Konfirmasi batal ===
  const handleCancel = () => {
    Swal.fire({
      title: "Batalkan Pengajuan?",
      text: "Perubahan yang kamu buat tidak akan disimpan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Kembali",
      confirmButtonColor: "#0F2C59",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/riwayat");
      }
    });
  };

  // Tampilkan loading state
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

  // Tampilkan error state
  if (error && !ticketData) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-md">
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

  // Gunakan data dari API atau dari state
  const currentTicketData = ticketData || laporan;

  return (
    <LayoutPegawai>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-4xl mx-auto">
              {/* Background wave */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

              {/* Judul Tengah */}
              <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
                Formulir Pengajuan Kembali
              </h2>

              {/* Pengirim & ID Tiket - Layout vertikal */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-600 w-40">
                    Nama
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm flex-1 text-center">
                    {currentTicketData.nama ||
                      currentTicketData.creator?.full_name ||
                      "Sri Wulandari"}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-600 w-40">
                    Email
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm flex-1 text-center">
                    {currentTicketData.email ||
                      currentTicketData.creator?.email ||
                      "84Wulandari@gmail.com"}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-600 w-40">
                    Divisi
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm flex-1 text-center">
                    {currentTicketData.divisi || "Divisi Sumber Daya Manusia"}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-600 w-40">
                    ID Tiket
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm font-medium flex-1 text-center">
                    {currentTicketData.ticket_code ||
                      currentTicketData.id ||
                      "UPS23336"}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-8"></div>

              {/* Judul Pelaporan */}
              <div className="mb-8">
                <span className="text-sm font-semibold text-gray-600 mb-2 block">
                  Judul Pelaporan
                </span>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm font-medium">
                  {currentTicketData.title ||
                    currentTicketData.judulPelaporan ||
                    "Printer Sekarat"}
                </div>
              </div>

              {/* Data Aset & Nomor Seri - Grid 2 kolom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Data Aset
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm">
                    {currentTicketData.dataAset ||
                      currentTicketData.nama_asset ||
                      "Printer HP LaserJet Pro P1102w"}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Nomor Seri
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm">
                    {currentTicketData.nomorSeri || "HP-LJ-P1102W-001"}
                  </div>
                </div>
              </div>

              {/* Kategori - Sub Kategori - Jenis Aset - Grid 3 kolom */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Kategori Aset
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm text-center">
                    {currentTicketData.kategoriAset || "Non TI"}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Sub-Kategori Aset
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm text-center">
                    {currentTicketData.subKategoriAset || "Jaringan"}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Jenis Aset
                  </span>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm text-center">
                    {currentTicketData.jenisAset || "Barang"}
                  </div>
                </div>
              </div>

              {/* Lokasi Kejadian */}
              <div className="mb-8">
                <span className="text-sm font-semibold text-gray-600 mb-2 block">
                  Lokasi Kejadian
                </span>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 text-sm w-fit">
                  {currentTicketData.lokasiKejadian ||
                    currentTicketData.lokasi_penempatan ||
                    "Dinas Pendidikan Kantor Pusat"}
                </div>
              </div>

              <div className="border-t border-gray-200 my-8"></div>

              {/* Alasan Pengajuan */}
              <div className="mb-8">
                <span className="text-sm font-semibold text-gray-600 mb-2 block">
                  Alasan pengajuan kembali
                </span>
                <textarea
                  placeholder="Ketik disini"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-4 text-gray-800 text-sm resize-none h-32 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59] border border-gray-300"
                  disabled={submitting}
                />
              </div>

              {/* Lampiran File */}
              <div className="mb-8">
                <span className="text-sm font-semibold text-gray-600 mb-2 block">
                  Lampiran file
                </span>
                <label
                  className={`flex items-center gap-2 bg-[#0F2C59] text-white px-4 py-3 w-fit rounded-lg cursor-pointer hover:bg-[#15397A] transition ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Upload size={18} />
                  <span className="text-sm">Lampirkan File</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={submitting}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </label>
                {lampiran && (
                  <p className="text-sm text-gray-700 mt-3 ml-1">
                    {lampiran.name} ({(lampiran.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Penyelesaian */}
              <div className="mb-10">
                <span className="text-sm font-semibold text-gray-600 mb-2 block">
                  Penyelesaian yang Diharapkan
                </span>
                <textarea
                  placeholder="Ketik disini"
                  value={penyelesaian}
                  onChange={(e) => setPenyelesaian(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-4 text-gray-800 text-sm resize-none h-28 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59] border border-gray-300"
                  disabled={submitting}
                />
              </div>

              {/* Tombol Aksi - Seperti di gambar dengan posisi di kiri */}
              <div className="flex justify-start gap-4">
                <button
                  onClick={handleCancel}
                  className="border border-gray-400 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#0F2C59] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#15397A] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPegawai>
  );
}
