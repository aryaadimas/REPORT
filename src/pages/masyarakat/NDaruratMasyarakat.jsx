import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NotifDarurat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daruratData, setDaruratData] = useState(null);

  const notificationId =
    location.state?.notificationId || "darurat-notification";

  useEffect(() => {
    const fetchDaruratData = async () => {
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
            setDaruratData({
              title: data.data?.title || "Pengumuman Darurat",
              message:
                data.data?.message || "Gangguan jaringan pusat sedang terjadi",
              details:
                data.data?.details ||
                "Kami informasikan bahwa saat ini terjadi gangguan jaringan pada pusat data kota yang berdampak pada akses layanan tiket dan sistem internal di seluruh OPD. Akibat gangguan ini, perhitungan SLA (Service Level Agreement) untuk seluruh tiket dihentikan sementara hingga sistem kembali normal.",
              created_at: data.data?.created_at || "2025-12-04T14:52:46.848080",
              type: "darurat",
            });
          } else {
            throw new Error("Failed to fetch notification data");
          }
        } else {
          throw new Error("Darurat notification API not available");
        }
      } catch (err) {
        console.error("Error fetching darurat data:", err);
        setError(err.message);

        setDaruratData({
          title: "Gangguan Jaringan Pusat",
          message:
            "Kami informasikan bahwa saat ini terjadi gangguan jaringan pada pusat data kota yang berdampak pada akses layanan tiket dan sistem internal di seluruh OPD.",
          details:
            "Akibat gangguan ini, perhitungan SLA (Service Level Agreement) untuk seluruh tiket dihentikan sementara hingga sistem kembali normal. Tim teknis pusat saat ini sedang melakukan investigasi dan pemulihan jaringan secara menyeluruh. Perkiraan waktu pemulihan akan diinformasikan kembali setelah proses perbaikan mencapai tahap stabil.",
          created_at: "2025-12-04T14:52:46.848080",
          type: "darurat",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDaruratData();
  }, [notificationId]);

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "4 hari yang lalu";

    const createdTime = new Date(isoString);
    const now = new Date();
    const diffMs = now - createdTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} menit yang lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else {
      return `${diffDays} hari yang lalu`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pengumuman darurat...</p>
        </div>
      </div>
    );
  }

  if (error && !daruratData) {
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
      <div className="pt-4 pb-8">
        <div className="px-4 mb-6">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate("/kotakmasukmasyarakat")}
              className="inline-flex items-center gap-2 text-[#113F67] hover:text-blue-800 px-4 py-2 text-sm font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 bg-white shadow-sm hover:shadow-md"
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

        <div className="px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-300 p-8">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold text-[#000000] mb-4">
                    {daruratData?.title || "Pengumuman"}
                  </h1>
                  <div className="bg-[#226597] text-white px-4 py-1 rounded-2xl inline-block">
                    <span className="text-sm font-medium">Darurat</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(daruratData?.created_at)}
                </div>
              </div>

              <div className="flex justify-center items-center py-8">
                <img
                  src="/assets/Darurat.png"
                  alt="Darurat"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>

              <div className="mt-8 space-y-6 text-left">
                <div className="text-gray-800">
                  <p className="font-semibold text-lg">
                    ⚠️ Gangguan Jaringan Pusat
                  </p>
                  <div className="mt-2 text-sm space-y-4">
                    <p>
                      {daruratData?.message ||
                        "Kami informasikan bahwa saat ini terjadi gangguan jaringan pada pusat data kota yang berdampak pada akses layanan tiket dan sistem internal di seluruh OPD. Akibat gangguan ini, perhitungan SLA (Service Level Agreement) untuk seluruh tiket dihentikan sementara hingga sistem kembali normal."}
                    </p>

                    <p>
                      Tim teknis pusat saat ini sedang melakukan investigasi dan
                      pemulihan jaringan secara menyeluruh.
                    </p>

                    <p>
                      Perkiraan waktu pemulihan akan diinformasikan kembali
                      setelah proses perbaikan mencapai tahap stabil.
                    </p>

                    <p>
                      Kami mohon maaf atas ketidaknyamanan ini dan menghimbau
                      seluruh pengguna untuk tidak melakukan eskalasi tiket baru
                      sampai pengumuman pemulihan dikeluarkan.
                    </p>

                    <p>Terima kasih atas pengertian dan kerja samanya.</p>
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
