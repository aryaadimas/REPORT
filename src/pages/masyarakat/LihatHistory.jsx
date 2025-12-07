import React from "react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

export default function LihatHistory() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const laporan = state?.item || {};

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

              {/* === Pengirim & ID Laporan (fix posisi sejajar) === */}
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
                    <p className="text-gray-800 font-medium">Widya Karim</p>
                  </div>
                </div>

                {/* ID Laporan */}
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">ID Laporan</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {laporan.id || "UMS:38088"}
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

              {/* Lokasi Kejadian */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Lokasi Kejadian
                </p>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm w-fit">
                  Binas Pendidikan Kantor Pusat
                </div>
              </div>

              {/* Rincian Masalah */}
              <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">
                  Rincian Masalah
                </p>
                <textarea
                  readOnly
                  value="ROUTER DI RUANG AKU BADA AKU"
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
                  bukti_laporan.pdf
                </div>
              </div>

              {/* Penyelesaian */}
              <div className="mb-8">
                <p className="font-semibold text-gray-600 mb-1">
                  Penyelesaian yang Diharapkan
                </p>
                <textarea
                  readOnly
                  value="PROOK SEUMI LAH NAVIK"
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-20 leading-relaxed"
                />
              </div>

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
