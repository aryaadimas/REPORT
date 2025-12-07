import React, { useState } from "react";
import {
  DocumentIcon,
  PencilSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function PenugasanSeksi() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pelaporan");

  const data = [
    {
      id: 1,
      nama: "Doni Ridho",
      prioritas: "Tinggi",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Draft",
      foto: "/assets/Suika.jpg",
      lampiran: ["/assets/doc1.pdf"],
    },
    {
      id: 2,
      nama: "Rio Widoro",
      prioritas: "Tinggi",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Draft",
      foto: "/assets/shizuku.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf"],
    },
    {
      id: 3,
      nama: "Lia Yustia",
      prioritas: "Sedang",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Diproses",
      foto: "/assets/Suika.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf", "/assets/doc3.pdf"],
    },
    {
      id: 4,
      nama: "Ridwan Yusuf",
      prioritas: "Sedang",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Diproses",
      foto: "/assets/shizuku.jpg",
      lampiran: [],
    },
    {
      id: 5,
      nama: "Ridwan Yusuf",
      prioritas: "Rendah",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Diproses",
      foto: "/assets/shizuku.jpg",
      lampiran: [],
    },
    {
      id: 6,
      nama: "Lia Yustia",
      prioritas: "Tinggi",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Diproses",
      foto: "/assets/Suika.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf", "/assets/doc3.pdf"],
    },
    {
      id: 7,
      nama: "Doni Ridho",
      prioritas: "Rendah",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Draft",
      foto: "/assets/Suika.jpg",
      lampiran: ["/assets/doc1.pdf"],
    },
    {
      id: 8,
      nama: "Rio Widoro",
      prioritas: "Rendah",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Draft",
      foto: "/assets/shizuku.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf"],
    },
    {
      id: 9,
      nama: "Lia Yustia",
      prioritas: "Rendah",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Diproses",
      foto: "/assets/Suika.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf", "/assets/doc3.pdf"],
    },
    {
      id: 10,
      nama: "Ridwan Yusuf",
      prioritas: "Tinggi",
      aset: "IT",
      seri: "Non-Fisik",
      status: "Diproses",
      foto: "/assets/shizuku.jpg",
      lampiran: [],
    },
  ];

  const getPriorityColor = (level) => {
    switch (level) {
      case "Tinggi":
        return "bg-red-500";
      case "Sedang":
        return "bg-yellow-400";
      case "Rendah":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Diproses":
        return "bg-orange-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0F2C59]">Penugasan</h1>
      </div>

      {/* Tabs + Refresh button in one row */}
      <div className="flex items-center justify-between border-b mb-4">
        <div className="flex">
          {["pelaporan", "pelayanan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-semibold capitalize rounded-t-lg ${
                activeTab === tab
                  ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                  : "text-gray-400 hover:text-[#0F2C59]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 bg-[#0F2C59] hover:bg-[#15397A] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <ArrowPathIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-5">
        <h2 className="text-[#0F2C59] font-semibold mb-6 text-sm">
          Filter pencarian
        </h2>

        {/* 2 kolom ke kanan, 3 baris ke bawah */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* Kategori */}
          <div className="flex items-center justify-between">
            <label className="w-24 text-sm font-medium text-gray-700">
              Data Aset
            </label>
            <select className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0F2C59]">
              <option>Semua</option>
              <option>Sistem Operasi</option>
              <option>Aplikasi</option>
              <option>Jaringan</option>
            </select>
          </div>

          {/* Jenis */}
          <div className="flex items-center justify-between">
            <label className="w-24 text-sm font-medium text-gray-700">
              Prioritas
            </label>
            <select className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0F2C59]">
              <option>Semua</option>
              <option>IT</option>
              <option>Non-IT</option>
            </select>
          </div>

          {/* Bentuk */}
          <div className="flex items-center justify-between">
            <label className="w-24 text-sm font-medium text-gray-700">
              No Seri
            </label>
            <select className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0F2C59]">
              <option>Semua</option>
              <option>Fisik</option>
              <option>Non-Fisik</option>
            </select>
          </div>

          {/* Prioritas */}
          <div className="flex items-center justify-between">
            <label className="w-24 text-sm font-medium text-gray-700">
              Status
            </label>
            <select className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0F2C59]">
              <option>Semua</option>
              <option>Rendah</option>
              <option>Sedang</option>
              <option>Tinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-[#0F2C59] text-white text-xs uppercase">
            <tr>
              <th className="py-3 px-4 rounded-tl-lg">Pengirim</th>
              <th className="py-3 px-4">Data Aset</th>
              <th className="py-3 px-4">No Seri</th>
              <th className="py-3 px-4">Lampiran</th>
              <th className="py-3 px-4">Prioritas</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-tr-lg">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{item.nama}</span>
                </td>
                <td className="py-3 px-4">{item.aset}</td>
                <td className="py-3 px-4">{item.seri}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {item.lampiran.length > 0 ? (
                      item.lampiran.slice(0, 3).map((_, idx) => (
                        <DocumentIcon
                          key={idx}
                          className="w-5 h-5 text-[#0F2C59] hover:text-[#15397A] cursor-pointer"
                        />
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        Tidak ada
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs text-white px-3 py-1 rounded-full ${getPriorityColor(
                      item.prioritas
                    )}`}
                  >
                    {item.prioritas}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs text-white px-3 py-1 rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => navigate("/formpenugasanseksi")}
                    className="text-[#0F2C59] hover:text-[#15397A]"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>
          Menampilkan data 1 sampai {data.length} dari 23 data
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            &lt;
          </button>
          <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            3
          </button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
