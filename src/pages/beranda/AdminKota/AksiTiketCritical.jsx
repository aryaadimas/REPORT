import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AksiTiketCritical = () => {
  const navigate = useNavigate();
  const [showDetailTiket, setShowDetailTiket] = useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);

  // State untuk form input
  const [formData, setFormData] = useState({
    pengirim: "Doni Richo",
    foto: "/assets/Widya.jpeg",
    idLaporan: "LPR20288",
    prioritas: "Kritis",
    judulRapat: "",
    opdTerkait: "",
    seksiTerkait: "",
    linkMeet: "",
    mulaiTanggal: "",
    mulaiWaktu: "",
    sampaiTanggal: "",
    sampaiWaktu: "",
  });

  // Daftar OPD untuk dropdown
  const opdList = [
    "Pilih OPD",
    "Dinas Pendidikan",
    "Dinas Kesehatan",
    "Dinas Pekerjaan Umum",
    "Dinas Sosial",
    "Dinas Perhubungan",
    "Dinas Pariwisata",
    "Dinas Perdagangan",
    "Dinas Lingkungan Hidup",
  ];

  // Handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSubmitWarning(true);
  };

  // === Handle Konfirmasi Kirim ===
  const handleConfirmSubmit = () => {
    setShowSubmitWarning(false);

    // Simpan data (dummy)
    console.log("Data rapat yang diinput:", formData);

    Swal.fire({
      icon: "success",
      title: "Rapat berhasil disimpan!",
      showConfirmButton: false,
      timer: 1500,
    });

    // Navigasi setelah berhasil
    setTimeout(() => {
      navigate(-1); // Kembali ke halaman sebelumnya
    }, 1600);
  };

  // === Handle Batal Kirim ===
  const handleCancelSubmit = () => {
    setShowSubmitWarning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
          {/* Wave background */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

          {/* === Judul Aksi Tiket (Tengah) === */}
          <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
            Aksi Tiket
          </h2>

          <form onSubmit={handleSubmit}>
            {/* === Section Pengirim (Read-only) === */}
            <div className="space-y-4 mb-8">
              {/* Pengirim dengan Foto */}
              <div className="flex items-center">
                <label className="font-semibold text-gray-600 w-40">
                  Pengirim
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden">
                    <img
                      src={formData.foto}
                      alt={formData.pengirim}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-800 font-medium">
                    {formData.pengirim}
                  </span>
                </div>
              </div>

              {/* ID Laporan - read-only */}
              <div className="flex items-center">
                <label className="font-semibold text-gray-600 w-40">
                  ID laporan
                </label>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 text-sm font-medium w-full text-center">
                    {formData.idLaporan}
                  </div>
                </div>
              </div>

              {/* Prioritas - read-only */}
              <div className="flex items-center">
                <label className="font-semibold text-gray-600 w-40">
                  Prioritas
                </label>
                <div className="flex-1 flex justify-center">
                  <div className="bg-red-100 text-red-800 rounded-lg px-4 py-2 text-sm font-semibold w-full text-center">
                    {formData.prioritas}
                  </div>
                </div>
              </div>
            </div>

            {/* === Section Judul Rapat (Input) === */}
            <div className="mb-8">
              {/* Judul Rapat - Input teks */}
              <div className="flex items-center mb-4">
                <label className="font-semibold text-gray-600 w-40">
                  Judul Rapat
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="judulRapat"
                    value={formData.judulRapat}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ketik di sini"
                    required
                  />
                </div>
              </div>

              {/* OPD Terkait - Dropdown */}
              <div className="flex items-center mb-4">
                <label className="font-semibold text-gray-600 w-40">
                  OPD Terkait
                </label>
                <div className="flex-1">
                  <select
                    name="opdTerkait"
                    value={formData.opdTerkait}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    {opdList.map((opd, index) => (
                      <option key={index} value={index === 0 ? "" : opd}>
                        {opd}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seksi Terkait - Input teks */}
              <div className="flex items-center">
                <label className="font-semibold text-gray-600 w-40">
                  Seksi Terkait
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="seksiTerkait"
                    value={formData.seksiTerkait}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* === Section Link Meet === */}
            <div className="mb-8">
              {/* Link Meet - Input teks */}
              <div className="flex items-center mb-4">
                <label className="font-semibold text-gray-600 w-40">
                  Link Meet
                </label>
                <div className="flex-1">
                  <input
                    type="url"
                    name="linkMeet"
                    value={formData.linkMeet}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ketik di sini"
                    required
                  />
                </div>
              </div>

              {/* Mulai dan Sampai - Tanggal dan Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">
                    Mulai Tanggal
                  </label>
                  <input
                    type="date"
                    name="mulaiTanggal"
                    value={formData.mulaiTanggal}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">
                    Mulai Waktu
                  </label>
                  <input
                    type="time"
                    name="mulaiWaktu"
                    value={formData.mulaiWaktu}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    name="sampaiTanggal"
                    value={formData.sampaiTanggal}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-2">
                    Sampai Waktu
                  </label>
                  <input
                    type="time"
                    name="sampaiWaktu"
                    value={formData.sampaiWaktu}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* === Tombol Detail Tiket (Dropdown) === */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowDetailTiket(!showDetailTiket)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <span className="font-semibold text-gray-600">
                  Detail Tiket
                </span>
                {showDetailTiket ? (
                  <ChevronUpIcon className="text-[#0F2C59] h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="text-[#0F2C59] h-5 w-5" />
                )}
              </button>

              {/* Konten Detail Tiket yang bisa di-expand/collapse */}
              {showDetailTiket && (
                <div className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Judul Pelaporan
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
                          Printer Sekarat
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Data Aset
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
                          Dell PowerEdge R740
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Kategori Aset
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
                          TI
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Lokasi Kejadian
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
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
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
                          DELL-R740-PRD-001
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Sub-Kategori Aset
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
                          Server
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-1">
                          Jenis Aset
                        </p>
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
                          Barang
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rincian Masalah */}
                  <div className="mt-6">
                    <p className="font-semibold text-gray-600 mb-1">
                      Rincian masalah
                    </p>
                    <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
                      Server down banyak anu terhambat
                    </div>
                  </div>

                  {/* === Lampiran File dengan Icon === */}
                  <div className="mt-6">
                    <p className="font-semibold text-gray-600 mb-1">
                      Lampiran file
                    </p>
                    <div className="flex items-center gap-2 bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm w-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>buki laporan.pdf</span>
                    </div>
                  </div>

                  {/* === Penyelesaian yang Diharapkan === */}
                  <div className="mt-6">
                    <p className="font-semibold text-gray-600 mb-1">
                      Penyelesaian yang Diharapkan
                    </p>
                    <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm text-left">
                      Server balik normal kek biasanya
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* === Tombol Aksi === */}
            <div className="flex justify-between">
              {/* Tombol Batalkan */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
              >
                Batalkan
              </button>

              {/* Tombol Simpan */}
              <button
                type="submit"
                className="bg-[#0F2C59] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup Warning Kirim */}
      {showSubmitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 0C77.615 0 100 22.385 100 50C100 77.615 77.615 100 50 100C22.385 100 0 77.615 0 50C0 22.385 22.385 0 50 0ZM50 10C39.3913 10 29.2172 14.2143 21.7157 21.7157C14.2143 29.2172 10 39.3913 10 50C10 60.6087 14.2143 70.7828 21.7157 78.2843C29.2172 85.7857 39.3913 90 50 90C60.6087 90 70.7828 85.7857 78.2843 78.2843C85.7857 70.7828 90 60.6087 90 50C90 39.3913 85.7857 29.2172 78.2843 21.7157C70.7828 14.2143 60.6087 10 50 10ZM50 65C51.3261 65 52.5979 65.5268 53.5355 66.4645C54.4732 67.4021 55 68.6739 55 70C55 71.3261 54.4732 72.5979 53.5355 73.5355C52.5979 74.4732 51.3261 75 50 75C48.6739 75 47.4021 74.4732 46.4645 73.5355C45.5268 72.5979 45 71.3261 45 70C45 68.6739 45.5268 67.4021 46.4645 66.4645C47.4021 65.5268 48.6739 65 50 65ZM50 20C51.3261 20 52.5979 20.5268 53.5355 21.4645C54.4732 22.4021 55 23.6739 55 25V55C55 56.3261 54.4732 57.5979 53.5355 58.5355C52.5979 59.4732 51.3261 60 50 60C48.6739 60 47.4021 59.4732 46.4645 58.5355C45.5268 57.5979 45 56.3261 45 55V25C45 23.6739 45.5268 22.4021 46.4645 21.4645C47.4021 20.5268 48.6739 20 50 20Z"
                    fill="#FF5F57"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apakah Anda yakin ingin menyimpan?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Cek kembali inputan Anda sebelum mengirim!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 bg-[#0F2C59] text-white rounded-md text-sm font-medium hover:bg-[#15397A] transition-colors"
                >
                  Ya, saya yakin!
                </button>
                <button
                  onClick={handleCancelSubmit}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AksiTiketCritical;
