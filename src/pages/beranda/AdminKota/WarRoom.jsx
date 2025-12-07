import React, { useState } from "react";
import { Eye, RefreshCw, File, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WarRoom() {
  const [activeTab, setActiveTab] = useState("Pelaporan");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const totalData = 33;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  // Data dengan foto seperti RateKotaOpd
  const data = [
    {
      nama: "Doni Richo",
      foto: "/assets/Bokuto.jpg",
      tanggal: "18/09/2024",
      dataAset: "Fortinet FortiGate 200E",
      nomorSeri: "FGT-200E-SEC-001",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "Rio Widaro",
      foto: "/assets/Suika.jpg",
      tanggal: "18/09/2024",
      dataAset: "Dell PowerEdge R740",
      nomorSeri: "DELL-R740-PRD-001",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "La Yustia",
      foto: "/assets/shizuku.jpg",
      tanggal: "17/09/2024",
      dataAset: "Fortinet FortiGate 200E",
      nomorSeri: "FGT-200E-SEC-002",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "Ridwan Yusuf",
      foto: "/assets/Bokuto.jpg",
      tanggal: "17/09/2024",
      dataAset: "Cisco Catalyst 9800 Core",
      nomorSeri: "CSC-CT9600-001",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "Elia Meisya",
      foto: "/assets/Suika.jpg",
      tanggal: "17/09/2024",
      dataAset: "Dell PowerEdge R740",
      nomorSeri: "DELL-R740-PRD-001",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "Sri Wulandari",
      foto: "/assets/shizuku.jpg",
      tanggal: "16/09/2024",
      dataAset: "Dell PowerEdge R740",
      nomorSeri: "DELL-R740-PRD-002",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "Doni Richo",
      foto: "/assets/Bokuto.jpg",
      tanggal: "18/09/2024",
      dataAset: "Fortinet FortiGate 200E",
      nomorSeri: "FGT-200E-SEC-003",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "Rio Widaro",
      foto: "/assets/Suika.jpg",
      tanggal: "18/09/2024",
      dataAset: "Dell PowerEdge R740",
      nomorSeri: "DELL-R740-PRD-003",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "La Yustia",
      foto: "/assets/shizuku.jpg",
      tanggal: "17/09/2024",
      dataAset: "Fortinet FortiGate 200E",
      nomorSeri: "FGT-200E-SEC-004",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
    {
      nama: "Ridwan Yusuf",
      foto: "/assets/Bokuto.jpg",
      tanggal: "17/09/2024",
      dataAset: "Cisco Catalyst 9800 Core",
      nomorSeri: "CSC-CT9600-002",
      lampiran: <File className="w-5 h-5 text-gray-600" />,
      prioritas: "Critical",
    },
  ];

  // Fungsi untuk handle klik ikon aksi (Eye)
  const handleLihatDetail = (item) => {
    console.log("Lihat detail untuk:", item.nama);
    navigate("/aksitiketcritical");
  };

  const handleRefresh = () => {
    console.log("Refresh data");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* === Judul Halaman === */}
      <h1 className="text-3xl font-bold text-[#0F2C59]">War Room</h1>

      {/* === Monitoring OPD Dinamis === */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-gray-700">Monitoring OPD</p>
        <button className="bg-[#0F2C59] text-white text-sm font-medium px-3 py-1.5 rounded-md">
          Dinas Pendidikan
        </button>
      </div>

      {/* === Tabs Pelaporan/Pelayanan === */}
      <div className="flex items-center justify-between">
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab("Pelaporan")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "Pelaporan"
                ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                : "text-gray-400 hover:text-[#0F2C59]"
            }`}
          >
            Pelaporan
          </button>
          <button
            onClick={() => setActiveTab("Pelayanan")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "Pelayanan"
                ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                : "text-gray-400 hover:text-[#0F2C59]"
            }`}
          >
            Pelayanan
          </button>
        </div>

        {/* Tombol Refresh */}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-[#0F2C59] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#15397A] transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* === Filter Section === */}
      <div className="bg-white shadow rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Filter pencarian
          </h2>
        </div>

        {/* Filter fields sesuai gambar War Room */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {/* Perihal */}
          <select className="border border-gray-300 rounded-lg p-2 text-sm">
            <option>Perihal</option>
            <option>Pilih perihal</option>
            <option>Teknis</option>
            <option>Administrasi</option>
          </select>

          {/* Status */}
          <select className="border border-gray-300 rounded-lg p-2 text-sm">
            <option>Status</option>
            <option>Pilih status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>

          {/* Prioritas */}
          <select className="border border-gray-300 rounded-lg p-2 text-sm">
            <option>Prioritas</option>
            <option>Pilih prioritas</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {/* Empty columns for 6-column layout */}
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* === Tabel Data Pelaporan === */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#0F2C59] text-white">
            <tr>
              {[
                "Pengirim",
                "Tgl. Masuk",
                "Data Aset",
                "Nomor Seri",
                "Lampiran",
                "Prioritas",
                "Aksi",
              ].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 transition-all">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-medium">
                      {item.nama}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.tanggal}</td>
                <td className="px-4 py-3 text-gray-700">{item.dataAset}</td>
                <td className="px-4 py-3 text-gray-700">{item.nomorSeri}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-start">{item.lampiran}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    {/* Kotak Critical */}
                    <div className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-md">
                      Critical
                    </div>
                    {/* Checkmark */}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleLihatDetail(item)}
                    className="text-[#0F2C59] hover:text-[#15397A] p-1 hover:bg-gray-100 rounded-md transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* === Footer dengan Pagination === */}
        <div className="flex justify-between items-center p-4 border-t text-sm text-gray-600">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
          >
            Kembali
          </button>

          <div className="flex items-center gap-6">
            <p>
              Menampilkan data 1 sampai {itemsPerPage} dari {totalData} data
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button className="px-3 py-1 border rounded-lg bg-[#0F2C59] text-white">
                1
              </button>
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                2
              </button>
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                3
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
