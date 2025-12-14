import React, { useEffect, useMemo, useState } from "react";
import LayoutBidang from "../../components/Layout/LayoutBidang";
import { FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function AksiTiket() {
  const navigate = useNavigate();
  const { ticketId } = useParams();

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== master data dropdown =====
  const [unitKerjaList, setUnitKerjaList] = useState([]);
  const [lokasiList, setLokasiList] = useState([]);
  const [subKategoriList, setSubKategoriList] = useState([]);

  // ===== loading submit asset =====
  const [savingAsset, setSavingAsset] = useState(false);

  // ===== form penolakan =====
  const [isRejected, setIsRejected] = useState(false);
  const [alasan, setAlasan] = useState("");

  // ===== form create asset =====
  const [assetForm, setAssetForm] = useState({
    unit_kerja_id: "",
    lokasi_id: "",
    nama_aset: "",
    kategori_aset: "", // "ti" / "non ti"
    sub_kategori_id: "",
  });

  // ================= PRIORITY STYLE =================
  const getPriorityStyle = (priority) => {
    if (!priority) return "bg-gray-300 text-gray-700";
    const p = String(priority).toLowerCase();
    if (p === "high" || p === "tinggi") return "bg-red-500 text-white";
    if (p === "medium" || p === "sedang") return "bg-yellow-400 text-white";
    if (p === "low" || p === "rendah") return "bg-green-500 text-white";
    return "bg-gray-300 text-gray-700";
  };

  // ================= STATUS STYLE (optional) =================
  const getStatusBadge = (status) => {
    if (!status) return "bg-gray-100 text-gray-700 border border-gray-200";
    const s = String(status).toLowerCase();
    if (s.includes("verified")) return "bg-green-100 text-green-700 border border-green-200";
    if (s.includes("pending")) return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    if (s.includes("reject") || s.includes("tolak")) return "bg-red-100 text-red-700 border border-red-200";
    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  // ================= FETCH DETAIL TIKET =================
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!token) throw new Error("Token tidak ada");
        if (!ticketId) throw new Error("ticketId tidak ada di params");

        const res = await fetch(`${BASE_URL}/api/tickets/bidang/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // biar keliatan jelas di console
          const txt = await res.text();
          console.error("Fetch detail gagal:", res.status, txt);
          setDetail(null);
          return;
        }

        const json = await res.json();
        setDetail(json.data || null);
      } catch (err) {
        console.error("Fetch detail tiket error:", err);
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [ticketId, token]);

  // ================= FETCH MASTER DATA (UNIT KERJA, LOKASI, SUB KATEGORI) =================
  useEffect(() => {
    const fetchMaster = async () => {
      try {
        if (!token) return;

        const [unitRes, lokasiRes, subRes] = await Promise.all([
          fetch(`${BASE_URL}/api/unit-kerja`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/assets/lokasi`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/sub-kategori`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        // Unit kerja
        if (unitRes.ok) {
          const unitJson = await unitRes.json();
          setUnitKerjaList(unitJson.data || []);
        } else {
          console.error("Fetch unit kerja gagal:", unitRes.status);
        }

        // Lokasi
        if (lokasiRes.ok) {
          const lokasiJson = await lokasiRes.json();
          setLokasiList(lokasiJson.data || []);
        } else {
          console.error("Fetch lokasi gagal:", lokasiRes.status);
        }

        // Sub kategori (response array langsung)
        if (subRes.ok) {
          const subJson = await subRes.json();
          setSubKategoriList(Array.isArray(subJson) ? subJson : (subJson.data || []));
        } else {
          console.error("Fetch sub kategori gagal:", subRes.status);
        }
      } catch (err) {
        console.error("Fetch master data error:", err);
      }
    };

    fetchMaster();
  }, [token]);

  // ================= PREFILL FORM (optional) =================
  // Kalau ticket sudah punya asset, kita isi default nama_aset/kategori/sub_kategori/lokasi dari detail
  useEffect(() => {
    if (!detail) return;

    setAssetForm((prev) => ({
      ...prev,
      nama_aset: prev.nama_aset || detail.asset?.nama_asset || "",
      kategori_aset: prev.kategori_aset || detail.asset?.kategori || "", // dari response: "ti"
      sub_kategori_id:
        prev.sub_kategori_id ||
        (detail.asset?.subkategori_id ? String(detail.asset.subkategori_id) : ""),
      // lokasi_id & unit_kerja_id biar user pilih manual
    }));
  }, [detail]);

  // ================= HANDLE FORM CHANGE =================
  const handleAssetChange = (e) => {
    const { name, value } = e.target;
    setAssetForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= VALIDASI CREATE ASSET =================
  const isAssetFormComplete = useMemo(() => {
    return (
      assetForm.unit_kerja_id &&
      assetForm.lokasi_id &&
      assetForm.nama_aset &&
      assetForm.kategori_aset &&
      assetForm.sub_kategori_id
    );
  }, [assetForm]);

  // ================= SUBMIT CREATE ASSET =================
  const handleCreateAsset = async () => {
    if (!ticketId) return;

    if (!isAssetFormComplete) {
      Swal.fire({
        icon: "warning",
        title: "Data aset belum lengkap",
        text: "Lengkapi Unit Kerja, Lokasi, Nama Aset, Kategori Aset, dan Sub Kategori Aset.",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    setSavingAsset(true);
    try {
      const payload = new URLSearchParams({
        unit_kerja_id: assetForm.unit_kerja_id,
        lokasi_id: assetForm.lokasi_id,
        nama_aset: assetForm.nama_aset,
        kategori_aset: assetForm.kategori_aset, // "ti" / "non ti"
        sub_kategori_id: assetForm.sub_kategori_id,
      });

      const res = await fetch(
        `${BASE_URL}/api/tickets/bidang/create-asset/${ticketId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: payload,
        }
      );

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Create asset gagal:", res.status, json);
        Swal.fire({
          icon: "error",
          title: "Gagal menyimpan aset",
          text: json?.message || "Terjadi kesalahan saat menyimpan aset.",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: json?.message || "Aset berhasil disimpan ke tiket.",
        confirmButtonColor: "#1e3a8a",
      });
    } catch (err) {
      console.error("Create asset error:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan jaringan saat menyimpan aset.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setSavingAsset(false);
    }
  };

  // ================= SUBMIT (verifikasi / tolak) - belum disambung endpoint =================
  const handleSubmit = () => {
    if (isRejected && !alasan.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Alasan wajib diisi",
        text: "Harap isi alasan penolakan terlebih dahulu.",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Perubahan status tiket akan disimpan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#f87171",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: sambungkan endpoint verifikasi / tolak bidang
        Swal.fire({
          title: "Berhasil",
          text: "Status tiket berhasil diperbarui.",
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        }).then(() => navigate("/dashboardbidang"));
      }
    });
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <LayoutBidang>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2C59]" />
        </div>
      </LayoutBidang>
    );
  }

  // ================= ERROR =================
  if (!detail) {
    return (
      <LayoutBidang>
        <div className="text-center text-gray-500 py-10">
          Data tiket tidak ditemukan
        </div>
      </LayoutBidang>
    );
  }

  // ================= RENDER =================
  return (
    <LayoutBidang>
      <div className="space-y-6 p-6">
        <div className="bg-white shadow-md rounded-2xl p-8 relative overflow-hidden">
          <div className="relative space-y-6">
            {/* Pengirim */}
            <div className="flex items-center">
              <label className="w-40 font-semibold text-gray-700">Pengirim</label>
              <div className="flex items-center gap-3">
                <img
                  src={detail.creator?.profile || "/assets/default-avatar.png"}
                  alt="Profil"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800">
                  {detail.creator?.full_name || "-"}
                </span>
              </div>
            </div>

            {/* ID Laporan */}
            <div className="flex items-center">
              <label className="w-40 font-semibold text-gray-700">ID Laporan</label>
              <div className="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 w-64 text-center">
                {detail.ticket_code || "-"}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <label className="w-40 font-semibold text-gray-700">Status</label>
              <div className={`px-4 py-2 rounded-md text-sm font-semibold ${getStatusBadge(detail.status_ticket_pengguna || detail.status)}`}>
                {detail.status_ticket_pengguna || detail.status || "-"}
              </div>
            </div>

            {/* Prioritas */}
            <div className="flex items-center">
              <label className="w-40 font-semibold text-gray-700">Prioritas</label>
              <div
                className={`w-64 text-white text-sm font-semibold text-center py-2 rounded-md shadow-sm ${getPriorityStyle(
                  detail.priority
                )}`}
              >
                {detail.priority || "-"}
              </div>
            </div>

            {/* Garis tipis pemisah */}
            <div className="border-t pt-4" />

            {/* Judul Pelaporan */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Judul Pelaporan</p>
              <input
                type="text"
                readOnly
                value={detail.title || "-"}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
              />
            </div>

            {/* Data Aset & Nomor Seri - 2 kolom */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Data Aset</p>
                <div className="bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700">
                  {detail.asset?.nama_asset || detail.subkategori_nama || "-"}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Nomor Seri</p>
                <div className="bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700">
                  {detail.asset?.nomor_seri || "-"}
                </div>
              </div>
            </div>

            {/* Kategori - Sub - Jenis (3 kolom) */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Kategori Aset</p>
                <div className="bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700">
                  {detail.asset?.kategori || "-"}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Sub-Kategori Aset</p>
                <div className="bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700">
                  {detail.asset?.subkategori_nama || detail.subkategori_nama || "-"}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Jenis Aset</p>
                <div className="bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700">
                  {detail.asset?.jenis_asset || "-"}
                </div>
              </div>
            </div>

            {/* Lokasi Kejadian */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Lokasi Kejadian</p>
              <div className="bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700 w-1/2">
                {detail.lokasi_kejadian || "-"}
              </div>
            </div>

            {/* Rincian masalah */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Rincian masalah</p>
              <textarea
                readOnly
                rows={3}
                className="w-full bg-gray-200 rounded-md px-4 py-2 text-sm text-gray-700"
                value={detail.description || "-"}
              />
            </div>

            {/* Lampiran file */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">Lampiran file</p>
              {detail.files?.length > 0 ? (
                detail.files.map((file, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      // sesuaikan kalau backend kamu pakai field lain
                      const url = file.file_url || file.url || file.file_path;
                      if (url) window.open(url, "_blank");
                    }}
                    className="flex items-center gap-2 rounded-md px-3 py-2 w-fit cursor-pointer hover:bg-gray-50"
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700 font-medium underline">
                      {file.file_name || "Lampiran"}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-500">Tidak ada lampiran</span>
              )}
            </div>

            {/* ✅ Penyelesaian yang Diharapkan (BARU) */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                Penyelesaian yang Diharapkan
              </p>
              <textarea
                readOnly
                rows={3}
                className="w-full bg-gray-200 rounded-md px-4 py-2 text-sm text-gray-700"
                value={detail.expected_resolution || "-"}
              />
            </div>

            {/* ===================== FORM CREATE ASSET (BARU) ===================== */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-base font-bold text-[#0F2C59]">
                Input Data Aset (Bidang)
              </h3>

              {/* Unit Kerja */}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Unit Kerja</p>
                <select
                  name="unit_kerja_id"
                  value={assetForm.unit_kerja_id}
                  onChange={handleAssetChange}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
                >
                  <option value="">Pilih Unit Kerja</option>
                  {unitKerjaList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lokasi */}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Lokasi (ID Lokasi)</p>
                <select
                  name="lokasi_id"
                  value={assetForm.lokasi_id}
                  onChange={handleAssetChange}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
                >
                  <option value="">Pilih Lokasi</option>
                  {lokasiList.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nama Aset */}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Nama Aset</p>
                <input
                  name="nama_aset"
                  value={assetForm.nama_aset}
                  onChange={handleAssetChange}
                  placeholder="Masukkan nama aset"
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
                />
              </div>

              {/* Kategori Aset */}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Kategori Aset</p>
                <select
                  name="kategori_aset"
                  value={assetForm.kategori_aset}
                  onChange={handleAssetChange}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
                >
                  <option value="">Pilih kategori</option>
                  <option value="ti">TI</option>
                  <option value="non ti">Non TI</option>
                </select>
              </div>

              {/* Sub Kategori Aset */}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Sub Kategori Aset</p>
                <select
                  name="sub_kategori_id"
                  value={assetForm.sub_kategori_id}
                  onChange={handleAssetChange}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
                >
                  <option value="">Pilih sub kategori</option>
                  {subKategoriList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Button simpan asset */}
              <div className="flex justify-end">
                <button
                  onClick={handleCreateAsset}
                  disabled={savingAsset}
                  className={`px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition
                    ${
                      savingAsset
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-[#226597] hover:bg-blue-600 text-white"
                    }`}
                >
                  {savingAsset ? "Menyimpan..." : "Simpan Data Aset"}
                </button>
              </div>
            </div>

            {/* ===================== TOGGLE TOLAK (LAMA) ===================== */}
            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-gray-800 font-medium">
                  <input
                    type="checkbox"
                    checked={isRejected}
                    onChange={(e) => setIsRejected(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Tolak
                </label>
              </div>

              {isRejected && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Alasan ditolak
                  </p>
                  <textarea
                    rows={3}
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    placeholder="Ketik disini"
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm resize-none"
                  />
                </div>
              )}
            </div>

            {/* Tombol aksi bawah (LAMA) */}
            <div className="flex justify-between items-center pt-4 border-t mt-4">
              <button
                onClick={() => navigate("/dashboardbidang")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
              >
                Batalkan
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-[#0F2C59] hover:bg-[#15397A] text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </LayoutBidang>
  );
}
