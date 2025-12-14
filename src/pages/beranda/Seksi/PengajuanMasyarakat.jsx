import { useState, useEffect } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function PengajuanMasyarakat() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [checked, setChecked] = useState(false);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // PRIORITAS: Low | Medium | High | Critical
  const [priority, setPriority] = useState("");

  // ================================
  // FETCH DETAIL TICKET
  // ================================
  useEffect(() => {
    fetchDetail();
  }, [id]);

  async function fetchDetail() {
    try {
      const res = await fetch(
        `https://service-desk-be-production.up.railway.app/api/tickets/seksi/detail/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const json = await res.json();
      console.log("DETAIL MASYARAKAT:", json);
      setDetail(json);
    } catch (err) {
      console.error("ERROR FETCH:", err);
    }
  }

  // ================================
  // HANDLE KIRIM / TOLAK
  // ================================
  async function handleActionMasyarakat() {
    if (submitting) return;

    // ================== MODE TOLAK ==================
    if (checked) {
      if (!reason.trim()) {
        return Swal.fire({
          icon: "error",
          title: "Alasan wajib diisi!",
          text: "Isi alasan penolakan terlebih dahulu.",
        });
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
            body: JSON.stringify({ reason }),
          }
        );

        if (!res.ok) throw new Error("Gagal menolak laporan");

        await Swal.fire({
          icon: "success",
          title: "Laporan ditolak",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate(-1);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.message,
        });
      } finally {
        setSubmitting(false);
      }

      return;
    }

    // ================== MODE KIRIM ==================
    if (!priority) {
      return Swal.fire({
        icon: "warning",
        title: "Prioritas belum dipilih!",
        text: "Pilih Low, Medium, High, atau Critical.",
      });
    }

    try {
      setSubmitting(true);

      // === STEP 1 — Update Priority ===
      const updateRes = await fetch(
        `https://service-desk-be-production.up.railway.app/api/tickets/${id}/priority/masyarakat`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ priority }),
        }
      );

      if (!updateRes.ok) {
        const errJson = await updateRes.json().catch(() => ({}));
        throw new Error(errJson?.detail || "Gagal update prioritas");
      }

      // === TIDAK ADA submit step ===
      // BE langsung ganti status_ticket_seksi menjadi Pending

      await Swal.fire({
        icon: "success",
        title: "Laporan terkirim",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(-1);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal mengirim laporan",
        text: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ================================
  // UI
  // ================================
  if (!detail) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59]">Detail Pengajuan</h1>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">

        {/* ================= PENGIRIM ================= */}
        <div className="grid grid-cols-[40%_60%] gap-x-8 gap-y-5">
          <div className="flex items-center gap-3">
            <label className="w-32 font-semibold">Pengirim</label>
            <div className="flex items-center gap-2">
              <img
                src={detail?.creator?.profile}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{detail?.creator?.full_name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-32 font-semibold">ID Laporan</label>
            <input
              readOnly
              value={detail.ticket_code}
              className="flex-1 bg-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="w-32 font-semibold">Email</label>
            <input
              readOnly
              value={detail.creator.email}
              className="flex-1 bg-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="w-32 font-semibold">NIK</label>
            <input
              readOnly
              value={detail.creator.nik}
              className="flex-1 bg-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        {/* ================= Judul ================= */}
        <div className="mt-8">
          <label className="font-semibold">Judul Pelaporan</label>
          <input
            readOnly
            value={detail.title}
            className="w-full bg-gray-300 mt-1 rounded-lg p-3"
          />
        </div>

        {/* ================= Deskripsi ================= */}
        <div className="mt-6">
          <label className="font-semibold">Rincian Masalah</label>
          <textarea
            readOnly
            value={detail.description}
            className="w-full bg-gray-300 mt-1 rounded-lg p-3 h-24"
          />
        </div>

        {/* ================= PRIORITAS ================= */}
        <div className="mt-8">
          <label className="font-semibold text-gray-800">
            Pilih Prioritas
          </label>

          <div className="grid grid-cols-4 gap-3 mt-3">
            {["Low", "Medium", "High", "Critical"].map((p) => (
              <div
                key={p}
                onClick={() => setPriority(p)}
                className={`cursor-pointer border rounded-lg px-4 py-2 text-center font-medium transition
                  ${
                    priority === p
                      ? "text-white " +
                        (p === "Low"
                          ? "bg-blue-600"
                          : p === "Medium"
                          ? "bg-yellow-500"
                          : p === "High"
                          ? "bg-orange-500"
                          : "bg-red-600")
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* ================= Lampiran ================= */}
        <div className="mt-8">
          <label className="font-semibold">Lampiran File</label>

          <div className="flex items-center gap-2 py-3">
            <PaperClipIcon className="w-5 h-5" />
            {detail.files.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {detail.files.map((file) => (
                  <button
                    key={file.attachment_id}
                    onClick={() => window.open(file.file_path, "_blank")}
                    className="text-blue-700 underline cursor-pointer text-sm"
                  >
                    Lihat lampiran
                  </button>
                ))}
              </div>
            ) : (
              <span className="italic text-gray-500">Tidak ada lampiran</span>
            )}
          </div>

          {/* Reject */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <p className="font-medium">Tolak laporan ini</p>
          </div>

          {checked && (
            <textarea
              placeholder="Masukkan alasan menolak..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-200 p-3 mt-3 rounded-md"
            />
          )}
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Kembali
          </button>

          <div className="flex gap-3">
            <button
              onClick={() =>
                Swal.fire({
                  icon: "success",
                  title: "Berhasil disimpan ke draft",
                  timer: 1500,
                  showConfirmButton: false,
                }).then(() => navigate(-1))
              }
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              disabled={submitting}
            >
              Simpan Draft
            </button>

            <button
              onClick={handleActionMasyarakat}
              disabled={submitting}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                checked
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#0F2C59] hover:bg-[#15397A]"
              }`}
            >
              {submitting
                ? "Memproses..."
                : checked
                ? "Tolak"
                : "Kirim"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
