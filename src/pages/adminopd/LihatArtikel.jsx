import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOPD";

export default function LihatArtikel() {
  const navigate = useNavigate();

  // Dummy data artikel (nanti bisa diganti dari props atau backend)
  const artikel = {
    judul: "Panduan Cek Knowledge Base",
    penulis: "Friska Farinda",
    kategori: "Akun dan SSO",
    gambar:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=60",
    isi: `
      Aku benci manpro. Setiap tugasnya terasa seperti beban yang tak ada habisnya. 
      Aku benci hidupku, seolah semua hal bersekongkol membuatku lelah. Hari-hari terasa panjang, 
      penuh tekanan, dan tanpa arah yang jelas. Aku berusaha bertahan, tapi semakin lama rasanya 
      semakin hampa. Pikiran ini terus berputar, menanyakan kapan semua ini akan berakhir. 
      Aku berharap semua segera selesai, agar aku bisa bernapas lega, tanpa tuntutan, 
      tanpa rasa bersalah. Aku hanya ingin tenang, meski sejenak saja, tanpa bayangan tugas dan 
      penyesalan yang terus menghantui setiap malam
    `,
  };

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="pt-4 pb-8">
          {/* Content Container */}
          <div className="px-4 md:px-6">
            <div className="p-6 md:p-8 space-y-6">
              {/* Header */}
              <h1 className="text-3xl font-bold text-[#0F2C59]">
                {artikel.judul}
              </h1>
              <p className="text-gray-600 font-medium">
                Dari: {artikel.penulis}
              </p>

              {/* Kategori */}
              <div className="flex justify-end">
                <span className="bg-[#0F2C59] text-white text-sm px-3 py-1 rounded-lg font-semibold shadow">
                  {artikel.kategori}
                </span>
              </div>

              {/* Gambar */}
              <div className="rounded-xl overflow-hidden shadow-md">
                <img
                  src={artikel.gambar}
                  alt={artikel.judul}
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Isi Artikel */}
              <div className="bg-gray-50 rounded-xl shadow-inner p-6 leading-relaxed text-gray-800">
                {artikel.isi}
              </div>

              {/* Tombol Kembali */}
              <div className="pt-4">
                <button
                  onClick={() => navigate("/dashboardopd")}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow transition-all"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutOpd>
  );
}
