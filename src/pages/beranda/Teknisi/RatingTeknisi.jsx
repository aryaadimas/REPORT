import React, { useState } from "react";
import { RefreshCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RatingTeknisi() {
  const [activeTab, setActiveTab] = useState("pelaporan");

  const navigate = useNavigate();

  // === Dummy data lengkap (ada IT / Non-IT & Fisik / Non-Fisik)
  const dataRating = [
    { id: 1, nama: "Doni Ridho", masuk: "18/09/2024", selesai: "28/09/2024", aset: "Laptop Lenovo", seri: "LNV-TP-001", rating: 4, foto: "/assets/shizuku.jpg" },
    { id: 2, nama: "Rio Widoro", masuk: "18/09/2024", selesai: "19/09/2024", aset: "Printer HP", seri: "PT-HP-001", rating: 3, foto: "/assets/Suika.jpg" },
    { id: 3, nama: "Lia Yustia", masuk: "17/09/2024", selesai: "17/09/2024", aset: "PC Dell", seri: "PC-DL-012", rating: 5, foto: "/assets/Bokuto.jpg" },
    { id: 4, nama: "Sinta Wulandari", masuk: "20/09/2024", selesai: "21/09/2024", aset: "Monitor Samsung", seri: "MN-SS-004", rating: 4, foto: "/assets/shizuku.jpg" },
    { id: 5, nama: "Bagas Arif", masuk: "15/09/2024", selesai: "18/09/2024", aset: "Router TP-Link", seri: "RT-TPL-010", rating: 2, foto: "/assets/Suika.jpg" },
    { id: 6, nama: "Rani Amelia", masuk: "11/09/2024", selesai: "11/09/2024", aset: "Keyboard Logitech", seri: "KB-LG-022", rating: 5, foto: "/assets/Bokuto.jpg" },
    { id: 7, nama: "Feri Saputra", masuk: "09/10/2024", selesai: "10/10/2024", aset: "Mouse Logitech", seri: "MS-LG-099", rating: 3, foto: "/assets/shizuku.jpg" },
    { id: 8, nama: "Ayuni Pratiwi", masuk: "12/10/2024", selesai: "13/10/2024", aset: "Scanner Canon", seri: "SC-CN-008", rating: 4, foto: "/assets/Suika.jpg" },
    { id: 9, nama: "Kevin Hartanta", masuk: "05/10/2024", selesai: "07/10/2024", aset: "CCTV Hikvision", seri: "CT-HV-003", rating: 2, foto: "/assets/Bokuto.jpg" },
    { id: 10, nama: "Dewi Nursita", masuk: "01/10/2024", selesai: "03/10/2024", aset: "Wifi Indihome", seri: "WF-ID-020", rating: 5, foto: "/assets/shizuku.jpg" },
  ];

  const renderStars = (count) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#0F2C59]">Rating Kepuasan</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* === Tab Pelaporan / Pelayanan === */}
        <div className="border-b flex items-center justify-between px-6">
          <div className="flex">
            {["pelaporan", "pelayanan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-[#0F2C59] text-[#0F2C59]"
                    : "border-transparent text-gray-500 hover:text-[#0F2C59]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-[#0F2C59] hover:bg-[#15397A] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        {/* === Filter Baru 1 Baris 3 Kolom === */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-3 gap-8">

            {/* Kategori */}
            <div className="flex items-center gap-2">
              <label className="w-29 text-sm font-semibold text-gray-700">
                Data Aset
              </label>
              <select className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F2C59]">
                <option>Laptop Dell</option>
                <option>Jaringan</option>
                <option>Aplikasi</option>
                <option>Email</option>
                <option>Sistem Operasi</option>
              </select>
            </div>

            {/* Jenis */}
            <div className="flex items-center gap-2">
              <label className="w-29 text-sm font-semibold text-gray-700">
                No Seri
              </label>
              <select className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F2C59]">
                <option>Semua</option>
                <option>IT</option>
                <option>Non-IT</option>
              </select>
            </div>

            <div className="flex items-center  gap-2">
              <label className="w-29 text-sm font-semibold text-gray-700">
                Rating
              </label>
              <select className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F2C59]">
                <option>Semua</option>
                <option>⭐</option>
                <option>⭐⭐</option>
                <option>⭐⭐⭐</option>
                <option>⭐⭐⭐⭐</option>
                <option>⭐⭐⭐⭐⭐</option>
              </select>
            </div>
          </div>
        </div>


        {/* === Tabel Data === */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#0F2C59] text-white">
                <th className="p-3">Pengirim</th>
                <th className="p-3">Tgl. Awal</th>
                <th className="p-3">Tgl. Selesai</th>
                <th className="p-3">Data Aset</th>
                <th className="p-3">No Seri</th>
                <th className="p-3">Rating</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataRating.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 flex items-center gap-2">
                    <img src={item.foto} alt={item.nama} className="w-8 h-8 rounded-full object-cover" />
                    {item.nama}
                  </td>
                  <td className="p-3">{item.masuk}</td>
                  <td className="p-3">{item.selesai}</td>
                  <td className="p-3">{item.aset}</td>
                  <td className="p-3">{item.seri}</td>
                  <td className="p-3">{renderStars(item.rating)}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-[#0F2C59] hover:text-[#15397A]"
                      onClick={() => navigate("/detailratingteknisi")} // ✅ Tambahan navigasi
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === Pagination === */}
        <div className="flex justify-between items-center p-4 border-t text-sm text-gray-600">
          <p>Menampilkan data 1 sampai 10 dari 33 data</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">&lt;</button>
            <button className="px-3 py-1 border rounded-lg bg-[#0F2C59] text-white">1</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">3</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
