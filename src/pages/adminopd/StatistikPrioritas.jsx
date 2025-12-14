import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import LayoutOpd from "../../components/Layout/LayoutOPD";
import * as XLSX from "xlsx";

export default function StatistikPrioritas() {
  const [mainTab, setMainTab] = useState("Pelaporan");
  const [bulanIndex, setBulanIndex] = useState(7); // Agustus 2025
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistikData, setStatistikData] = useState(null);

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

  // Mapping data dari API ke tampilan UI
  const priorityMapping = {
    Critical: { label: "Kritis", color: "#D32F2F", tableColor: "#F44336" },
    High: { label: "Tinggi", color: "#E57373", tableColor: "#EF9A9A" },
    Medium: { label: "Sedang", color: "#FFD54F", tableColor: "#FFF59D" },
    Low: { label: "Rendah", color: "#81C784", tableColor: "#C8E6C9" },
  };

  const gantiBulan = (arah) => {
    setBulanIndex((prev) =>
      arah === "kiri"
        ? prev === 0
          ? 11
          : prev - 1
        : prev === 11
        ? 0
        : prev + 1
    );
  };

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Ambil token dari localStorage (sesuaikan dengan implementasi auth Anda)
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : null;

      // 2. Siapkan headers dengan Authorization
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/api/admin-opd/statistik/pelaporan-online/priority",
        {
          method: "GET",
          headers: headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("user");
          window.location.href = "/login";
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      setStatistikData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format data untuk chart berdasarkan API response
  const formatChartData = () => {
    if (!statistikData || !statistikData.priority_stats) return [];

    return statistikData.priority_stats
      .map((item) => {
        const mapping = priorityMapping[item.priority] || {
          label: item.priority,
          color: "#9E9E9E",
          tableColor: "#E0E0E0",
        };

        return {
          name: mapping.label,
          value: item.count,
          color: mapping.color,
          tableColor: mapping.tableColor,
          originalPriority: item.priority,
        };
      })
      .sort((a, b) => {
        // Urutkan: Critical, High, Medium, Low
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return order[a.originalPriority] - order[b.originalPriority];
      });
  };

  // Fungsi untuk export ke Excel
  const exportToExcel = () => {
    if (!statistikData) return;

    const dataChart = formatChartData();

    // Data untuk Excel
    const excelData = dataChart.map((item) => ({
      "Level Prioritas": item.name,
      Jumlah: item.value,
    }));

    // Tambahkan total
    excelData.push({
      "Level Prioritas": "Total Laporan",
      Jumlah: statistikData.total_pelaporan_online || 0,
    });

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Format lebar kolom
    const wscols = [
      { wch: 20 }, // Level Prioritas
      { wch: 10 }, // Jumlah
    ];
    ws["!cols"] = wscols;

    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistik Prioritas");

    // Export file
    const fileName = `Statistik_Prioritas_${bulanList[bulanIndex]}_2025.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

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

  // Data untuk chart
  const dataChart = statistikData ? formatChartData() : [];

  if (loading) {
    return (
      <LayoutOpd>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data statistik...</p>
          </div>
        </div>
      </LayoutOpd>
    );
  }

  if (error) {
    return (
      <LayoutOpd>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-700">Terjadi kesalahan: {error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-[#0F2C59] text-white rounded-lg hover:bg-[#15397A]"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </LayoutOpd>
    );
  }

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-4 pb-8">
          <div className="px-4">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-[#0F2C59]">Statistik</h1>
              </div>

              {/* === Sub Tabs === */}
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
                        Chart Laporan Berdasarkan Prioritas
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
                        <Tooltip
                          formatter={(value) => [`${value} laporan`, "Jumlah"]}
                          labelFormatter={(label) => `Prioritas: ${label}`}
                        />
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
                      <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-[#0F2C59] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#15397A] whitespace-nowrap"
                      >
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
                          {dataChart.map((item, index) => (
                            <tr key={index} className="text-center">
                              <td
                                className="p-2 border border-gray-300 whitespace-nowrap font-medium"
                                style={{ backgroundColor: item.tableColor }}
                              >
                                {item.name}
                              </td>
                              <td className="p-2 border-l border-gray-300 border-t border-b font-semibold">
                                {item.value}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-[#0F2C59] text-white font-semibold text-center">
                            <td className="p-2 border border-gray-300 whitespace-nowrap">
                              Total Laporan
                            </td>
                            <td className="p-2 border-l border-gray-300 border-t border-b">
                              {statistikData?.total_pelaporan_online || 0}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Informasi Tambahan */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Detail Prioritas:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {dataChart.map((item, index) => (
                          <React.Fragment key={index}>
                            <div className="text-gray-600 flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              {item.name}:
                            </div>
                            <div className="font-medium">
                              {item.value} laporan
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
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
