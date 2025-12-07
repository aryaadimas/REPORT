import React, { useState, useEffect } from "react";
import {
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOpd";

const LihatRatingOpd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingData, setRatingData] = useState(null);

  // Data dummy sebagai fallback jika API gagal
  const dummyData = {
    id: 1,
    pengirim: "Widya Karim",
    foto_profil: "/assets/Widya.jpeg",
    idTiket: "LPR20288",
    ratingPelayanan: 5,
    komentar: "yapyapyap",
    selesai: true,
    detail_tiket: {
      judul_pelaporan: "Printer Sekarat",
      data_aset: "Printer HP LaserJet Pro P1102w",
      kategori_aset: "Non TI",
      lokasi_kejadian: "Dinas Pendidikan Kantor Pusat",
      nomor_seri: "HP-LJ-P1102W-001",
      sub_kategori_aset: "Jaringan",
      jenis_aset: "Barang",
    },
  };

  // Ambil ID rating dari state navigasi atau parameter URL
  const ratingId =
    location.state?.ratingData?.id ||
    location.state?.id ||
    (window.location.pathname.split("/").pop() === "lihatratingopd" ? 1 : null);

  // Fetch data rating detail dari API
  useEffect(() => {
    const fetchRatingDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil token dari localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        // Jika ada ratingId, fetch dari API
        if (ratingId) {
          const response = await fetch(
            `https://service-desk-be-production.up.railway.app/api/admin-opd/ratings/${ratingId}`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            // Jika error karena role bukan admin OPD
            if (data.detail && data.detail.includes("admin OPD")) {
              setError(
                
              );
              setRatingData(dummyData);
              return;
            }
            throw new Error(data.detail || "Gagal mengambil detail rating");
          }

          // Format data dari API ke format yang dibutuhkan frontend
          const formattedData = {
            id: data.id || ratingId,
            pengirim: data.pelapor_nama || "N/A",
            foto_profil: data.pelapor_foto || "/assets/default-avatar.jpg",
            idTiket: data.id_tiket || "N/A",
            ratingPelayanan: data.rating || 0,
            komentar: data.komentar || "Tidak ada komentar",
            selesai: data.status_selesai || false,
            detail_tiket: {
              judul_pelaporan: data.judul_pelaporan || "N/A",
              data_aset: data.aset_nama || "N/A",
              kategori_aset: data.kategori_aset || "N/A",
              lokasi_kejadian: data.lokasi || "N/A",
              nomor_seri: data.nomor_seri || "N/A",
              sub_kategori_aset: data.sub_kategori || "N/A",
              jenis_aset: data.jenis_aset || "N/A",
            },
          };
          setRatingData(formattedData);
        } else {
          // Gunakan data dari state navigasi atau dummy data
          const passedData = location.state?.ratingData || dummyData;
          setRatingData(passedData);
        }
      } catch (error) {
        console.error("Error fetching rating detail:", error);
        setError(error.message);
        setRatingData(dummyData); // Gunakan data dummy jika error
      } finally {
        setLoading(false);
      }
    };

    fetchRatingDetail();
  }, [ratingId, location.state]);

  // Komponen bintang rating
  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < count ? "text-[#0F2C59]" : "text-gray-300"}`}
      />
    ));
  };

  // Fungsi untuk kembali ke halaman rating
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/ratingkepuasan");
    }
  };

  // Jika masih loading
  if (loading) {
    return (
      <LayoutOpd>
        <div className="min-h-screen bg-[#F9FAFB]">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59]"></div>
                <p className="mt-4 text-gray-600">Memuat detail rating...</p>
              </div>
            </div>
          </div>
        </div>
      </LayoutOpd>
    );
  }

  // Jika tidak ada data
  if (!ratingData) {
    return (
      <LayoutOpd>
        <div className="min-h-screen bg-[#F9FAFB]">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Data rating tidak ditemukan
                </h3>
                <p className="text-gray-600 mb-4">
                  {error || "Rating yang Anda cari tidak tersedia."}
                </p>
                <button
                  onClick={handleBack}
                  className="bg-[#0F2C59] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </LayoutOpd>
    );
  }

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="p-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
            {/* Wave background */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

            {/* Error message jika ada */}
            {error && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-600 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">
                      {error}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Menampilkan data contoh untuk preview.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* === Judul Rating (Tengah) === */}
            <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
              Rating
            </h2>

            {/* === Section Pengirim dan ID Tiket === */}
            <div className="space-y-4 mb-8">
              {/* Pengirim */}
              <div className="flex items-center">
                <label className="font-semibold text-gray-600 w-40">
                  Pengirim
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden">
                    <img
                      src={
                        ratingData.foto_profil || "/assets/default-avatar.jpg"
                      }
                      alt={ratingData.pengirim}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/default-avatar.jpg";
                      }}
                    />
                  </div>
                  <span className="text-gray-800 font-medium">
                    {ratingData.pengirim}
                  </span>
                </div>
              </div>

              {/* ID Tiket */}
              <div className="flex items-center">
                <label className="font-semibold text-gray-600 w-40">
                  ID Tiket
                </label>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                  {ratingData.idTiket}
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
                  <ChevronUpIcon className="text-[#0F2C59] h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="text-[#0F2C59] h-5 w-5" />
                )}
              </button>

              {/* Konten detail yang bisa di-expand/collapse */}
              {showDetail && ratingData.detail_tiket && (
                <div className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Judul Pelaporan
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                          {ratingData.detail_tiket.judul_pelaporan}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Data Aset
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                          {ratingData.detail_tiket.data_aset}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Kategori Aset
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                          {ratingData.detail_tiket.kategori_aset}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Lokasi Kejadian
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                          {ratingData.detail_tiket.lokasi_kejadian}
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
                          {ratingData.detail_tiket.nomor_seri}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Sub-Kategori Aset
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                          {ratingData.detail_tiket.sub_kategori_aset}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Jenis Aset
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
                          {ratingData.detail_tiket.jenis_aset}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* === Rating Kepuasan === */}
            <div className="mb-8">
              <p className="font-semibold text-gray-600 mb-2">
                Rating Kepuasan Pelayanan Kami
              </p>
              <div className="flex gap-1">
                {renderStars(ratingData.ratingPelayanan)}
                <span className="ml-2 text-gray-700 font-medium">
                  ({ratingData.ratingPelayanan}/5)
                </span>
              </div>
            </div>

            {/* === Komentar === */}
            <div className="mb-8">
              <p className="font-semibold text-gray-600 mb-1">Komentar</p>
              <div className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm min-h-24">
                {ratingData.komentar || "Tidak ada komentar"}
              </div>
            </div>

            
            {/* === Tombol Kembali === */}
            <div className="flex justify-start">
              <button
                onClick={handleBack}
                className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutOpd>
  );
};

export default LihatRatingOpd;
