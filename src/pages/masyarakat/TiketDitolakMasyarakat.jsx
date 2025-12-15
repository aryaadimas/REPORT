import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

export default function TiketDitolakMasyarakat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [nik, setNik] = useState("357885380230002");

  const ticketId =
    state?.item?.ticket_id ||
    state?.ticketId ||
    "09635cce-db14-43e9-a1bd-cd3a3fc901cc";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const tokenKeys = [
          "access_token",
          "token",
          "auth_token",
          "bearer_token",
        ];
        let token = null;

        for (const key of tokenKeys) {
          const storedToken = localStorage.getItem(key);
          if (storedToken) {
            token = storedToken;
            break;
          }
        }

        if (!token) {
          console.warn("No token found in localStorage");
          token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTY5OTQ0M30.1JAk7yDczD2TwxDv94qz479-F_4ER08gjJipgh1yQVY";
        }

        const ticketResponse = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/${ticketId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!ticketResponse.ok) {
          throw new Error(`HTTP error! status: ${ticketResponse.status}`);
        }

        const ticketData = await ticketResponse.json();
        setTicketData(ticketData);

        const finishedResponse = await fetch(
          "https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/finished",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (finishedResponse.ok) {
          const finishedData = await finishedResponse.json();

          const matchingTicket = finishedData.data?.find(
            (ticket) => ticket.ticket_id === ticketId
          );

          if (matchingTicket?.nik) {
            setNik(matchingTicket.nik);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Data tidak ditemukan</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F9FAFB] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

          <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
            Tiket Ditolak
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">Nama</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium min-w-[500px] text-center">
                {ticketData.creator?.full_name ||
                  state?.item?.creator?.full_name ||
                  "Yono Wirenko"}
              </div>
            </div>

            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">NIK</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium min-w-[500px] text-center">
                {nik || "357885380230002"}
              </div>
            </div>

            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">Email</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium min-w-[500px] text-center">
                {ticketData.creator?.email ||
                  state?.item?.creator?.email ||
                  "yonowinarko@legmail.com"}
              </div>
            </div>

            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium min-w-[500px] text-center">
                {ticketData.ticket_code ||
                  state?.item?.ticket_code ||
                  "LP8321336"}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Judul Pelaporan</p>
            <input
              type="text"
              value={
                ticketData.title || state?.item?.title || "Parkir Nguwawor"
              }
              readOnly
              className="w-full bg-gray-100 rounded-lg px-3 py-2 text-gray-800 text-sm"
            />
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Rincian Masalah</p>
            <textarea
              readOnly
              value={
                ticketData.description ||
                state?.item?.description ||
                "Banyak kendaraan yang parkir sembarangan di separyang jalan kalianak"
              }
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed"
            />
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Lampiran file</p>
            <div className="flex items-center gap-2 mt-1">
              <FileText size={18} className="text-[#0F2C59]" />
              <span className="text-gray-800">
                {ticketData.files && ticketData.files.length > 0
                  ? ticketData.files[0].filename || "bukti laporan.pdf"
                  : "bukti laporan.pdf"}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Alasan Penolakan</p>
            <textarea
              readOnly
              value={
                ticketData.rejection_reason_seksi ||
                state?.item?.rejection_reason_seksi ||
                "Tiket ditolak karena informasi yang diberikan tidak lengkap"
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm resize-none h-24 leading-relaxed"
            />
          </div>

          <div className="flex justify-start pt-4">
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition mr-3"
            >
              Kembali
            </button>

            {state?.item?.status === "rejected" && (
              <button
                onClick={() =>
                  navigate("/reopenmasyarakat", { state: { item: state.item } })
                }
                className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Ajukan Kembali
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
