import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function LayananChat() {
  const [search, setSearch] = useState("");
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // === FETCH LIST CHAT UNTUK SEKSI ===
  const fetchChatList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/chat/opd`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      // Backend biasanya return list chat dalam result.data
      setChatList(result.data || []);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  // === FILTER CHAT BERDASARKAN SEARCH ===
  const filteredChat = chatList.filter((item) =>
    (item.user_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // === HANDLE KLIK MASUK KE DETAIL CHAT ===
  const handleOpenChat = (chat) => {
    navigate(`/layananpesan/${chat.chat_id}`, { state: { chat } });
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
            placeholder="Cari nama pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-5 py-3 pr-12 text-sm bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-[#0F2C59] absolute right-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* === List Chat === */}
        <div className="flex flex-col gap-3">
          
          {loading && (
            <p className="text-center text-gray-500 py-4">Memuat chat...</p>
          )}

          {!loading && filteredChat.length === 0 && (
            <p className="text-center text-gray-500 py-4">Tidak ada chat ditemukan.</p>
          )}

          {!loading &&
            filteredChat.map((chat, index) => (
              <div
                key={index}
                onClick={() => handleOpenChat(chat)}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:bg-gray-50 transition cursor-pointer"
              >
                {/* Foto User */}
                <img
                  src={
                    chat.user_profile || "/assets/default-avatar.png"
                  }
                  alt={chat.user_name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* Nama & Pesan Terakhir */}
                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-800">
                    {chat.user_name || "Pengguna Tanpa Nama"}
                  </h3>
                  <p className="text-sm text-gray-500 truncate w-[250px]">
                    {chat.last_message || "Belum ada pesan"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
