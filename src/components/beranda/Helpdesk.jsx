import { useState, useRef, useEffect } from "react";

const BASE_URL = "https://service-desk-be-production.up.railway.app";

const Helpdesk = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ JANGAN tampilkan widget jika bukan pelapor
  if (!user || !["masyarakat", "user"].includes(user.role_name)) {
    return null;
  }

  // scroll otomatis
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // ===============================
  // SEND MESSAGE (PELAPOR → SEKSI)
  // ===============================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("opd_id", 1); // 👉 Dinas Kesehatan
      formData.append("message", newMessage);

      // DEBUG WAJIB (boleh dihapus kalau sudah yakin)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await fetch(`${BASE_URL}/chat/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // TOKEN USER
        },
        body: formData,
      });

      const result = await res.json();
      console.log("SEND CHAT RESPONSE:", result);

      // append ke UI (optimistic)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "user",
          content: newMessage,
          time: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
      alert("Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  // ===============================
  // WIDGET KECIL (TERTUTUP)
  // ===============================
  if (!isOpen) {
    return (
      <div
        className="fixed bottom-6 right-6 bg-white rounded-lg border p-4 flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-xl transition"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          💬
        </div>
        <div>
          <p className="font-semibold text-sm">Butuh Bantuan?</p>
          <p className="text-xs text-gray-500">Chat dengan Helpdesk</p>
        </div>
      </div>
    );
  }

  // ===============================
  // CHAT WINDOW
  // ===============================
  return (
    <div className="fixed bottom-6 right-6 bg-white w-80 rounded-2xl shadow-2xl border overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-[#0F2C59]">Helpdesk</h2>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>

      {/* MESSAGES */}
      <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            Mulai percakapan dengan helpdesk
          </p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-end">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl text-sm max-w-xs">
              <p>{msg.content}</p>
              <span className="block text-[10px] mt-1 opacity-80 text-right">
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSendMessage}
        className="flex gap-2 p-3 border-t"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tulis pesan..."
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
            sending ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default Helpdesk;
