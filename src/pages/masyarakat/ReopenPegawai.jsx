import React, { useState } from "react";
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
          idTiket: laporan.id || "LPR321336",
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
          navigate("/riwayat");
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
        navigate("/riwayat");
      }
    });
  };

  return (
    <LayoutPegawai>
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

              {/* Pengirim & ID Tiket */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Pengirim</p>
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/Anya.jpg"
                      alt="pengirim"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <p className="text-gray-800 font-medium">Sri Wulandari</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {laporan.id || "LPR321336"}
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
                  value="Printer Sekarat"
                  readOnly
                  className="w-full bg-gray-100 rounded-lg px-3 py-2 text-gray-800 text-sm"
                />
              </div>

              {/* Data Aset & Nomor Seri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Data Aset</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                    Printer HP LaserJet Pro P1102w
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Nomor Seri</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                    HP-LJ-P1102W-001
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
                    Non T1
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">
                    Sub-Kategori Aset
                  </p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-center">
                    Jaringan
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Jenis Aset</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-center">
                    Barang
                  </div>
                </div>
              </div>

              {/* Lokasi */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Lokasi Kejadian
                </p>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm w-fit">
                  Binas Pendidikan Kantor Pusat
                </div>
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
    </LayoutPegawai>
  );
}
