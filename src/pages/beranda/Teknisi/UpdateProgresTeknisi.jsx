import React, { useState } from "react";
import { FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function UpdateProgressTeknisi() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  const handleSubmit = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menyimpan?",
      text: "Cek kembali inputan Anda sebelum mengirim!",
      icon: "warning",
      iconColor: "#1e3a8a",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#f87171",
      confirmButtonText: "Ya, saya yakin!",
      cancelButtonText: "Batalkan",
      reverseButtons: true,
      customClass: {
        title: "text-2xl font-bold",
        htmlContainer: "text-gray-600 text-sm",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Progress Diperbarui!",
          text: "Data berhasil disimpan ke sistem.",
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        });
      }
    });
  };
  const handleDraft = () => {
  Swal.fire({
    title: "Disimpan sebagai draft",
    text: "Perubahan anda telah disimpan sementara.",
    icon: "success",
    confirmButtonColor: "#1e3a8a",
  }).then(() => {
    navigate("/dashboardteknisi");
  });
};


  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-2xl p-8 relative overflow-hidden">      
        <div className="relative space-y-6">
          {/* Pengirim */}
          <div className="flex items-center">
            <label className="w-40 font-semibold text-gray-700">Pengirim</label>
            <div className="flex items-center gap-3">
              <img
                src="/assets/shizuku.jpg"
                alt="Profil"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-medium text-gray-800">Widya Karim</span>
            </div>
          </div>

          {/* ID Laporan */}
          <div className="flex items-center">
            <label className="w-40 font-semibold text-gray-700">
              ID Laporan
            </label>
            <div className="bg-gray-300 px-4 py-2 rounded-md text-sm font-medium text-gray-700 w-64 text-center">
              LPR318728
            </div>
          </div>

          {/* Prioritas */}
          <div className="flex items-center">
            <label className="w-40 font-semibold text-gray-700">Prioritas</label>
            <div className="w-64 bg-green-500 text-white text-sm font-semibold text-center py-2 rounded-md shadow-sm">
              Rendah
            </div>
          </div>

          {/* Perbarui Status */}
          <div className="flex items-center">
            <label className="w-40 font-semibold text-gray-700">
              Perbarui Status
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setStatus("Draft")}
                className={`px-5 py-2 rounded-lg border text-sm font-medium ${
                  status === "Draft"
                    ? "bg-gray-200 border-gray-500 text-gray-800"
                    : "border-gray-400 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setStatus("Diproses")}
                className={`px-5 py-2 rounded-lg border text-sm font-medium ${
                  status === "Diproses"
                    ? "bg-orange-100 border-orange-500 text-orange-700"
                    : "border-orange-500 text-orange-600 hover:bg-orange-50"
                }`}
              >
                Diproses
              </button>
              <button
                onClick={() => setStatus("Selesai")}
                className={`px-5 py-2 rounded-lg border text-sm font-medium ${
                  status === "Selesai"
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "border-green-500 text-green-600 hover:bg-green-50"
                }`}
              >
                Selesai
              </button>
            </div>
          </div>

          {/* Garis tipis pemisah */}
          <div className="border-t pt-4" />

          {/* Judul Pelaporan */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">
              Judul Pelaporan
            </p>
            <input
              type="text"
              readOnly
              value="Printer Sekarat"
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
            />
          </div>

          {/* Data Aset & Nomor Seri - 2 kolom */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Data Aset</p>
              <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700">
                Printer HP LaserJet Pro P1102W
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Nomor Seri</p>
              <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700">
                HP-LJ-P1102W-001
              </div>
            </div>
          </div>

          {/* Kategori - Sub - Jenis (3 kolom) */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                Kategori Aset
              </p>
              <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700">
                Non TI
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                Sub-Kategori Aset
              </p>
              <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700">
                Jaringan
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Jenis Aset</p>
              <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700">
                Barang
              </div>
            </div>
          </div>

          {/* Lokasi Kejadian */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">
              Lokasi Kejadian
            </p>
            <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 w-1/2">
              Dinas Pendidikan Kantor Pusat
            </div>
          </div>

          {/* Pengerjaan awal & sampai */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                Pengerjaan awal
              </p>
              <input
                type="date"
                defaultValue="2024-09-19"
                className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-700 "
                disabled
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Sampai</p>
              <input
                type="date"
                defaultValue="2024-09-20"
                className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-700 "
                disabled
              />
            </div>
          </div>

          {/* Rincian masalah */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">
              Rincian masalah
            </p>
            <textarea
              readOnly
              rows={3}
              className="w-full bg-gray-300 rounded-md px-4 py-2 text-sm text-gray-700"
              value="ROUTER DI RUANG ARSIP RADA ANU"
            />
          </div>

          {/* Lampiran file */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">
              Lampiran file
            </p>
            <div className="flex items-center gap-2 rounded-md px-3 py-2 w-fit cursor-pointer">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700 font-medium">
                bukti-laporan.pdf
              </span>
            </div>
          </div>

          {/* Penyelesaian yang Diharapkan */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">
              Penyelesaian yang Diharapkan
            </p>
            <textarea
              readOnly
              rows={3}
              className="w-full bg-gray-300 rounded-md px-4 py-2 text-sm text-gray-700"
              value="POKOK KELAR LAH WKWK"
            />
          </div>

          {/* Tombol aksi bawah */}
          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <button
              onClick={() => navigate("/dashboardteknisi")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
            >
              Batalkan
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={handleDraft}
                className="text-sm font-medium text-gray-700 hover:underline"
              >
                Simpan draft
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#0F2C59] hover:bg-[#15397A] text-white rounded-lg text-sm font-medium shadow-sm"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
