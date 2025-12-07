import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOPD";

export default function StatistikKategori() {
  const [mainTab, setMainTab] = useState("Pelaporan");
  const [bulanIndex, setBulanIndex] = useState(7); // Agustus 2025

  const bulanList = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const gantiBulan = (arah) => {
    setBulanIndex((prev) => {
      if (arah === "kiri") return prev === 0 ? 11 : prev - 1;
      else return prev === 11 ? 0 : prev + 1;
    });
  };

  const dataChart = [
    { name: "Perangkat Keras", value: 20, color: "#5A9CF3" },
    { name: "Perangkat Lunak & Aplikasi", value: 15, color: "#5AD8A1" },
    { name: "Jaringan & Konektivitas", value: 15, color: "#F9C74F" },
    { name: "Email & Komunikasi", value: 15, color: "#F9844A" },
    { name: "Keamanan", value: 20, color: "#D056E5" },
    { name: "Permasalahan Lainnya", value: 5, color: "#9D9D9D" },
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="pt-4 pb-8">
          {/* Content Container */}
          <div className="px-4 md:px-6">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#0F2C59]">Statistik</h1>

              {/* === Main Tabs === */}
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

              {/* === Sub Tabs (NavLink Navigation) === */}
              <div className="flex gap-3 bg-white rounded-xl shadow p-4">
                <NavLink
                  to="/StatistikKategori"
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm rounded-md font-medium transition ${
                      isActive
                        ? "bg-[#0F2C59] text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`
                  }
                >
                  Kategori Laporan
                </NavLink>

                <NavLink
                  to="/StatistikPrioritas"
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm rounded-md font-medium transition ${
                      isActive
                        ? "bg-[#0F2C59] text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`
                  }
                >
                  Level Prioritas
                </NavLink>

                <NavLink
                  to="/StatistikTahunan"
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm rounded-md font-medium transition ${
                      isActive
                        ? "bg-[#0F2C59] text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`
                  }
                >
                  Tiket Tahunan
                </NavLink>

                <NavLink
                  to="/StatistikBulanan"
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm rounded-md font-medium transition ${
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
                  {/* Donut Chart */}
                  <div className="w-full lg:w-1/2 flex flex-col items-center">
                    <div className="flex justify-between w-full items-center mb-3">
                      <h2 className="text-md font-semibold text-gray-800">
                        Chart Laporan
                      </h2>

                      {/* Navigasi Bulan */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => gantiBulan("kiri")}
                          className="p-1.5 bg-[#0F2C59] text-white rounded-full hover:bg-[#15397A]"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="bg-[#0F2C59] text-white px-4 py-1 rounded-full text-sm font-medium">
                          {bulanList[bulanIndex]} 2025
                        </span>
                        <button
                          onClick={() => gantiBulan("kanan")}
                          className="p-1.5 bg-[#0F2C59] text-white rounded-full hover:bg-[#15397A]"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dataChart}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={4}
                          labelLine={false}
                          label={renderCustomizedLabel}
                        >
                          {dataChart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* === Table === */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                          Statistik laporan berdasarkan kategori laporan bulan{" "}
                          {bulanList[bulanIndex]} 2025
                        </h3>
                      </div>
                      <button className="flex items-center gap-3 bg-[#0F2C59] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#15397A]">
                        <Download size={14} />
                        Unduh .xls
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-[#0F2C59] text-white text-center">
                            <th className="p-2 border border-gray-300">
                              Kategori Laporan
                            </th>
                            <th className="p-2 border border-gray-300">
                              Jumlah
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center">
                            <td className="p-2 bg-[#76C7F0] border border-gray-300">
                              Perangkat Keras
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              20
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td className="p-2 bg-[#B4E197] border border-gray-300">
                              Perangkat Lunak & Aplikasi
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              15
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td className="p-2 bg-[#FFE699] border border-gray-300">
                              Jaringan & Konektivitas
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              15
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td className="p-2 bg-[#FFD6A5] border border-gray-300">
                              Email & Komunikasi
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              15
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td className="p-2 bg-[#E8B5E5] border border-gray-300">
                              Keamanan
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              20
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td className="p-2 bg-[#D9B8FF] border border-gray-300">
                              Permasalahan Lainnya
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              5
                            </td>
                          </tr>
                          <tr className="bg-[#0F2C59] text-white font-semibold text-center">
                            <td className="p-2 border border-gray-300">
                              Total Laporan
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              90
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
    </LayoutOpd>
  );
}
