import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NotifMaintenance() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState(null);

  const notificationId =
    location.state?.notificationId || "maintenance-notification";

  useEffect(() => {
    const fetchMaintenanceData = async () => {
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
            setMaintenanceData({
              title: "Pengumuman Maintenance",
              message: data.message || "Maintenance sistem akan dilaksanakan",
              created_at: data.data?.created_at || "2025-12-04T14:52:46.848080",
              type: "maintenance",
            });
          } else {
            throw new Error("Failed to fetch notification data");
          }
        } else {
          throw new Error("Maintenance notification API not available");
        }
      } catch (err) {
        console.error("Error fetching maintenance data:", err);
        setError(err.message);

        setMaintenanceData({
          title: "Pengumuman Maintenance Terjadwal",
          message:
            "Dalam rangka meningkatkan kinerja dan keamanan sistem, Service Desk akan menjalani pemeliharaan (maintenance).",
          schedule_date: "5 November 2025",
          schedule_time: "08.00 - 16.00 WIB",
          details:
            "Selama waktu tersebut, akses ke sistem Service Desk mungkin terbatas. Disarankan untuk menyelesaikan aktivitas sebelum jadwal tersebut.",
          created_at: "2025-12-04T14:52:46.848080",
          type: "maintenance",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
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
          <p className="mt-4 text-gray-600">Memuat pengumuman maintenance...</p>
        </div>
      </div>
    );
  }

  if (error && !maintenanceData) {
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

        <div>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-300 p-6 md:p-8">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-[#000000] mb-4">
                    {maintenanceData?.title || "Pengumuman"}
                  </h1>
                  <div className="bg-[#226597] text-white px-4 py-1 rounded-2xl inline-block">
                    <span className="text-sm font-medium">Maintenance</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(maintenanceData?.created_at)}
                </div>
              </div>

              <div className="flex justify-center items-center py-6 md:py-8">
                <img
                  src="/assets/maintenance.png"
                  alt="Maintenance Information"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>

              <div className="mt-6 md:mt-8 space-y-6 text-left">
                <div className="text-gray-800">
                  <p className="font-semibold text-lg md:text-xl">
                    📢 Pengumuman Maintenance Terjadwal
                  </p>
                  <div className="mt-2 text-sm md:text-base space-y-3">
                    <p>
                      {maintenanceData?.message ||
                        "Dalam rangka meningkatkan kinerja dan keamanan sistem, Service Desk akan menjalani pemeliharaan (maintenance)."}
                    </p>

                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <span>🗓️</span>
                        <span>
                          Tanggal:{" "}
                          {maintenanceData?.schedule_date || "5 November 2025"}
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span>⏰</span>
                        <span>
                          Waktu:{" "}
                          {maintenanceData?.schedule_time ||
                            "08.00 - 16.00 WIB"}
                        </span>
                      </p>
                    </div>

                    <p className="mb-1">
                      {maintenanceData?.details ||
                        "Selama waktu tersebut, akses ke sistem Service Desk mungkin terbatas. Disarankan untuk menyelesaikan aktivitas sebelum jadwal tersebut."}
                    </p>
                    <p>Terima kasih atas pengertian Anda.</p>
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
