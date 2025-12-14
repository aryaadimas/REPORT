import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutBidang from "../../components/Layout/LayoutBidang";

const RatingKepuasan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pelaporan");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  // ⭐ STAR COMPONENT
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              star <= rating ? "text-[#226597]" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // ===================================================================
  // 🔥 FETCH DATA FROM BACKEND
  // ===================================================================
  const fetchRatings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/bidang/ratings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setTableData(json.data || []);
    } catch (error) {
      console.error("Rating error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  // ===================================================================
  // Aksi lihat detail rating
  // ===================================================================
  const handleLihatRating = (item) => {
    navigate("/lihatratingbidang", { state: { ticket_id: item.ticket_id } })

  };

  // ===================================================================
  // UI STARTS HERE
  // ===================================================================
  return (
    <LayoutBidang>
      <div className="min-h-screen bg-gray-50">
        <main className="p-4 md:p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-[#226597]">
              Rating Kepuasan
            </h1>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            {/* Tabs + Refresh */}
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <div className="flex space-x-6">
                <button
                  className="pb-2 border-b-2 border-blue-600 font-semibold text-blue-600"
                >
                  Rating Kepuasan
                </button>
              </div>

              <button
                onClick={fetchRatings}
                className={`flex items-center space-x-2 bg-[#226597] text-white px-4 py-2 rounded-lg shadow ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v6h6M20 20v-6h-6"
                  />
                </svg>
                <span>Refresh</span>
              </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">

              {/* Header Desktop */}
              <div
                className="bg-[#226597] text-white p-4 hidden md:grid"
                style={{
                  gridTemplateColumns:
                    "1fr 0.8fr 0.8fr 1.2fr 0.8fr 0.6fr 0.3fr",
                }}
              >
                <div>Pengirim</div>
                <div>Tgl. Awal</div>
                <div>Tgl. Selesai</div>
                <div>Data Aset</div>
                <div>No Seri</div>
                <div>Rating</div>
                <div>Aksi</div>
              </div>

              {/* Body */}
              {tableData.map((item, index) => (
                <div
                  key={index}
                  className="p-4 hidden md:grid border-b"
                  style={{
                    gridTemplateColumns:
                      "1fr 0.8fr 0.8fr 1.2fr 0.8fr 0.6fr 0.3fr",
                  }}
                >
                  {/* Pengirim */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden">
                      {item.creator?.profile ? (
                        <img
                          src={item.creator.profile}
                          className="w-full h-full object-cover"
                          alt="avatar"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-200 text-blue-900">
                          {item.creator.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                    </div>
                    {item.creator?.full_name}
                  </div>

                  {/* Tanggal Awal */}
                  <div>{item.pengerjaan_awal?.slice(0, 10) || "-"}</div>

                  {/* Tanggal Akhir */}
                  <div>{item.pengerjaan_akhir?.slice(0, 10) || "-"}</div>

                  {/* Asset */}
                  <div>{item.asset?.nama_asset || "-"}</div>

                  {/* Nomor Seri */}
                  <div>{item.asset?.nomor_seri || "-"}</div>

                  {/* Rating */}
                  <div>
                    <StarRating rating={item.rating} />
                  </div>

                  {/* Aksi */}
                  <div>
                    <button
                      onClick={() => handleLihatRating(item)}
                      className="text-[#113F67] hover:text-blue-600"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </LayoutBidang>
  );
};

export default RatingKepuasan;
