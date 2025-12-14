import LayoutBidang from "../../components/Layout/LayoutBidang";
import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const LihatRatingBidang = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ticket_id } = location.state || {};

  const BASE_URL = "https://service-desk-be-production.up.railway.app";
  const token = localStorage.getItem("token");

  const [ratingData, setRatingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH DETAIL RATING BY ID
  const fetchDetailRating = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/bidang/ratings/${ticket_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setRatingData(json);
    } catch (err) {
      console.error("Error fetching rating detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticket_id) fetchDetailRating();
  }, [ticket_id]);

  // STAR COMPONENT
  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < count ? "text-[#0F2C59]" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <LayoutBidang>
        <main className="p-6">
          <div className="text-center text-gray-500">Loading...</div>
        </main>
      </LayoutBidang>
    );
  }

  if (!ratingData) {
    return (
      <LayoutBidang>
        <main className="p-6">
          <div className="text-center text-red-500">Data tidak ditemukan.</div>
        </main>
      </LayoutBidang>
    );
  }

  return (
    <LayoutBidang>
      <main className="flex-1 p-4 md:p-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
          {/* TITLE */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F2C59] text-center mb-8">
            Detail Rating
          </h1>

          {/* PENGIRIM + ID TIKET */}
          <div className="space-y-4 mb-8">
            {/* Pengirim */}
            <div className="flex items-center">
              <label className="text-gray-600 text-sm font-medium w-32">
                Pengirim
              </label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {ratingData.creator?.profile ? (
                    <img
                      src={ratingData.creator.profile}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#226597] text-white font-bold">
                      {ratingData.creator?.full_name
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("")}
                    </div>
                  )}
                </div>
                <span className="font-medium text-gray-800">
                  {ratingData.creator?.full_name}
                </span>
              </div>
            </div>

            {/* ID Tiket */}
            <div className="flex items-center">
              <label className="text-gray-600 text-sm font-medium w-32">
                ID Tiket
              </label>
              <div className="bg-gray-200 px-5 py-2 rounded-lg text-gray-800 font-medium">
                {ratingData.ticket_code}
              </div>
            </div>
          </div>

          {/* RATING */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold block mb-2">
              Rating Kepuasan Pelayanan
            </label>
            <div className="flex gap-1">{renderStars(ratingData.rating)}</div>
          </div>

          {/* KOMENTAR */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold block mb-2">
              Komentar
            </label>
            <textarea
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-700 text-sm resize-none h-28"
              value={ratingData.comment || "-"}
              readOnly
            />
          </div>

          {/* DETAIL ASET */}
          <div className="space-y-4 mb-10">
            <h2 className="font-semibold text-gray-800 text-lg">
              Informasi Aset
            </h2>

            <div className="flex items-center">
              <label className="w-32 text-gray-600 font-medium">Aset</label>
              <div className="text-gray-800">{ratingData.asset?.nama_asset || "-"}</div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-gray-600 font-medium">Nomor Seri</label>
              <div className="text-gray-800">{ratingData.asset?.nomor_seri || "-"}</div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-gray-600 font-medium">
                Tanggal Mulai
              </label>
              <div className="text-gray-800">
                {ratingData.pengerjaan_awal?.slice(0, 10) || "-"}
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-gray-600 font-medium">
                Tanggal Selesai
              </label>
              <div className="text-gray-800">
                {ratingData.pengerjaan_akhir?.slice(0, 10) || "-"}
              </div>
            </div>
          </div>

          {/* BUTTON KEMBALI */}
          <div className="flex justify-start">
            <button
              onClick={() => navigate("/ratingkepuasan")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </main>
    </LayoutBidang>
  );
};

export default LihatRatingBidang;
