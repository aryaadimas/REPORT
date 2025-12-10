import React, { useState, useRef, useEffect } from "react";
import { X, Send, Plus } from "lucide-react";

export default function HelpdeskPopup() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOPD, setSelectedOPD] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [token, setToken] = useState(null);
  const [opdList, setOpdList] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingOpd, setLoadingOpd] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [opdChats, setOpdChats] = useState({});
  const popupRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({
    x: window.innerWidth - 350,
    y: window.innerHeight - 500,
  });

  const [newMessage, setNewMessage] = useState("");

  const getPlaceholderLogo = () => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#0F2C59"/>
        <text x="20" y="20" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">OPD</text>
      </svg>
    `)}`;
  };

  const handleMouseDown = (e) => {
    if (popupRef.current && e.target.closest("#popup-header")) {
      setIsDragging(true);
      setOffset({
        x: e.clientX - popupRef.current.getBoundingClientRect().left,
        y: e.clientY - popupRef.current.getBoundingClientRect().top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  useEffect(() => {
    if (isChatOpen && isNewChat) {
      fetchOpdList();
    }
  }, [isChatOpen, isNewChat]);

  const fetchOpdList = async () => {
    setLoadingOpd(true);
    try {
      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/opd/dinas",
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedOpdList = data.data.map((opd) => ({
          id: opd.id,
          name: opd.nama,
          logo: opd.file_path || getPlaceholderLogo(),
        }));
        setOpdList(formattedOpdList);
      } else {
        setOpdList(getFallbackOpdList());
      }
    } catch (error) {
      setOpdList(getFallbackOpdList());
    } finally {
      setLoadingOpd(false);
    }
  };

  const getFallbackOpdList = () => [
    {
      id: 1,
      name: "Dinas Pendidikan",
      logo: getPlaceholderLogo(),
    },
    {
      id: 2,
      name: "Dinas Kesehatan",
      logo: getPlaceholderLogo(),
    },
    {
      id: 3,
      name: "Dinas Perhubungan",
      logo: getPlaceholderLogo(),
    },
    {
      id: 4,
      name: "Dinas Sosial",
      logo: getPlaceholderLogo(),
    },
    {
      id: 5,
      name: "Dinas Sumber Daya Air dan Bina Marga",
      logo: getPlaceholderLogo(),
    },
    {
      id: 6,
      name: "Dinas Perumahan Rakyat dan Kawasan Permukiman serta Pertanahan",
      logo: getPlaceholderLogo(),
    },
    {
      id: 7,
      name: "Dinas Pemadam Kebakaran dan Penyelamatan",
      logo: getPlaceholderLogo(),
    },
    {
      id: 8,
      name: "Dinas Perindustrian dan Tenaga Kerja",
      logo: getPlaceholderLogo(),
    },
    {
      id: 9,
      name: "Dinas Ketahanan Pangan dan Pertanian",
      logo: getPlaceholderLogo(),
    },
    {
      id: 10,
      name: "Dinas Perpustakaan dan Kearsipan",
      logo: getPlaceholderLogo(),
    },
    {
      id: 11,
      name: "Dinas Komunikasi dan Informatika",
      logo: getPlaceholderLogo(),
    },
    {
      id: 12,
      name: "Dinas Lingkungan Hidup",
      logo: getPlaceholderLogo(),
    },
    {
      id: 13,
      name: "Dinas Kependudukan dan Pencatatan Sipil",
      logo: getPlaceholderLogo(),
    },
    {
      id: 14,
      name: "Dinas Koperasi Usaha Kecil dan Menengah dan Perdagangan",
      logo: getPlaceholderLogo(),
    },
    {
      id: 15,
      name: "Dinas Kebudayaan, Kepemudaan dan Olah Raga serta Pariwisata",
      logo: getPlaceholderLogo(),
    },
    {
      id: 16,
      name: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
      logo: getPlaceholderLogo(),
    },
    {
      id: 17,
      name: "Satuan Polisi Pamong Praja",
      logo: getPlaceholderLogo(),
    },
    {
      id: 18,
      name: "Dinas Pemberdayaan Perempuan dan Perlindungan Anak",
      logo: getPlaceholderLogo(),
    },
  ];

  useEffect(() => {
    if (isChatOpen && !isNewChat && token) {
      fetchChatHistory();
    }
  }, [isChatOpen, isNewChat, token]);

  const fetchChatHistory = async () => {
    setLoadingChats(true);
    try {
      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/chat/user-history",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedChatHistory =
          data.data?.map((chat) => ({
            id: chat.chat_id,
            name: chat.opd_name || "OPD",
            lastMessage: chat.last_message || "Belum ada pesan",
            logo: chat.opd_icon || getPlaceholderLogo(),
            time: chat.last_message_time || "",
            opd_id: chat.opd_id,
          })) || [];

        setChatHistory(formattedChatHistory);

        const initialOpdChats = {};
        formattedChatHistory.forEach((chat) => {
          if (chat.id && chat.opd_id) {
            initialOpdChats[chat.opd_id] = {
              chatId: chat.id,
              messages: [],
              loaded: false,
            };
          }
        });
        setOpdChats((prev) => ({ ...prev, ...initialOpdChats }));
      } else {
        setChatHistory(getFallbackChatHistory());
      }
    } catch (error) {
      setChatHistory(getFallbackChatHistory());
    } finally {
      setLoadingChats(false);
    }
  };

  const getFallbackChatHistory = () => [
    {
      id: "dummy-1",
      name: "Dinas Pendidikan",
      lastMessage: "Terima kasih, laporan Anda sudah kami proses.",
      logo: getPlaceholderLogo(),
      opd_id: 1,
    },
    {
      id: "dummy-2",
      name: "Dinas Kesehatan",
      lastMessage: "Baik, kami akan menindaklanjuti laporan ini.",
      logo: getPlaceholderLogo(),
      opd_id: 2,
    },
    {
      id: "dummy-3",
      name: "Dinas Sosial",
      lastMessage: "Mohon tunggu, admin akan segera membalas.",
      logo: getPlaceholderLogo(),
      opd_id: 4,
    },
  ];

  const getCurrentMessages = () => {
    if (!selectedOPD || !selectedOPD.id) return [];
    return opdChats[selectedOPD.id]?.messages || [];
  };

  const saveMessagesToOpdChats = (opdId, messages, chatId = null) => {
    setOpdChats((prev) => ({
      ...prev,
      [opdId]: {
        ...prev[opdId],
        messages,
        chatId: chatId || prev[opdId]?.chatId || null,
        loaded: true,
      },
    }));
  };

  const handleStartNewChat = async () => {
    if (!selectedOPD) {
      alert("Silakan pilih OPD tujuan terlebih dahulu");
      return;
    }

    if (!selectedOPD.id) {
      alert("Data OPD tidak valid");
      return;
    }

    const currentMessages = getCurrentMessages();
    const hasExistingChat = opdChats[selectedOPD.id]?.chatId;

    if (!token) {
      const userMessage = {
        id: Date.now(),
        sender: "user",
        text: newMessage || "Halo, saya ingin bertanya",
      };

      const updatedMessages = [...currentMessages, userMessage];
      saveMessagesToOpdChats(selectedOPD.id, updatedMessages);

      setTimeout(() => {
        const autoReplyMessage = {
          id: Date.now() + 1,
          sender: "admin",
          text: "Pesan Anda telah diterima oleh Admin",
        };
        const finalMessages = [...updatedMessages, autoReplyMessage];
        saveMessagesToOpdChats(selectedOPD.id, finalMessages);
      }, 1000);

      setNewMessage("");
      return;
    }

    if (hasExistingChat) {
      await handleSendMessage();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("opd_id", selectedOPD.id);
      formData.append("message", newMessage || "Halo, saya ingin bertanya");

      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/chat/send",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActiveChatId(data.chat_id);

        const userMessage = {
          id: Date.now(),
          sender: "user",
          text: newMessage || "Halo, saya ingin bertanya",
        };

        const updatedMessages = [...currentMessages, userMessage];
        saveMessagesToOpdChats(selectedOPD.id, updatedMessages, data.chat_id);

        setTimeout(() => {
          const autoReplyMessage = {
            id: Date.now() + 1,
            sender: "admin",
            text: "Pesan Anda telah diterima oleh admin OPD.",
          };
          const finalMessages = [...updatedMessages, autoReplyMessage];
          saveMessagesToOpdChats(selectedOPD.id, finalMessages, data.chat_id);
        }, 1000);

        setNewMessage("");
      } else {
        const errorText = await response.text();

        if (response.status === 401) {
          alert("Sesi Anda telah habis. Silakan login kembali.");
          localStorage.removeItem("access_token");
          setToken(null);
        } else {
          alert(`Gagal memulai chat baru: ${response.statusText}`);
        }

        const userMessage = {
          id: Date.now(),
          sender: "user",
          text: newMessage || "Halo, saya ingin bertanya",
        };

        const updatedMessages = [...currentMessages, userMessage];
        saveMessagesToOpdChats(selectedOPD.id, updatedMessages);

        setTimeout(() => {
          const autoReplyMessage = {
            id: Date.now() + 1,
            sender: "admin",
            text: "Pesan Anda telah diterima oleh Admin",
          };
          const finalMessages = [...updatedMessages, autoReplyMessage];
          saveMessagesToOpdChats(selectedOPD.id, finalMessages);
        }, 1000);

        setNewMessage("");
      }
    } catch (error) {
      const userMessage = {
        id: Date.now(),
        sender: "user",
        text: newMessage || "Halo, saya ingin bertanya",
      };

      const updatedMessages = [...currentMessages, userMessage];
      saveMessagesToOpdChats(selectedOPD.id, updatedMessages);

      setTimeout(() => {
        const autoReplyMessage = {
          id: Date.now() + 1,
          sender: "admin",
          text: "Pesan Anda telah diterima oleh Admin",
        };
        const finalMessages = [...updatedMessages, autoReplyMessage];
        saveMessagesToOpdChats(selectedOPD.id, finalMessages);
      }, 1000);

      setNewMessage("");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!selectedOPD) {
      alert("Silakan pilih OPD tujuan terlebih dahulu");
      return;
    }

    const currentMessages = getCurrentMessages();
    const chatId = opdChats[selectedOPD.id]?.chatId;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: newMessage,
    };

    const updatedMessages = [...currentMessages, userMessage];
    saveMessagesToOpdChats(selectedOPD.id, updatedMessages, chatId);

    setNewMessage("");

    if (chatId && token) {
      try {
        const formData = new FormData();
        formData.append("message", newMessage);

        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/chat/${chatId}/send`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.chat_id && data.chat_id !== chatId) {
            saveMessagesToOpdChats(
              selectedOPD.id,
              updatedMessages,
              data.chat_id
            );
            setActiveChatId(data.chat_id);
          }

          setTimeout(() => {
            const autoReplyMessage = {
              id: Date.now() + 1,
              sender: "admin",
              text: "Pesan Anda telah diterima oleh Admin.",
            };
            const finalMessages = [...updatedMessages, autoReplyMessage];
            saveMessagesToOpdChats(
              selectedOPD.id,
              finalMessages,
              data.chat_id || chatId
            );
          }, 1000);
        } else {
          setTimeout(() => {
            const autoReplyMessage = {
              id: Date.now() + 1,
              sender: "admin",
              text: "Pesan Anda telah diterima ",
            };
            const finalMessages = [...updatedMessages, autoReplyMessage];
            saveMessagesToOpdChats(selectedOPD.id, finalMessages, chatId);
          }, 1000);
        }
      } catch (error) {
        setTimeout(() => {
          const autoReplyMessage = {
            id: Date.now() + 1,
            sender: "admin",
            text: "Pesan Anda telah diterima",
          };
          const finalMessages = [...updatedMessages, autoReplyMessage];
          saveMessagesToOpdChats(selectedOPD.id, finalMessages, chatId);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        const autoReplyMessage = {
          id: Date.now() + 1,
          sender: "admin",
          text: "Pesan Anda telah diterima oleh Admin",
        };
        const finalMessages = [...updatedMessages, autoReplyMessage];
        saveMessagesToOpdChats(selectedOPD.id, finalMessages, chatId);
      }, 1000);
    }
  };

  const loadChatHistory = async (chatId, opdId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `https://service-desk-be-production.up.railway.app/chat/history/${chatId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.messages.map((msg) => ({
          id: msg.message_id,
          sender: msg.role === "user" ? "user" : "admin",
          text: msg.message || "(Pesan dengan file)",
        }));

        saveMessagesToOpdChats(opdId, formattedMessages, chatId);
        setActiveChatId(chatId);

        const opd =
          opdList.find((o) => o.id == opdId) ||
          getFallbackOpdList().find((o) => o.id == opdId);

        if (opd) {
          setSelectedOPD(opd);
        }

        setIsNewChat(true);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleChatHistoryClick = (chat) => {
    if (chat.id && chat.opd_id) {
      loadChatHistory(chat.id, chat.opd_id);
    } else {
      const opd = {
        name: chat.name,
        logo: chat.logo,
        id: chat.opd_id,
      };
      setSelectedOPD(opd);

      const existingMessages = opdChats[chat.opd_id]?.messages || [];
      if (existingMessages.length === 0) {
        saveMessagesToOpdChats(chat.opd_id, []);
      }

      setActiveChatId(chat.id || null);
      setIsNewChat(true);
    }
  };

  const handleSelectOPD = (opd) => {
    if (selectedOPD && selectedOPD.id === opd.id) {
      return;
    }

    setSelectedOPD(opd);

    if (!opdChats[opd.id]) {
      saveMessagesToOpdChats(opd.id, []);
    }

    setDropdownOpen(false);
  };

  const handleBackToNewChat = () => {
    setSelectedOPD(null);
    setActiveChatId(null);
    setNewMessage("");
    setIsNewChat(true);
  };

  const currentMessages = getCurrentMessages();

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => {
            setIsChatOpen(true);
            setIsNewChat(false);
            setSelectedOPD(null);
            setActiveChatId(null);
            setNewMessage("");
          }}
          className="fixed bottom-6 right-6 bg-white text-[#0F2C59] px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold hover:bg-gray-50 transition"
        >
          <img src="/assets/hd.png" alt="chat" className="w-5 h-5" />
          Tanya Helpdesk
        </button>
      )}

      {isChatOpen && (
        <div
          ref={popupRef}
          onMouseDown={handleMouseDown}
          className="fixed w-80 h-[420px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col transition-all duration-200 z-[9999]"
          style={{
            top: pos.y,
            left: pos.x,
            cursor: isDragging ? "grabbing" : "default",
          }}
        >
          <div
            id="popup-header"
            className="bg-[#0F2C59] text-white px-4 py-3 flex items-center justify-between select-none cursor-grab"
          >
            <h2 className="font-semibold text-sm">Helpdesk</h2>
            <button
              onClick={() => {
                setIsChatOpen(false);
                setIsNewChat(false);
                setDropdownOpen(false);
                setSelectedOPD(null);
                setActiveChatId(null);
                setNewMessage("");
              }}
            >
              <X size={18} />
            </button>
          </div>

          {isNewChat ? (
            <div className="flex-1 p-4 flex flex-col min-h-0">
              <p className="text-sm text-gray-600 mb-2">
                Kami akan mengalihkan Anda ke helpdesk OPD yang ingin Anda
                hubungi
              </p>

              <p className="font-semibold text-sm mb-1">OPD Tujuan</p>

              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full border rounded-lg p-2 text-left text-sm shadow-sm flex items-center justify-between focus:ring-2 focus:ring-[#226597]"
                >
                  <span className="flex items-center gap-2">
                    {selectedOPD ? (
                      <>
                        <img
                          src={selectedOPD.logo}
                          alt={selectedOPD.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="truncate">{selectedOPD.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">
                        {loadingOpd ? "Memuat OPD..." : "Pilih OPD"}
                      </span>
                    )}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg overflow-y-auto"
                    style={{
                      maxHeight: "140px",
                      right: 0,
                      left: 0,
                    }}
                  >
                    {loadingOpd ? (
                      <div className="p-2 text-center text-gray-500 text-sm">
                        Memuat data OPD...
                      </div>
                    ) : (
                      opdList.map((opd, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectOPD(opd)}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          <img
                            src={opd.logo}
                            alt={opd.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="truncate">{opd.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col min-h-0 mt-3">
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 rounded-md max-h-[250px]">
                  {currentMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-center text-gray-400 text-sm">
                        {selectedOPD
                          ? `Belum ada pesan dengan ${selectedOPD.name}`
                          : "Pilih OPD untuk memulai chat"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2 rounded-lg max-w-[80%] break-words ${
                            msg.sender === "user"
                              ? "bg-[#0F2C59] text-white ml-auto"
                              : "bg-gray-200 text-gray-800"
                          }`}
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if (selectedOPD) {
                        handleSendMessage();
                      } else {
                        alert("Pilih OPD terlebih dahulu");
                      }
                    }
                  }}
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
                  disabled={!selectedOPD}
                />
                <button
                  onClick={() => {
                    if (selectedOPD) {
                      if (opdChats[selectedOPD.id]?.chatId) {
                        handleSendMessage();
                      } else {
                        handleStartNewChat();
                      }
                    } else {
                      alert("Pilih OPD terlebih dahulu");
                    }
                  }}
                  disabled={!selectedOPD}
                  className={`p-3 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                    selectedOPD
                      ? "bg-[#0F2C59] hover:bg-[#15397A] text-white hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  title={
                    selectedOPD ? "Kirim Pesan" : "Pilih OPD terlebih dahulu"
                  }
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-3 flex flex-col min-h-0">
              <button
                onClick={handleBackToNewChat}
                className="bg-[#0F2C59] text-white flex items-center justify-center gap-2 py-2 rounded-lg mb-3 text-sm font-medium shadow hover:bg-[#15397A] flex-shrink-0"
              >
                <Plus size={16} /> Chat Baru
              </button>

              <div className="flex-1 overflow-y-auto min-h-0">
                {loadingChats ? (
                  <div className="text-center py-4 text-gray-500 h-full flex items-center justify-center">
                    Memuat riwayat chat...
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 h-full flex items-center justify-center">
                    Belum ada riwayat chat
                  </div>
                ) : (
                  <div className="divide-y text-sm">
                    {chatHistory.map((chat, i) => (
                      <div
                        key={i}
                        onClick={() => handleChatHistoryClick(chat)}
                        className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50"
                      >
                        <img
                          src={chat.logo}
                          alt={chat.name}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-[13px] truncate">
                            {chat.name}
                          </p>
                          <p className="text-gray-500 text-[12px] truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                        <span className="text-[11px] text-gray-400 flex-shrink-0">
                          {chat.time}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
