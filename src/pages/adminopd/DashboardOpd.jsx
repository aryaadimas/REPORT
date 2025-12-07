import React, { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import LayoutOpd from "../../components/Layout/LayoutOpd";

const DashboardOpd = () => {
  const [activeTab, setActiveTab] = useState("pelaporan");
  const navigate = useNavigate();

  const [bulanIndex, setBulanIndex] = useState(7); // 7 = Agustus
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

  const [chartTab, setChartTab] = useState("kategori");
  const [ticketTab, setTicketTab] = useState("tahunan");

  // State untuk filter
  const [filters, setFilters] = useState({
    kategori: "",
    jenis: "",
    bentuk: "",
    sla: "",
    prioritas: "",
    status: "",
  });

  const gantiBulan = (arah) => {
    setBulanIndex((prev) => {
      if (arah === "kiri") return prev === 0 ? 11 : prev - 1;
      else return prev === 11 ? 0 : prev + 1;
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // === Dummy Data Donut ===
  const dataKategori = [
    { name: "Perangkat Keras", value: 20, color: "#5A9CF3" },
    { name: "Perangkat Lunak", value: 15, color: "#5AD8A1" },
    { name: "Jaringan & Konektivitas", value: 10, color: "#F9C74F" },
    { name: "Email & Komunikasi", value: 25, color: "#F9844A" },
    { name: "Keamanan", value: 30, color: "#D056E5" },
  ];

  const dataPrioritas = [
    { name: "Tinggi", value: 35, color: "#D32F2F" },
    { name: "Sedang", value: 45, color: "#FFB300" },
    { name: "Rendah", value: 20, color: "#388E3C" },
  ];

  // === Dummy Data Line ===
  const dataTahunan = [
    { name: "Jan", value: 110 },
    { name: "Feb", value: 90 },
    { name: "Mar", value: 130 },
    { name: "Apr", value: 120 },
    { name: "Mei", value: 100 },
    { name: "Jun", value: 160 },
    { name: "Jul", value: 145 },
    { name: "Agu", value: 135 },
    { name: "Sep", value: 128 },
    { name: "Okt", value: 120 },
    { name: "Nov", value: 118 },
    { name: "Des", value: 110 },
  ];

  const dataBulanan = [
    { name: "1", value: 30 },
    { name: "5", value: 45 },
    { name: "10", value: 60 },
    { name: "15", value: 55 },
    { name: "20", value: 80 },
    { name: "25", value: 75 },
    { name: "30", value: 90 },
  ];

  // Data tabel sesuai dengan gambar PNG yang diberikan
  const dataTabel = [
    {
      teknisi: "Arjuna Wirata",
      gambar: "/assets/Heungmin.jpg",
      dataAset: "Laptop Lenovo ThinkPad X230",
      nameSeri: "LNV-TP-X230-001",
      sla: "Sesuai SLA",
      prioritas: "Tinggi",
      status: "Diproses",
    },
    {
      teknisi: "Fadil Ishak",
      gambar: "/assets/Jaemin.jpg",
      dataAset: "PC Dell OptiPlex 3020",
      nameSeri: "DELL-OP-3020-001",
      sla: "Peringatan SLA",
      prioritas: "Tinggi",
      status: "Diproses",
    },
    {
      teknisi: "Katrina Wilan",
      gambar: "/assets/Ella.jpg",
      dataAset: "Laptop HP EliteBook 840",
      nameSeri: "HP-EB-840-001",
      sla: "Sesuai SLA",
      prioritas: "Rendah",
      status: "Diproses",
    },
    {
      teknisi: "Ian Farizki",
      gambar: "/assets/Jeno.jpg",
      dataAset: "PC Dell OptiPlex 3020",
      nameSeri: "DELL-OP-3020-002",
      sla: "Peringatan SLA",
      prioritas: "Sedang",
      status: "Diproses",
    },
    {
      teknisi: "Dewi Inwanto",
      gambar: "/assets/Lia.jpg",
      dataAset: "Printer HP LaserJet Pro P1102w",
      nameSeri: "HP-LJ-P1102W-001",
      sla: "Sesuai SLA",
      prioritas: "Rendah",
      status: "Diproses",
    },
    {
      teknisi: "Seiya Windara",
      gambar: "/assets/Ryujin.jpg",
      dataAset: "-",
      nameSeri: "-",
      sla: "Sesuai SLA",
      prioritas: "Sedang",
      status: "Diproses",
    },
    {
      teknisi: "Willy Dewaza",
      gambar: "/assets/Rio.jpeg",
      dataAset: "Laptop ASUS ZenBook UX305FA",
      nameSeri: "ASUS-ZB-UX305-001",
      sla: "Sesuai SLA",
      prioritas: "Rendah",
      status: "Diproses",
    },
    {
      teknisi: "Coki Farezi",
      gambar: "/assets/Rudiono.jpeg",
      dataAset: "Printer Canon PIXMA MP287",
      nameSeri: "CANON-MP-287-001",
      sla: "Sesuai SLA",
      prioritas: "Sedang",
      status: "Diproses",
    },
    {
      teknisi: "Irwandi Putra",
      gambar: "/assets/Ikbal Rasyid.png",
      dataAset: "Laptop Lenovo ThinkPad X230",
      nameSeri: "LNV-TP-X230-002",
      sla: "Sesuai SLA",
      prioritas: "Rendah",
      status: "Diproses",
    },
    {
      teknisi: "Julius Simon",
      gambar: "/assets/Lomon.png",
      dataAset: "-",
      nameSeri: "-",
      sla: "Sesuai SLA",
      prioritas: "Rendah",
      status: "Diproses",
    },
  ];

  // === Label Persentase di Dalam Donut ===
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

  const currentPieData = chartTab === "kategori" ? dataKategori : dataPrioritas;

  const handleDetailClick = () => {
    navigate("/cekdetail");
  };

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content - Simple structure tanpa complex positioning */}
        <div className="pt-4 pb-8">
          {/* Header Section - Simple tanpa background complex */}
          <div className="px-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-bold text-[#226597] text-left">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4">
            {/* === GRID 2 KOLOM === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Donut Chart */}
              <div className="bg-white shadow rounded-2xl p-6">
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setChartTab("kategori")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      chartTab === "kategori"
                        ? "bg-[#226597] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Kategori Laporan
                  </button>
                  <button
                    onClick={() => setChartTab("prioritas")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      chartTab === "prioritas"
                        ? "bg-[#226597] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Level Prioritas
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-gray-800 text-lg">
                      Chart Laporan
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => gantiBulan("kiri")}
                        className="p-1 bg-[#226597] text-white rounded-full hover:bg-[#1e448a]"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="bg-[#226597] text-white px-4 py-1 rounded-full text-sm font-medium">
                        {bulanList[bulanIndex]} 2024
                      </span>
                      <button
                        onClick={() => gantiBulan("kanan")}
                        className="p-1 bg-[#226597] text-white rounded-full hover:bg-[#1e448a]"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={currentPieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={3}
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {currentPieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <p className="text-sm text-blue-600 cursor-pointer mt-2">
                    Cek selengkapnya →
                  </p>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white shadow rounded-2xl p-6">
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setTicketTab("tahunan")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      ticketTab === "tahunan"
                        ? "bg-[#226597] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tiket Tahunan
                  </button>
                  <button
                    onClick={() => setTicketTab("bulanan")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      ticketTab === "bulanan"
                        ? "bg-[#226597] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tiket Bulanan
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                      data={ticketTab === "tahunan" ? dataTahunan : dataBulanan}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} width={30} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                        labelStyle={{ fontWeight: "600", color: "#226597" }}
                        formatter={(value) => [`${value} tiket`, "Jumlah"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#6B63FF"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <p className="text-sm text-blue-600 cursor-pointer mt-2">
                    Cek selengkapnya →
                  </p>
                </div>
              </div>
            </div>

            {/* === FILTER PENCARIAN === */}
            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">
                Filter pencarian
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kolom Kiri */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      value={filters.kategori}
                      onChange={(e) =>
                        handleFilterChange("kategori", e.target.value)
                      }
                    >
                      <option value="">Pilih kategori</option>
                      <option value="Sistem Operasi">Sistem Operasi</option>
                      <option value="Email">Email</option>
                      <option value="Jaringan">Jaringan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Seri
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      value={filters.jenis}
                      onChange={(e) =>
                        handleFilterChange("jenis", e.target.value)
                      }
                    >
                      <option value="">Pilih nomor seri aset</option>
                      <option value="IT">LNV-TP-X230-001</option>
                      <option value="Non-IT">DELL-OP-3020-001</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SLA
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      value={filters.sla}
                      onChange={(e) =>
                        handleFilterChange("sla", e.target.value)
                      }
                    >
                      <option value="">Pilih status SLA</option>
                      <option value="Sesuai SLA">Sesuai SLA</option>
                      <option value="Peringatan SLA">Peringatan SLA</option>
                    </select>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioritas
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      value={filters.prioritas}
                      onChange={(e) =>
                        handleFilterChange("prioritas", e.target.value)
                      }
                    >
                      <option value="">Pilih prioritas</option>
                      <option value="Tinggi">Tinggi</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Rendah">Rendah</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="">Pilih status</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* === MONITORING LAPORAN === */}
            <div className="bg-white shadow rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800 text-lg">
                  Monitoring Laporan
                </h2>
                <button className="flex items-center gap-2 bg-[#226597] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1e448a] transition">
                  <RefreshCcw size={16} /> Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-[#226597] text-white">
                      <th className="p-3 font-semibold">Teknisi</th>
                      <th className="p-3 font-semibold">Data Aset</th>
                      <th className="p-3 font-semibold">Nomor Seri</th>
                      <th className="p-3 font-semibold">SLA</th>
                      <th className="p-3 font-semibold">Prioritas</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataTabel.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                              <img
                                src={item.gambar}
                                alt={item.teknisi}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  const fallback =
                                    e.target.parentElement.querySelector(
                                      ".fallback-initial"
                                    );
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                              <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 hidden fallback-initial">
                                {item.teknisi
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            </div>
                            <span>{item.teknisi}</span>
                          </div>
                        </td>
                        <td className="p-3">{item.dataAset}</td>
                        <td className="p-3">{item.nameSeri}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              item.sla === "Sesuai SLA"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {item.sla === "Sesuai SLA" ? (
                              <>● Sesuai SLA</>
                            ) : (
                              <>● Peringatan SLA</>
                            )}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              item.prioritas === "Tinggi"
                                ? "bg-red-100 text-red-700"
                                : item.prioritas === "Sedang"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.prioritas}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={handleDetailClick}
                            className="text-[#226597] hover:text-[#1e448a] transition"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <p>Menampilkan data 1 sampai 10 dari 15 data</p>
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded-full hover:bg-gray-200 transition">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="px-2 py-1 bg-[#226597] text-white rounded-md text-xs font-semibold">
                    1
                  </button>
                  <button className="text-gray-600 text-xs font-medium hover:text-[#226597]">
                    2
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-200 transition">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutOpd>
  );
};

export default DashboardOpd;
