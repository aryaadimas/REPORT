import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function FormPenugasanSeksi() {
  const navigate = useNavigate();
  const { ticket_id } = useParams();

  // ===== STATES =====
  const [ticketData, setTicketData] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedTeknisi, setSelectedTeknisi] = useState("");
  const [lampiranName, setLampiranName] = useState("");

  const [teknisiList, setTeknisiList] = useState([]);
  const [loadingTeknisi, setLoadingTeknisi] = useState(true);

  const [tglAwal, setTglAwal] = useState("");
  const [tglAkhir, setTglAkhir] = useState("");

  // ===== FETCH DETAIL TICKET =====
   useEffect(() => {
    async function fetchTicketDetail() {
      try {
        const res = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/seksi/verified-bidang/${ticket_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const json = await res.json();
        setTicketData(json);
      } catch (err) {
        console.error("Error fetch detail:", err);
        Swal.fire("Gagal memuat detail tiket", "", "error");
      } finally {
        setLoadingTicket(false);
      }
    }

    fetchTicketDetail();
  }, [ticket_id]);

  // ===== FETCH LIST TEKNISI =====
  useEffect(() => {
    async function fetchTeknisi() {
      try {
        const res = await fetch(
          "https://service-desk-be-production.up.railway.app/api/teknisi/seksi",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const json = await res.json();
        setTeknisiList(json.data || []);
      } catch (err) {
        console.error("FETCH TEKNISI ERROR:", err);
        Swal.fire("Gagal memuat daftar teknisi", "", "error");
      } finally {
        setLoadingTeknisi(false);
      }
    }

    fetchTeknisi();
  }, []);

  // ===== BUTTON KIRIM =====
  const handleSubmit = async () => {
    if (!selectedTeknisi) {
      return Swal.fire("Pilih teknisi dulu!", "", "warning");
    }
    if (!tglAwal || !tglAkhir) {
      return Swal.fire("Isi tanggal pengerjaan!", "", "warning");
    }

    Swal.fire({
      title: "Yakin ingin mengirim?",
      text: "Teknisi akan ditugaskan untuk tiket ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F2C59",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, Kirim!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
       if (!result.isConfirmed) return;

      try {
        setLoadingSubmit(true); // 🔥 MULAI LOADING

        const res = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/${ticket_id}/assign-teknisi`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              teknisi_id: selectedTeknisi,
              pengerjaan_awal: tglAwal,
              pengerjaan_akhir: tglAkhir,
            }),
          }
        );

        const json = await res.json();

        if (!res.ok) {
          setLoadingSubmit(false);
          return Swal.fire("Gagal mengirim!", json.message || "", "error");
        }

        Swal.fire({
          title: "Berhasil!",
          text: "Teknisi berhasil ditugaskan.",
          icon: "success",
          confirmButtonColor: "#0F2C59",
        }).then(() => navigate(-1)); // 🔥 BALIK KE SEBELUMNYA

      } catch (err) {
        console.error(err);
        Swal.fire("Terjadi kesalahan!", "", "error");
      } finally {
        setLoadingSubmit(false); // 🔥 SELESAI LOADING
      }
    });
  };

  // ===== BUTTON DRAFT =====
  const handleDraft = () => {
    Swal.fire({
      title: "Draft disimpan",
      icon: "info",
      confirmButtonColor: "#0F2C59",
    }).then(() => navigate(-1));
  };

  // LOADING STATE
  if (loadingTicket) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Memuat detail tiket...</p>
      </div>
    );
  }

  // ======================= RENDER =======================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59] mb-3">Detail Penugasan</h1>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-8 space-y-8">

        {/* ==== PENGIRIM ==== */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-gray-800">Pengirim</label>
          <div className="flex items-center gap-2">
            <img
              src={ticketData.creator?.profile || "/assets/default-avatar.png"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-800">
              {ticketData.creator?.full_name}
            </span>
          </div>
        </div>

        {/* ==== ID LAPORAN ==== */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-gray-800">ID Laporan</label>
          <div className="bg-gray-300 px-4 py-1.5 rounded w-60 text-center text-gray-700">
            {ticketData.ticket_code}
          </div>
        </div>

        {/* ==== PRIORITAS ==== */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-gray-800">Prioritas</label>
          <div className="w-60 bg-green-500 text-white text-sm font-semibold text-center py-2 rounded">
            {ticketData.priority}
          </div>
        </div>

        {/* ==== STATUS ==== */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-gray-800">Status</label>
          <div className="bg-gray-300 px-4 py-1.5 rounded w-60 text-center text-gray-700">
            {ticketData.status_ticket_seksi}
          </div>
        </div>

        {/* ==== JUDUL ==== */}
        <div>
          <label className="text-sm font-semibold text-gray-800">
            Judul Pelaporan
          </label>
          <input
            readOnly
            value={ticketData.title || "-"}
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded text-gray-800"
          />
        </div>

        {/* ==== DATA ASET ==== */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Data Aset</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.asset?.nama_asset || "-"}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Nomor Seri</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.asset?.nomor_seri || "-"}
            </div>
          </div>
        </div>

        {/* ==== KATEGORI ASET ==== */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Kategori Aset</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.asset?.kategori || "-"}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">
              Sub-Kategori Aset
            </label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.asset?.subkategori_nama || "-"}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Jenis Aset</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.asset?.jenis_asset || "-"}
            </div>
          </div>
        </div>

        {/* ==== LOKASI ==== */}
        <div>
          <label className="font-semibold text-gray-800">Lokasi Kejadian</label>
          <div className="bg-gray-300 px-4 py-2 mt-1 rounded w-1/2">
            {ticketData.lokasi_kejadian || "-"}
          </div>
        </div>

        {/* ==== RISIKO ==== */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="font-semibold text-gray-800">Kategori Risiko</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.kategori_risiko_nama_asset || "-"}
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-800">Risiko Positif</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.kategori_risiko_selera_positif || "-"}
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-800">Risiko Negatif</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.kategori_risiko_selera_negatif || "-"}
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-800">Area Dampak</label>
            <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
              {ticketData.area_dampak_nama_asset || "-"}
            </div>
          </div>
        </div>

        {/* ==== DESKRIPSI PENGENDALIAN ==== */}
        <div>
          <label className="font-semibold text-gray-800">
            Deskripsi Pengendalian
          </label>
          <textarea
            readOnly
            value={ticketData.deskripsi_pengendalian_bidang || "-"}
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded"
          />
        </div>

        {/* ==== PILIH TEKNISI ==== */}
        <div>
          <label className="font-semibold text-gray-800">Pilih Teknisi</label>

          {loadingTeknisi ? (
            <p className="text-gray-500 text-sm mt-1">Memuat teknisi...</p>
          ) : (
            <>
              <select
                value={selectedTeknisi}
                onChange={(e) => setSelectedTeknisi(e.target.value)}
                className="mt-1 w-64 border px-3 py-2 rounded-lg text-gray-700"
              >
                <option value="" disabled hidden>
                  Pilih teknisi
                </option>

                {teknisiList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name} — {t.tag} (Sisa {t.remaining_quota})
                  </option>
                ))}
              </select>

              {/* Detail teknisi */}
              {selectedTeknisi && (
                <div className="flex items-center gap-3 mt-3 bg-gray-50 border border-gray-200 rounded px-3 py-2 w-fit">
                  <img
                    src={
                      teknisiList.find((t) => t.id === selectedTeknisi)
                        ?.profile_url || "/assets/default-avatar.png"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {teknisiList.find((t) => t.id === selectedTeknisi)
                        ?.full_name}
                    </span>

                    <span className="text-xs text-gray-600">
                      {teknisiList.find((t) => t.id === selectedTeknisi)?.tag} •{" "}
                      <b>
                        {teknisiList.find((t) => t.id === selectedTeknisi)?.level}
                      </b>
                    </span>

                    <span className="text-xs text-gray-500">
                      Sisa kuota:{" "}
                      {
                        teknisiList.find((t) => t.id === selectedTeknisi)
                          ?.remaining_quota
                      }
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ========================= RANGE TANGGAL ========================= */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Pengerjaan Awal</label>
            <input
  type="date"
  value={tglAwal}
  onChange={(e) => setTglAwal(e.target.value)}
  className="mt-1 w-full border px-3 py-2 rounded"
/>
          </div>
          <div>
            <label className="font-semibold text-gray-800">Sampai</label>
            <input
  type="date"
  value={tglAkhir}
  onChange={(e) => setTglAkhir(e.target.value)}
  className="mt-1 w-full border px-3 py-2 rounded"
/>
          </div>
        </div>

        {/* ==== RINCIAN MASALAH ==== */}
        <div>
          <label className="font-semibold text-gray-800">
            Rincian Masalah
          </label>
          <div className="bg-gray-300 px-4 py-2 mt-1 rounded">
            {ticketData.description}
          </div>
        </div>

        {/* ==== LAMPIRAN ==== */}
        <div>
          <label className="font-semibold text-gray-800">Lampiran File</label>

          <div className="mt-1 flex flex-col gap-2">
            {ticketData.files?.length > 0 ? (
              ticketData.files.map((file, i) => (
                <a
                  key={i}
                  href={file.file_url}
                  target="_blank"
                  className="flex items-center gap-2 bg-gray-100 p-2 rounded-md w-fit hover:bg-gray-200"
                >
                  <FileText className="w-5 h-5 text-[#0F2C59]" />
                  <span>{file.name}</span>
                </a>
              ))
            ) : (
              <span className="text-gray-500 text-sm">
                Tidak ada lampiran
              </span>
            )}
          </div>
        </div>

        {/* ==== PENYELESAIAN ==== */}
        <div>
          <label className="font-semibold text-gray-800">
            Penyelesaian yang Diharapkan
          </label>
          <textarea
            readOnly
            value={ticketData.expected_resolution || "-"}
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded"
          />
        </div>

        {/* ==== BUTTON ==== */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-400 rounded-lg bg-white"
          >
            Batalkan
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={handleDraft}
              className="text-[#0F2C59] underline hover:text-[#15397A] font-medium"
            >
              Simpan Draft
            </button>

            <button
  onClick={handleSubmit}
  disabled={loadingSubmit}
  className={`px-6 py-2 rounded-lg text-white 
    ${loadingSubmit 
      ? "bg-gray-400 cursor-not-allowed" 
      : "bg-[#0F2C59] hover:bg-[#15397A]"}
  `}
>
  {loadingSubmit ? "Memproses..." : "Kirim"}
</button>

          </div>
        </div>
      </div>
    </div>
  );
}
