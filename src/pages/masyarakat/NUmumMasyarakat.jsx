import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NotifUmum() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcementData, setAnnouncementData] = useState(null);

  const notificationId = location.state?.notificationId || "umum-notification";

  useEffect(() => {
    const fetchAnnouncementData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/api/notifications/${notificationId}`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTc4NzE3MX0.Ig-aV0ofrI7srjWX4RLTXZkB0i00PYVxEnGtyjwfsOU",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.status === "success") {
            setAnnouncementData({
              title: data.message || "Pengumuman",
              message:
                "Dalam rangka memperingati Hari Jadi Kota Surabaya yang ke-727...",
              details:
                data.data?.message ||
                "Pengumuman umum untuk seluruh masyarakat",
              created_at: data.data?.created_at || "2025-07-01T14:52:46.848080",
              type: "announcement",
              activities: [
                "Upacara peringatan Hari Jadi Kota Surabaya di Balai Kota.",
                "Festival budaya dan pameran UMKM Surabaya.",
                "Gerakan bersih lingkungan serentak di 31 kecamatan.",
                "Malam puncak perayaan dengan konser rakyat di Taman Surya.",
              ],
            });
          } else {
            throw new Error("Failed to fetch announcement data");
          }
        } else {
          throw new Error("Announcement API not available");
        }
      } catch (err) {
        console.error("Error fetching announcement data:", err);
        setError(err.message);

        setAnnouncementData({
          title: "🎉 Peringatan Hari Jadi Kota Surabaya ke-727",
          message:
            "Dalam rangka memperingati Hari Jadi Kota Surabaya yang ke-727, kami mengajak seluruh pegawai, mitra, dan masyarakat Surabaya untuk bersama-sama memeriahkan momentum istimewa ini dengan semangat 'Surabaya Hebat, Tangguh, dan Berdaya Saing'.",
          details:
            "Berbagai kegiatan akan diselenggarakan sepanjang bulan Mei. Kami mengimbau seluruh OPD dan masyarakat untuk turut serta menjaga ketertiban, kebersihan, dan semangat gotong royong selama rangkaian kegiatan berlangsung.",
          created_at: "2025-07-01T14:52:46.848080",
          type: "announcement",
          activities: [
            "Upacara peringatan Hari Jadi Kota Surabaya di Balai Kota.",
            "Festival budaya dan pameran UMKM Surabaya.",
            "Gerakan bersih lingkungan serentak di 31 kecamatan.",
            "Malam puncak perayaan dengan konser rakyat di Taman Surya.",
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementData();
  }, [notificationId]);

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "5 bulan yang lalu";

    const createdTime = new Date(isoString);
    const now = new Date();
    const diffMs = now - createdTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 60) {
      return `${diffMins} menit yang lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else if (diffDays < 30) {
      return `${diffDays} hari yang lalu`;
    } else {
      return `${diffMonths} bulan yang lalu`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pengumuman...</p>
        </div>
      </div>
    );
  }

  if (error && !announcementData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/kotakmasukmasyarakat")}
            className="bg-[#226597] hover:bg-[#1a507a] text-white py-2 px-6 rounded-md text-sm font-medium transition-colors w-full"
          >
            Kembali ke Kotak Masuk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate("/kotakmasukmasyarakat")}
              className="inline-flex items-center gap-2 text-[#113F67] hover:text-blue-800 px-4 py-2 text-sm font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 bg-white shadow-sm hover:shadow-md mb-6"
            >
              <svg
                width="10"
                height="17"
                viewBox="0 0 10 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.41379 8.485L9.48479 15.556L8.07079 16.97L0.292786 9.192C0.105315 9.00447 0 8.75016 0 8.485C0 8.21984 0.105315 7.96553 0.292786 7.778L8.07079 0L9.48479 1.414L2.41379 8.485Z"
                  fill="#113F67"
                />
              </svg>
              Kembali
            </button>
          </div>
        </div>

        <div>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-300 p-6 md:p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-[#000000] mb-4">
                    {announcementData?.title?.includes("🎉")
                      ? "Pengumuman"
                      : announcementData?.title || "Pengumuman"}
                  </h1>
                  <div className="bg-[#226597] text-white px-4 py-1 rounded-2xl inline-block">
                    <span className="text-sm font-medium">Umum</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(announcementData?.created_at)}
                </div>
              </div>

              <div className="flex justify-center items-center py-6 md:py-8 mb-6">
                <img
                  src="/assets/Pengumuman.png"
                  alt="Pengumuman"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>

              <div className="space-y-6 text-left">
                <div className="text-gray-800">
                  <p className="font-semibold text-lg md:text-xl">
                    {announcementData?.title?.includes("🎉")
                      ? announcementData.title
                      : "🎉 Peringatan Hari Jadi Kota Surabaya ke-727"}
                  </p>
                  <div className="mt-4 text-sm md:text-base space-y-4">
                    <p>
                      {announcementData?.message ||
                        "Dalam rangka memperingati Hari Jadi Kota Surabaya yang ke-727, kami mengajak seluruh pegawai, mitra, dan masyarakat Surabaya untuk bersama-sama memeriahkan momentum istimewa ini dengan semangat 'Surabaya Hebat, Tangguh, dan Berdaya Saing'."}
                    </p>

                    <div className="space-y-3">
                      <p>
                        {announcementData?.activities
                          ? "Berbagai kegiatan akan diselenggarakan sepanjang bulan Mei, antara lain:"
                          : "Berbagai kegiatan akan diselenggarakan sepanjang bulan Mei, antara lain:"}
                      </p>
                      <div className="space-y-2">
                        {announcementData?.activities &&
                          announcementData.activities.map((activity, index) => {
                            const icons = ["🏛️", "🎭", "🌳", "🎉"];
                            return (
                              <p key={index} className="flex items-start gap-2">
                                <span>{icons[index] || "📌"}</span>
                                <span>{activity}</span>
                              </p>
                            );
                          })}
                      </div>
                    </div>

                    <p>
                      {announcementData?.details ||
                        "Kami mengimbau seluruh OPD dan masyarakat untuk turut serta menjaga ketertiban, kebersihan, dan semangat gotong royong selama rangkaian kegiatan berlangsung."}
                    </p>

                    <p className="font-semibold">
                      Selamat Hari Jadi Kota Surabaya ke-727!
                    </p>

                    <p>
                      Mari terus bersama membangun kota yang lebih maju, ramah,
                      dan berdaya saing global. 💚
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
