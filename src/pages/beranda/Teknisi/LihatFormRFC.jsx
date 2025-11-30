import React from "react";
import { useNavigate } from "react-router-dom";

export default function LihatFormRFC() {
  const navigate = useNavigate();

  const form = {
    judul: "Penggantian Router Utama",
    namaPemohon: "Arya Dimas Saputra",
    opdAsal: "Dinas Pendidikan Kota Surabaya",
    noHP: "081234567890",
    dataAset: "Router TP-Link Lantai 3",
    nomorSeri: "TP-9983-LL",
    kategori: "Jaringan",
    subKategori: "Wireless",
    jenisAset: "Barang",
    estimasiWaktu: "02 Jam 00 Menit 00 Detik",
    estimasiBiaya: "Rp 2.000.000",
    deskripsi: "Router utama tidak stabil dan perlu diganti dengan unit baru.",
    alasan: "Router sudah melebihi masa pakai dan sering mengalami gangguan.",
    dampakPerubahan: "Perlu downtime jaringan selama 2 jam.",
    dampakTidakBerubah: "Koneksi akan tetap lambat dan sering putus.",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0F2C59] mb-8">Lihat Form RFC</h1>

        <div className="space-y-6">
          {/* Judul Pengajuan */}
          <div>
            <label className="text-gray-700 text-sm">Judul Pengajuan</label>
            <input
              type="text"
              readOnly
              value={form.judul}
              className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
            />
          </div>

          {/* Nama - OPD Asal - No HP */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-gray-700 text-sm">Nama Pemohon</label>
              <input
                readOnly
                value={form.namaPemohon}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm">OPD Asal</label>
              <input
                readOnly
                value={form.opdAsal}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm">Nomor HP</label>
              <input
                readOnly
                value={form.noHP}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>
          </div>

          {/* Data Aset - No Seri */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 text-sm">Data Aset</label>
              <input
                readOnly
                value={form.dataAset}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm">Nomor Seri</label>
              <input
                readOnly
                value={form.nomorSeri}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>
          </div>

          {/* Kategori - Sub - Jenis */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-gray-700 text-sm">Kategori Aset</label>
              <input
                readOnly
                value={form.kategori}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm">Sub Kategori</label>
              <input
                readOnly
                value={form.subKategori}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm">Jenis Aset</label>
              <input
                readOnly
                value={form.jenisAset}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>
          </div>

          {/* Estimasi Waktu & Biaya */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 text-sm">Estimasi Waktu</label>
              <input
                readOnly
                value={form.estimasiWaktu}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm">Estimasi Biaya</label>
              <input
                readOnly
                value={form.estimasiBiaya}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-gray-700 text-sm">Deskripsi</label>
            <textarea
              readOnly
              rows={3}
              value={form.deskripsi}
              className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
            />
          </div>

          {/* Alasan */}
          <div>
            <label className="text-gray-700 text-sm">Alasan Perubahan</label>
            <textarea
              readOnly
              rows={3}
              value={form.alasan}
              className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
            />
          </div>

          {/* Dampak Perubahan */}
          <div>
            <label className="text-gray-700 text-sm">Dampak Perubahan</label>
            <textarea
              readOnly
              rows={3}
              value={form.dampakPerubahan}
              className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
            />
          </div>

          {/* Dampak Jika Tidak */}
          <div>
            <label className="text-gray-700 text-sm">
              Dampak Jika Tidak Dilakukan
            </label>
            <textarea
              readOnly
              rows={3}
              value={form.dampakTidakBerubah}
              className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-lg mt-1"
            />
          </div>

          {/* Tombol */}
          <div className="pt-4 border-t">
            <button
              onClick={() => navigate("/rfcteknisi")}
              className="px-5 py-2 bg-[#0F2C59] hover:bg-[#15397A] text-white text-sm font-medium rounded-lg shadow-sm"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
