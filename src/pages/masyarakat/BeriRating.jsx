import React, { useState } from "react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

export default function BeriRating() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const laporan = state?.item || {};

  // === State rating ===
  const [mainRating, setMainRating] = useState(0);
  const [easeRating, setEaseRating] = useState(0);
  const [speedRating, setSpeedRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showDetail, setShowDetail] = useState(false); // State untuk detail tiket

  const handleSubmit = () => {
    const data = {
      idTiket: laporan.id || "LPR321336",
      mainRating,
      easeRating,
      speedRating,
      qualityRating,
      comment,
    };
    console.log("Data dikirim:", data);
    alert("Rating berhasil dikirim!");
    navigate("/riwayat");
  };

  return (
    <LayoutPegawai>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              {/* Background wave */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

              {/* Judul tengah */}
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
                    {laporan.id || "LPR321336"}
                  </div>
                </div>
              </div>

              {/* === Tombol Detail Tiket === */}
              <div className="mb-6">
                <button
                  onClick={() => setShowDetail(!showDetail)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <p className="font-semibold text-gray-600 mb-1">
                    Detail Tiket
                  </p>
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

              {/* Rating utama */}
              <div className="mb-8">
                <p className="font-semibold text-gray-600 mb-2">
                  Rating Kepuasan Pelayanan Kami
                </p>
                <div className="flex gap-1 text-[#0F2C59]">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Star
                      key={num}
                      size={24}
                      className="cursor-pointer transition"
                      fill={num <= mainRating ? "#0F2C59" : "none"}
                      stroke="#0F2C59"
                      onClick={() => setMainRating(num)}
                    />
                  ))}
                </div>
              </div>

              {/* Komentar */}
              <div className="mb-8">
                <p className="font-semibold text-gray-600 mb-1">Komentar</p>
                <textarea
                  placeholder="Ketik di sini..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                />
              </div>

              {/* Tombol aksi */}
              <div className="flex justify-start gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                >
                  Batal
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
