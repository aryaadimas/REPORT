import React, { useState } from "react";
import { FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function FormPenugasanSeksi() {
  const navigate = useNavigate();

  const daftarTeknisi = [
    { nama: "Eren Jaeger", avatar: "/assets/Suika.jpg" },
    { nama: "Bakugo Katsuki", avatar: "/assets/shizuku.jpg" },
    { nama: "Meguru Bachira", avatar: "/assets/Bokuto.jpg" },
  ];

  const [selectedTeknisi, setSelectedTeknisi] = useState("");
  const [lampiranName, setLampiranName] = useState("");
  const teknisiObj = daftarTeknisi.find((t) => t.nama === selectedTeknisi);

  // === Handle KIRIM ===
  const handleSubmit = () => {
    Swal.fire({
      title: "Yakin ingin mengirim?",
      text: "Cek kembali inputan Anda sebelum mengirim.",
      icon: "warning",
      iconColor: "#dc2626", // merah
      showCancelButton: true,
      confirmButtonColor: "#0F2C59",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, Kirim!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Laporan terkirim!",
          text: "Data berhasil dikirim ke sistem.",
          icon: "success",
          confirmButtonColor: "#0F2C59",
        });
      }
    });
  };

  // === Handle SIMPAN DRAFT ===
  const handleDraft = () => {
    Swal.fire({
      title: "Draft disimpan",
      icon: "info",
      confirmButtonColor: "#0F2C59",
    }).then(() => navigate(-1));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59] mb-3">Detail Penugasan</h1>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-8 space-y-8">

        {/* ========================= PENGIRIM ========================= */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-gray-800">Pengirim</label>
          <div className="flex items-center gap-2">
            <img src="/assets/shizuku.jpg" className="w-8 h-8 rounded-full" />
            <span className="font-medium text-gray-800">Widiya Karim</span>
          </div>
        </div>

        {/* ========================= ID LAPORAN ========================= */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-gray-800">ID Laporan</label>
          <div className="bg-gray-300 px-4 py-1.5 rounded text-center w-60 text-gray-700">
            LPR25838
          </div>
        </div>

        {/* ========================= PRIORITAS ========================= */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-gray-800">Prioritas</label>
          <div className="w-60 bg-green-500 text-white text-sm font-semibold text-center py-2 rounded">
            Rendah
          </div>
        </div>

        {/* ========================= STATUS ========================= */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-gray-800">Status</label>
          <div className="bg-gray-300 px-4 py-1.5 rounded text-center w-60 text-gray-700">
            Draft
          </div>
        </div>

        {/* ========================= JUDUL ========================= */}
        <div>
          <label className="text-sm font-semibold text-gray-800">
            Judul Pelaporan
          </label>
          <input
            readOnly
            defaultValue="Printer Sekarat"
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded text-gray-800"
          />
        </div>

        {/* ========================= DATA ASET + NOMOR SERI ========================= */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Data Aset</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded text-gray-800">
              Printer HP LaserJet Pro P1102W
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Nomor Seri</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded text-gray-800">
              HP-LJ-P1102W-001
            </div>
          </div>
        </div>

        {/* ========================= KATEGORI – SUB – JENIS ========================= */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Kategori Aset</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">Non TI</div>
          </div>
          <div>
            <label className="font-semibold text-gray-800">Sub-Kategori Aset</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">Jaringan</div>
          </div>
          <div>
            <label className="font-semibold text-gray-800">Jenis Aset</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">Barang</div>
          </div>
        </div>

        {/* ========================= LOKASI ========================= */}
        <div>
          <label className="font-semibold text-gray-800">Lokasi Kejadian</label>
          <div className="mt-1 bg-gray-300 px-4 py-2 rounded w-1/2 text-gray-800">
            Dinas Pendidikan Kantor Pusat
          </div>
        </div>

        {/* ========================= PILIH TEKNISI ========================= */}
        <div>
          <label className="font-semibold text-gray-800">Pilih Teknisi</label>
          <select
            value={selectedTeknisi}
            onChange={(e) => setSelectedTeknisi(e.target.value)}
            className="mt-1 w-64 border px-3 py-2 rounded-lg text-gray-700"
          >
            <option value="" disabled hidden>
              Pilih teknisi
            </option>
            {daftarTeknisi.map((t) => (
              <option key={t.nama} value={t.nama}>
                {t.nama}
              </option>
            ))}
          </select>

          {teknisiObj && (
            <div className="flex items-center gap-2 mt-3 bg-gray-50 border border-gray-200 rounded px-3 py-2 w-fit">
              <img
                src={teknisiObj.avatar}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-800">{teknisiObj.nama}</span>
            </div>
          )}
        </div>

        {/* ========================= RANGE TANGGAL ========================= */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Pengerjaan Awal</label>
            <input type="date" className="mt-1 w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="font-semibold text-gray-800">Sampai</label>
            <input type="date" className="mt-1 w-full border px-3 py-2 rounded" />
          </div>
        </div>

        {/* ========================= RINCIAN MASALAH ========================= */}
        <div>
          <label className="font-semibold text-gray-800">Rincian Masalah</label>
          <textarea
            readOnly
            rows="3"
            defaultValue="ROUTER DI RUANG ANAK RUSAK DAHH"
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded"
          />
        </div>

    {/* ========================= LAMPIRAN ========================= */}
<div>
  <label className="font-semibold text-gray-800">Lampiran File</label>

  <div className="mt-1 flex items-center gap-2">
    {/* ICON TIDAK BISA DIKLIK */}
    <FileText className="w-5 h-5 text-[#0F2C59]" />

    {/* HANYA TEKS YANG BISA DIKLIK */}
    <span
      onClick={() => document.getElementById("fileInputLampiran").click()}
      className="text-sm underline text-[#0F2C59] cursor-pointer hover:text-[#15397A]"
    >
      {lampiranName ? lampiranName : "Klik untuk unggah foto"}
    </span>
  </div>

  <input
    id="fileInputLampiran"
    type="file"
    accept="image/png, image/jpeg, image/jpg"
    className="hidden"
    onChange={(e) => {
      if (e.target.files[0]) {
        setLampiranName(e.target.files[0].name);
      }
    }}
  />
</div>





        {/* ========================= PENYELESAIAN ========================= */}
        <div>
          <label className="font-semibold text-gray-800">
            Penyelesaian yang Diharapkan
          </label>
          <textarea
            readOnly
            rows="2"
            defaultValue="POKOK ETILAH WKWKW"
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded"
          />
        </div>

        {/* ========================= BUTTON ========================= */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-400 rounded-lg bg-white"
          >
            Batalkan
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={handleDraft}
              className="text-[#0F2C59] underline hover:text-[#15397A] font-medium"
            >
              Simpan Draft
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#0F2C59] hover:bg-[#15397A] text-white rounded-lg"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
