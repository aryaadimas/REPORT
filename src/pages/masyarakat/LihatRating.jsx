import React, { useState } from "react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

export default function LihatRating() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ratingData = state?.item || {};
  const [showDetail, setShowDetail] = useState(false); // Default false (collapsed)

  return (
    <LayoutPegawai>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              {/* Wave background */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

              {/* === Judul Rating (Tengah) === */}
              <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
                Rating
              </h2>

              {/* Pengirim dan ID Tiket */}
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
                    {ratingData.id || "LPR321336"}
                  </div>
                </div>
              </div>

              {/* === Tombol Detail Tiket === */}
              <div className="mb-6">
                <button
                  onClick={() => setShowDetail(!showDetail)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <h3 className="text-lg font-semibold text-[#0F2C59]">
                    Detail Tiket
                  </h3>
                  {showDetail ? (
                    <ChevronUp className="text-[#0F2C59]" size={20} />
                  ) : (
                    <ChevronDown className="text-[#0F2C59]" size={20} />
                  )}
                </button>

                {/* Konten detail yang bisa di-expand/collapse */}
                {showDetail && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Kolom Kiri */}
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Judul Pelaporan
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            Printer Sekarat
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Data Aset
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            Printer HP LaserJet Pro P1102w
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Kategori Aset
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            Non TI
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Lokasi Kejadian
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            Dinas Pendidikan Kantor Pusat
                          </div>
                        </div>
                      </div>

                      {/* Kolom Kanan */}
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Nomor Seri
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            HP-LJ-P1102W-001
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Sub-Kategori Aset
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            Jaringan
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Jenis Aset
                          </p>
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                            Barang
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rating utama - bintang tetap biru */}
              <div className="mb-8">
                <p className="font-semibold text-gray-600 mb-2">
                  Rating Kepuasan Pelayanan Kami
                </p>
                <div className="flex gap-1 text-[#0F2C59]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={22} fill="#0F2C59" stroke="#0F2C59" />
                  ))}
                </div>
              </div>

              {/* Komentar */}
              <div className="mb-8">
                <p className="font-semibold text-gray-600 mb-1">Komentar</p>
                <textarea
                  readOnly
                  value="yayayayayap"
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed"
                />
              </div>

              {/* Tombol kembali */}
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
