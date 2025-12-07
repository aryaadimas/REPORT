import React, { useState } from "react";
import { PencilSquareIcon, } from "@heroicons/react/24/outline";
import { FileText, RefreshCcw} from "lucide-react";

export default function ArsipSeksi() {
  const [activeTab, setActiveTab] = useState("pelaporan");

  const dataArsip = [
    {
  id: 1, aset: "Laptop", tanggal: "02/09/2024", intensitas: "2", status: "normal",
},
{
  id: 2, aset: "Wifi", tanggal: "01/11/2024", intensitas: "7", status: "perlu rfc",
},
{
  id: 3, aset: "Laptop", tanggal: "20/09/2024", intensitas: "4", status: "bermasalah",
},
{
  id: 4, aset: "Printer", tanggal: "05/08/2024", intensitas: "6", status: "perlu rfc",
},
{
  id: 5, aset: "CCTV", tanggal: "12/10/2024", intensitas: "3", status: "normal",
},
{
  id: 6, aset: "Server", tanggal: "25/11/2024", intensitas: "8", status: "bermasalah",
},
{
  id: 7, aset: "Router", tanggal: "14/07/2024", intensitas: "5", status: "perlu rfc",
},
{
  id: 8, aset: "Scanner", tanggal: "30/09/2024", intensitas: "1", status: "normal",
},
{
  id: 9, aset: "Monitor", tanggal: "19/10/2024", intensitas: "9", status: "bermasalah",
},
{
  id: 10, aset: "Access Point", tanggal: "07/12/2024", intensitas: "3", status: "normal",
},

  ];

  const statusColor = (status) => {
    switch (status) {
      case "perlu rfc":
        return "bg-red-100 text-white-700";
      case "bermasalah":
        return "bg-yellow-100 text-white-700";
      default:
        return "bg-green-100 text-white-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Judul */}
      <h1 className="text-3xl font-bold text-gray-800">Daftar Arsip</h1>

      {/* Tab */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="border-b flex items-center justify-between px-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("pelaporan")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 ${
                activeTab === "pelaporan"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
            >
              Pelaporan
            </button>
            <button
              onClick={() => setActiveTab("pelayanan")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 ${
                activeTab === "pelayanan"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
            >
              Pelayanan
            </button>
          </div>
            <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                <RefreshCcw size={16} /> Refresh
            </button>
        </div>

        {/* === FILTER 1 BARIS === */}
<div className="p-5 border-b bg-gray-50">
  <h2 className="text-gray-700 font-semibold mb-4">Filter pencarian</h2>

  <div className="grid grid-cols-3 gap-6">

    {/* === Kategori === */}
    <div className="flex items-center gap-3">
      <label className="text-gray-700 text-sm w-24">Kategori</label>
      <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white">
        <option>Pilih kategori</option>
        <option>Keamanan</option>
        <option>Jaringan</option>
        <option>Email</option>
      </select>
    </div>

    {/* === Jenis === */}
    <div className="flex items-center gap-3">
      <label className="text-gray-700 text-sm w-16">Jenis</label>
      <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white">
        <option>Pilih jenis</option>
        <option>Fisik</option>
        <option>Non-Fisik</option>
      </select>
    </div>

    {/* === Rating === */}
    <div className="flex items-center gap-3">
      <label className="text-gray-700 text-sm w-20">Rating</label>
      <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white">
        <option>Pilih rating</option>
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </div>

  </div>
</div>


        {/* Tabel */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3">Nama Aset</th>
                <th className="p-3">Terakhir dilaporkan</th>
                <th className="p-3">Intensitas</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataArsip.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{item.aset}</td>
                  <td className="p-3">{item.tanggal}</td>
                  <td className="p-3">{item.intensitas}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3">
                    <PencilSquareIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t text-sm text-gray-600">
          <p>Menampilkan data 1 sampai 10 dari 216 data</p>
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
