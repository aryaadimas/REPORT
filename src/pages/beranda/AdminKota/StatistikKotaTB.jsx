import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import LayoutKota from "../../../components/Layout/LayoutKota";

export default function StatistikKotaTB() {
  console.log("✅ StatistikKotaTB component loaded!");

  const [mainTab, setMainTab] = useState("Pelaporan");
  const [tahun, setTahun] = useState(2025);

  const gantiTahun = (arah) => {
    setTahun((prev) => (arah === "kiri" ? prev - 1 : prev + 1));
  };

  // === Data untuk Chart & Tabel berdasarkan gambar ===
  const dataMingguan = [
    { name: "Minggu 1", value: 10 },
    { name: "Minggu 2", value: 8 },
    { name: "Minggu 3", value: 16 },
    { name: "Minggu 4", value: 22 },
    { name: "Minggu 5", value: 30 },
  ];

  const total = dataMingguan.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Simple structure */}
      <div className="pt-4 pb-8">
        {/* Content Container */}
        <div className="px-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#0F2C59]">Statistik</h1>
            </div>

            {/* === Main Tabs: Pelaporan / Pelayanan === */}
            <div className="flex border-b border-gray-300">
              {["Pelaporan", "Pelayanan"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMainTab(tab)}
                  className={`px-4 py-2 font-semibold ${
                    mainTab === tab
                      ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                      : "text-gray-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* === Sub Tabs === */}
            <div className="flex gap-3 bg-white rounded-xl shadow p-4 overflow-x-auto">
              <NavLink
                to="/statistikkotakl"
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-md font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-[#0F2C59] text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                Kategori Laporan
              </NavLink>
              <NavLink
                to="/statistikkotalp"
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-md font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-[#0F2C59] text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                Level Prioritas
              </NavLink>
              <NavLink
                to="/statistikkotatt"
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-md font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-[#0F2C59] text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                Tiket Tahunan
              </NavLink>
              <NavLink
                to="/statistikkotatb"
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-md font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-[#0F2C59] text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                Tiket Bulanan
              </NavLink>
            </div>

            {/* === Chart + Table Section === */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Chart Section */}
                <div className="w-full lg:w-1/2 flex flex-col items-center">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-3 gap-3">
                    <h2 className="text-md font-semibold text-gray-800">
                      Chart Laporan
                    </h2>

                    {/* Navigasi Tahun */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => gantiTahun("kiri")}
                        className="p-1.5 bg-[#0F2C59] text-white rounded-full hover:bg-[#15397A]"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="bg-[#0F2C59] text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                        Agustus {tahun}
                      </span>
                      <button
                        onClick={() => gantiTahun("kanan")}
                        className="p-1.5 bg-[#0F2C59] text-white rounded-full hover:bg-[#15397A]"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataMingguan}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        stroke="#4b5563"
                        tick={{ fill: "#6b7280" }}
                      />
                      <YAxis stroke="#4b5563" tick={{ fill: "#6b7280" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                        labelStyle={{ fontWeight: "600", color: "#0F2C59" }}
                        formatter={(value) => [`${value} tiket`, "Jumlah"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0F2C59"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Table Section */}
                <div className="w-full lg:w-1/2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Statistik laporan berdasarkan kategori laporan Agustus{" "}
                        {tahun}
                      </h3>
                    </div>
                    <button className="flex items-center gap-2 bg-[#0F2C59] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#15397A] whitespace-nowrap">
                      <Download size={14} />
                      Unduh.xls
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-[#0F2C59] text-white text-center">
                          <th className="p-2 border border-gray-300 whitespace-nowrap">
                            Minggu
                          </th>
                          <th className="p-2 border border-gray-300">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataMingguan.map((item, index) => (
                          <tr key={index} className="text-center">
                            <td className="p-2 bg-[#C8B3FF] border border-gray-300 whitespace-nowrap">
                              {item.name}
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              {item.value}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-[#0F2C59] text-white font-semibold text-center">
                          <td className="p-2 border border-gray-300 whitespace-nowrap">
                            Total Laporan
                          </td>
                          <td className="p-2 border-l border-gray-300 border-t border-b">
                            {total}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
