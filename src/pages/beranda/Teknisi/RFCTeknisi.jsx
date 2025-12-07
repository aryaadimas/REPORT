import React, { useState } from "react";
import {
  PlusIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function RFCTeknisi() {
  const [activeTab, setActiveTab] = useState("Draft");
  const navigate = useNavigate(); // ✅ hook untuk navigasi

  // === Data Dummy ===
  const dataDraft = [
    { nama: "Lorem ipsum", tanggal: "23/09/2024" },
    { nama: "Lorem ipsum", tanggal: "23/09/2024" },
    { nama: "Lorem ipsum", tanggal: "23/09/2024" },
  ];

  const dataTerkirim = [
    { nama: "Lorem ipsum", tanggal: "25/09/2024", status: "Diproses"},
    { nama: "Lorem ipsum", tanggal: "19/09/2024", status: "Diproses" },
    { nama: "Lorem ipsum", tanggal: "17/09/2024", status: "Diproses" },
  ];

  const displayedData = activeTab === "Draft" ? dataDraft : dataTerkirim;

  // === Fungsi Navigasi ===
  const handleAdd = () => {
    navigate("/buatformrfc");
  };

  const handleEdit = (item) => {
    // bisa kirim data kalau mau (misal data dokumen)
    navigate("/editformrfc");
  };

  const handleLihat = (item) => {
    navigate("/lihatformrfc");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-6xl p-8">
        {/* === Tombol Tambah === */}
        <div className="flex items-start mb-6">
          <div className="flex flex-col items-center mr-8">
            <div
              onClick={handleAdd}
              className="bg-gray-100 shadow-md w-28 h-32 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
            >
              <PlusIcon className="w-8 h-8 text-[#0F2C59]" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              Tambah
            </span>
          </div>
        </div>

        {/* === Tabs === */}
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <div className="flex border-b">
            {["Draft", "Terkirim"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold transition relative ${
                  activeTab === tab
                    ? "text-[#0F2C59] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#0F2C59]"
                    : "text-gray-400 hover:text-[#0F2C59]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* === Table Header === */}
          <div className="flex justify-between items-center bg-[#0F2C59] text-white text-sm font-semibold px-5 py-3">
            <div className="w-1/2">Dokumen</div>
            {activeTab === "Draft" ? (
              <>
                <div className="w-1/4 text-center">Terakhir diubah</div>
                <div className="w-1/4 text-center">Aksi</div>
              </>
            ) : (
              <>
                <div className="w-1/4 text-center">Tanggal kirim</div>
                <div className="w-1/4 text-center">Status</div>
                <div className="w-1/4 text-center">Detail</div>
              </>
            )}
          </div>

          {/* === Table Content === */}
          <div className="p-4">
            {displayedData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3 mb-3 shadow-sm hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 w-1/2">
                  <DocumentTextIcon className="w-5 h-5 text-[#0F2C59]" />
                  <span className="text-sm text-gray-800">{item.nama}</span>
                </div>

                {activeTab === "Draft" ? (
                  <>
                    <div className="w-1/4 text-sm text-gray-600 text-center">
                      {item.tanggal}
                    </div>
                    <div className="w-1/4 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-[#0F2C59] hover:text-[#15397A]"
                      >
                        <PencilSquareIcon className="w-5 h-5 inline" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-1/4 text-sm text-gray-600 text-center">
                      {item.tanggal}
                    </div>
                    <div className="w-1/4 text-center">
                      <span className="bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        {item.status}
                      </span>
                    </div>
                    <div className="w-1/4 text-center">
                      <button
                        onClick={() => handleLihat(item)}
                        className="text-[#0F2C59] hover:text-[#15397A]"
                      >
                        <EyeIcon className="w-5 h-5 inline" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* === Info Data + Pagination === */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500 px-1">
              <span>
                Menampilkan data 1 sampai {displayedData.length} dari{" "}
                {displayedData.length} data
              </span>
              <div className="flex gap-2">
                <button className="px-2 py-1 border rounded-lg hover:bg-gray-100">
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button className="px-3 py-1 border rounded-lg bg-[#0F2C59] text-white">
                  1
                </button>
                <button className="px-2 py-1 border rounded-lg hover:bg-gray-100">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
