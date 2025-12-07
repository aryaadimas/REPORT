import React from "react";
import { Paperclip } from "lucide-react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate } from "react-router-dom";

export default function Riwayat() {
  const navigate = useNavigate();

  const dataRiwayat = [
    {
      id: "LPR321336",
      nama: "Gangguan Router",
      tanggalSelesai: "17-07-2025",
      lampiran: [1],
      ajukanKembali: true,
    },
    {
      id: "LPR238129",
      nama: "Gangguan Printer",
      tanggalSelesai: "17-07-2025",
      lampiran: [1, 2, 3],
      ajukanKembali: false,
    },
    {
      id: "LYN643758",
      nama: "Permintaan File Bulanan",
      tanggalSelesai: "17-07-2025",
      lampiran: [1, 2],
      ajukanKembali: false,
    },
    {
      id: "LYN918222",
      nama: "Permintaan Printer",
      tanggalSelesai: "17-07-2025",
      lampiran: [1],
      ajukanKembali: true,
    },
    {
      id: "LPR283471",
      nama: "Gangguan WiFi",
      tanggalSelesai: "17-07-2025",
      lampiran: [1, 2],
      ajukanKembali: false,
    },
  ];

  const handleBeriRating = (item) => {
    navigate("/berirating", { state: { item } });
  };

  const handleLihatRating = (item) => {
    navigate("/lihatrating", { state: { item } });
  };

  const handleLihatRiwayat = (item) => {
    navigate("/lihathistory", { state: { item } });
  };

  return ( 
    <LayoutPegawai>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-4 pb-8">
          <div className="px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-[#0F2C59]">
                  Riwayat Laporan
                </h2>

                {dataRiwayat.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 mb-4 hover:shadow-sm transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="font-semibold text-gray-600">ID:</p>
                          <p className="text-gray-800">{item.id}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Nama:</p>
                          <p className="text-gray-800">{item.nama}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">
                            Tanggal Selesai:
                          </p>
                          <p className="text-gray-800">{item.tanggalSelesai}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {item.ajukanKembali ? (
                          <>
                            <button
                              onClick={() =>
                                navigate("/reopenpegawai", { state: { item } })
                              }
                              className="border border-red-400 text-red-500 px-3 py-1 rounded-lg text-xs hover:bg-red-50 transition whitespace-nowrap"
                            >
                              Ajukan Kembali
                            </button>
                            <button
                              onClick={() => handleBeriRating(item)}
                              className="border border-yellow-400 text-yellow-600 px-3 py-1 rounded-lg text-xs hover:bg-yellow-50 transition whitespace-nowrap"
                            >
                              Beri Rating
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleLihatRating(item)}
                            className="border border-yellow-400 text-yellow-600 px-3 py-1 rounded-lg text-xs hover:bg-yellow-50 transition whitespace-nowrap"
                          >
                            Lihat Rating
                          </button>
                        )}

                        <button
                          onClick={() => handleLihatRiwayat(item)}
                          className="bg-[#0F2C59] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#15397A] transition whitespace-nowrap"
                        >
                          Lihat Riwayat
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center mt-3">
                      <span className="font-semibold text-gray-600 mr-2">
                        Lampiran:
                      </span>
                      {item.lampiran.map((_, i) => (
                        <Paperclip
                          key={i}
                          size={16}
                          className="mx-1 text-[#0F2C59] cursor-pointer hover:text-[#15397A]"
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <p className="text-xs text-gray-500 mt-4">
                  Menampilkan data 1 sampai {dataRiwayat.length} dari{" "}
                  {dataRiwayat.length} data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPegawai>
  );
}
