import React, { useState } from "react";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  StarIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom"; // ✅ Tambahan

export default function RatingSeksi() {
  const [activeTab, setActiveTab] = useState("Pelaporan");
  const [filters, setFilters] = useState({
    kategori: "",
    jenis: "",
    bentuk: "",
    rating: "",
  });

  const navigate = useNavigate(); // ✅ Inisialisasi navigasi

  const data = [
    {
      pengirim: "Doni Ridho",
      masuk: "18/09/2024",
      selesai: "18/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 5,
      foto: "/assets/Suika.jpg",
    },
    {
      pengirim: "Rio Widoro",
      masuk: "18/09/2024",
      selesai: "18/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 4,
      foto: "/assets/Bokuto.jpg",
    },
    {
      pengirim: "Lia Yustia",
      masuk: "17/09/2024",
      selesai: "18/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 3,
      foto: "/assets/shizuku.jpg",
    },
    {
      pengirim: "Ella Meisya",
      masuk: "17/09/2024",
      selesai: "17/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 4,
      foto: "/assets/Bokuto.jpg",
    },
    {
      pengirim: "Widiya Karim",
      masuk: "15/09/2024",
      selesai: "16/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 2,
      foto: "/assets/Suika.jpg",
    },
    {
      pengirim: "Doni Ridho",
      masuk: "18/09/2024",
      selesai: "18/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 5,
      foto: "/assets/Suika.jpg",
    },
    {
      pengirim: "Rio Widoro",
      masuk: "18/09/2024",
      selesai: "18/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 4,
      foto: "/assets/Bokuto.jpg",
    },
    {
      pengirim: "Lia Yustia",
      masuk: "17/09/2024",
      selesai: "18/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 3,
      foto: "/assets/shizuku.jpg",
    },
    {
      pengirim: "Ella Meisya",
      masuk: "17/09/2024",
      selesai: "17/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 4,
      foto: "/assets/Bokuto.jpg",
    },
    {
      pengirim: "Widiya Karim",
      masuk: "15/09/2024",
      selesai: "16/09/2024",
      aset: "Komputer",
      seri: "LP-VLK-021",
      rating: 2,
      foto: "/assets/Suika.jpg",
    },
  ];

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < count ? "text-[#0F2C59]" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-6xl mx-auto">
        {/* === Judul === */}
        <h1 className="text-3xl font-bold text-[#0F2C59] mb-6">
          Rating Kepuasan
        </h1>

        {/* === Tab dengan garis bawah === */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-300">
          <div className="flex gap-8">
            {["Pelaporan", "Pelayanan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-base font-semibold transition ${
                  activeTab === tab
                    ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                    : "text-gray-400 hover:text-[#0F2C59]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tombol Refresh */}
          <button className="flex items-center gap-2 bg-[#0F2C59] text-white px-4 py-2 rounded-lg hover:bg-[#15397A] transition text-sm font-medium shadow-sm -mt-4">
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* === Filter Pencarian 1 baris 3 kolom === */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 border shadow-sm">
          <h2 className="text-gray-700 font-semibold mb-4">
            Filter pencarian
          </h2>

          <div className="grid grid-cols-3 gap-6">

            {/* Data Aset */}
            <div>
              <label className="text-gray-600 text-sm block mb-1">
                Data Aset
              </label>
              <div className="relative">
                <select
                  value={filters.kategori}
                  onChange={(e) => handleFilterChange("kategori", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm appearance-none"
                >
                  <option>Pilih kategori</option>
                  <option>Sistem Operasi</option>
                  <option>Jaringan</option>
                  <option>Aplikasi</option>
                  <option>Email</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* No Seri */}
            <div>
              <label className="text-gray-600 text-sm block mb-1">
                No. Seri
              </label>
              <div className="relative">
                <select
                  value={filters.jenis}
                  onChange={(e) => handleFilterChange("jenis", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm appearance-none"
                >
                  <option>Pilih jenis</option>
                  <option>IT</option>
                  <option>Non-IT</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-gray-600 text-sm block mb-1">
                Rating
              </label>
              <div className="relative">
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm appearance-none"
                >
                  <option>Pilih rating</option>
                  <option>5</option>
                  <option>4</option>
                  <option>3</option>
                  <option>2</option>
                  <option>1</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

          </div>
        </div>


        {/* === Tabel Data === */}
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-[#0F2C59] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Pengirim</th>
                <th className="px-4 py-3 text-left">Tgl.Awal</th>
                <th className="px-4 py-3 text-left">Tgl.Selesai</th>
                <th className="px-4 py-3 text-left">Data Aset</th>
                <th className="px-4 py-3 text-left">No Seri</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <img
                      src={item.foto}
                      alt={item.pengirim}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {item.pengirim}
                  </td>
                  <td className="px-4 py-3">{item.masuk}</td>
                  <td className="px-4 py-3">{item.selesai}</td>
                  <td className="px-4 py-3">{item.aset}</td>
                  <td className="px-4 py-3">{item.seri}</td>
                  <td className="px-4 py-3 flex">{renderStars(item.rating)}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-[#0F2C59] hover:text-[#15397A]"
                      onClick={() => navigate("/detailrating")} // ✅ Tambahan navigasi
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === Pagination Info === */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>
            Menampilkan data 1 sampai {data.length} dari 30 data
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">&lt;</button>
            <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">3</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
