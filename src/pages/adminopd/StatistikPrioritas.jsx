import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import LayoutOpd from "../../components/Layout/LayoutOPD";

export default function StatistikPrioritas() {
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

  // Dummy data chart
  const dataChart = [
    { name: "Tinggi", value: 5, color: "#E57373" },
    { name: "Sedang", value: 12, color: "#FFD54F" },
    { name: "Rendah", value: 18, color: "#81C784" },
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
        {/* Main Content - Simple structure */}
        <div className="pt-4 pb-8">
          {/* Content Container */}
          <div className="px-4">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-[#0F2C59]">Statistik</h1>
              </div>

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
              <div className="flex gap-3 bg-white rounded-xl shadow p-4 overflow-x-auto">
                <NavLink
                  to="/StatistikKategori"
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
                  to="/StatistikPrioritas"
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
                  to="/StatistikTahunan"
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
                  to="/StatistikBulanan"
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
                          outerRadius={120}
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

                  {/* Table Section */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Statistik laporan berdasarkan Level Prioritas bulan{" "}
                          {bulanList[bulanIndex]} 2025
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
                              Level Prioritas
                            </th>
                            <th className="p-2 border border-gray-300">
                              Jumlah
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center">
                            <td className="p-2 bg-[#E57373] border border-gray-300 whitespace-nowrap">
                              Tinggi
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              25
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td className="p-2 bg-[#FFD54F] border border-gray-300 whitespace-nowrap">
                              Sedang
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              40
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td className="p-2 bg-[#81C784] border border-gray-300 whitespace-nowrap">
                              Rendah
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              35
                            </td>
                          </tr>
                          <tr className="bg-[#0F2C59] text-white font-semibold text-center">
                            <td className="p-2 border border-gray-300 whitespace-nowrap">
                              Total Laporan
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              100
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
