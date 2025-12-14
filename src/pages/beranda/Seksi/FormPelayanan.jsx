import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function FormPelayanan() {
  const navigate = useNavigate();
  const { ticket_id } = useParams();

  // ===== STATES =====
  const [ticketData, setTicketData] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedTeknisi, setSelectedTeknisi] = useState("");
  const [teknisiList, setTeknisiList] = useState([]);
  const [loadingTeknisi, setLoadingTeknisi] = useState(true);

  const [tglAwal, setTglAwal] = useState("");
  const [tglAkhir, setTglAkhir] = useState("");

  const [lampiranName, setLampiranName] = useState("");

  // ================= FETCH TICKET DETAIL =================
  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/seksi/verified-bidang/${ticket_id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        const json = await res.json();
        setTicketData(json);
      } catch (err) {
        console.error("Fetch detail error:", err);
        Swal.fire("Gagal memuat detail tiket", "", "error");
      } finally {
        setLoadingTicket(false);
      }
    }
    fetchDetail();
  }, [ticket_id]);

  // ================= FETCH LIST TEKNISI =================
  useEffect(() => {
    async function fetchTeknisi() {
      try {
        const res = await fetch(
          "https://service-desk-be-production.up.railway.app/api/teknisi/seksi",
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        const json = await res.json();
        setTeknisiList(json.data || []);
      } catch (err) {
        console.error("Teknisi error:", err);
        Swal.fire("Gagal memuat daftar teknisi", "", "error");
      } finally {
        setLoadingTeknisi(false);
      }
    }
    fetchTeknisi();
  }, []);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {
    if (!selectedTeknisi) return Swal.fire("Pilih teknisi dulu!", "", "warning");
    if (!tglAwal || !tglAkhir) return Swal.fire("Isi tanggal pengerjaan!", "", "warning");

    Swal.fire({
      title: "Yakin ingin mengirim?",
      text: "Teknisi akan ditugaskan untuk tiket pelayanan ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F2C59",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, Kirim!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        setLoadingSubmit(true);

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
        }).then(() => navigate(-1));
      } catch (err) {
        Swal.fire("Terjadi kesalahan!", "", "error");
      } finally {
        setLoadingSubmit(false);
      }
    });
  };

  const handleDraft = () => {
    Swal.fire({ title: "Draft disimpan", icon: "info" }).then(() => navigate(-1));
  };

  if (loadingTicket) return <p className="p-6 text-gray-500">Memuat detail tiket...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59] mb-3">Detail Pelayanan</h1>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-8 space-y-8">

        {/* ================= PENGIRIM ================= */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold">Pengirim</label>
          <div className="flex items-center gap-2">
            <img
              src={ticketData.creator.profile || "/assets/default-avatar.png"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{ticketData.creator.full_name}</span>
          </div>
        </div>

        {/* ================= ID LAPORAN ================= */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold">ID Laporan</label>
          <div className="bg-gray-300 px-4 py-1.5 rounded w-60 text-center">
            {ticketData.ticket_code}
          </div>
        </div>

        {/* ================= PRIORITAS ================= */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold">Prioritas</label>
          <div className="w-60 bg-green-500 text-white py-2 rounded text-center">
            {ticketData.priority}
          </div>
        </div>

        {/* ================= STATUS ================= */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold">Status</label>
          <div className="bg-gray-300 px-4 py-1.5 rounded w-60 text-center">
            {ticketData.status_ticket_seksi}
          </div>
        </div>

        {/* ================= JUDUL ================= */}
        <div>
          <label className="font-semibold">Judul Pelaporan</label>
          <input
            readOnly
            value={ticketData.title}
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded"
          />
        </div>

        {/* ================= PENEMPATAN ================= */}
        <div>
          <label className="font-semibold">Lokasi Penempatan</label>
          <input
            readOnly
            value={ticketData.lokasi_penempatan || "-"}
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded"
          />
        </div>

        {/* ================= UNIT & LOKASI ID ================= */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Unit Kerja</label>
            <div className="bg-gray-300 px-4 py-2 rounded mt-1">
              {ticketData.pengajuan_pelayanan?.unit_kerja_nama || "-"}
            </div>
          </div>
          <div>
            <label className="font-semibold">ID Lokasi</label>
            <div className="bg-gray-300 px-4 py-2 rounded mt-1">
              {ticketData.pengajuan_pelayanan?.lokasi_id || "-"}
            </div>
          </div>
        </div>

        {/* ================= NAMA, KAT, SUB ================= */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold">Nama Aset</label>
            <div className="bg-gray-300 px-4 py-2 rounded mt-1">
              {ticketData.pengajuan_pelayanan?.nama_aset_baru || "-"}
            </div>
          </div>
          <div>
            <label className="font-semibold">Kategori</label>
            <div className="bg-gray-300 px-4 py-2 rounded mt-1">
              {ticketData.pengajuan_pelayanan?.kategori_aset || "-"}
            </div>
          </div>
          <div>
            <label className="font-semibold">Sub-Kategori</label>
            <div className="bg-gray-300 px-4 py-2 rounded mt-1">
              {ticketData.pengajuan_pelayanan?.subkategori_nama || "-"}
            </div>
          </div>
        </div>

        {/* ================= PILIH TEKNISI ================= */}
        <div>
          <label className="font-semibold">Pilih Teknisi</label>

          {loadingTeknisi ? (
            <p className="text-gray-500 text-sm mt-1">Memuat teknisi...</p>
          ) : (
            <>
              <select
                value={selectedTeknisi}
                onChange={(e) => setSelectedTeknisi(e.target.value)}
                className="mt-1 w-64 border px-3 py-2 rounded"
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

              {selectedTeknisi && (
                <div className="flex items-center gap-3 mt-3 bg-gray-50 border p-2 rounded w-fit">
                  <img
                    src={
                      teknisiList.find((t) => t.id === selectedTeknisi)?.profile_url ||
                      "/assets/default-avatar.png"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">
                      {teknisiList.find((t) => t.id === selectedTeknisi)?.full_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {
                        teknisiList.find((t) => t.id === selectedTeknisi)
                          ?.tag
                      }{" "}
                      •{" "}
                      <b>
                        {
                          teknisiList.find((t) => t.id === selectedTeknisi)
                            ?.level
                        }
                      </b>
                    </p>
                    <p className="text-xs text-gray-500">
                      Sisa kuota:{" "}
                      {
                        teknisiList.find((t) => t.id === selectedTeknisi)
                          ?.remaining_quota
                      }
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ================= TANGGAL ================= */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Pengerjaan Awal</label>
            <input
              type="date"
              value={tglAwal}
              onChange={(e) => setTglAwal(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Sampai</label>
            <input
              type="date"
              value={tglAkhir}
              onChange={(e) => setTglAkhir(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* ================= RINCIAN MASALAH ================= */}
        <div>
          <label className="font-semibold">Rincian Masalah</label>
          <textarea
            readOnly
            rows="3"
            value={ticketData.description}
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded"
          />
        </div>

        {/* ================= LAMPIRAN ================= */}
        <div>
          <label className="font-semibold">Lampiran File</label>

          {ticketData.files.length > 0 ? (
            ticketData.files.map((f, i) => (
              <a
                key={i}
                href={f.file_url}
                target="_blank"
                className="flex items-center gap-2 bg-gray-100 p-2 mt-2 rounded-md w-fit hover:bg-gray-200"
              >
                <FileText className="w-5 h-5" />
                <span>{f.name}</span>
              </a>
            ))
          ) : (
            <p className="mt-1 text-gray-500 text-sm">Tidak ada lampiran</p>
          )}
        </div>

        {/* ================= PENYELESAIAN ================= */}
        <div>
          <label className="font-semibold">Penyelesaian yang Diharapkan</label>
          <textarea
            readOnly
            rows="2"
            value={ticketData.expected_resolution}
            className="mt-1 w-full bg-gray-300 px-4 py-2 rounded"
          />
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex justify-between border-t pt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-400 rounded-lg bg-white"
          >
            Batalkan
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={handleDraft}
              className="text-[#0F2C59] underline"
            >
              Simpan Draft
            </button>

            <button
              onClick={handleSubmit}
              disabled={loadingSubmit}
              className={`px-6 py-2 rounded-lg text-white ${
                loadingSubmit
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0F2C59] hover:bg-[#15397A]"
              }`}
            >
              {loadingSubmit ? "Memproses..." : "Kirim"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
