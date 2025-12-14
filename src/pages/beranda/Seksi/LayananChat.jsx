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

      // 🔑 MAPPING DATA SESUAI RESPONSE BE
      const mappedChats = (result || []).map((chat) => {
        const lastMsg = chat.messages?.[0]; // biasanya DESC (pesan terakhir)

        return {
          chat_id: chat.chat_id,
          user_id: chat.user_id,
          last_message: lastMsg?.message || "Belum ada pesan",
          last_role: lastMsg?.role,
          last_time: lastMsg?.sent_at,
          is_read: lastMsg?.is_read ?? true,
        };
      });

      setChatList(mappedChats);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  // === FILTER CHAT (sementara pakai user_id) ===
  const filteredChat = chatList.filter((chat) =>
    chat.user_id.toLowerCase().includes(search.toLowerCase())
  );

  // === BUKA DETAIL CHAT ===
  const handleOpenChat = (chat) => {
    navigate(`/layananpesan/${chat.chat_id}`, { state: { chat } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-5xl mx-auto">

        {/* === JUDUL === */}
        <h1 className="text-3xl font-bold text-[#0F2C59] mb-6">Helpdesk</h1>

        {/* === SEARCH BAR === */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Cari ID pelapor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-5 py-3 pr-12 text-sm bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-[#0F2C59] absolute right-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* === LIST CHAT === */}
        <div className="flex flex-col gap-3">
          {loading && (
            <p className="text-center text-gray-500 py-4">Memuat chat...</p>
          )}

          {!loading && filteredChat.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Tidak ada chat ditemukan.
            </p>
          )}

          {!loading &&
            filteredChat.map((chat) => (
              <div
                key={chat.chat_id}
                onClick={() => handleOpenChat(chat)}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:bg-gray-50 transition cursor-pointer"
              >
                {/* AVATAR */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-[#0F2C59]">
                  {chat.user_id.slice(0, 2).toUpperCase()}
                </div>

                {/* INFO CHAT */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    Pelapor #{chat.user_id.slice(0, 6)}
                  </h3>

                  <p className="text-sm text-gray-500 truncate">
                    {chat.last_role === "user" ? "Pelapor: " : "Anda: "}
                    {chat.last_message || "Belum ada pesan"}
                  </p>
                </div>

                {/* UNREAD INDICATOR */}
                {!chat.is_read && (
                  <span className="w-3 h-3 bg-blue-600 rounded-full" />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
