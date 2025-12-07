import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function LayananChat() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const dataChat = [
    {
      nama: "Sri Wulandari",
      pesan: "Hai, apakah sudah diperiksa jaringan di lantai 2?",
      foto: "/assets/shizuku.jpg",
    },
    {
      nama: "Budiono Siregar",
      pesan: "Sudah saya update laporan terakhir ya kak.",
      foto: "/assets/Bokuto.jpg",
    },
    {
      nama: "Yuliana Dewi",
      pesan: "Baik, akan segera kami tindak lanjuti.",
      foto: "/assets/Suika.jpg",
    },
    {
      nama: "Roni Surya",
      pesan: "Masalah printer sudah selesai diperbaiki.",
      foto: "/assets/shizuku.jpg",
    },
    {
      nama: "Wini Aprilia",
      pesan: "Kak, mohon konfirmasi kembali untuk aset yang rusak.",
      foto: "/assets/Bokuto.jpg",
    },
  ];

  const filteredChat = dataChat.filter((chat) =>
    chat.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleClick = (chat) => {
    // Arahkan ke halaman LayananPesan.jsx dan kirim data chat lewat state
    navigate("/layananpesan", { state: { chat } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-5xl mx-auto">
        {/* === Judul === */}
        <h1 className="text-3xl font-bold text-[#0F2C59] mb-6">Helpdesk</h1>

        {/* === Search Bar === */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Cari di sini"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-5 py-3 pr-12 text-sm bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-[#0F2C59] absolute right-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* === List Chat === */}
        <div className="flex flex-col gap-3">
          {filteredChat.map((chat, index) => (
            <div
              key={index}
              onClick={() => handleClick(chat)}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:bg-gray-50 transition cursor-pointer"
            >
              <img
                src={chat.foto}
                alt={chat.nama}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{chat.nama}</h3>
                <p className="text-sm text-gray-500 truncate w-[250px]">
                  {chat.pesan}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
