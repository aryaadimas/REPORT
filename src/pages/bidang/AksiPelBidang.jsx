import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayoutBidang from "../../components/Layout/LayoutBidang";

export default function AksiPelBidang() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  const authHeader = {
    Authorization: token?.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`,
    Accept: "application/json",
  };

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  const [kategoriRisiko, setKategoriRisiko] = useState([]);
  const [areaDampak, setAreaDampak] = useState([]);

  const [selectedRisiko, setSelectedRisiko] = useState("");
  const [resikoPositif, setResikoPositif] = useState("");
  const [resikoNegatif, setResikoNegatif] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [deskripsiPengendalian, setDeskripsiPengendalian] = useState("");

  const [isRevisi, setIsRevisi] = useState(false);
  const [alasanRevisi, setAlasanRevisi] = useState("");

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchDetailTicket();
    fetchKategoriRisiko();
    fetchAreaDampak();
    // eslint-disable-next-line
  }, []);

  const fetchDetailTicket = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/tickets/bidang/${ticket_id}`,
        { headers: authHeader }
      );
      const json = await res.json();
      setTicket(json.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil detail tiket");
    } finally {
      setLoading(false);
    }
  };

  const fetchKategoriRisiko = async () => {
    const res = await fetch(`${BASE_URL}/api/kategori-risiko`, {
      headers: authHeader,
    });
    const json = await res.json();
    setKategoriRisiko(json.data || []);
  };

  const fetchAreaDampak = async () => {
    const res = await fetch(`${BASE_URL}/api/area-dampak`, {
      headers: authHeader,
    });
    const json = await res.json();
    setAreaDampak(json.data || []);
  };

  /* ================= ACTION ================= */

  const handleTolak = async () => {
    if (!window.confirm("Yakin ingin menolak tiket ini?")) return;

    await fetch(
      `${BASE_URL}/api/tickets/bidang/reject/${ticket_id}`,
      { method: "PATCH", headers: authHeader }
    );

    alert("Tiket berhasil ditolak");
    navigate(-1);
  };

  const handleKirim = async () => {
    if (!selectedRisiko || !selectedArea || !deskripsiPengendalian.trim()) {
      alert(
        "Kategori Risiko, Area Dampak, dan Deskripsi Pengendalian wajib diisi"
      );
      return;
    }

    const endpoint =
      ticket.ticket_source === "Pegawai"
        ? `/api/tickets/bidang/verify/${ticket_id}`
        : `/api/tickets/bidang/verify/masyarakat/${ticket_id}`;

    const formData = new FormData();
    formData.append("kategori_risiko_id", Number(selectedRisiko));
    formData.append("area_dampak_id", Number(selectedArea));
    formData.append("deskripsi_pengendalian", deskripsiPengendalian);

    if (isRevisi) {
      formData.append("alasan_revisi", alasanRevisi);
    }

    await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: authHeader, // JANGAN set Content-Type
      body: formData,
    });

    alert("Tiket berhasil diverifikasi");
    navigate(-1);
  };

  if (loading) {
    return (
      <LayoutBidang>
        <div className="p-6">Memuat data...</div>
      </LayoutBidang>
    );
  }

  return (
    <LayoutBidang>
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info label="Pengirim" value={ticket.creator?.full_name} />
            <Info label="ID Laporan" value={ticket.ticket_code} />
            <div>
              <p className="text-sm text-gray-500">Prioritas</p>
              <span className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                {ticket.priority}
              </span>
            </div>
          </div>
        </div>

        {/* DETAIL TIKET */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <Input label="Judul Pelaporan" value={ticket.title} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Data Aset" value={ticket.asset?.nama_asset} />
            <Input label="Nomor Seri" value={ticket.asset?.nomor_seri} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Kategori Aset" value={ticket.asset?.kategori} />
            <Input label="Sub-Kategori" value={ticket.subkategori_nama} />
            <Input label="Jenis Aset" value={ticket.asset?.jenis_asset} />
          </div>
          <Input label="Lokasi Kejadian" value={ticket.lokasi_kejadian} />
          <Textarea label="Rincian Masalah" value={ticket.description} readOnly />
          <Textarea
            label="Penyelesaian yang Diharapkan"
            value={ticket.expected_resolution}
            readOnly
          />
        </div>

        {/* FORM AKSI */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              label="Kategori Risiko"
              value={selectedRisiko}
              onChange={(e) => {
                const r = kategoriRisiko.find(
                  (x) => x.id === Number(e.target.value)
                );
                setSelectedRisiko(e.target.value);
                setResikoPositif(r?.selera_positif || "-");
                setResikoNegatif(r?.selera_negatif || "-");
              }}
              options={kategoriRisiko}
            />
            <Input label="Resiko Positif" value={resikoPositif} />
            <Input label="Resiko Negatif" value={resikoNegatif} />
          </div>

          <Select
            label="Area Dampak"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            options={areaDampak}
          />

          <Textarea
            label="Deskripsi Pengendalian"
            value={deskripsiPengendalian}
            onChange={(e) => setDeskripsiPengendalian(e.target.value)}
            placeholder="Isi deskripsi pengendalian risiko..."
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRevisi}
              onChange={(e) => setIsRevisi(e.target.checked)}
            />
            Revisi
          </label>

          <Textarea
            label="Alasan Revisi"
            value={alasanRevisi}
            onChange={(e) => setAlasanRevisi(e.target.value)}
            disabled={!isRevisi}
            placeholder="Isi alasan revisi..."
          />

          <div className="flex justify-between pt-4">
            <button
              onClick={handleTolak}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Tolak
            </button>

            <button
              onClick={handleKirim}
              className="px-6 py-2 bg-[#0F2C59] text-white rounded"
            >
              Kirim
            </button>
          </div>
        </div>

      </div>
    </LayoutBidang>
  );
}

/* ================= COMPONENT ================= */

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

const Input = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <input
      readOnly
      value={value || "-"}
      className="w-full mt-1 p-2 bg-gray-100 rounded"
    />
  </div>
);

const Textarea = ({ label, value, onChange, disabled, placeholder, readOnly }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <textarea
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      className="w-full mt-1 p-2 bg-gray-100 rounded min-h-[100px]"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full mt-1 p-2 border rounded"
    >
      <option value="">Pilih</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.nama}
        </option>
      ))}
    </select>
  </div>
);
