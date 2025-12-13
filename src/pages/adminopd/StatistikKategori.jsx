import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOPD";
import * as XLSX from "xlsx";

export default function StatistikKategori() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState("Pelaporan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistikData, setStatistikData] = useState(null);

  // Kategori yang sesuai dengan data API
  const kategoriData = [
    {
      name: "Perangkat Keras",
      id: "perangkat-keras",
      color: "#5A9CF3",
      tableColor: "#76C7F0",
    },
    { 
      name: "Lainnya", 
      id: "lainnya", 
      color: "#9D9D9D", 
      tableColor: "#D9B8FF" 
    },
  ];

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      // Endpoint untuk statistik kategori pelaporan
      const apiUrl = "https://service-desk-be-production.up.railway.app/api/admin-opd/statistik/pelaporan-online/kategori";

      console.log("🔍 Mengambil data statistik kategori...");

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw new Error(
          `Gagal mengambil data dari server (Status: ${response.status})`
        );
      }

      const data = await response.json();
      console.log("✅ Data statistik kategori:", data);
      setStatistikData(data);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Hanya fetch sekali karena API tidak support filter bulan

  // Format data untuk chart berdasarkan API
  const formatChartData = () => {
    if (!statistikData) {
      console.log("⚠️ Tidak ada data statistik");
      return kategoriData.map(kategori => ({
        ...kategori,
        value: 0
      }));
    }

    // Hitung total perangkat keras dari semua subkategori
    const totalPerangkatKeras = statistikData.kategori_asset_stats?.reduce(
      (sum, item) => sum + item.count, 0
    ) || 0;

    // Hitung permasalahan lainnya (total pelaporan online - perangkat keras)
    const totalLainnya = statistikData.total_pelaporan_online - totalPerangkatKeras;

    console.log(`📊 Perhitungan data: 
      Total Pelaporan: ${statistikData.total_pelaporan_online}
      Perangkat Keras: ${totalPerangkatKeras}
      Lainnya: ${totalLainnya}`);

    return kategoriData.map(kategori => {
      if (kategori.id === "perangkat-keras") {
        return {
          ...kategori,
          value: totalPerangkatKeras
        };
      } else if (kategori.id === "lainnya") {
        return {
          ...kategori,
          value: totalLainnya
        };
      }
      return { ...kategori, value: 0 };
    });
  };

  // Fungsi untuk export ke Excel
  const exportToExcel = () => {
    if (!statistikData) return;

    const dataChart = formatChartData();
    const total = dataChart.reduce((sum, item) => sum + item.value, 0);

    // Data untuk Excel - Chart data
    const excelData = dataChart.map((item) => ({
      "Kategori Laporan": item.name,
      "Jumlah": item.value,
    }));

    // Tambahkan total
    excelData.push({
      "Kategori Laporan": "Total Laporan",
      "Jumlah": total,
    });

    // Tambahkan informasi detail
    excelData.push({
      "Kategori Laporan": "--- Detail Perangkat Keras ---",
      "Jumlah": ""
    });

    // Tambahkan detail subkategori
    if (statistikData.kategori_asset_stats && statistikData.kategori_asset_stats.length > 0) {
      statistikData.kategori_asset_stats.forEach((asset, index) => {
        excelData.push({
          "Kategori Laporan": asset.subkategori,
          "Jumlah": asset.count,
        });
      });
    }

    // Tambahkan informasi lainnya
    excelData.push({
      "Kategori Laporan": "--- Informasi Lain ---",
      "Jumlah": ""
    });

    excelData.push({
      "Kategori Laporan": "Total Masyarakat",
      "Jumlah": statistikData.total_masyarakat || 0,
    });

    excelData.push({
      "Kategori Laporan": "Total Pegawai",
      "Jumlah": statistikData.total_pegawai || 0,
    });

    // Tambahkan timestamp
    excelData.push({
      "Kategori Laporan": "Tanggal Export",
      "Jumlah": new Date().toLocaleDateString('id-ID'),
    });

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Format lebar kolom
    const wscols = [
      { wch: 30 }, // Kategori Laporan
      { wch: 15 }  // Jumlah
    ];
    ws['!cols'] = wscols;

    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistik Kategori");

    // Export file
    const fileName = `Statistik_Kategori_Pelaporan_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  const dataChart = formatChartData();
  const total = dataChart.reduce((sum, item) => sum + item.value, 0);

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
          <div className="px-4 md:px-6">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#0F2C59]">Statistik</h1>

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
                  {/* Donut Chart */}
                  <div className="w-full lg:w-1/2 flex flex-col items-center">
                    <div className="w-full mb-3">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Distribusi Kategori Pelaporan
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Data agregat keseluruhan periode
                      </p>
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
                        <Tooltip
                          formatter={(value) => [`${value} laporan`, "Jumlah"]}
                          labelFormatter={(label) => `Kategori: ${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg w-full">
                      <div className="flex justify-between mb-2">
                        <span>Total Pelaporan:</span>
                        <span className="font-bold">{statistikData?.total_pelaporan_online || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Data diambil pada:</span>
                        <span>{new Date().toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  {/* === Table === */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Statistik Pelaporan Online
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ringkasan data pelaporan berdasarkan kategori
                        </p>
                      </div>
                      <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-[#0F2C59] text-white px-4 py-2 rounded-lg hover:bg-[#15397A] font-medium"
                      >
                        <Download size={16} />
                        Export Excel
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-[#0F2C59] text-white text-center">
                            <th className="p-3 border border-gray-300">
                              Kategori Laporan
                            </th>
                            <th className="p-3 border border-gray-300">
                              Jumlah
                            </th>
                            <th className="p-3 border border-gray-300">
                              Persentase
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataChart.map((item, index) => {
                            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                            return (
                              <tr key={index} className="text-center hover:bg-gray-50">
                                <td
                                  className="p-3 border border-gray-300 font-medium"
                                  style={{
                                    backgroundColor: item.tableColor || item.color,
                                  }}
                                >
                                  {item.name}
                                </td>
                                <td className="p-3 border-l border-gray-300 font-bold">
                                  {item.value}
                                </td>
                                <td className="p-3 border-l border-gray-300">
                                  <div className="flex items-center justify-center">
                                    <span className="mr-2">{percentage}%</span>
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-[#0F2C59] h-2 rounded-full" 
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="bg-[#0F2C59] text-white font-bold text-center">
                            <td className="p-3 border border-gray-300">
                              TOTAL LAPORAN
                            </td>
                            <td className="p-3 border-l border-gray-300">
                              {statistikData?.total_pelaporan_online || 0}
                            </td>
                            <td className="p-3 border-l border-gray-300">
                              100%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Informasi Tambahan */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          📊 Sumber Pelaporan
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Masyarakat</span>
                            <span className="font-bold">{statistikData?.total_masyarakat || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Pegawai</span>
                            <span className="font-bold">{statistikData?.total_pegawai || 0}</span>
                          </div>
                          <div className="pt-2 border-t border-blue-200">
                            <div className="flex justify-between font-semibold">
                              <span>Total</span>
                              <span>{(statistikData?.total_masyarakat || 0) + (statistikData?.total_pegawai || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h4 className="font-semibold text-green-800 mb-2">
                          🔧 Jenis Perangkat Keras
                        </h4>
                        <div className="flex items-center">
                          <div className="text-3xl font-bold text-green-600 mr-3">
                            {statistikData?.kategori_asset_stats?.length || 0}
                          </div>
                          <div className="text-sm text-green-700">
                            jenis perangkat dilaporkan
                            <div className="text-xs text-green-600 mt-1">
                              {statistikData?.kategori_asset_stats?.reduce((sum, item) => sum + item.count, 0) || 0} total laporan
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detail Subkategori Asset */}
                    {statistikData?.kategori_asset_stats && statistikData.kategori_asset_stats.length > 0 && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="mr-2">📋 Detail Perangkat Keras</span>
                          <span className="text-sm font-normal text-gray-600">
                            ({statistikData.kategori_asset_stats.length} jenis)
                          </span>
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                          {statistikData.kategori_asset_stats
                            .sort((a, b) => b.count - a.count) // Urutkan dari yang terbanyak
                            .map((asset, index) => {
                              const totalPerangkatKeras = statistikData.kategori_asset_stats.reduce((sum, item) => sum + item.count, 0);
                              const percentage = totalPerangkatKeras > 0 ? ((asset.count / totalPerangkatKeras) * 100).toFixed(1) : 0;
                              
                              return (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-white rounded border hover:bg-gray-50"
                                >
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-700">
                                      {asset.subkategori}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      {asset.count} laporan • {percentage}%
                                    </div>
                                  </div>
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full" 
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-300 text-sm text-gray-600 flex justify-between">
                          <span>Total Perangkat Keras:</span>
                          <span className="font-bold">
                            {statistikData.kategori_asset_stats.reduce((sum, item) => sum + item.count, 0)} laporan
                          </span>
                        </div>
                      </div>
                    )}
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
