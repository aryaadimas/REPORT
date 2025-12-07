import React, { useState } from "react";
import { Plus, Trash2, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function KBEditorKota() {
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showNoSelectionWarning, setShowNoSelectionWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // TAMBAHKAN STATE INI SAJA
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState("");

  const data = [
    {
      judul: "Cara Login ke Sistem Menggunakan Akun SSO",
      kategori: "Akun dan SSO",
    },
    {
      judul: "Panduan Aktivasi Akun Email Dinas Baru",
      kategori: "Akun dan SSO",
    },
    { judul: "Cara Reset Password untuk Akun SSO", kategori: "Akun dan SSO" },
    {
      judul: "Cara Membuat Tiket Laporan Baru di Sistem",
      kategori: "Pelaporan dan Pelayanan",
    },
    {
      judul: "Langkah-langkah Melihat Status Tiket",
      kategori: "Pelaporan dan Pelayanan",
    },
    {
      judul: "Cara Melihat Riwayat Laporan Tiket Sebelumnya",
      kategori: "Pelaporan dan Pelayanan",
    },
    {
      judul: "Arti Warna dan Status Tiket",
      kategori: "Pelaporan dan Pelayanan",
    },
    {
      judul: "Langkah-langkah untuk Permohonan Pelayanan",
      kategori: "Pelaporan dan Pelayanan",
    },
    {
      judul: "Cara Melaporkan Tiket yang Salah Kategori",
      kategori: "Pelaporan dan Pelayanan",
    },
    {
      judul: "Tambah Dokumen Pendukung Permintaan",
      kategori: "Layanan dan Formulir",
    },
    {
      judul: "Cara Mengisi Formulir Pelaporan",
      kategori: "Layanan dan Formulir",
    },
    {
      judul: "Cara Mengisi Formulir Pelayanan",
      kategori: "Layanan dan Formulir",
    },
  ];

  const handleDeleteMode = () => {
    // Jika deleteMode sedang aktif, tampilkan SweetAlert konfirmasi hapus
    if (deleteMode && selected.length > 0) {
      setShowDeleteConfirm(true);
    } else if (deleteMode && selected.length === 0) {
      // Tampilkan popup custom warning
      setShowNoSelectionWarning(true);
    } else {
      // Aktifkan mode hapus
      setDeleteMode(true);
    }
  };

  const toggleSelect = (judul) => {
    setSelected((prev) =>
      prev.includes(judul)
        ? prev.filter((item) => item !== judul)
        : [...prev, judul]
    );
  };

  // Fungsi untuk menutup popup warning
  const handleCloseNoSelectionWarning = () => {
    setShowNoSelectionWarning(false);
  };

  // Fungsi untuk konfirmasi hapus
  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    Swal.fire({
      icon: "success",
      title: "Data berhasil dihapus!",
      confirmButtonColor: "#0F2C59",
    });
    setSelected([]);
    setDeleteMode(false);
  };

  // Fungsi untuk batal hapus
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // TAMBAHKAN FUNGSI INI SAJA - untuk popup Tambah
  const handleAddClick = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
    setSelectedArticle("");
  };

  const handleSubmitArticle = () => {
    if (selectedArticle) {
      Swal.fire({
        icon: "success",
        title: "Unggahan berhasil terkirim!",
        confirmButtonColor: "#0F2C59",
      });
      handleCloseAddPopup();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Silakan pilih artikel terlebih dahulu!",
        confirmButtonColor: "#0F2C59",
      });
    }
  };

  // Data untuk dropdown (sesuai gambar)
  const approvedArticles = [
    "Panduan Cek Knowledge Base",
    "Cara Menghubungi Service Desk",
    "Cara Reset Password",
    "Panduan Cek Status",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Tombol Tambah dan Hapus - TAMBAH onClick di tombol Tambah */}
      <div className="flex gap-3">
        <button
          onClick={handleAddClick} // INI SAJA YANG DIUBAH
          className="flex items-center gap-2 bg-[#0F2C59] text-white px-4 py-2 rounded-xl shadow hover:bg-[#15397A] transition-all"
        >
          <Plus size={16} />
          Tambah
        </button>

        <button
          onClick={handleDeleteMode}
          className={`flex items-center gap-2 ${
            deleteMode
              ? selected.length > 0
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-400 hover:bg-gray-500"
              : "bg-red-500 hover:bg-red-600"
          } text-white px-4 py-2 rounded-xl shadow transition-all`}
        >
          <Trash2 size={16} />
          {deleteMode ? "Selesai" : "Hapus"}
        </button>
      </div>

      {/* Grid Artikel - TIDAK DIUBAH */}
      <div className="grid grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className={`relative bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-all ${
              selected.includes(item.judul) ? "ring-2 ring-red-400" : ""
            }`}
          >
            {/* Checkbox hanya muncul saat delete mode */}
            {deleteMode && (
              <input
                type="checkbox"
                checked={selected.includes(item.judul)}
                onChange={() => toggleSelect(item.judul)}
                className="absolute top-3 left-3 w-4 h-4 accent-red-500 cursor-pointer"
              />
            )}

            <div className={`${deleteMode ? "pl-6" : ""}`}>
              <h3 className="font-semibold text-gray-800 mb-2">{item.judul}</h3>
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-lg bg-[#0F2C59] text-white">
                {item.kategori}
              </span>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate("/lihatartikelkota")}
                disabled={deleteMode}
                className={`flex items-center text-[#0F2C59] hover:text-[#15397A] transition-all ${
                  deleteMode ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TAMBAHKAN POPUP INI SAJA - Popup Unggah Artikel */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col gap-2 p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Unggah Artikel
                </h3>
                <button
                  onClick={handleCloseAddPopup}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <h5 className="text-gray-600">
                Pilih artikel yang sudah di approve
              </h5>
            </div>
            {/* Content */}
            <div className="p-6">
              {/* Dokumen yang sudah di-approve */}
              <div className="mb-8">
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  {/* Header Table */}
                  <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                    <div className="col-span-5">Dokumen</div>
                    <div className="col-span-3">Tanggal masuk</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Aksi</div>
                  </div>

                  {/* List Dokumen */}
                  <div className="bg-white">
                    {approvedArticles.map((article, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 items-center px-4 py-3 border-t border-gray-100 hover:bg-gray-50"
                      >
                        <div className="col-span-5 flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedArticle === article}
                            onChange={() => setSelectedArticle(article)}
                            className="mr-3 w-4 h-4 accent-[#0F2C59] cursor-pointer"
                          />
                          <span className="text-gray-800">{article}</span>
                        </div>
                        <div className="col-span-3 text-gray-600">
                          25/09/2024
                        </div>
                        <div className="col-span-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Approve
                          </span>
                        </div>
                        <div className="col-span-2">
                          <button className="text-[#0F2C59] hover:text-[#15397A] text-sm font-medium">
                            Lihat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Tombol Aksi */}
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t">
              <button
                onClick={handleSubmitArticle}
                className="px-5 py-2.5 bg-[#0F2C59] text-white rounded-xl hover:bg-[#15397A] transition-colors font-medium"
              >
                Pilih
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Warning - Belum ada yang dipilih - TIDAK DIUBAH */}
      {showNoSelectionWarning && (
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
                Tidak ada yang dipilih
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Pilih minimal satu artikel yang ingin dihapus!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleCloseNoSelectionWarning}
                  className="px-4 py-2 bg-[#0F2C59] text-white rounded-md text-sm font-medium hover:bg-[#15397A] transition-colors"
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Konfirmasi Hapus - TIDAK DIUBAH */}
      {showDeleteConfirm && (
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
                Apakah Anda yakin ingin menghapus?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Cek kembali sebelum mengirim!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-[#0F2C59] text-white rounded-md text-sm font-medium hover:bg-[#15397A] transition-colors"
                >
                  Ya, saya yakin!
                </button>
                <button
                  onClick={handleCancelDelete}
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
}
