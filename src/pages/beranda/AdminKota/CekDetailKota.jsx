import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText } from "lucide-react";

const CekDetailKota = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pengerjaanAwal, setPengerjaanAwal] = useState("");
  const [tenggatPengerjaan, setTenggatPengerjaan] = useState("");
  const [formData, setFormData] = useState({
    teknisiPengerjaan: {
      nama: "Katrina Wulan",
      gambar: "/assets/Bokuto.jpg",
    },
    pengirim: {
      nama: "Widiya Karim",
      gambar: "/assets/Suika.jpg",
    },
    idLaporan: "LPR-98278",
    prioritas: "Rendah",
    rincianMasalah:
      "Pada komputer di unit pelayanan muncul pesan error yang memerlukan pembaruan bawaan sistem tertentu agar data bisa disuplai ulang. Beberapa file penting tidak dapat diakses termasuk template jadwal. Aktivitas browsing gagal mengunduh informasi. Dugaan kuat pengaruh isolasi jaringan internal.",
    informasiTambahan:
      "Segera lakukan pengecekan jaringan dan update sistem keamanan pada perangkat client. Pastikan koneksi stabil dan data aman.",
    lampiranFile: false,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleBatalkan = () => {
    navigate("/DashboardKota");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-4 pb-8">
        <div className="px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Teknisi Pengerjaan */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                    Teknisi Pengerjaan
                  </label>
                  <div className="flex-1 flex items-center gap-3 text-left">
                    <img
                      src={formData.teknisiPengerjaan.gambar}
                      alt="Profile Teknisi"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-semibold text-sm md:text-base">
                      {formData.teknisiPengerjaan.nama}
                    </span>
                  </div>
                </div>

                {/* Pengirim */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                    Pengirim
                  </label>
                  <div className="flex-1 flex items-center gap-3 text-left">
                    <img
                      src={formData.pengirim.gambar}
                      alt="Profile Pengirim"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-semibold text-sm md:text-base">
                      {formData.pengirim.nama}
                    </span>
                  </div>
                </div>

                {/* ID Laporan */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                    ID Laporan
                  </label>
                  <div className="flex-1 bg-gray-100 p-2 md:p-3 rounded border border-gray-300 text-center">
                    <span className="text-gray-800 text-sm md:text-base">
                      {formData.idLaporan}
                    </span>
                  </div>
                </div>

                {/* Prioritas */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                    Prioritas
                  </label>
                  <div
                    className={`flex-1 p-2 md:p-3 rounded text-center font-semibold text-white text-sm md:text-base ${
                      formData.prioritas === "Tinggi"
                        ? "bg-red-500"
                        : formData.prioritas === "Sedang"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    <span>{formData.prioritas}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                    Status
                  </label>
                  <div className="flex-1 p-2 md:p-3 rounded text-center font-semibold text-white text-sm md:text-base bg-yellow-500">
                    <span>Diproses</span>
                  </div>
                </div>

                {/* SLA */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                    SLA
                  </label>
                  <div className="flex-1 p-2 md:p-3 text-left font-medium text-green-600 text-sm md:text-base">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span className="font-normal">Sesuai SLA</span>
                    </span>
                  </div>
                </div>

                {/* Judul Pelaporan */}
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-gray-700 block">
                    Judul Pelaporan
                  </label>
                  <div className="bg-gray-100 p-3 rounded border border-gray-300">
                    <p className="text-gray-800 text-sm md:text-base font-medium">
                      Printer Sekarat
                    </p>
                  </div>
                </div>

                {/* Data Aset dan Nomor Seri - Sebelahan */}
                <div className="space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Data Aset
                      </p>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300">
                        <p className="text-gray-800 text-sm">
                          Printer HP LaserJet Pro P1102w
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Nomor Seri
                      </p>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300">
                        <p className="text-gray-800 text-sm font-medium">
                          HP-LJ-P1102W-001
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kategori, Sub-Kategori, dan Jenis Aset - Sebelahan bertiga */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Kategori Aset
                      </p>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300">
                        <p className="text-gray-800 text-sm">Non TI</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Sub-Kategori Aset
                      </p>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300">
                        <p className="text-gray-800 text-sm">Jaringan</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Jenis Aset
                      </p>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300">
                        <p className="text-gray-800 text-sm">Barang</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lokasi Kejadian */}
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-gray-700 block">
                    Lokasi Kejadian
                  </label>
                  <div className="bg-gray-100 p-3 rounded border border-gray-300">
                    <p className="text-gray-800 text-sm md:text-base">
                      Dinas Pendidikan Kantor Pusat
                    </p>
                  </div>
                </div>

                {/* Pengerjaan Awal dan Tenggat Pengerjaan */}
                <div className="space-y-2 text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <label className="text-sm font-medium text-gray-700 text-left sm:w-32">
                      Pengerjaan Awal
                    </label>
                    <div className="flex-1 flex items-center bg-gray-100 rounded p-2 md:p-3">
                      <Calendar size={16} className="text-gray-600 mr-2" />
                      <span className="w-full text-sm text-gray-700 text-center">
                        15/01/2025
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Sampai
                    </span>
                    <div className="flex-1 flex items-center bg-gray-100 rounded p-2 md:p-3">
                      <Calendar size={16} className="text-gray-600 mr-2" />
                      <span className="w-full text-sm text-gray-700 text-center">
                        17/01/2025
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rincian Masalah */}
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-gray-700 block">
                    Rincian Masalah
                  </label>
                  <div className="bg-gray-100 p-3 rounded border border-gray-300 min-h-[100px] md:min-h-[120px]">
                    <p className="text-gray-800 text-xs md:text-sm">
                      {formData.rincianMasalah}
                    </p>
                  </div>
                </div>

                {/* Garis Pembatas */}
                <hr className="my-4 border-gray-300" />

                {/* Informasi Tambahan */}
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-gray-700 block">
                    Informasi Tambahan
                  </label>
                  <div className="bg-gray-100 p-3 rounded border border-gray-300 min-h-[60px] md:min-h-[80px]">
                    <p className="text-gray-800 text-xs md:text-sm">
                      {formData.informasiTambahan}
                    </p>
                  </div>
                </div>

                {/* Lampiran File */}
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-gray-700 block">
                    Lampiran File
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText size={20} className="text-[#0F2C59]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        bukti_laporan.pdf
                      </p>
                      <p className="text-xs text-gray-500">2.4 MB</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between pt-4 gap-3 sm:gap-0">
                  <button
                    type="button"
                    onClick={handleBatalkan}
                    className="text-black border border-gray-300 bg-transparent px-3 py-2 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-red-50 transition-colors text-center order-2 sm:order-1"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CekDetailKota;
