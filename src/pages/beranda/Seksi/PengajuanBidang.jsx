import React, { useState, useRef, useEffect } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function PengajuanBidang() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [urgensi, setUrgensi] = useState(2); // 1–3
  const [dampak, setDampak] = useState(2);  // 1–3

  const [detail, setDetail] = useState(null);
  const fileInput = useRef(null);

  const [isRejected, setIsRejected] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ======================
  // FETCH DETAIL TICKET
  // ======================
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
        console.log("DETAIL TICKET:", json);
        setDetail(json);
      } catch (err) {
        console.error("Error fetching detail:", err);
      }
    }

    fetchDetail();
  }, [id]);

  // ======================
  // HITUNG PRIORITAS (FE only)
  // ======================
  const hasil = urgensi * dampak;

  let priority = "";
  if (hasil <= 2) priority = "Rendah";
  else if (hasil <= 4) priority = "Sedang";
  else if (hasil === 6) priority = "Tinggi";
  else priority = "Kritis";

  const priorityClasses = {
    Rendah: "border-green-500 text-green-700",
    Sedang: "border-yellow-500 text-yellow-600",
    Tinggi: "border-red-500 text-red-600",
    Kritis: "border-gray-700 text-gray-700",
  };

  const uploadLampiran = () => fileInput.current?.click();


  // ======================
  // AKSI KIRIM / TOLAK
  // ======================
  async function handleAction() {
    if (submitting) return;

    // ============ MODE TOLAK ============
    if (isRejected) {
      if (!reason.trim()) {
        Swal.fire({
          icon: "error",
          title: "Alasan wajib diisi!",
          text: "Harap isi alasan penolakan sebelum menolak laporan.",
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
            body: JSON.stringify({ reason }),
          }
        );

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(
            errJson?.detail || errJson?.message || "Gagal menolak tiket"
          );
        }

        await Swal.fire({
          icon: "success",
          title: "Laporan ditolak",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate(-1);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Gagal menolak laporan",
          text: err.message || "Terjadi kesalahan.",
        });
      } finally {
        setSubmitting(false);
      }

      return;
    }

    // ============ MODE KIRIM (UPDATE PRIORITY) ============
    try {
      setSubmitting(true);

      const res = await fetch(
        `https://service-desk-be-production.up.railway.app/api/tickets/${id}/priority`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            urgency: urgensi,
            impact: dampak,
          }),
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(
          errJson?.detail || errJson?.message || "Gagal update prioritas"
        );
      }

      // BE otomatis:
      // - simpan urgency & impact
      // - set status tiket jadi Pending
      // - kirim ke Bidang
      await Swal.fire({
        icon: "success",
        title: "Laporan terkirim ke Bidang",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate(-1);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal mengirim laporan",
        text: err.message || "Terjadi kesalahan.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Optional: loading state saat detail belum ada
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

      <div className="bg-white border rounded-2xl shadow p-8 space-y-8">
        {/* PENGIRIM */}
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <label className="w-40 text-gray-800 font-semibold">Pengirim</label>
            <div className="flex items-center gap-3">
              <img
                src={detail?.creator?.profile || "/default-avatar.png"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">
                {detail?.creator?.full_name || "-"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold text-gray-800">
              ID Laporan
            </label>
            <div className="bg-gray-300 rounded px-4 py-1.5 w-80 text-center">
              {detail?.ticket_code}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold text-gray-800">Status</label>
            <div className="bg-gray-300 rounded px-4 py-1.5 w-80 text-center">
              {detail?.status_ticket_seksi}
            </div>
          </div>
        </div>

        {/* JUDUL */}
        <div>
          <label className="font-semibold text-gray-800">Judul Pelaporan</label>
          <div className="bg-gray-300 rounded px-4 py-1.5 mt-1">
            {detail?.title}
          </div>
        </div>

        {/* BARIS 1 */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Data Aset</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">
              {detail?.asset?.nama_asset || "-"}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Nomor Seri</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">
              {detail?.asset?.nomor_seri || "-"}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Skor Risiko</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">-</div>
          </div>
        </div>

        {/* BARIS 2 */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-800">Kategori Aset</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">
              {detail?.asset?.kategori || "-"}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">
              Sub-Kategori Aset
            </label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">
              {detail?.asset?.subkategori_nama || "-"}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">Jenis Aset</label>
            <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">
              {detail?.asset?.jenis_asset || "-"}
            </div>
          </div>
        </div>

        {/* LOKASI */}
        <div>
          <label className="font-semibold text-gray-800">Lokasi Kejadian</label>
          <div className="bg-gray-300 rounded px-3 py-1.5 mt-1">
            {detail?.lokasi_kejadian || "-"}
          </div>
        </div>

        {/* URGENSI & DAMPAK */}
        <div className="grid grid-cols-2 gap-10 mt-6">
          {/* URGENSI */}
          <div>
            <label className="font-semibold text-gray-800">Urgensi</label>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm text-gray-600">Rendah</span>
              <div className="flex gap-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    onClick={() => setUrgensi(n)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border transition ${
                        urgensi === n
                          ? "bg-[#0F2C59] border-[#0F2C59]"
                          : "border-gray-400"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600">Tinggi</span>
            </div>
          </div>

          {/* DAMPAK */}
          <div>
            <label className="font-semibold text-gray-800">Dampak</label>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm text-gray-600">Rendah</span>
              <div className="flex gap-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    onClick={() => setDampak(n)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border transition ${
                        dampak === n
                          ? "bg-[#0F2C59] border-[#0F2C59]"
                          : "border-gray-400"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600">Tinggi</span>
            </div>
          </div>
        </div>

        {/* LEVEL PRIORITAS */}
        <div>
          <label className="font-semibold text-gray-800">Level Prioritas</label>
          <div className="mt-3">
            <div
              className={`px-5 py-1 rounded-lg border font-semibold w-fit ${
                priorityClasses[priority]
              }`}
            >
              {priority}
            </div>
          </div>
        </div>

        {/* RINCIAN MASALAH */}
        <div>
          <label className="font-semibold text-gray-800">Rincian Masalah</label>
          <textarea
            value={detail?.description || "-"}
            readOnly
            rows="3"
            className="w-full bg-gray-300 rounded px-4 py-2 mt-1"
          />
        </div>

        {/* LAMPIRAN */}
        <div>
          <label className="font-semibold text-gray-800">Lampiran File</label>

          <div className="flex items-center gap-2 mt-1">
            <PaperClipIcon className="w-5 h-5 text-gray-700" />
            {detail?.files?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {detail.files.map((file) => (
                  <button
                    key={file.attachment_id}
                    type="button"
                    onClick={() => window.open(file.file_path, "_blank")}
                    className="text-sm text-blue-700 underline"
                  >
                    Lihat lampiran
                  </button>
                ))}
              </div>
            ) : (
              <span className="italic text-gray-500">Tidak ada lampiran</span>
            )}
          </div>

        </div>

        {/* PENYELESAIAN */}
        <div>
          <label className="font-semibold text-gray-800">
            Penyelesaian yang Diharapkan
          </label>
          <textarea
            readOnly
            rows="2"
            className="w-full bg-gray-300 rounded px-4 py-2 mt-1"
            value={detail?.expected_resolution || "-"}
          />
        </div>

        {/* TOLAK LAPORAN */}
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isRejected}
              onChange={(e) => setIsRejected(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
            <label className="font-semibold text-gray-800 text-lg">
              Tolak Laporan
            </label>
          </div>

          {isRejected && (
            <div className="mt-4">
              <label className="font-semibold text-gray-800">
                Alasan Penolakan
              </label>
              <textarea
                rows="3"
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 mt-1"
                placeholder="Tuliskan alasan penolakan laporan..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white border border-gray-400 rounded-lg"
            disabled={submitting}
          >
            Batalkan
          </button>

          <div className="flex gap-4">
            <button
              onClick={() =>
                Swal.fire({
                  icon: "success",
                  title: "Laporan disimpan",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => navigate(-1))
              }
              className="px-6 py-2 bg-gray-300 rounded-lg"
              disabled={submitting}
            >
              Simpan Draft
            </button>

            <button
              onClick={handleAction}
              disabled={submitting}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                isRejected
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#0F2C59] hover:bg-[#15397A]"
              } ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Memproses..." : isRejected ? "Tolak" : "Kirim"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
