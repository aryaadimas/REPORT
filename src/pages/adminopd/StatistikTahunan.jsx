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
import LayoutOpd from "../../components/Layout/LayoutOPD";

export default function StatistikTahunan() {
  const [mainTab, setMainTab] = useState("Pelaporan");
  const [tahun, setTahun] = useState(2025);

  const gantiTahun = (arah) => {
    setTahun((prev) => (arah === "kiri" ? prev - 1 : prev + 1));
  };

  // === Dummy Data untuk Chart & Tabel ===
  const dataTahun = [
    { name: "Januari", value: 101 },
    { name: "Februari", value: 121 },
    { name: "Maret", value: 92 },
    { name: "April", value: 131 },
    { name: "Mei", value: 125 },
    { name: "Juni", value: 103 },
    { name: "Juli", value: 161 },
    { name: "Agustus", value: 141 },
    { name: "September", value: 128 },
    { name: "Oktober", value: 125 },
    { name: "November", value: 121 },
    { name: "Desember", value: 100 },
  ];

  const total = dataTahun.reduce((sum, d) => sum + d.value, 0);

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="pt-4 pb-8">
          {/* Content Container */}
          <div className="px-4 md:px-6">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#0F2C59]">Statistik</h1>

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
                  {/* Chart Section */}
                  <div className="w-full lg:w-1/2 flex flex-col items-center">
                    <div className="flex justify-between w-full items-center mb-3">
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
                        <span className="bg-[#0F2C59] text-white px-4 py-1 rounded-full text-sm font-medium">
                          {tahun}
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
                      <LineChart data={dataTahun}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
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
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                          Statistik laporan berdasarkan kategori laporan Tahun{" "}
                          {tahun}
                        </h3>
                      </div>
                      <button className="flex items-center gap-3 bg-[#0F2C59] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#15397A]">
                        <Download size={14} />
                        Unduh.xls
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-[#0F2C59] text-white text-center">
                            <th className="p-2 border border-gray-300">
                              Bulan
                            </th>
                            <th className="p-2 border border-gray-300">
                              Jumlah
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataTahun.map((item, index) => (
                            <tr key={index} className="text-center">
                              <td className="p-2 bg-[#C8B3FF] border border-gray-300">
                                {item.name}
                              </td>
                              <td className="p-2 border-l border-gray-300 border-t border-b">
                                {item.value}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-[#0F2C59] text-white font-semibold text-center">
                            <td className="p-2 border border-gray-300">
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
    </LayoutOpd>
  );
}
