import React, { useState } from "react";
import { Star, Eye, RefreshCcw } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function RateKotaOpd() {
  const [activeTab, setActiveTab] = useState("Pelaporan");
  const { opdName } = useParams();
  const navigate = useNavigate();

  // === Dummy Data sesuai gambar ===
  const data = [
    {
      nama: "Doni Ridho",
      foto: "/assets/Bokuto.jpg",
      tglAwal: "18/09/2024",
      tglSelesai: "18/09/2024",
      dataAset: "Laptop Lenovo ThinkPad X230",
      noSeri: "INV-TP-X230-001",
      rating: 4,
    },
    {
      nama: "Rio Widoro",
      foto: "/assets/Suika.jpg",
      tglAwal: "18/09/2024",
      tglSelesai: "18/09/2024",
      dataAset: "Printer HP LaserJet Pro P1102w",
      noSeri: "HP-LJ-P1102W-001",
      rating: 4,
    },
    {
      nama: "La Yustia",
      foto: "/assets/shizuku.jpg",
      tglAwal: "17/09/2024",
      tglSelesai: "17/09/2024",
      dataAset: "PC Dell OptiPlex 3020",
      noSeri: "DELL-OP-3020-001",
      rating: 3,
    },
    {
      nama: "Ridwan Yusuf",
      foto: "/assets/Bokuto.jpg",
      tglAwal: "17/09/2024",
      tglSelesai: "17/09/2024",
      dataAset: "-",
      noSeri: "-",
      rating: 4,
    },
    {
      nama: "Elia Meisya",
      foto: "/assets/Suika.jpg",
      tglAwal: "17/09/2024",
      tglSelesai: "17/09/2024",
      dataAset: "Printer Canon PIXMA MP287",
      noSeri: "CANON-MP-287-001",
      rating: 3,
    },
    {
      nama: "Sri Wulandari",
      foto: "/assets/shizuku.jpg",
      tglAwal: "16/09/2024",
      tglSelesai: "16/09/2024",
      dataAset: "Laptop HP EliteBook 840",
      noSeri: "HP-EB-840-001",
      rating: 4,
    },
    {
      nama: "Supriatno",
      foto: "/assets/Bokuto.jpg",
      tglAwal: "16/09/2024",
      tglSelesai: "16/09/2024",
      dataAset: "Printer Epson L310",
      noSeri: "EPSON-L310-001",
      rating: 3,
    },
    {
      nama: "Anya Rosalina",
      foto: "/assets/Suika.jpg",
      tglAwal: "16/09/2024",
      tglSelesai: "16/09/2024",
      dataAset: "-",
      noSeri: "-",
      rating: 4,
    },
    {
      nama: "Widya Karim",
      foto: "/assets/shizuku.jpg",
      tglAwal: "15/09/2024",
      tglSelesai: "15/09/2024",
      dataAset: "PC Dell OptiPlex 3020",
      noSeri: "DELL-OP-3020-002",
      rating: 4,
    },
    {
      nama: "Rudiono",
      foto: "/assets/Bokuto.jpg",
      tglAwal: "15/09/2024",
      tglSelesai: "15/09/2024",
      dataAset: "-",
      noSeri: "-",
      rating: 3,
    },
  ];

  // === Unique No. Seri from data for dropdown ===
  const uniqueNoSeri = Array.from(
    new Set(data.map((item) => item.noSeri).filter((noSeri) => noSeri !== "-"))
  );

  // Fungsi untuk handle klik ikon aksi (Eye)
  const handleLihatRating = (item) => {
    console.log("Lihat rating untuk:", item.nama);
    navigate("/lihatratingkota");
  };

  return (
    <div className="p-6 space-y-6">
      {/* === Judul Halaman === */}
      <h1 className="text-3xl font-bold text-[#0F2C59]">Rating Kepuasan</h1>

      {/* === Monitoring OPD Dinamis === */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-gray-700">Monitoring OPD</p>
        <button className="bg-[#0F2C59] text-white text-sm font-medium px-3 py-1.5 rounded-md">
          {decodeURIComponent(opdName || "Dinas Pendidikan")}
        </button>
      </div>

      {/* === Tabs Pelaporan/Pelayanan === */}
      <div className="flex border-b border-gray-300">
        {["Pelaporan", "Pelayanan"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === tab
                ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                : "text-gray-400 hover:text-[#0F2C59]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* === Filter Section === */}
      <div className="bg-white shadow rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">
            Filter pencarian
          </h2>
          <button className="flex items-center gap-2 bg-[#0F2C59] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#15397A]">
            <RefreshCcw size={14} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Data Aset */}
          <select className="border border-gray-300 rounded-lg p-2 text-sm">
            <option>Data Aset</option>
            <option>Laptop</option>
            <option>Printer</option>
            <option>PC</option>
            <option>Monitor</option>
          </select>

          {/* No. Seri - Changed to dropdown */}
          <select className="border border-gray-300 rounded-lg p-2 text-sm">
            <option>No. Seri</option>
            {uniqueNoSeri.map((noSeri, index) => (
              <option key={index} value={noSeri}>
                {noSeri}
              </option>
            ))}
          </select>

          {/* Rating */}
          <select className="border border-gray-300 rounded-lg p-2 text-sm">
            <option>Rating</option>
            <option>⭐⭐⭐⭐⭐</option>
            <option>⭐⭐⭐⭐</option>
            <option>⭐⭐⭐</option>
            <option>⭐⭐</option>
            <option>⭐</option>
          </select>
        </div>
      </div>

      {/* === Tabel Rating === */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#0F2C59] text-white">
            <tr>
              {[
                "Pengirim",
                "Tgl. Awal",
                "Tgl. Selesai",
                "Data Aset",
                "Nomor Seri",
                "Rating",
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
                <td className="px-4 py-3 text-gray-700">{item.tglAwal}</td>
                <td className="px-4 py-3 text-gray-700">{item.tglSelesai}</td>
                <td className="px-4 py-3 text-gray-700">{item.dataAset}</td>
                <td className="px-4 py-3 text-gray-700">{item.noSeri}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className={`${
                          idx < item.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleLihatRating(item)}
                    className="text-[#0F2C59] hover:text-[#15397A] p-1 hover:bg-gray-100 rounded-md transition-colors"
                    title="Lihat Detail Rating"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* === Tombol Kembali & Pagination === */}
        <div className="flex justify-between items-center p-4 border-t text-sm text-gray-600">
          <button
            onClick={() => navigate("/ratekota")}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
          >
            Kembali
          </button>

          <div className="flex items-center gap-6">
            <p>Menampilkan data 1 sampai 10 dari 33 data</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                &lt;
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
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
