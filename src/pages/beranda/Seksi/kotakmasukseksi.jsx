import React, { useEffect, useState } from "react";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const BASE_URL = "https://service-desk-be-production.up.railway.app";

export default function KotakMasukSeksi() {
  const [activeTab, setActiveTab] = useState("semua");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingRead, setLoadingRead] = useState(false);

  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  /* =========================
      FETCH NOTIFICATIONS
  ========================== */
  const fetchNotifications = async () => {
    try {
      setLoadingList(true);
      const res = await fetch(`${BASE_URL}/api/notifications/seksi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error("Gagal fetch notifikasi:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* =========================
      UTIL
  ========================== */
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const formatTime = (date) =>
    new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  /* =========================
      DELETE NOTIFICATIONS
  ========================== */
  const handleDeleteClick = () => {
    if (!deleteMode) {
      setDeleteMode(true);
      return;
    }

    if (selected.length === 0) {
      Swal.fire("Oops", "Pilih pesan terlebih dahulu", "warning");
      return;
    }

    Swal.fire({
      title: "Hapus notifikasi?",
      text: "Pesan yang dipilih akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        setLoadingDelete(true);

        await Promise.all(
          selected.map((id) =>
            fetch(`${BASE_URL}/api/notifications/seksi/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );

        setData((prev) =>
          prev.filter((item) => !selected.includes(item.notification_id))
        );

        setSelected([]);
        setDeleteMode(false);

        Swal.fire("Berhasil", "Notifikasi dihapus", "success");
      } catch (err) {
        Swal.fire("Error", "Gagal menghapus notifikasi", "error");
      } finally {
        setLoadingDelete(false);
      }
    });
  };

  /* =========================
      MARK AS READ
  ========================== */
  const markAsRead = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/notifications/seksi/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData((prev) =>
        prev.map((item) =>
          item.notification_id === id ? { ...item, is_read: true } : item
        )
      );
    } catch (err) {
      console.error("Gagal tandai baca:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoadingRead(true);

      await fetch(`${BASE_URL}/api/notifications/seksi/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotifications();
    } catch (err) {
      console.error("Gagal tandai baca semua:", err);
    } finally {
      setLoadingRead(false);
    }
  };

  /* =========================
      FILTER TAB
  ========================== */
  const filteredData = data.filter((item) => {
    if (activeTab === "semua") return true;
    return item.notification_type === activeTab;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#0F2C59] mb-4">
        Kotak Masuk
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow">
        {/* TAB */}
        <div className="flex gap-3 mb-6">
          {[
            { id: "semua", label: "Semua" },
            { id: "ticket", label: "Tiket" },
            { id: "status", label: "Status" },
            { id: "announcemet", label: "Pengumuman" },
            { id: "war_room", label: "war room"}
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setDeleteMode(false);
                setSelected([]);
              }}
              className={`px-5 py-2 rounded-full border text-sm font-semibold transition
                ${
                  activeTab === tab.id
                    ? "bg-[#0F2C59] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handleDeleteClick}
            disabled={loadingDelete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white
              ${
                loadingDelete
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {loadingDelete ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <TrashIcon className="w-5 h-5" />
                {deleteMode ? "Hapus Sekarang" : "Hapus"}
              </>
            )}
          </button>

          <button
            onClick={markAllAsRead}
            disabled={loadingRead}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white
              ${
                loadingRead
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0F2C59] hover:bg-[#15397A]"
              }`}
          >
            <ArrowPathIcon
              className={`w-5 h-5 ${loadingRead ? "animate-spin" : ""}`}
            />
            {loadingRead ? "Memproses..." : "Tandai Baca Semua"}
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filteredData.map((item) => (
            <div
              key={item.notification_id}
              className={`flex items-start gap-4 p-5 border rounded-xl
                ${item.is_read ? "bg-white" : "bg-blue-50"}`}
            >
              {deleteMode && (
                <input
                  type="checkbox"
                  checked={selected.includes(item.notification_id)}
                  onChange={() =>
                    toggleSelect(item.notification_id)
                  }
                  className="mt-2 w-5 h-5 cursor-pointer"
                />
              )}

              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100">
                <DocumentTextIcon className="w-7 h-7 text-[#0F2C59]" />
              </div>

              <div
                className="flex-1 cursor-pointer"
                onClick={() => markAsRead(item.notification_id)}
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  {item.notification_type === "ticket"
                    ? "Tiket Masuk"
                    : "Notifikasi"}
                </h3>

                <p className="text-gray-600">{item.message}</p>

                <span className="inline-block mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg">
                  {item.notification_type}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                {formatTime(item.created_at)}
              </div>
            </div>
          ))}

          {!loadingList && filteredData.length === 0 && (
            <p className="text-center text-gray-400">
              Tidak ada notifikasi
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
