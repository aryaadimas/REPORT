import React, { useState, useEffect } from "react";
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
import { NavLink, useNavigate } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOPD";
import * as XLSX from "xlsx";

export default function StatistikTahunan() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState("Pelaporan");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistikData, setStatistikData] = useState(null);

  const bulanList = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const gantiTahun = (arah) => {
    setTahun((prev) => (arah === "kiri" ? prev - 1 : prev + 1));
  };

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const apiUrl = "https://service-desk-be-production.up.railway.app/api/admin-opd/statistik/pelaporan-online/rekap";

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
        throw new Error(`Gagal mengambil data (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log("✅ Data statistik tahunan:", data);
      setStatistikData(data);
      setError(null);
      
      // Set tahun dari data API jika tersedia
      if (data.tahun) {
        setTahun(data.tahun);
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk mengelompokkan data per bulan
  const getYearlyData = () => {
    if (!statistikData || !statistikData.rekap) {
      return bulanList.map((bulan) => ({
        name: bulan,
        value: 0,
      }));
    }

    // Format data dari API rekap untuk chart
    const formattedData = bulanList.map((bulanNama, index) => {
      const dataBulan = statistikData.rekap.find(item => item.bulan === index + 1);
      return {
        name: bulanNama,
        value: dataBulan ? dataBulan.total_tiket : 0,
      };
    });

    console.log(`📊 Data untuk tahun ${statistikData.tahun || tahun}:`, formattedData);
    return formattedData;
  };

  // Fungsi untuk menghitung total tiket per tahun
  const calculateTotal = () => {
    if (!statistikData || !statistikData.rekap) return 0;
    return statistikData.rekap.reduce((sum, item) => sum + item.total_tiket, 0);
  };

  // Fungsi untuk export ke Excel
  const exportToExcel = () => {
    if (!statistikData) return;

    const yearlyData = getYearlyData();
    const total = calculateTotal();

    const excelData = yearlyData.map((item) => ({
      Bulan: item.name,
      "Jumlah Tiket": item.value,
    }));

    excelData.push({
      Bulan: "Total Laporan",
      "Jumlah Tiket": total,
    });

    excelData.push({
      Bulan: "Tahun",
      "Jumlah Tiket": statistikData.tahun || tahun,
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wscols = [
      { wch: 15 },
      { wch: 15 },
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Statistik ${statistikData.tahun || tahun}`);

    const fileName = `Statistik_Tahunan_${statistikData.tahun || tahun}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Data untuk chart dan tabel
  const yearlyData = getYearlyData();
  const total = calculateTotal();
  const tahunDitampilkan = statistikData?.tahun || tahun;

  // Cari bulan dengan tiket tertinggi dan terendah
  const bulanTersibuk = yearlyData.length > 0 && total > 0 
    ? yearlyData.reduce((max, item) => item.value > max.value ? item : max, yearlyData[0])
    : null;
  
  const bulanTersedikit = yearlyData.length > 0 && total > 0
    ? yearlyData.reduce((min, item) => item.value < min.value ? item : min, yearlyData[0])
    : null;

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

              {/* === Main Tabs === */}
              <div className="flex border-b border-gray-300">
                {["Pelaporan", "Pelayanan"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setMainTab(tab);
                      if (tab === "Pelayanan") {
                        navigate("/StatistikTahunanPelayanan");
                      }
                    }}
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

              {/* Info Data */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <p className="text-sm text-blue-700">
                      📊 Data untuk tahun: <span className="font-semibold">{tahunDitampilkan}</span>
                    </p>
                  </div>
                  <p className="text-xs text-blue-600">
                    Total tiket: <span className="font-semibold">{total}</span>
                  </p>
                </div>
              </div>

              {/* === Chart + Table Section === */}
              <div className="bg-white shadow-lg rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Chart Section */}
                  <div className="w-full lg:w-1/2 flex flex-col items-center">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-3 gap-3">
                      <h2 className="text-md font-semibold text-gray-800">
                        Statistik Tiket Tahunan
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
                          {tahunDitampilkan}
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
                      <LineChart data={yearlyData}>
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
                          labelFormatter={(label) => `Bulan: ${label}`}
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

                    {/* Info tambahan */}
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        📊 Tahun: <span className="font-semibold">{tahunDitampilkan}</span>
                      </p>
                      <p className="text-xs">
                        Total tiket: <span className="font-semibold">{total}</span>
                      </p>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Statistik laporan tahun {tahunDitampilkan}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Menampilkan data per bulan untuk tahun {tahunDitampilkan}
                        </p>
                      </div>
                      <button
                        onClick={exportToExcel}
                        disabled={!statistikData}
                        className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                          statistikData
                            ? "bg-[#0F2C59] text-white hover:bg-[#15397A]"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
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
                              Jumlah Tiket
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearlyData.map((item, index) => (
                            <tr key={index} className="text-center">
                              <td className="p-2 bg-[#C8B3FF] border border-gray-300 font-medium">
                                {item.name}
                              </td>
                              <td className="p-2 border-l border-gray-300 border-t border-b font-semibold">
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

                    {/* Informasi Tambahan */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Informasi Data:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">Tahun ditampilkan:</div>
                        <div className="font-medium">{tahunDitampilkan}</div>
                        
                        <div className="text-gray-600">Total Tiket:</div>
                        <div className="font-medium">{total} tiket</div>
                        
                        <div className="text-gray-600">Bulan tersibuk:</div>
                        <div className="font-medium">
                          {bulanTersibuk && bulanTersibuk.value > 0
                            ? `${bulanTersibuk.name} (${bulanTersibuk.value} tiket)`
                            : "Tidak ada data"}
                        </div>
                        
                        <div className="text-gray-600">Bulan tersedikit:</div>
                        <div className="font-medium">
                          {bulanTersedikit && total > 0
                            ? `${bulanTersedikit.name} (${bulanTersedikit.value} tiket)`
                            : "Tidak ada data"}
                        </div>
                        
                        <div className="text-gray-600">Rata-rata per bulan:</div>
                        <div className="font-medium">
                          {total > 0 ? Math.round(total / 12) : 0} tiket
                        </div>
                        
                        <div className="text-gray-600">OPD ID:</div>
                        <div className="font-medium">{statistikData?.opd_id || "-"}</div>
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