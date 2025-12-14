import React, { useState, useEffect } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function PelayananBidang() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [detail, setDetail] = useState(null);
  const [prioritas, setPrioritas] = useState("Rendah");
  const [ditolak, setDitolak] = useState(false);
  const [alasanTolak, setAlasanTolak] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =========================================
  // FETCH DETAIL TIKET
  // =========================================
  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/seksi/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const json = await res.json();
        setDetail(json);

        // set default priority jika BE sudah punya
        if (json.priority) {
          if (json.priority === "Low") setPrioritas("Rendah");
          else if (json.priority === "Medium") setPrioritas("Sedang");
          else if (json.priority === "High") setPrioritas("Tinggi");
        }
      } catch (err) {
        console.error("ERROR DETAIL:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  // =========================================
  // MAPPING PRIORITY
  // =========================================


  // =========================================
  // SIMPAN DRAFT (FE ONLY)
  // =========================================
  const handleDraft = async () => {
  await Swal.fire({
    icon: "success",
    title: "Berhasil disimpan sebagai draft!",
    timer: 1500,
    showConfirmButton: false,
  });

  navigate(-1);  // ← balik ke dashboard / halaman sebelumnya
};


  // =========================================
  // TOLAK LAPORAN
  // =========================================
  const handleReject = async () => {
  if (!alasanTolak.trim()) {
    Swal.fire({
      icon: "error",
      title: "Alasan wajib diisi!",
      text: "Harap isi alasan penolakan laporan.",
    });
    return;
  }

  try {
    setSubmitting(true);

    const res = await fetch(
      `https://service-desk-be-production.up.railway.app/api/tickets/${id}/reject`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          reason: alasanTolak,
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Gagal menolak tiket");
    }

    await Swal.fire({
      icon: "success",
      title: "Tiket berhasil ditolak",
      showConfirmButton: false,
      timer: 1500,
    });

    navigate(-1); // tiket hilang dari dashboard pelayanan
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal menolak layanan",
      text: err.message,
    });
  } finally {
    setSubmitting(false);
  }
};


  const priorityMap = {
  "Rendah": "Low",
  "Sedang": "Medium",
  "Tinggi": "High",
};


  // =========================================
  // VERIFIKASI / KIRIM KE BIDANG
  // =========================================
  const handleSubmit = async () => {
  try {
    setSubmitting(true);               // ← penting

    const res = await fetch(
      `https://service-desk-be-production.up.railway.app/api/tickets/${id}/priority/pengajuan`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          priority: priorityMap[prioritas],
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Gagal mengirim tiket");
    }

    await Swal.fire({
      icon: "success",
      title: "Layanan berhasil dikirim",
      showConfirmButton: false,
      timer: 1500,
    });

    navigate(-1);
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal mengirim layanan",
      text: err.message,
    });
  } finally {
    setSubmitting(false);              // ← penting juga
  }
};



  // =========================================
  // LOADING
  // =========================================
  if (loading || !detail) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59]">Detail Pengajuan</h1>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-8">

        {/* ===================== PENGIRIM ===================== */}
        <div className="grid grid-cols-4 gap-y-5 gap-x-8">
          <p className="font-medium text-gray-700">Pengirim</p>
          <div className="col-span-3 flex items-center gap-3">
            <img
              src={detail.creator?.profile || "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold text-gray-800">
              {detail.creator?.full_name}
            </span>
          </div>

          <p className="font-medium text-gray-700">ID Laporan</p>
          <input
            readOnly
            value={detail.ticket_code}
            className="col-span-3 w-60 px-3 py-2 bg-gray-100 rounded-lg border"
          />

          <p className="font-medium text-gray-700">Status</p>
          <input
            readOnly
            value={detail.status_ticket_seksi}
            className="col-span-3 w-60 px-3 py-2 bg-gray-100 rounded-lg border"
          />
        </div>

        {/* ===================== JUDUL ===================== */}
        <div>
          <p className="font-medium text-gray-700 mb-1">Judul Pengajuan</p>
          <input
            readOnly
            value={detail.title}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
          />
        </div>

        {/* ===================== ASEET & LOKASI ===================== */}
        <div>
          <p className="font-medium text-gray-700 mb-1">Nama Aset</p>
          <select
  disabled
  className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
>
  <option>{detail?.asset?.subkategori_nama || "-"}</option>
</select>

        </div>

        <div>
          <p className="font-medium text-gray-700 mb-1">Lokasi Penempatan</p>
          <input
            readOnly
            value={detail.asset?.lokasi_asset || "-"}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
          />
        </div>

        {/* ===================== PRIORITAS ===================== */}
        <div>
          <p className="font-medium text-gray-700 mb-2">Level Prioritas</p>
          <div className="flex gap-4">
            {["Rendah", "Sedang", "Tinggi"].map((lvl) => (
              <div
                key={lvl}
                onClick={() => setPrioritas(lvl)}
                className={`px-4 py-2 rounded-lg border cursor-pointer transition ${
                  prioritas === lvl
                    ? lvl === "Rendah"
                      ? "border-green-500 bg-green-50"
                      : lvl === "Sedang"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {lvl}
              </div>
            ))}
          </div>
        </div>

        {/* ===================== RINCIAN ===================== */}
        <div>
          <p className="font-medium text-gray-700 mb-1">Rincian Masalah</p>
          <textarea
            readOnly
            value={detail.description}
            className="w-full h-28 px-3 py-2 bg-gray-100 rounded-lg border"
          />
        </div>

        {/* ===================== LAMPIRAN ===================== */}
        <div>
          <p className="font-medium text-gray-700 mb-1">Lampiran File</p>

          {detail.files?.length > 0 ? (
            detail.files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 cursor-pointer w-fit p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => window.open(file.file_path, "_blank")}
              >
                <PaperClipIcon className="w-5 h-5 text-[#0F2C59]" />
                <span className="text-[#0F2C59] font-medium">{file.filename}</span>
              </div>
            ))
          ) : (
            <p className="italic text-gray-500">Tidak ada lampiran</p>
          )}
        </div>

        {/* ===================== HARAPAN ===================== */}
        <div>
          <p className="font-medium text-gray-700 mb-1">
            Penyelesaian yang Diharapkan
          </p>
          <textarea
            readOnly
            value={detail.expected_resolution || "-"}
            className="w-full h-28 px-3 py-2 bg-gray-100 rounded-lg border"
          />
        </div>

        {/* ===================== TOLAK ===================== */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={ditolak}
              onChange={() => setDitolak(!ditolak)}
              className="w-5 h-5"
            />
            <p className="font-medium text-gray-700">Tolak</p>
          </div>

          {ditolak && (
            <textarea
              placeholder="Berikan alasan penolakan..."
              value={alasanTolak}
              onChange={(e) => setAlasanTolak(e.target.value)}
              className="w-full h-28 px-3 py-2 bg-white rounded-lg border focus:ring-[#0F2C59]"
            />
          )}
        </div>

        {/* ===================== BUTTON ===================== */}
<div className="flex justify-between items-center">
  {/* Tombol Batalkan */}
  <button
    onClick={() => navigate(-1)}
    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
    disabled={submitting}
  >
    Batalkan
  </button>

  <div className="flex items-center gap-3">
    {/* Simpan Draft */}
    <button
      onClick={handleDraft}
      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
      disabled={submitting}
    >
      Simpan Draft
    </button>

    {/* Kirim / Tolak */}
    <button
  onClick={ditolak ? handleReject : handleSubmit}
  disabled={submitting}
  className={`px-6 py-2 rounded-lg text-white font-medium transition
    ${submitting ? "opacity-60 cursor-not-allowed" : ""}
    ${
      ditolak
        ? "bg-red-600 hover:bg-red-700"
        : "bg-[#0F2C59] hover:bg-[#15397A]"
    }
  `}
>
  {submitting ? "Memproses..." : ditolak ? "Tolak" : "Kirim"}
</button>

  </div>
</div>


      </div>
    </div>
  );
}
