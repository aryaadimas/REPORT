import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";


export default function MonitoringTiketSeksi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lampiranName, setLampiranName] = useState("");

  const laporanData = [
    {
      id: "LPR831938",
      pengirim: "Widiya Karim",
      status: "Diproses",
      prioritas: "Rendah",
      judul: "Printer Sekarat",
      kategori: "Non TI",
      subKategori: "Jaringan",
      jenis: "Barang",
      dataAset: "Printer HP LaserJet Pro P1102W",
      nomorSeri: "HP-LJ-P1102W-001",
      lokasi: "Dinas Pendidikan Kantor Pusat",
      rincian: "Printer gabisa ngacaasi ini haduu",
      lampiran: "bukti-laporan.pdf",
      penyelesaian: "Balik ke settingan biasanya",
      foto: "/assets/shizuku.jpg",
    },
    {
      id: "LPR931728",
      pengirim: "Widiya Karim",
      status: "Diproses",
      prioritas: "Rendah",
      judul: "Printer Sekarat",
      kategori: "Non TI",
      subKategori: "Jaringan",
      jenis: "Barang",
      dataAset: "Printer HP LaserJet Pro P1102W",
      nomorSeri: "HP-LJ-P1102W-001",
      lokasi: "Dinas Pendidikan Kantor Pusat",
      rincian: "Printer gabisa ngacaasi ini haduu",
      lampiran: "bukti-laporan.pdf",
      penyelesaian: "Balik ke settingan biasanya",
      foto: "/assets/shizuku.jpg",
    },
    {
      id: "LPR907276",
      pengirim: "Widiy Karim",
      status: "Diproses",
      prioritas: "Rendah",
      judul: "Printer Sekarat",
      kategori: "Non TI",
      subKategori: "Jaringan",
      jenis: "Barang",
      dataAset: "Printer HP LaserJet Pro P1102W",
      nomorSeri: "HP-LJ-P1102W-001",
      lokasi: "Dinas Pendidikan Kantor Pusat",
      rincian: "Printer gabisa ngacaasi ini haduu",
      lampiran: "bukti-laporan.pdf",
      penyelesaian: "Balik ke settingan biasanya",
      foto: "/assets/shizuku.jpg",
    },
  ];

  const laporan = laporanData.find((lap) => lap.id === id);

  if (!laporan) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Data laporan tidak ditemukan</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Kembali
        </button>
      </div>
    );
  }

  const getPriorityColor = (p) => {
    switch (p) {
      case "Rendah":
        return "bg-green-500";
      case "Sedang":
        return "bg-yellow-500";
      case "Tinggi":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59] mb-4">
        Detail Laporan
      </h1>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-8 space-y-8">

        {/* ==== Pengirim ==== */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-36 font-semibold text-gray-800">Pengirim</label>
            <div className="flex items-center gap-3">
              <img
                src={laporan.foto}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-medium text-gray-700">
                {laporan.pengirim}
              </span>
            </div>
          </div>

          {/* ID */}
          <div className="flex items-center gap-4">
            <label className="w-36 font-semibold text-gray-800">
              ID Laporan
            </label>
            <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md w-48 text-center text-sm font-medium">
              {laporan.id}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <label className="w-36 font-semibold text-gray-800">Status</label>
            <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md w-48 text-center text-sm font-medium">
              {laporan.status}
            </div>
          </div>

          {/* Prioritas */}
          <div className="flex items-center gap-4">
            <label className="w-36 font-semibold text-gray-800">
              Level Prioritas
            </label>
            <div
              className={`px-4 py-2 rounded-md text-white w-48 text-center text-sm font-semibold ${getPriorityColor(
                laporan.prioritas
              )}`}
            >
              {laporan.prioritas}
            </div>
          </div>
        </div>

        {/* ==== Judul ==== */}
        <div className="pt-4 border-t">
          <label className="font-semibold text-gray-800">Judul Pelaporan</label>
          <input
            readOnly
            value={laporan.judul}
            className="w-full bg-gray-300 px-4 py-2 rounded-lg mt-1"
          />
        </div>

        {/* ==== Data Aset - Nomor Seri (2 kolom) ==== */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Data Aset</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {laporan.dataAset}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Nomor Seri</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {laporan.nomorSeri}
            </div>
          </div>
        </div>

        {/* ==== Kategori - SubKategori - Jenis (3 kolom) ==== */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Kategori Aset</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {laporan.kategori}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">
              Sub-Kategori Aset
            </label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {laporan.subKategori}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Jenis Aset</label>
            <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1">
              {laporan.jenis}
            </div>
          </div>
        </div>

        {/* ==== Lokasi ==== */}
        <div>
          <label className="font-semibold text-gray-800">Lokasi Kejadian</label>
          <div className="bg-gray-300 px-4 py-2 rounded-lg mt-1 w-1/2">
            {laporan.lokasi}
          </div>
        </div>

        {/* ==== Rincian ==== */}
        <div>
          <label className="font-semibold text-gray-800">Rincian Masalah</label>
          <textarea
            readOnly
            rows="3"
            className="w-full bg-gray-300 rounded px-4 py-2 mt-1"
            value={laporan.rincian}
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



        {/* ==== Penyelesaian ==== */}
        <div>
          <label className="font-semibold text-gray-800">
            Penyelesaian yang Diharapkan
          </label>
          <textarea
            readOnly
            rows="2"
            className="w-full bg-gray-300 rounded px-4 py-2 mt-1"
            value={laporan.penyelesaian}
          />
        </div>

        {/* ==== Tombol ==== */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
