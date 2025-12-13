import React, { useState, useEffect } from "react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

export default function LihatRating() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({});
  const [token, setToken] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      // Ambil token
      let storedToken =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("user_token");

      if (!storedToken && state?.token) {
        storedToken = state.token;
      }

      if (!storedToken) {
        setDataError("Token tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      setToken(storedToken);

      // Ambil data tiket
      let ticketItem = null;

      if (state?.item) {
        ticketItem = state.item;
      } else {
        const storedItem = localStorage.getItem("ticketData");
        if (storedItem) {
          try {
            ticketItem = JSON.parse(storedItem);
          } catch (error) {
            console.error("Error parsing stored item:", error);
          }
        }
      }

      if (!ticketItem || !ticketItem.ticket_id) {
        setDataError("Data rating tidak ditemukan.");
      }

      setItem(ticketItem || {});
      setLoading(false);
    };

    getData();
  }, [state]);

  const handleBack = () => {
    navigate("/riwayat");
  };

  if (dataError && !loading) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{dataError}</p>
            <button
              onClick={() => navigate("/riwayat")}
              className="bg-[#0F2C59] text-white px-6 py-2 rounded-lg hover:bg-[#15397A] transition"
            >
              Kembali ke Riwayat
            </button>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  if (loading) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59]"></div>
          </div>
          <p className="text-center text-gray-500 mt-4">
            Memuat data rating...
          </p>
        </div>
      </LayoutPegawai>
    );
  }

  return (
    <LayoutPegawai>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden max-w-5xl mx-auto">
              <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
                Lihat Rating
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium">
                    {item.id || "N/A"}
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-600 w-40">Judul</p>
                  <p className="text-gray-800 font-medium">
                    {item.nama || "N/A"}
                  </p>
                </div>
              </div>

              {/* Tampilkan Rating */}
              {item.rating && (
                <div className="mb-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    Rating Anda:
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={24}
                          className={`${
                            i < item.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-800">
                      {item.rating}/5
                    </span>
                  </div>
                  {item.rating_comment && (
                    <div className="mt-3">
                      <p className="font-semibold text-gray-600 mb-1">
                        Komentar:
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        {item.rating_comment}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detail Tiket (sama seperti di BeriRating) */}
              <div className="mb-6">
                <button
                  onClick={() => setShowDetail(!showDetail)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <p className="font-semibold text-gray-600 mb-1">
                    Detail Tiket
                  </p>
                  {showDetail ? (
                    <ChevronUp className="text-[#0F2C59]" size={20} />
                  ) : (
                    <ChevronDown className="text-[#0F2C59]" size={20} />
                  )}
                </button>

                {showDetail && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
                    {/* ... isi detail tiket sama seperti di BeriRating.jsx ... */}
                  </div>
                )}
              </div>

              <div className="flex justify-start">
                <button
                  onClick={handleBack}
                  className="bg-[#0F2C59] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#15397A] transition"
                >
                  Kembali ke Riwayat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPegawai>
  );
}
