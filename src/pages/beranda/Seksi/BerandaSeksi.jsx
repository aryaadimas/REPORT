import React, { useState } from "react";
import {
  DocumentIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function DashboardSeksi() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pelaporan");

  const dataPelaporan = [
    {
      id: 1,
      pengirim: "Doni Ridho",
      tanggal: "18/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Revisi",
      foto: "/assets/Suika.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf"],
    },
    {
      id: 2,
      pengirim: "Hiko Wicakso",
      tanggal: "18/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Draft",
      foto: "/assets/shizuku.jpg",
      lampiran: ["/assets/doc1.pdf"],
    },
    {
      id: 3,
      pengirim: "Ella Melisya",
      tanggal: "18/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Terverifikasi",
      foto: "/assets/Bokuto.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf", "/assets/doc3.pdf"],
    },
    {
      id: 4,
      pengirim: "Arnya Rosalina",
      tanggal: "20/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Pending",
      foto: "/assets/Suika.jpg",
      lampiran: [],
    },
    {
      id: 5,
      pengirim: "Arnya Rosalina",
      tanggal: "20/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Ditolak",
      foto: "/assets/Suika.jpg",
      lampiran: [],
    },
    {
      id: 6,
      pengirim: "Doni Ridho",
      tanggal: "18/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Revisi",
      foto: "/assets/Suika.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf"],
    },
    {
      id: 7,
      pengirim: "Hiko Wicakso",
      tanggal: "18/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Draft",
      foto: "/assets/shizuku.jpg",
      lampiran: ["/assets/doc1.pdf"],
    },
    {
      id: 8,
      pengirim: "Ella Melisya",
      tanggal: "18/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Terverifikasi",
      foto: "/assets/Bokuto.jpg",
      lampiran: ["/assets/doc1.pdf", "/assets/doc2.pdf", "/assets/doc3.pdf"],
    },
    {
      id: 9,
      pengirim: "Arnya Rosalina",
      tanggal: "20/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Pending",
      foto: "/assets/Suika.jpg",
      lampiran: [],
    },
    {
      id: 10,
      pengirim: "Arnya Rosalina",
      tanggal: "20/09/2024",
      Aset: "Lenovo",
      Seri: "LNV-TP-001",
      status: "Ditolak",
      foto: "/assets/Suika.jpg",
      lampiran: [],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Ditolak":
        return "bg-red-500";
      case "Draft":
        return "bg-gray-500";
      case "Pending":
        return "bg-yellow-400";
      case "Terverifikasi":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59]">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Tiket Masuk", value: 33 },
          { label: "Pending", value: 10 },
          { label: "Diverifikasi", value: 15 },
          { label: "Ditolak", value: 1 },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow border border-gray-100 flex flex-col justify-center items-center py-5"
          >
            <span className="text-3xl font-semibold text-[#0F2C59]">
              {item.value}
            </span>
            <span className="text-sm text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
        {/* Tabs */}
        <div className="flex justify-between items-center border-b mb-4">
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

        {/* Filter Pencarian */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="text-[#0F2C59] font-semibold mb-6 text-sm">
            Filter pencarian
          </h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {/* Baris 1 */}
            <div className="flex items-center justify-between">
              <label className="w-24 text-sm font-medium text-gray-700">
                Data Aset
              </label>
              <select className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0F2C59]">
                <option>-</option>
                <option>-</option>
                <option>-</option>
                <option>-</option>
              </select>
            </div>
            {/* Baris 2 */}
            <div className="flex items-center justify-between">
              <label className="w-24 text-sm font-medium text-gray-700">
                No Seri
              </label>
              <select className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0F2C59]">
                <option>-</option>
                <option>-</option>
                <option>-</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="w-24 text-sm font-medium text-gray-700">
                Status
              </label>
              <select className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0F2C59]">
                <option>Semua</option>
                <option>Pending</option>
                <option>Terverifikasi</option>
                <option>Revisi</option>
                <option>Ditolak</option>
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
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Data Aset</th>
                <th className="py-3 px-4">No Seri</th>
                <th className="py-3 px-4">Lampiran</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {dataPelaporan.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  {/* Avatar + Nama */}
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img
                      src={item.foto}
                      alt={item.pengirim}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{item.pengirim}</span>
                  </td>

                  <td className="py-3 px-4">{item.tanggal}</td>
                  <td className="py-3 px-4">{item.Aset}</td>
                  <td className="py-3 px-4">{item.Seri}</td>

                  {/* Lampiran (1-3 ikon) */}
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {item.lampiran.length > 0 ? (
                        item.lampiran
                          .slice(0, 3)
                          .map((_, idx) => (
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
                      className={`text-xs text-white px-3 py-1 rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate("/pengajuanbidang")}
                      className="text-[#0F2C59] hover:text-[#15397A] transition"
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
            Menampilkan data 1 sampai {dataPelaporan.length} dari 30 data
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
    </div>
  );
}
