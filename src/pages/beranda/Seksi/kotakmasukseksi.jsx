import React, { useState } from "react";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export default function KotakMasukSeksi() {
  const [activeTab, setActiveTab] = useState("semua");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState([]);

  const [data, setData] = useState([
    {
      id: 1,
      tipe: "tiket",
      judul: "Tiket Masuk",
      detail: "Tiket dengan ID LPR2782972 perlu ditindaklanjuti.",
      tag: "Tiket",
      waktu: "Baru saja",
    },
    {
      id: 2,
      tipe: "tiket",
      judul: "Tiket Masuk",
      detail: "Tiket dengan ID LPR346313 perlu ditindaklanjuti.",
      tag: "Tiket",
      waktu: "12 menit yang lalu",
    },
    {
      id: 3,
      tipe: "status",
      judul: "Status Tiket Diperbarui",
      detail: "Tiket dengan ID LPR238887 telah diverifikasi oleh bidang.",
      tag: "Status",
      waktu: "59 menit yang lalu",
    },
    {
      id: 4,
      tipe: "pengumuman",
      judul: "Pengumuman Baru",
      detail: "Sistem akan maintenance jam 09.00 malam.",
      tag: "Pengumuman",
      waktu: "2 jam yang lalu",
    },
    {
      id: 5,
      tipe: "tiket",
      judul: "Tiket Masuk",
      detail: "Tiket dengan ID LPR298313 perlu ditindaklanjuti.",
      tag: "Tiket",
      waktu: "2 menit yang lalu",
    },
    {
      id: 4,
      tipe: "pengumuman",
      judul: "Pengumuman Baru",
      detail: "Sistem akan maintenance jam 11.00 pagi.",
      tag: "Pengumuman",
      waktu: "10 jam yang lalu",
    },
  ]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = () => {
    // klik pertama → masukkan ke delete mode
    if (!deleteMode) {
      setDeleteMode(true);
      return;
    }

    // jika deleteMode ON tapi tidak ada item yg dipilih
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak ada pesan yang dipilih!",
        text: "Pilih pesan terlebih dahulu sebelum menghapus.",
        confirmButtonColor: "#0F2C59",
      });
      return;
    }

    // konfirmasi penghapusan
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Pesan yang dipilih akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => !selected.includes(item.id)));
        setSelected([]);
        setDeleteMode(false);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pesan berhasil dihapus.",
          confirmButtonColor: "#0F2C59",
        });
      }
    });
  };

  const filteredData = data.filter((item) => {
    if (activeTab === "semua") return true;
    return item.tipe === activeTab;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#0F2C59] mb-3">Kotak Masuk</h1>

      <div className="bg-white p-6 rounded-2xl shadow">

        {/* TAB FILTER */}
        <div className="flex gap-3 mb-6">
          {[
            { id: "semua", label: "Semua" },
            { id: "tiket", label: "Tiket" },
            { id: "status", label: "Status" },
            { id: "pengumuman", label: "Pengumuman" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setDeleteMode(false);
                setSelected([]);
              }}
              className={`px-5 py-2 rounded-full border text-sm font-semibold transition
              ${
                activeTab === tab.id
                  ? "bg-[#0F2C59] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TOMBOL */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            <TrashIcon className="w-5 h-5" />
            {deleteMode ? "Hapus Sekarang" : "Hapus"}
          </button>

          <button className="flex items-center gap-2 bg-[#0F2C59] hover:bg-[#15397A] text-white px-4 py-2 rounded-lg font-medium">
            <ArrowPathIcon className="w-5 h-5" /> Refresh
          </button>
        </div>

        {/* LIST PESAN */}
        <div className="space-y-4">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-5 bg-white border rounded-xl shadow-sm"
            >
              {deleteMode && (
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="mt-2 w-5 h-5 cursor-pointer"
                />
              )}

              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100">
                <DocumentTextIcon className="w-7 h-7 text-[#0F2C59]" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-700">
                  {item.judul}
                </h3>
                <p className="text-gray-600">{item.detail}</p>

                <span className="inline-block px-3 py-1 mt-2 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg">
                  {item.tag}
                </span>
              </div>

              <div className="text-sm text-gray-500">{item.waktu}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
