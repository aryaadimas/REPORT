import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
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
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import LayoutBidang from "../../components/Layout/LayoutBidang";

export default function MonitoringBidang() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [allTickets, setAllTickets] = useState([]); // semua tiket untuk kalender
  const [teknisiList, setTeknisiList] = useState([]); // daftar teknisi unik
  const [selectedTeknisi, setSelectedTeknisi] = useState("Semua");

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // ======================================================
  // 🔥 FETCH ALL ASSIGNED TICKETS
  // ======================================================
  const fetchAllAssigned = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/tickets/bidang/all/assigned`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      const data = json.data || [];

      // Ubah struktur jadikan 1 array untuk kalender
      const mapped = data.map((item) => ({
  id: item.ticket_code,                      // buat ditampilkan di kalender
  ticket_id: item.ticket_id,                // buat dipakai ke endpoint detail
  start: parseISO(item.pengerjaan_awal),
  end: parseISO(item.pengerjaan_akhir),
  teknisi_id: item.assigned_teknisi_id,
  nama_teknisi: item.nama_teknisi,
  progress: item.status === "selesai" ? 100 : 10,
}));


      setAllTickets(mapped);

      // Ambil teknisi unik
      const teknisiUnique = [
        "Semua",
        ...Array.from(new Set(mapped.map((t) => t.nama_teknisi))),
      ];

      setTeknisiList(teknisiUnique);
    } catch (err) {
      console.error("Error fetch all assigned:", err);
    }
  };

  useEffect(() => {
    fetchAllAssigned();
  }, []);

  // FILTER TICKET BY TEKNISI
  const filteredTickets =
    selectedTeknisi === "Semua"
      ? allTickets
      : allTickets.filter((t) => t.nama_teknisi === selectedTeknisi);

  // ======================================================
  // RENDER KALENDER
  // ======================================================
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
        {days.map((d) => (
          <div key={d} className="py-2">
            {d}
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

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");

        const laporanHariIni = filteredTickets.filter(
          (lap) => day >= lap.start && day <= lap.end
        );

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
              {laporanHariIni.map((lap) => (
                <div
                  key={lap.id}
                  onClick={() => navigate(`/detailbidang/${lap.ticket_id}`)}
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

  // ======================================================
  return (
    <LayoutBidang>
      <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-6xl mx-auto">
          {/* TITLE */}
          <h1 className="text-3xl font-bold text-[#226597] mb-4">
            Monitoring
          </h1>

          {/* NAVIGASI BULAN */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="bg-[#226597] text-white p-2 rounded-lg hover:bg-[#15397A]"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <span className="text-gray-700 font-semibold text-lg capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: id })}
            </span>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="bg-[#226597] text-white p-2 rounded-lg hover:bg-[#15397A]"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* DROPDOWN PILIH TEKNISI */}
          <div className="w-64 mb-6">
            <label className="text-gray-600 text-sm mb-1 block">
              Lihat Pekerjaan Teknisi
            </label>

            <select
              value={selectedTeknisi}
              onChange={(e) => setSelectedTeknisi(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white"
            >
              {teknisiList.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* RENDER DAYS & CELLS */}
          {renderDays()}
          {renderCells()}
        </div>
      </div>
    </LayoutBidang>
  );
}
