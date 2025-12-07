import React, { useState, useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function PengajuanBidang() {
  const navigate = useNavigate();

  const [urgensi, setUrgensi] = useState(2);
  const [dampak, setDampak] = useState(2);
  const [lampiranName, setLampiranName] = useState("bukti-laporan.pdf");

  // === HITUNG PRIORITAS OTOMATIS ===
  const hasil = urgensi * dampak;

  let priority = "";
  if (hasil === 1 || hasil === 2) priority = "Rendah";
  else if (hasil === 3 || hasil === 4) priority = "Sedang";
  else if (hasil === 6) priority = "Tinggi";
  else if (hasil === 9) priority = "Kritis";

  const priorityClasses = {
    Rendah: "border-green-500 text-green-700",
    Sedang: "border-yellow-500 text-yellow-600",
    Tinggi: "border-red-500 text-red-600",
    Kritis: "border-gray-700 text-gray-700",
  };

  const fileInput = useRef(null);

  const uploadLampiran = () => fileInput.current.click();
  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setLampiranName(e.target.files[0].name);
    }
  };

  const data = {
    pengirim: "Widiya Karim",
    id: "LPR831938",
    status: "Draft",
    judul: "Printer Rusak Berat",
    dataAset: "Printer HP LaserJet Pro P1102W",
    nomorSeri: "HP-LJ-P1102W-001",
    skor: "15",
    kategori: "Non TI",
    subKategori: "Jaringan",
    jenis: "Barang",
    lokasi: "Dinas Pendidikan Kantor Pusat",
    rincian: "ROUTER DI RUANG ANAM RUSAK DAHH",
    penyelesaian: "PERBAIKAN / PENGGANTIAN UNIT",
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59]">Detail Pengajuan</h1>

      <div className="bg-white border rounded-2xl shadow p-8 space-y-8">

        {/* === PENGIRIM === */}
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <label className="w-40 text-gray-800 font-semibold">Pengirim</label>
            <div className="flex items-center gap-3">
              <img src="/assets/shizuku.jpg" className="w-10 h-10 rounded-full" />
              <span className="text-gray-700 font-medium">{data.pengirim}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold text-gray-800">ID Laporan</label>
            <div className="bg-gray-300 rounded px-4 py-1.5 w-80 text-center">
              {data.id}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold text-gray-800">Status</label>
            <div className="bg-gray-300 rounded px-4 py-1.5 w-80 text-center">
              {data.status}
            </div>
          </div>
        </div>

        {/* === JUDUL === */}
        <div>
          <label className="font-semibold text-gray-800">Judul Pelaporan</label>
          <div className="bg-gray-300 rounded px-4 py-1.5 mt-1">{data.judul}</div>
        </div>

        {/* === BARIS 1 === */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Data Aset</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">{data.dataAset}</div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Nomor Seri</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">{data.nomorSeri}</div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Skor Risiko</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">{data.skor}</div>
          </div>
        </div>

        {/* === BARIS 2 === */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Kategori Aset</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">{data.kategori}</div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Sub-Kategori Aset</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">{data.subKategori}</div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Jenis Aset</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">{data.jenis}</div>
          </div>
        </div>

        {/* === LOKASI === */}
        <div>
          <label className="font-semibold text-gray-800">Lokasi Kejadian</label>
          <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">{data.lokasi}</div>
        </div>

        {/* === URGENSI & DAMPAK === */}
<div className="grid grid-cols-2 gap-10 mt-6">

  {/* URGENSI */}
  <div>
    <label className="font-semibold text-gray-800">Urgensi</label>

    <div className="flex items-center gap-3 mt-3">
      <span className="text-sm text-gray-600">Rendah</span>

      <div className="flex gap-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            onClick={() => setUrgensi(n)}
            className="cursor-pointer"
          >
            <div
              className={
                "w-5 h-5 rounded-full border transition " +
                (urgensi === n
                  ? "bg-[#0F2C59] border-[#0F2C59]"
                  : "border-gray-400")
              }
            ></div>
          </div>
        ))}
      </div>

      <span className="text-sm text-gray-600">Tinggi</span>
    </div>
  </div>

  {/* DAMPAK */}
  <div>
    <label className="font-semibold text-gray-800">Dampak</label>

    <div className="flex items-center gap-3 mt-3">
      <span className="text-sm text-gray-600">Rendah</span>

      <div className="flex gap-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            onClick={() => setDampak(n)}
            className="cursor-pointer"
          >
            <div
              className={
                "w-5 h-5 rounded-full border transition " +
                (dampak === n
                  ? "bg-[#0F2C59] border-[#0F2C59]"
                  : "border-gray-400")
              }
            ></div>
          </div>
        ))}
      </div>

      <span className="text-sm text-gray-600">Tinggi</span>
    </div>
  </div>

</div>

        {/* === LEVEL PRIORITAS === */}
        <div>
          <label className="font-semibold text-gray-800">Level Prioritas</label>

          <div className="mt-3">
            <div
              className={
                "px-5 py-1 rounded-lg border font-semibold w-fit " +
                priorityClasses[priority]
              }
            >
              {priority}
            </div>
          </div>
        </div>

        {/* === RINCIAN === */}
        <div>
          <label className="font-semibold text-gray-800">Rincian Masalah</label>
          <textarea
            readOnly
            rows="3"
            className="w-full bg-gray-300 rounded px-4 py-2 mt-1"
            defaultValue={data.rincian}
          />
        </div>

        {/* === LAMPIRAN === */}
        <div>
          <label className="font-semibold text-gray-800">Lampiran File</label>

          <div
            onClick={uploadLampiran}
            className="flex items-center gap-2 cursor-pointer text-[#0F2C59] mt-1"
          >
            <PaperClipIcon className="w-5 h-5 text-gray-700" />
            {lampiranName}
          </div>

          <input ref={fileInput} onChange={onFileChange} type="file" className="hidden" />
        </div>

        {/* === PENYELESAIAN === */}
        <div>
          <label className="font-semibold text-gray-800">
            Penyelesaian yang Diharapkan
          </label>
          <textarea
            readOnly
            rows="2"
            className="w-full bg-gray-300 rounded px-4 py-2 mt-1"
            defaultValue={data.penyelesaian}
          />
        </div>

        {/* === BUTTONS === */}
        <div className="flex justify-between pt-6 border-t">

          {/* BATALKAN */}
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white border border-gray-400 rounded-lg"
          >
            Batalkan
          </button>

          <div className="flex gap-4">

            {/* SIMPAN DRAFT */}
            <button
              onClick={() =>
                Swal.fire({
                  icon: "success",
                  title: "Laporan disimpan",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => navigate(-1)) // kembali ke halaman sebelumnya
              }
              className="px-6 py-2 bg-gray-300 rounded-lg"
            >
              Simpan Draft
            </button>

            {/* KIRIM */}
            <button
              onClick={() =>
                Swal.fire({
                  title: "Yakin ingin mengirim laporan?",
                  icon: "warning",        // <-- ICON WARNING (merah/kuning)
                  showCancelButton: true,
                  confirmButtonText: "Ya",
                  cancelButtonText: "Batal",
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      icon: "success",
                      title: "Laporan terkirim",
                      showConfirmButton: false,
                      timer: 1500,
                    }).then(() => navigate(-1)); // balik setelah terkirim
                  }
                })
              }
              className="px-6 py-2 bg-[#0F2C59] text-white rounded-lg"
            >
              Kirim
            </button>

          </div>
        </div>


      </div>
    </div>
  );
}
