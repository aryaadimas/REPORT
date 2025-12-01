import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";
import { id } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import LayoutBidang from "../../components/Layout/LayoutBidang";

export default function MonitoringBidang() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filter, setFilter] = useState("Semua");
  const [level, setLevel] = useState("Semua");

  const dataTeknisi = [
    {
      nama: "Sri Wulandari",
      bidang: "Keamanan",
      foto: "/assets/shizuku.jpg",
      level: "1",
      laporan: [
        {
          id: "LP831938",
          progress: 80,
          start: new Date(2025, 10, 2),
          end: new Date(2025, 10, 4),
        },
        {
          id: "LP931728",
          progress: 100,
          start: new Date(2025, 10, 9),
          end: new Date(2025, 10, 11),
        },
        {
          id: "LP931720",
          progress: 10,
          start: new Date(2025, 10, 8),
          end: new Date(2025, 10, 12),
        },
      ],
    },
    {
      nama: "Galang Wardi",
      bidang: "Jaringan",
      foto: "/assets/Bokuto.jpg",
      level: "2",
      laporan: [
        {
          id: "LP907276",
          progress: 50,
          start: new Date(2025, 10, 2),
          end: new Date(2025, 10, 3),
        },
        {
          id: "LP826792",
          progress: 100,
          start: new Date(2025, 10, 10),
          end: new Date(2025, 10, 11),
        },
      ],
    },
    {
      nama: "Albert Madara",
      bidang: "Perangkat Keras",
      foto: "/assets/Suika.jpg",
      level: "3",
      laporan: [
        {
          id: "LP802476",
          progress: 100,
          start: new Date(2025, 10, 3),
          end: new Date(2025, 10, 5),
        },
        {
          id: "LP937282",
          progress: 40,
          start: new Date(2025, 10, 9),
          end: new Date(2025, 10, 10),
        },
      ],
    },
  ];

  const [selectedTeknisi, setSelectedTeknisi] = useState(dataTeknisi[0]);

  const renderDays = () => {
    const days = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];
    return (
      <div className="grid grid-cols-7 text-center font-semibold text-[#0F2C59] mb-3">
        {days.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    const laporanList = selectedTeknisi.laporan;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const laporanHariIni = laporanList.filter(
          (lap) => day >= lap.start && day <= lap.end
        );
        const laporanFiltered = laporanHariIni.filter((lap) => {
          if (filter === "Progress") return lap.progress < 100;
          if (filter === "Selesai") return lap.progress === 100;
          return true;
        });

        days.push(
          <div
            key={day.toISOString()}
            className={`relative border rounded-xl min-h-[100px] p-2 text-sm transition ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-50 text-gray-400"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <span className="absolute top-1 right-2 text-xs text-gray-400">
              {formattedDate}
            </span>

            <div className="flex flex-col gap-1 mt-5">
              {laporanFiltered.map((lap) => (
                <div
                  key={lap.id}
                  onClick={() => navigate(`/detailbidang/${lap.id}`)}
                  className={`cursor-pointer text-white text-xs px-2 py-1 rounded-md w-fit transition ${
                    lap.progress === 100
                      ? "bg-[#0F2C59] hover:bg-[#1e448a]"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {lap.id}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-2 mb-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  // Bungkus seluruh konten dengan LayoutBidang
  return (
    <LayoutBidang>
      <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-6xl mx-auto">
          {/* === Judul Monitoring === */}
          <h1 className="text-3xl font-bold text-[#226597] mb-2">Monitoring</h1>

          {/* === Tombol Filter Status (dalam box) === */}
          <div className="flex justify-end mb-6">
            <div className="flex gap-2 border border-gray-300 rounded-2xl px-3 py-2 bg-gray-50 shadow-sm">
              {["Semua", "Progress", "Selesai"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === item
                      ? "bg-[#226597] text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* === Navigasi Bulan === */}
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="bg-[#226597] text-white p-2 rounded-lg hover:bg-[#15397A] transition"
            >
              <ChevronLeftIcon className="w-2 h-2" />
            </button>
            <span className="text-gray-700 font-semibold text-lg capitalize">
              {format(currentMonth, "MMMM", { locale: id })}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="bg-[#226597] text-white p-2 rounded-lg hover:bg-[#15397A] transition"
            >
              <ChevronRightIcon className="w-2 h-2" />
            </button>
          </div>

          {/* === Filter Dropdowns (Full Width, 3 Kolom) === */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Level Teknisi */}
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">
                Level Teknisi
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
              >
                <option>Semua</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>

            {/* Bidang Teknisi */}
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">
                Bidang Teknisi
              </label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full">
                <option>Semua</option>
                <option>Keamanan</option>
                <option>Jaringan</option>
                <option>Perangkat Keras</option>
              </select>
            </div>

            {/* Lihat Pekerjaan */}
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">
                Lihat Pekerjaan
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full bg-white">
                <img
                  src={selectedTeknisi.foto}
                  alt={selectedTeknisi.nama}
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
                <select
                  value={selectedTeknisi.nama}
                  onChange={(e) => {
                    const teknisi = dataTeknisi.find(
                      (t) => t.nama === e.target.value
                    );
                    setSelectedTeknisi(teknisi);
                  }}
                  className="bg-transparent text-sm w-full outline-none"
                >
                  {dataTeknisi.map((t) => (
                    <option key={t.nama} value={t.nama}>
                      {t.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* === Kalender === */}
          {renderDays()}
          {renderCells()}
        </div>
      </div>
    </LayoutBidang>
  );
}
