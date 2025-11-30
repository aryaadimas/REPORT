import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Buatformrfc() {
  const navigate = useNavigate();

  // Data aset untuk dropdown + auto nomor seri
  const asetData = {
    "Router TP-Link TL-WR940N": "TPL-WR940N-001",
    "Printer HP LaserJet P1102": "HP-P1102-002",
    "CCTV Hikvision DS-2CD": "HKV-2CD-003",
  };

  // Sub kategori otomatis per kategori
  const subKategoriMap = {
    Jaringan: ["Switch", "Router", "Access Point"],
    Keamanan: ["CCTV", "Alarm", "Akses Kontrol"],
    "Perangkat Keras": ["Printer", "Laptop", "Monitor"],
    Aplikasi: ["Sistem Informasi", "Mobile App", "Web App"],
  };

  const jenisMap = {
    Jaringan: ["Fisik", "Virtual"],
    Keamanan: ["Fisik", "Digital"],
    "Perangkat Keras": ["Barang", "Elektronik"],
    Aplikasi: ["Internal", "Publik"],
  };

  const [form, setForm] = useState({
    judul: "",
    namaPemohon: "",
    opd: "",
    noHP: "",

    dataAset: "",
    nomorSeri: "",
    kategori: "",
    subKategori: "",
    jenisAset: "",

    estimasiWaktu: "",
    estimasiSatuan: "Hari", // default

    deskripsi: "",
    alasan: "",
    dampakPerubahan: "",
    dampakTidakBerubah: "",
    estimasiBiaya: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAsetChange = (value) => {
    setForm({
      ...form,
      dataAset: value,
      nomorSeri: asetData[value] || "",
    });
  };

  const handleKategori = (value) => {
    setForm({
      ...form,
      kategori: value,
      subKategori: "",
      jenisAset: "",
    });
  };

  const formatRupiah = (value) => {
    const angka = value.replace(/[^\d]/g, "");
    return angka ? `Rp ${angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Simpan Perubahan?",
      text: "Pastikan data sudah benar sebelum disimpan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F2C59",
      cancelButtonColor: "#d33",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data RFC telah diperbarui.",
          icon: "success",
          confirmButtonColor: "#0F2C59",
        }).then(() => navigate("/rfcteknisi"));
      }
    });
  };

  const handleKirim = () => {
    Swal.fire({
      title: "Kirim Pengajuan?",
      text: "Pastikan semua data sudah benar sebelum dikirim.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F2C59",
      cancelButtonColor: "#d33",
      confirmButtonText: "Kirim",
      cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: "Berhasil!",
          text: "Pengajuan RFC berhasil dikirim.",
          icon: "success",
          confirmButtonColor: "#0F2C59",
        }).then(() => navigate("/rfcteknisi"));
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0F2C59] mb-10">Edit Form RFC</h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ==================== JUDUL ==================== */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 text-sm">
              Judul Pengajuan
            </label>
            <input
              type="text"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 shadow-sm text-sm"
              placeholder="Ketik disini"
            />
          </div>

          {/* ==================== 3 KOLOM ==================== */}
          <div className="grid grid-cols-3 gap-8">
            {/* Nama */}
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-semibold">
                Nama Pemohon
              </label>
              <input
                type="text"
                name="namaPemohon"
                value={form.namaPemohon}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 shadow-sm text-sm"
              />
            </div>

            {/* OPD */}
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-semibold">OPD Asal</label>
              <select
                name="opd"
                value={form.opd}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm"
                placeholder="pilih opd"
              >
                <option>Dinas Pendidikan</option>
                <option>Dinas Kesehatan</option>
                <option>Dinas Perhubungan</option>
              </select>
            </div>

            {/* HP */}
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-semibold">Nomor HP</label>
              <input
                type="text"
                name="noHP"
                value={form.noHP}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 shadow-sm text-sm"
              />
            </div>
          </div>

          {/* ==================== DATA ASET ==================== */}
          <div className="grid grid-cols-2 gap-8">
            {/* dropdown aset */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Data Aset</label>
              <select
                name="dataAset"
                value={form.dataAset}
                onChange={(e) => handleAsetChange(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 shadow-sm text-sm"
              >
                <option value="">Pilih data aset</option>
                {Object.keys(asetData).map((aset) => (
                  <option key={aset}>{aset}</option>
                ))}
              </select>
            </div>

            {/* auto nomor seri */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nomor Seri</label>
              <input
                type="text"
                name="nomorSeri"
                value={form.nomorSeri}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm shadow-sm"
              />
            </div>
          </div>

          {/* ==================== 3 KOLOM ASET ==================== */}
          <div className="grid grid-cols-3 gap-8">

          {/* kategori */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Kategori Aset
            </label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={(e) => handleKategori(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm"
            >
              <option value="">Pilih kategori</option>
              <option value="Jaringan">Jaringan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Perangkat Keras">Perangkat Keras</option>
              <option value="Aplikasi">Aplikasi</option>
            </select>
          </div>

          {/* Subkategori */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Sub-Kategori Aset
            </label>
            <select
              name="subKategori"
              value={form.subKategori}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm"
              disabled={!form.kategori}
            >
              <option value="">Pilih sub kategori</option>
              {form.kategori &&
                subKategoriMap[form.kategori].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
            </select>
          </div>

          {/* Jenis */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Jenis Aset</label>
            <select
              name="jenisAset"
              value={form.jenisAset}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm"
              disabled={!form.kategori}
            >
              <option value="">Pilih jenis aset</option>
              {form.kategori &&
                jenisMap[form.kategori].map((jenis) => (
                  <option key={jenis} value={jenis}>{jenis}</option>
                ))}
            </select>
          </div>

          </div>


          {/* ==================== ESTIMASI WAKTU ==================== */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
  <label className="text-sm font-semibold text-gray-700">
    Estimasi Waktu
  </label>

  <div className="flex items-center gap-3">

    {/* Jam */}
    <input
      type="number"
      min="0"
      max="999"
      name="estimasiJam"
      value={form.estimasiJam || ""}
      onChange={handleChange}
      className="w-20 border rounded-lg px-3 py-2 shadow-sm text-sm"
      placeholder="000"
    />
    <span className="text-gray-700 text-sm font-medium">Jam</span>

    {/* Menit */}
    <input
      type="number"
      min="0"
      max="59"
      name="estimasiMenit"
      value={form.estimasiMenit || ""}
      onChange={handleChange}
      className="w-20 border rounded-lg px-3 py-2 shadow-sm text-sm"
      placeholder="00"
    />
    <span className="text-gray-700 text-sm font-medium">Menit</span>

    {/* Detik */}
    <input
      type="number"
      min="0"
      max="59"
      name="estimasiDetik"
      value={form.estimasiDetik || ""}
      onChange={handleChange}
      className="w-20 border rounded-lg px-3 py-2 shadow-sm text-sm"
      placeholder="00"
    />
    <span className="text-gray-700 text-sm font-medium">Detik</span>

  </div>
</div>


            {/* biaya */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Estimasi Biaya
              </label>
              <input
                name="estimasiBiaya"
                value={formatRupiah(form.estimasiBiaya)}
                onChange={(e) => {
                  const angka = e.target.value.replace(/[^\d]/g, "");
                  setForm({ ...form, estimasiBiaya: angka });
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm"
              />
            </div>
          </div>

          {/* ==================== TEXTAREA AREA ==================== */}
          {[
            ["Deskripsi", "deskripsi"],
            ["Alasan Perubahan", "alasan"],
            ["Dampak Perubahan", "dampakPerubahan"],
            ["Dampak Jika Tidak Dilakukan Perubahan", "dampakTidakBerubah"],
          ].map(([label, field]) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {label}
              </label>
              <textarea
                name={field}
                value={form[field]}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm resize-none"
                placeholder="Ketik disini"
              />
            </div>
          ))}

          {/* ==================== BUTTON ==================== */}
          <div className="flex justify-between items-center border-t pt-6">
            <button
              type="button"
              onClick={() => navigate("/rfcteknisi")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-100 shadow-sm"
            >
              Batalkan
            </button>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F2C59] text-white rounded-lg text-sm shadow hover:bg-[#15397A]"
              >
                Simpan Draft
              </button>

              <button
                type="button"
                onClick={handleKirim}
                className="px-5 py-2 bg-[#0F2C59] text-white rounded-lg text-sm shadow hover:bg-[#15397A]"
              >
                Kirim
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
