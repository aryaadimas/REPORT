import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { RefreshCcw } from "lucide-react";

export default function ArsipSeksi() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("pelaporan");
  const [loading, setLoading] = useState(false);
  const [dataPelaporan, setDataPelaporan] = useState([]);
  const [dataPelayanan, setDataPelayanan] = useState([]);

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // FETCH PELAPORAN
  const fetchPelaporan = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/tickets/seksi/finished-pelaporan-online`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      setDataPelaporan(result.data || []);
    } catch (error) {
      console.error("Error fetch pelaporan:", error);
    }
    setLoading(false);
  };

  // FETCH PELAYANAN
  const fetchPelayanan = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/tickets/seksi/finished-pengajuan-layanan`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      setDataPelayanan(result.data || []);
    } catch (error) {
      console.error("Error fetch pelayanan:", error);
    }
    setLoading(false);
  };

  // LOAD DEFAULT
  useEffect(() => {
    if (activeTab === "pelaporan") fetchPelaporan();
    if (activeTab === "pelayanan") fetchPelayanan();
  }, [activeTab]);

  const handleRefresh = () => {
    if (activeTab === "pelaporan") fetchPelaporan();
    if (activeTab === "pelayanan") fetchPelayanan();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0F2C59]">Daftar Arsip</h1>

      {/* TAB */}
      <div className="flex gap-6 border-b">
        <button
          onClick={() => setActiveTab("pelaporan")}
          className={`pb-2 text-lg font-medium ${
            activeTab === "pelaporan"
              ? "text-[#0F2C59] border-b-2 border-[#0F2C59]"
              : "text-gray-500"
          }`}
        >
          Pelaporan
        </button>
        <button
          onClick={() => setActiveTab("pelayanan")}
          className={`pb-2 text-lg font-medium ${
            activeTab === "pelayanan"
              ? "text-[#0F2C59] border-b-2 border-[#0F2C59]"
              : "text-gray-500"
          }`}
        >
          Pelayanan
        </button>
      </div>

      {/* REFRESH */}
      <button
        onClick={handleRefresh}
        className={`flex items-center gap-2 px-4 py-2 mb-3 rounded-lg text-sm font-medium transition
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0F2C59] hover:bg-[#15397A] text-white"
          }`}
      >
        <RefreshCcw
          className={`w-4 h-4 transition-transform ${
            loading ? "animate-spin" : ""
          }`}
        />
        {loading ? "Refreshing..." : "Refresh"}
      </button>

      {/* TABEL */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0F2C59] text-white">
            <tr>
              <th className="p-3 text-left">Nama Aset</th>
              <th className="p-3 text-left">Terakhir dilaporkan</th>
              <th className="p-3 text-left">Intensitas</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {(activeTab === "pelaporan" ? dataPelaporan : dataPelayanan).map(
              (item) => (
                <tr
                  key={item.asset.asset_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{item.asset.nama_asset}</td>
                  <td className="p-3">
                    {new Date(item.latest_report_date).toLocaleDateString(
                      "id-ID"
                    )}
                  </td>
                  <td className="p-3">{item.intensitas_laporan}</td>
                  <td className="p-3 text-green-700 font-semibold">selesai</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        navigate(`/detailarsip/${item.asset.asset_id}`)
                      }
                      className="p-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
