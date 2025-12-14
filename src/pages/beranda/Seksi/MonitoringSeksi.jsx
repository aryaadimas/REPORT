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
} from "date-fns";
import { id } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function MonitoringSeksi() {
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [listTeknisi, setListTeknisi] = useState([]);
  const [selectedTeknisiId, setSelectedTeknisiId] = useState("");
  const [tiketList, setTiketList] = useState([]);
  const [hasSetInitialMonth, setHasSetInitialMonth] = useState(false);

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // helper baca field teknisi yang mungkin beda nama
  const getTeknisiId = (t) =>
    t.teknisi_id || t.id || t.user_id || t.assigned_teknisi_id;

  const getTeknisiName = (t) =>
    t.nama || t.name || t.nama_teknisi || "Tanpa nama";

  const getTeknisiFoto = (t) =>
    t.foto || t.avatar || t.profile_picture || "/assets/default.jpg";

  /* =======================
      FETCH TEKNISI
  ======================= */
 const fetchTeknisi = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/teknisi/seksi`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    const mapped = json.data.map((t) => ({
      id: t.id,
      name: t.full_name,               // <-- ini nama teknisi
      foto: t.profile_url || "/assets/default.jpg", // <-- fallback foto
    }));

    setListTeknisi(mapped);

    if (mapped.length > 0) {
      setSelectedTeknisiId(mapped[0].id);
    }
  } catch (err) {
    console.error("Gagal fetch teknisi:", err);
  }
};


  /* =======================
      FETCH TIKET
  ======================= */
 const fetchTickets = async (teknisiId) => {
  try {
    let url = `${BASE_URL}/api/tickets/seksi/assigned`;

    if (teknisiId) {
      url = `${BASE_URL}/api/tickets/seksi/assigned/${teknisiId}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    setTiketList(Array.isArray(json.data) ? json.data : []);
  } catch (err) {
    console.error("Gagal fetch tiket:", err);
  }
};


  /* =======================
      EFFECT: LOAD TEKNISI DI AWAL
  ======================= */
  useEffect(() => {
    fetchTeknisi();
  }, []);

  /* =======================
      EFFECT: FETCH TIKET SAAT TEKNISI GANTI
  ======================= */
 useEffect(() => {
  if (!selectedTeknisiId) return;

  if (selectedTeknisiId === "all") {
    fetchTickets(null);   // ambil semua tiket
  } else {
    fetchTickets(selectedTeknisiId); // tiket teknisi tertentu
  }
}, [selectedTeknisiId]);


  /* =======================
      EFFECT: SET BULAN AWAL BERDASARKAN DATA
  ======================= */
  useEffect(() => {
    if (!hasSetInitialMonth && tiketList.length > 0) {
      const first = tiketList[0];
      if (first.pengerjaan_awal) {
        setCurrentMonth(new Date(first.pengerjaan_awal));
        setHasSetInitialMonth(true);
      }
    }
  }, [tiketList, hasSetInitialMonth]);

  /* =======================
      RENDER HARI
  ======================= */
  const renderDays = () => {
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
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

  /* =======================
      RENDER KALENDER
  ======================= */
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
        const laporanHariIni = tiketList.filter((t) => {
          if (!t.pengerjaan_awal || !t.pengerjaan_akhir) return false;
          const start = new Date(t.pengerjaan_awal);
          const end = new Date(t.pengerjaan_akhir);
          return day >= start && day <= end;
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
              {format(day, "d")}
            </span>

            <div className="flex flex-col gap-1 mt-5">
              {laporanHariIni.map((lap) => {
               let warna = "bg-[#0F2C59] hover:bg-[#1e448a]"; // default: diproses (biru gelap)

if (lap.status?.toLowerCase() === "assigned to teknisi") {
  warna = "bg-blue-500 hover:bg-blue-600"; // biru cerah
}


                return (
                  <div
                    key={lap.ticket_id}
                    onClick={() =>
  navigate(`/monitoringtiketseksi/${lap.ticket_id}`)
}

                    className={`cursor-pointer text-white text-xs px-2 py-1 rounded-md w-fit transition ${warna}`}
                  >
                    {lap.ticket_code}
                  </div>
                );
              })}
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

  const selectedTeknisi = listTeknisi.find((t) => t.id === selectedTeknisiId);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-6xl mx-auto">
        {/* Judul */}
        <h1 className="text-3xl font-bold text-[#0F2C59] mb-6">Monitoring</h1>

        

        {/* Navigasi Bulan + Tahun */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="bg-[#0F2C59] text-white p-2 rounded-lg hover:bg-[#15397A] transition"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <span className="text-gray-700 font-semibold text-lg capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: id })}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="bg-[#0F2C59] text-white p-2 rounded-lg hover:bg-[#15397A] transition"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdown Lihat Pekerjaan */}
        <div className="w-72 mb-6">
          <label className="text-gray-600 text-sm mb-1">Lihat Pekerjaan</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full bg-white">
            {selectedTeknisiId !== "all" && selectedTeknisi && (
  <img
    src={selectedTeknisi.foto}
    alt={selectedTeknisi.name}
    className="w-6 h-6 rounded-full mr-2 object-cover"
  />
)}

            <select
  value={selectedTeknisiId}
  onChange={(e) => setSelectedTeknisiId(e.target.value)}
  className="bg-transparent text-sm w-full outline-none"
>
  <option value="all">Semua Teknisi</option>

  {listTeknisi.map((t) => (
    <option key={t.id} value={t.id}>
      {t.name}
    </option>
  ))}
</select>

          </div>
        </div>

        {/* Kalender */}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
