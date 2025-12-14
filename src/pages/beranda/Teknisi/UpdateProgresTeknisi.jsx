import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProgressTeknisi() {
  const navigate = useNavigate();
  const { ticket_id } = useParams();

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [initialStatus, setInitialStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH DETAIL TICKET
  // ======================================================
  const fetchDetail = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/tickets/teknisi/${ticket_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      setData(result);
      setStatus(result.status_ticket_teknisi);
      setInitialStatus(result.status_ticket_teknisi?.toLowerCase());
      setLoading(false);
    } catch (error) {
      console.error("Gagal fetch detail tiket:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [ticket_id]);

  // ======================================================
  // HANDLE UPDATE STATUS
  // ======================================================
  const handleSubmit = async () => {
    if (!status) return;

    const confirmed = await Swal.fire({
      title: "Apakah Anda yakin ingin menyimpan?",
      text: "Periksa kembali status yang Anda pilih!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#f87171",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batalkan",
    });

    if (!confirmed.isConfirmed) return;

    try {
      let endpoint = "";

      if (status === "Diproses") {
        endpoint = `${BASE_URL}/api/tickets/teknisi/${ticket_id}/process`;
      } else if (status === "Selesai") {
        endpoint = `${BASE_URL}/api/tickets/teknisi/${ticket_id}/complete`;
      } else {
        await Swal.fire({
          icon: "success",
          title: "Draft disimpan",
          text: "Perubahan disimpan sebagai draft.",
        });
        return;
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal update status");

      await Swal.fire({
        icon: "success",
        title: status === "Selesai" ? "Tiket Selesai!" : "Tiket Diproses!",
        text:
          status === "Selesai"
            ? "Tiket diselesaikan."
            : "Status diperbarui menjadi Diproses.",
      });

      if (status === "Selesai") {
        navigate("/arsipseksi");
      } else {
        navigate("/dashboardteknisi");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memperbarui status tiket.", "error");
    }
  };

  // ======================================================
  // HANDLE SAVE DRAFT
  // ======================================================
  const handleDraft = async () => {
    await Swal.fire({
      title: "Draft Disimpan",
      text: "Perubahan anda telah disimpan sementara.",
      icon: "success",
      confirmButtonColor: "#1e3a8a",
    });

    navigate("/dashboardteknisi");
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (loading || !data)
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-600">
        Memuat data...
      </div>
    );

  const creator = data.creator || {};
  const asset = data.asset || {};

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-2xl p-8 relative overflow-hidden">
        <div className="relative space-y-6">

          {/* Pengirim */}
          <div className="flex items-center">
            <label className="w-40 font-semibold text-gray-700">Pengirim</label>
            <div className="flex items-center gap-3">
              <img
                src={creator.profile}
                alt="Profil"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-medium text-gray-800">{creator.full_name}</span>
            </div>
          </div>

          {/* ID Laporan */}
          <div className="flex items-center">
            <label className="w-40 font-semibold text-gray-700">ID Laporan</label>
            <div className="bg-gray-300 px-4 py-2 rounded-md text-sm font-medium text-gray-700 w-64 text-center">
              {data.ticket_code}
            </div>
          </div>

          {/* Prioritas */}
          <div className="flex items-center">
            <label className="w-40 font-semibold text-gray-700">Prioritas</label>

            <div
              className={`w-64 text-white text-sm font-semibold text-center py-2 rounded-md shadow-sm 
              ${
                data.priority === "Critical"
                  ? "bg-red-600"
                  : data.priority === "High"
                  ? "bg-orange-500"
                  : data.priority === "Medium"
                  ? "bg-yellow-500"
                  : "bg-green-600"
              }`}
            >
              {data.priority}
            </div>
          </div>

          {/* Status Buttons */}
          <div className="flex items-center">
            <label className="w-40 font-semibold text-gray-700">Perbarui Status</label>

            <div className="flex gap-3">
              {["Draft", "Diproses", "Selesai"].map((s) => {
                const disabled =
                  (initialStatus === "draft" && s === "Selesai") ||
                  (initialStatus === "diproses" && s === "Draft");

                return (
                  <button
                    key={s}
                    disabled={disabled}
                    onClick={() => !disabled && setStatus(s)}
                    className={`px-5 py-2 rounded-lg border text-sm font-medium transition
                      ${status === s ? "bg-blue-100 border-blue-600 text-blue-700" : "border-gray-400 text-gray-600"}
                      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}
                    `}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4" />

          {/* Judul Pelaporan */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">Judul Pelaporan</p>
            <input
              readOnly
              value={data.title}
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
            />
          </div>

          {/* Asset & Seri */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Data Aset</p>
              <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700">
                {asset.nama_asset || "-"}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Nomor Seri</p>
              <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700">
                {asset.nomor_seri || "-"}
              </div>
            </div>
          </div>

          {/* Lokasi */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">Lokasi Kejadian</p>
            <div className="bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 w-1/2">
              {data.lokasi_kejadian || "-"}
            </div>
          </div>

          {/* Pengerjaan */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Pengerjaan awal</p>
              <input
                type="date"
                disabled
                value={data.pengerjaan_awal?.split("T")[0] || ""}
                className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Sampai</p>
              <input
                type="date"
                disabled
                value={data.pengerjaan_akhir?.split("T")[0] || ""}
                className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">Rincian Masalah</p>
            <textarea
              readOnly
              rows={3}
              value={data.description}
              className="w-full bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700"
            />
          </div>

          {/* Lampiran */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">Lampiran file</p>

            {data.files.length ? (
              data.files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{file}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Tidak ada lampiran</p>
            )}
          </div>

          {/* Expected Resolution */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">Penyelesaian yang Diharapkan</p>
            <textarea
              readOnly
              rows={3}
              value={data.expected_resolution || ""}
              className="w-full bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-700"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <button
              onClick={() => navigate("/dashboardteknisi")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
            >
              Batalkan
            </button>

            <div className="flex items-center gap-4">
              <button onClick={handleDraft} className="text-sm font-medium text-gray-700 hover:underline">
                Simpan draft
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#0F2C59] hover:bg-[#15397A] text-white rounded-lg text-sm font-medium shadow-sm"
              >
                Update
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
