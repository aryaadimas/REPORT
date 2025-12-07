import React, { useState } from "react";
import LayoutPegawai from "../../components/Layout/LayoutMasyarakat";
import LeftSidebar from "../../components/Layout/LeftSidebar";
import Header from "../../components/Header";
import { Upload, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LayoutMasyarakat from "../../components/Layout/LayoutMasyarakat";

export default function ReopenMasyarakat() {
  const navigate = useNavigate();
  const [alasan, setAlasan] = useState("");
  const [penyelesaian, setPenyelesaian] = useState("");
  const [lampiran, setLampiran] = useState(null);

  const handleFileChange = (e) => {
    setLampiran(e.target.files[0]);
  };

  // === Kirim data dengan konfirmasi SweetAlert ===
  const handleSubmit = () => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          alasan,
          penyelesaian,
          lampiran: lampiran?.name || "Tidak ada file",
        };
        console.log("Data Pengajuan:", data);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pengajuan kembali berhasil dikirim.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          navigate("/riwayatmasyarakat");
        });
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
        navigate("/riwayatmasyarakat");
      }
    });
  };

  return (
    <LayoutMasyarakat>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              {/* Background wave */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

              {/* Judul Tengah */}
              <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
                Formulir Pengajuan Kembali
              </h2>

              {/* Kirim laporan ke */}
              <div className="flex items-center mb-8">
                <p className="font-semibold text-gray-600 w-40">
                  Kirim laporan ke
                </p>
                <div className="flex items-center gap-2 bg-[#0F2C59] text-white px-3 py-2 rounded-lg w-fit">
                  <Building2 size={16} />
                  <span>Dinas Perhubungan</span>
                </div>
              </div>

              {/* Identitas */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Nama</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium w-64">
                    Yono Winarno
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">NIK</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium w-64">
                    367585326230002
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Email</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium w-64">
                    yonowinarno64@gmail.com
                  </div>
                </div>
              </div>

              {/* Judul Pelaporan */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Judul Pelaporan
                </p>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                  Parkir nguawooorrr
                </div>
              </div>

              {/* Rincian Masalah */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Rincian Masalah
                </p>
                <textarea
                  readOnly
                  value="Banyak kendaraan yang parkir sembarangan di sepanjang jalan kalanak"
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed"
                />
              </div>

              {/* Alasan Pengajuan */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Alasan Pengajuan Kembali
                </p>
                <textarea
                  placeholder="Ketik di sini..."
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                />
              </div>

              {/* Lampiran File */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Lampiran File
                </p>
                <label className="flex items-center gap-2 bg-[#0F2C59] text-white px-3 py-2 w-fit rounded-lg cursor-pointer hover:bg-[#15397A] transition">
                  <Upload size={16} />
                  <span>Lampirkan File</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {lampiran && (
                  <p className="text-sm text-gray-700 mt-2">{lampiran.name}</p>
                )}
              </div>

              {/* Penyelesaian */}
              <div className="mb-8">
                <p className="font-semibold text-gray-600 mb-1">
                  Penyelesaian yang Diharapkan
                </p>
                <textarea
                  placeholder="Ketik di sini..."
                  value={penyelesaian}
                  onChange={(e) => setPenyelesaian(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-20 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-start gap-3">
                <button
                  onClick={handleCancel}
                  className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#0F2C59] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#15397A] transition"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutMasyarakat>
  );
}
