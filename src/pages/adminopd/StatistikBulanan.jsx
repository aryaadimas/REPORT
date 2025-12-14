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

export default function StatistikBulanan() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState("Pelaporan");
  
  const today = new Date();
  const [tahun, setTahun] = useState(today.getFullYear());
  const [bulan, setBulan] = useState(today.getMonth());
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rekapData, setRekapData] = useState(null);

  const bulanList = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const gantiTahun = (arah) => {
    setTahun((prev) => (arah === "kiri" ? prev - 1 : prev + 1));
  };

  const gantiBulan = (arah) => {
    setBulan((prev) => {
      if (arah === "kiri") {
        if (prev === 0) {
          setTahun(tahun - 1);
          return 11;
        }
        return prev - 1;
      } else {
        if (prev === 11) {
          setTahun(tahun + 1);
          return 0;
        }
        return prev + 1;
      }
    });
  };

  // Fungsi untuk mengambil data rekap
  const fetchRekapData = async () => {
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
      console.log("✅ Data rekap tahunan:", data);
      setRekapData(data);
      
      // Set tahun dari data API jika tersedia
      if (data.tahun) {
        setTahun(data.tahun);
        
        // Cari bulan terakhir yang memiliki data
        const bulanDenganData = data.rekap
          .filter(item => item.total_tiket > 0)
          .sort((a, b) => b.bulan - a.bulan)[0];
        
        if (bulanDenganData) {
          setBulan(bulanDenganData.bulan - 1);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekapData();
  }, []);

  // Fungsi untuk mendapatkan total tiket berdasarkan bulan yang dipilih
  const getTotalTiketBulanIni = () => {
    if (!rekapData || !rekapData.rekap) return 0;
    
    const bulanData = rekapData.rekap.find(item => item.bulan === bulan + 1);
    return bulanData ? bulanData.total_tiket : 0;
  };

  // FUNGSI UTAMA: Logika distribusi mingguan yang benar
  const getWeeklyData = () => {
    const totalTiket = getTotalTiketBulanIni();
    
    // Jika tidak ada data, kembalikan semua minggu dengan nilai 0
    if (totalTiket === 0) {
      return [
        { name: "Minggu 1", value: 0 },
        { name: "Minggu 2", value: 0 },
        { name: "Minggu 3", value: 0 },
        { name: "Minggu 4", value: 0 },
        { name: "Minggu 5", value: 0 },
      ];
    }

    // 1. Tentukan jumlah hari dalam bulan yang dipilih
    const daysInMonth = new Date(tahun, bulan + 1, 0).getDate();
    
    // 2. Tentukan hari ini (real-time)
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 3. Tentukan apakah bulan yang dipilih adalah bulan BERJALAN saat ini
    const isCurrentMonth = (bulan === currentMonth && tahun === currentYear);
    
    // 4. Tentukan minggu maksimal yang sudah terjadi
    let maxWeekCompleted = 5; // Default untuk bulan sudah lewat
    
    if (isCurrentMonth) {
      // Jika bulan berjalan, hitung minggu yang sudah terjadi
      if (currentDay <= 7) maxWeekCompleted = 1;
      else if (currentDay <= 14) maxWeekCompleted = 2;
      else if (currentDay <= 21) maxWeekCompleted = 3;
      else if (currentDay <= 28) maxWeekCompleted = 4;
      else maxWeekCompleted = 5;
    } else if (tahun < currentYear || (tahun === currentYear && bulan < currentMonth)) {
      // Jika bulan di masa lalu, semua minggu sudah terjadi
      maxWeekCompleted = 5;
    } else {
      // Jika bulan di masa depan, tidak ada minggu yang terjadi
      maxWeekCompleted = 0;
    }
    
    // 5. Tentukan apakah bulan memiliki minggu ke-5
    const hasWeek5 = (daysInMonth > 28);
    
    // 6. Buat distribusi mingguan yang realistis
    const weeklyData = [
      { name: "Minggu 1", value: 0 },
      { name: "Minggu 2", value: 0 },
      { name: "Minggu 3", value: 0 },
      { name: "Minggu 4", value: 0 },
      { name: "Minggu 5", value: 0 },
    ];
    
    // 7. Distribusikan data berdasarkan logika yang benar
    if (isCurrentMonth && totalTiket > 0) {
      // Untuk bulan berjalan: distribusi berdasarkan minggu yang sudah terjadi
      // Ini adalah ESTIMASI karena kita tidak punya data real-time per minggu
      const weeksToDistribute = Math.min(maxWeekCompleted, hasWeek5 ? 5 : 4);
      
      if (weeksToDistribute > 0) {
        // Distribusi rata-rata untuk minggu yang sudah terjadi
        const avgPerWeek = Math.round(totalTiket / weeksToDistribute);
        
        for (let i = 0; i < weeksToDistribute; i++) {
          weeklyData[i].value = avgPerWeek;
        }
        
        // Sesuaikan untuk menghindari pembulatan
        const totalDistributed = weeklyData.reduce((sum, week) => sum + week.value, 0);
        if (totalDistributed > totalTiket) {
          weeklyData[weeksToDistribute - 1].value -= (totalDistributed - totalTiket);
        } else if (totalDistributed < totalTiket) {
          weeklyData[weeksToDistribute - 1].value += (totalTiket - totalDistributed);
        }
        
        // Minggu yang belum terjadi tetap 0
        for (let i = weeksToDistribute; i < 5; i++) {
          weeklyData[i].value = 0;
        }
      }
    } else if (tahun < currentYear || (tahun === currentYear && bulan < currentMonth)) {
      // Untuk bulan yang sudah lewat: distribusi rata-rata
      const weeksInMonth = hasWeek5 ? 5 : 4;
      const avgPerWeek = Math.round(totalTiket / weeksInMonth);
      
      for (let i = 0; i < weeksInMonth; i++) {
        weeklyData[i].value = avgPerWeek;
      }
      
      // Sesuaikan untuk menghindari pembulatan
      const totalDistributed = weeklyData.reduce((sum, week) => sum + week.value, 0);
      if (totalDistributed > totalTiket) {
        weeklyData[weeksInMonth - 1].value -= (totalDistributed - totalTiket);
      } else if (totalDistributed < totalTiket) {
        weeklyData[weeksInMonth - 1].value += (totalTiket - totalDistributed);
      }
      
      // Jika bulan hanya punya 4 minggu, minggu ke-5 tetap 0
      if (!hasWeek5) {
        weeklyData[4].value = 0;
      }
    } else {
      // Untuk bulan di masa depan: semua minggu 0
      for (let i = 0; i < 5; i++) {
        weeklyData[i].value = 0;
      }
    }
    
    console.log(`📊 Logika distribusi untuk ${bulanList[bulan]} ${tahun}:`, {
      totalTiket,
      daysInMonth,
      isCurrentMonth,
      currentDay,
      maxWeekCompleted,
      hasWeek5,
      weeklyData
    });
    
    return weeklyData;
  };

  // Fungsi untuk export ke Excel
  const exportToExcel = () => {
    if (!rekapData) return;

    const weeklyData = getWeeklyData();
    const total = weeklyData.reduce((sum, d) => sum + d.value, 0);
    const tahunDitampilkan = rekapData.tahun || tahun;
    const totalTiketBulanIni = getTotalTiketBulanIni();

    const excelData = weeklyData.map((item) => ({
      Minggu: item.name,
      "Jumlah Tiket": item.value,
      "Status": item.value === 0 ? "Belum terjadi" : "Sudah terjadi"
    }));

    excelData.push({
      Minggu: "Total Laporan (Estimasi)",
      "Jumlah Tiket": total,
      "Status": "Estimasi berdasarkan total bulanan"
    });

    excelData.push({
      Minggu: "Total Bulanan (Data API)",
      "Jumlah Tiket": totalTiketBulanIni,
      "Status": "Data aktual dari API"
    });

    excelData.push({
      Minggu: "Periode",
      "Jumlah Tiket": `${bulanList[bulan]} ${tahunDitampilkan}`,
      "Status": "Bulan dan tahun yang ditampilkan"
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wscols = [
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistik Bulanan");

    const fileName = `Statistik_Bulanan_${bulanList[bulan]}_${tahunDitampilkan}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Data untuk chart dan tabel
  const weeklyData = getWeeklyData();
  const total = weeklyData.reduce((sum, d) => sum + d.value, 0);
  const tahunDitampilkan = rekapData?.tahun || tahun;
  const totalTiketBulanIni = getTotalTiketBulanIni();

  // Informasi status data
  const getDataStatus = () => {
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const isCurrentMonth = (bulan === currentMonth && tahun === currentYear);
    const isPastMonth = tahun < currentYear || (tahun === currentYear && bulan < currentMonth);
    const isFutureMonth = tahun > currentYear || (tahun === currentYear && bulan > currentMonth);
    
    if (isCurrentMonth) {
      return {
        type: "current",
        message: `📅 Data bulan berjalan (hari ini: ${currentDay} ${bulanList[currentMonth]} ${currentYear})`,
        description: "Data per minggu adalah estimasi berdasarkan total bulanan yang sudah terjadi"
      };
    } else if (isPastMonth) {
      return {
        type: "past",
        message: `📅 Data bulan yang sudah lewat`,
        description: "Data per minggu adalah estimasi berdasarkan distribusi rata-rata"
      };
    } else {
      return {
        type: "future",
        message: `📅 Data bulan di masa depan`,
        description: "Belum ada data untuk bulan ini"
      };
    }
  };

  const dataStatus = getDataStatus();

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
              onClick={fetchRekapData}
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
                        navigate("/StatistikBulananPelayanan");
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
              <div className={`border rounded-lg p-3 ${
                dataStatus.type === "current" 
                  ? "bg-blue-50 border-blue-200" 
                  : dataStatus.type === "past"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      dataStatus.type === "current" 
                        ? "bg-blue-500" 
                        : dataStatus.type === "past"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}></div>
                    <div>
                      <p className={`text-sm ${
                        dataStatus.type === "current" 
                          ? "text-blue-700" 
                          : dataStatus.type === "past"
                          ? "text-yellow-700"
                          : "text-gray-700"
                      }`}>
                        {dataStatus.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{dataStatus.description}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Hari ini: {today.toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Card Statistik */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Bulanan</p>
                      <p className="text-2xl font-bold text-[#0F2C59]">
                        {totalTiketBulanIni}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Data aktual dari API
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#0F2C59] text-white rounded-full">
                        <span className="text-sm font-bold">Σ</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Estimasi Mingguan</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {total}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Berdasarkan distribusi logis
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
                        <span className="text-sm font-bold">≈</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Status Data</p>
                      <p className={`text-2xl font-bold ${
                        dataStatus.type === "current" 
                          ? "text-green-600" 
                          : dataStatus.type === "past"
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }`}>
                        {dataStatus.type === "current" ? "Berjalan" : 
                         dataStatus.type === "past" ? "Selesai" : "Masa Depan"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {bulanList[bulan]} {tahunDitampilkan}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-gray-50">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        dataStatus.type === "current" 
                          ? "bg-green-600" 
                          : dataStatus.type === "past"
                          ? "bg-yellow-600"
                          : "bg-gray-600"
                      } text-white`}>
                        <span className="text-sm font-bold">i</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* === Chart + Table Section === */}
              <div className="bg-white shadow-lg rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Chart Section */}
                  <div className="w-full lg:w-1/2 flex flex-col items-center">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-3 gap-3">
                      <h2 className="text-md font-semibold text-gray-800">
                        Chart Laporan Bulanan (Estimasi per Minggu)
                      </h2>

                      {/* Navigasi Bulan dan Tahun */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => gantiBulan("kiri")}
                            className="p-1.5 bg-[#0F2C59] text-white rounded-full hover:bg-[#15397A]"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <span className="bg-[#0F2C59] text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                            {bulanList[bulan]}
                          </span>
                          <button
                            onClick={() => gantiBulan("kanan")}
                            className="p-1.5 bg-[#0F2C59] text-white rounded-full hover:bg-[#15397A]"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>

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
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, "auto"]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                          labelStyle={{ fontWeight: "600", color: "#0F2C59" }}
                          formatter={(value, name, props) => {
                            const isFutureWeek = props.payload.value === 0 && 
                              dataStatus.type === "current" && 
                              parseInt(props.payload.name.split(" ")[1]) > 
                              Math.ceil(today.getDate() / 7);
                            
                            return [
                              `${value} tiket${isFutureWeek ? " (belum terjadi)" : ""}`,
                              "Jumlah"
                            ];
                          }}
                          labelFormatter={(label) => `Minggu: ${label}`}
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

                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        📅 Ditampilkan:{" "}
                        <span className="font-semibold">
                          {bulanList[bulan]} {tahunDitampilkan}
                        </span>
                      </p>
                      <p className="text-xs">
                        *Data per minggu adalah estimasi berdasarkan total bulanan dan periode waktu
                      </p>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Estimasi laporan per minggu {bulanList[bulan]}{" "}
                          {tahunDitampilkan}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Data aktual bulanan: {totalTiketBulanIni} tiket
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: {dataStatus.type === "current" ? "Bulan berjalan" : 
                                  dataStatus.type === "past" ? "Bulan sudah lewat" : 
                                  "Bulan masa depan"}
                        </p>
                      </div>
                      <button
                        onClick={exportToExcel}
                        disabled={!rekapData}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                          rekapData
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
                            <th className="p-2 border border-gray-300 whitespace-nowrap">
                              Minggu
                            </th>
                            <th className="p-2 border border-gray-300">
                              Jumlah Tiket
                            </th>
                            <th className="p-2 border border-gray-300">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {weeklyData.map((item, index) => {
                            const weekNumber = index + 1;
                            let status = "";
                            
                            if (dataStatus.type === "current") {
                              // Untuk bulan berjalan
                              const maxWeekCompleted = Math.ceil(today.getDate() / 7);
                              status = weekNumber <= maxWeekCompleted ? "Sudah terjadi" : "Belum terjadi";
                            } else if (dataStatus.type === "past") {
                              status = "Sudah selesai";
                            } else {
                              status = "Belum terjadi";
                            }
                            
                            return (
                              <tr key={index} className="text-center">
                                <td className="p-2 bg-[#C8B3FF] border border-gray-300 whitespace-nowrap font-medium">
                                  {item.name}
                                </td>
                                <td className="p-2 border border-gray-300 font-semibold">
                                  {item.value}
                                </td>
                                <td className={`p-2 border border-gray-300 ${
                                  status === "Sudah terjadi" || status === "Sudah selesai" 
                                    ? "text-green-600" 
                                    : "text-gray-400"
                                }`}>
                                  {status}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="bg-[#0F2C59] text-white font-semibold text-center">
                            <td className="p-2 border border-gray-300 whitespace-nowrap">
                              Total Estimasi
                            </td>
                            <td className="p-2 border border-gray-300">
                              {total}
                            </td>
                            <td className="p-2 border border-gray-300">
                              Distribusi logis
                            </td>
                          </tr>
                          <tr className="bg-gray-100 text-center">
                            <td className="p-2 border border-gray-300 whitespace-nowrap">
                              Total Aktual
                            </td>
                            <td className="p-2 border border-gray-300 font-semibold text-[#0F2C59]">
                              {totalTiketBulanIni}
                            </td>
                            <td className="p-2 border border-gray-300">
                              Data bulanan
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