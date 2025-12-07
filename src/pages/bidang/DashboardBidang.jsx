import React, { useState } from "react";
import LayoutBidang from "../../components/Layout/LayoutBidang";
import { useNavigate } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";


// ICON LAMPIRAN
const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// ICON AKSI (External Link)
const ActionIcon = () => (
  <svg width="22" height="22" fill="#0F2C59" viewBox="0 0 24 24">
    <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
    <path d="M5 5h5V3H3v7h2V5zm0 14v-5H3v7h7v-2H5z" />
  </svg>
);



// DROPDOWN FILTER
const FilterDropdown = ({ placeholder, options = [] }) => (
  <div className="relative">
    <select
    className="w-full text-left text-sm text-gray-700 p-2 bg-white rounded border border-gray-300 appearance-none pr-8 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    defaultValue=""
>
    <option value="" disabled hidden>
        {placeholder}
    </option>

    {options.map((opt, index) => (
        <option key={index} value={opt}>
            {opt}
        </option>
    ))}
</select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

const FilterRow = ({ label, children }) => (
    <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap w-20">
            {label}
        </span>
        <div className="flex-1">
            {children}
        </div>
    </div>
);


export default function DashboardBidang() {
  const [activeTab, setActiveTab] = useState("pelaporan");
  const navigate = useNavigate();

  const stats = [
    { number: 82, label: "Tiket Masuk", description: "tiket yang masuk", icon: "/assets/Tiket Masuk.png" },
    { number: 44, label: "Diverifikasi", description: "tiket telah diverifikasi", icon: "/assets/Diverifikasi.png" },
    { number: 10, label: "Revisi", description: "menunggu verifikasi", icon: "/assets/Revisi.png" },
    { number: 3, label: "Ditolak", description: "tiket yang ditolak", icon: "/assets/Ditolak.png" },
  ];

  const tableData = [
    { name: "Haikal Saputra", date: "18/09/2024", aset: "Laptop Dell", seri: "LTP-DL-001", priority: "rendah", avatar: "/assets/Haechan.jpg" },
    { name: "Jalu Atmaja", date: "01/09/2024", aset: "CCTV", seri: "CV-002", priority: "rendah", avatar: "/assets/Rio.jpeg" },
    { name: "Kayis Ibrahim", date: "01/09/2024", aset: "PC Samsung", seri: "PC-SMS-010", priority: "rendah", avatar: "/assets/Lia.jpg" },
    { name: "Nanda Prakoso", date: "09/09/2024", aset: "Printer Epson", seri: "PR-EP-015", priority: "rendah", avatar: "/assets/Haechan.jpg" },
    { name: "Rizky Mahendra", date: "09/09/2024", aset: "Router TP-Link", seri: "RT-TPL-003", priority: "sedang", avatar: "/assets/Rio.jpeg" },
    { name: "Fauzan Hakim", date: "12/09/2024", aset: "Laptop Dell", seri: "LTP-DL-001", priority: "tinggi", avatar: "/assets/Haechan.jpg" },
    { name: "Dewi Lestari", date: "03/10/2024", aset: "CCTV", seri: "CV-002", priority: "rendah", avatar: "/assets/Rio.jpeg" },
    { name: "Faris Abdullah", date: "15/09/2024", aset: "PC Samsung", seri: "PC-SMS-010", priority: "sedang", avatar: "/assets/Lia.jpg" },
    { name: "Putri Oktavia", date: "20/10/2024", aset: "Printer Epson", seri: "PR-EP-015", priority: "tinggi", avatar: "/assets/Haechan.jpg" },
    { name: "Kevin Hartanta", date: "28/09/2024", aset: "Router TP-Link", seri: "RT-TPL-003", priority: "rendah", avatar: "/assets/Rio.jpeg" },

  ];

  const getPriorityStyle = (priority) => {
  switch (priority.toLowerCase()) {
    case "tinggi":
      return "bg-red-100 text-red-700 border border-red-300";
    case "sedang":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "rendah":
      return "bg-green-100 text-green-700 border border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};


  return (
    <LayoutBidang>
      <main className="p-6 bg-gray-50">

        {/* HEADER DASHBOARD */}
        <div className="bg-white shadow-sm border rounded-xl p-6 mb-8">
          <h1 className="text-2xl font-bold text-[#226597]">Dashboard</h1>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={item.icon} className="w-8 h-8 object-contain" />
                <h3 className="font-semibold text-gray-800">{item.label}</h3>
              </div>
              <p className="text-3xl font-bold text-[#0F2C59]">{item.number}</p>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CARD – TAB, FILTER, TABLE */}
        <div className="bg-white shadow-md border rounded-xl p-7">

          {/* TAB + REFRESH */}
          <div className="flex justify-between items-center border-b pb-3 mb-6">

            {/* TAB */}
            <div className="flex gap-8">
              {["pelaporan", "pelayanan"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-semibold text-sm ${
                    activeTab === tab
                      ? "text-[#0F2C59] border-b-2 border-[#0F2C59]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* REFRESH BUTTON */}
            <button className="flex items-center gap-2 bg-[#226597] hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all text-sm font-medium">
              <ArrowPathIcon className="w-5 h-5" />
              Refresh
            </button>


          </div>

          {/* FILTER */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Pencarian</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <FilterRow label="Kategori">
                <FilterDropdown 
                    placeholder="Pilih kategori"
                    options={["Hardware", "Software", "Jaringan", "SDM"]}
                />
            </FilterRow>

            <FilterRow label="Jenis">
                <FilterDropdown 
                    placeholder="Pilih jenis"
                    options={["barang", "SDM"]}
                />
            </FilterRow>

            <FilterRow label="Prioritas">
                <FilterDropdown 
                    placeholder="Pilih prioritas"
                    options={["Tinggi", "Sedang", "Rendah"]}
                />
            </FilterRow>

            </div>


          </div>

          {/* TABLE */}
          <div className="border rounded-lg overflow-hidden">

            {/* TABLE HEADER */}
            <div className="grid grid-cols-7 bg-[#0F2C59] text-white font-medium text-sm p-3 text-center">
              <div className="text-left pl-2">Pengirim</div>
              <div>Tgl. Masuk</div>
              <div>Data Aset</div>
              <div>Nomor Seri</div>
              <div>Lampiran</div>
              <div>Prioritas</div>
              <div>Aksi</div>
            </div>

            {/* TABLE BODY */}
            {tableData.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-7 items-center p-3 border-b text-sm hover:bg-gray-50 transition"
              >
                {/* Pengirim */}
                <div className="flex items-center gap-3 pl-2">
                  <img src={row.avatar} className="w-8 h-8 rounded-full object-cover" />
                  {row.name}
                </div>

                <div className="text-center text-gray-700">{row.date}</div>

                <div className="text-center">{row.aset}</div>

                <div className="text-center">{row.seri}</div>

                {/* LAMPIRAN */}
                <div className="flex justify-center items-center gap-1 text-[#0F2C59] underline cursor-pointer">
                  <DocumentIcon />
                  <span className="text-xs">document.pdf</span>
                </div>

                {/* PRIORITAS */}
                <div className="flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(row.priority)}`}>
                    {row.priority}
                  </span>

                </div>

                {/* AKSI */}
                <div className="flex justify-center cursor-pointer" onClick={() => navigate("/aksitiket")}>
                  <ActionIcon />
                </div>
              </div>
            ))}

          </div>
        </div>
      </main>
    </LayoutBidang>
  );
}
