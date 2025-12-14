import { Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NotifDibuat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationData, setNotificationData] = useState(null);

  const notificationId =
    location.state?.notificationId || "2f8c96fe-621d-48d1-90ec-c16791379ace";

  useEffect(() => {
    const fetchNotificationData = async () => {
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "success") {
          setNotificationData(data.data);
        } else {
          throw new Error("Failed to fetch notification data");
        }
      } catch (err) {
        console.error("Error fetching notification data:", err);
        setError(err.message);

        setNotificationData({
          ticket_code: "SVD-PO-0078-MA",
          request_type: "pelaporan_online",
          nama_dinas: "Dinas Perhubungan",
          status_ticket_pengguna: "Menunggu Diproses",
          message:
            "Status tiket SVD-PO-0078-MA berubah dari Menunggu Diproses ke Menunggu Diproses",
          created_at: "2025-12-08T14:52:46.848080",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationData();
  }, [notificationId]);

  const ticketData = {
    noTiket: notificationData?.ticket_code || "LYN215491",
    pin: "228973",
    jenisLayanan:
      notificationData?.request_type === "pelaporan_online"
        ? "Pelaporan Online"
        : notificationData?.request_type || "Pengajuan Pelayanan",
    jenisPermohonan: notificationData?.nama_dinas || "Reset Password",
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "1 jam yang lalu";

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
          <p className="mt-4 text-gray-600">Memuat data notifikasi...</p>
        </div>
      </div>
    );
  }

  if (error && !notificationData) {
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
                    Tiket Dibuat
                  </h1>
                  <div className="bg-[#226597] text-white px-4 py-1 rounded-2xl inline-block">
                    <span className="text-sm font-medium">Tiket</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(notificationData?.created_at)}
                </div>
              </div>

              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <img
                      src="/assets/Logo Report.png"
                      alt="Report Logo"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h1 className="text-xl md:text-2xl font-semibold text-[#000000] text-center">
                    Permohonan Anda Telah Berhasil Dikirim
                  </h1>
                  <div className="text-gray-600 text-sm text-center mt-3">
                    <p>
                      Terima kasih atas permohonan Anda. Permohonan telah
                      tercatat, kami akan menindaklanjuti sesuai
                    </p>
                    <p>
                      prosedur dalam waktu yang ditentukan. Silakan pantau
                      perkembangan permohonan melalui menu
                    </p>
                    <p>Cek Status Layanan.</p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <div className="space-y-8">
                      <div className="text-center mb-2">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-sm font-medium text-gray-600">
                            No. Tiket
                          </span>
                          <div className="bg-[#226597] text-white px-6 py-3 rounded-lg inline-flex justify-center min-w-[200px]">
                            <span className="text-lg font-bold">
                              {ticketData.noTiket}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div>
                          <div className="flex items-start gap-4">
                            <svg
                              width="70"
                              height="70"
                              viewBox="0 0 72 72"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g filter="url(#filter0_d_1104_3295)">
                                <rect
                                  x="20"
                                  y="20"
                                  width="32"
                                  height="32"
                                  rx="16"
                                  fill="white"
                                  shapeRendering="crispEdges"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M31.989 27.3311C31.7485 27.8831 31.6246 28.4789 31.625 29.0811C31.625 29.5452 31.8094 29.9903 32.1376 30.3185C32.4658 30.6467 32.9109 30.8311 33.375 30.8311H38.625C39.0891 30.8311 39.5342 30.6467 39.8624 30.3185C40.1906 29.9903 40.375 29.5452 40.375 29.0811C40.375 28.4589 40.2455 27.8666 40.011 27.3311H41.25C41.7141 27.3311 42.1592 27.5154 42.4874 27.8436C42.8156 28.1718 43 28.6169 43 29.0811V42.2061C43 42.6702 42.8156 43.1153 42.4874 43.4435C42.1592 43.7717 41.7141 43.9561 41.25 43.9561H30.75C30.2859 43.9561 29.8408 43.7717 29.5126 43.4435C29.1844 43.1153 29 42.6702 29 42.2061V29.0811C29 28.6169 29.1844 28.1718 29.5126 27.8436C29.8408 27.5154 30.2859 27.3311 30.75 27.3311H31.989ZM36 36.9561H33.375C33.1429 36.9561 32.9204 37.0482 32.7563 37.2123C32.5922 37.3764 32.5 37.599 32.5 37.8311C32.5 38.0631 32.5922 38.2857 32.7563 38.4498C32.9204 38.6139 33.1429 38.7061 33.375 38.7061H36C36.2321 38.7061 36.4546 38.6139 36.6187 38.4498C36.7828 38.2857 36.875 38.0631 36.875 37.8311C36.875 37.599 36.7828 37.3764 36.6187 37.2123C36.4546 37.0482 36.2321 36.9561 36 36.9561ZM38.625 33.4561H33.375C33.152 33.4563 32.9375 33.5417 32.7753 33.6948C32.6131 33.8479 32.5155 34.0571 32.5025 34.2798C32.4894 34.5024 32.5618 34.7216 32.705 34.8927C32.8481 35.0637 33.0512 35.1736 33.2726 35.1999L33.375 35.2061H38.625C38.8571 35.2061 39.0796 35.1139 39.2437 34.9498C39.4078 34.7857 39.5 34.5631 39.5 34.3311C39.5 34.099 39.4078 33.8764 39.2437 33.7123C39.0796 33.5482 38.8571 33.4561 38.625 33.4561ZM36 26.4561C36.3693 26.4561 36.7345 26.534 37.0716 26.6848C37.4088 26.8356 37.7103 27.0558 37.9565 27.3311C38.331 27.7493 38.5725 28.2874 38.6171 28.8816L38.625 29.0811H33.375C33.375 28.4467 33.5999 27.8648 33.9744 27.4116L34.0435 27.3311C34.5247 26.7938 35.223 26.4561 36 26.4561Z"
                                  fill="#113F67"
                                />
                              </g>
                              <defs>
                                <filter
                                  id="filter0_d_1104_3295"
                                  x="0"
                                  y="0"
                                  width="72"
                                  height="72"
                                  filterUnits="userSpaceOnUse"
                                  colorInterpolationFilters="sRGB"
                                >
                                  <feFlood
                                    floodOpacity="0"
                                    result="BackgroundImageFix"
                                  />
                                  <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                  />
                                  <feOffset />
                                  <feGaussianBlur stdDeviation="10" />
                                  <feComposite in2="hardAlpha" operator="out" />
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect1_dropShadow_1104_3295"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_1104_3295"
                                    result="shape"
                                  />
                                </filter>
                              </defs>
                            </svg>
                            <div className="flex-1">
                              <label className="text-sm font-medium text-gray-600 block mb-2 text-left">
                                Jenis Layanan:
                              </label>
                              <div className="text-sm text-gray-800 bg-gray-50 px-4 py-3 rounded-md text-left">
                                {ticketData.jenisLayanan}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-start gap-4">
                            <svg
                              width="70"
                              height="70"
                              viewBox="0 0 72 72"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g filter="url(#filter0_d_2515_5514)">
                                <rect
                                  x="20"
                                  y="20"
                                  width="32"
                                  height="32"
                                  rx="16"
                                  fill="white"
                                  shapeRendering="crispEdges"
                                />
                                <path
                                  d="M43.7358 27.1136L27.4391 36.5125C26.8028 36.878 26.8836 37.7638 27.5165 38.0309L31.254 39.5985L41.3555 30.6988C41.5489 30.5265 41.8231 30.7902 41.6579 30.9905L33.1878 41.3068V44.1363C33.1878 44.9658 34.1899 45.2927 34.6821 44.6917L36.9148 41.9746L41.2957 43.8094C41.795 44.0203 42.3646 43.7075 42.456 43.1697L44.9875 27.9853C45.1071 27.2752 44.3441 26.7621 43.7358 27.1136Z"
                                  fill="#113F67"
                                />
                              </g>
                              <defs>
                                <filter
                                  id="filter0_d_2515_5514"
                                  x="0"
                                  y="0"
                                  width="72"
                                  height="72"
                                  filterUnits="userSpaceOnUse"
                                  colorInterpolationFilters="sRGB"
                                >
                                  <feFlood
                                    floodOpacity="0"
                                    result="BackgroundImageFix"
                                  />
                                  <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                  />
                                  <feOffset />
                                  <feGaussianBlur stdDeviation="10" />
                                  <feComposite in2="hardAlpha" operator="out" />
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect1_dropShadow_2515_5514"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_2515_5514"
                                    result="shape"
                                  />
                                </filter>
                              </defs>
                            </svg>
                            <div className="flex-1">
                              <label className="text-sm font-medium text-gray-600 block mb-2 text-left">
                                Jenis Permohonan:
                              </label>
                              <div className="text-sm text-gray-800 bg-gray-50 px-4 py-3 rounded-md text-left">
                                {ticketData.jenisPermohonan}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0 py-2 text-sm font-medium transition-colors underline">
                      <Download className="w-4 h-4" />
                      Unduh tiket
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-12 space-y-6 text-left">
                <div className="text-gray-800">
                  <p className="font-semibold text-lg md:text-xl">
                    ✅ Tiket berhasil dibuat
                  </p>
                  <div className="mt-2 text-sm md:text-base">
                    <p>
                      Laporan Anda telah berhasil direkam dalam sistem dengan
                      nomor tiket{" "}
                      <span className="font-bold text-[#226597]">
                        #{ticketData.noTiket}
                      </span>
                      .
                    </p>
                    <p className="mt-2">
                      Mohon simpan nomor ini untuk melacak status penyelesaian.
                    </p>
                    <p className="mt-2">
                      Tim kami akan segera menindaklanjuti laporan Anda.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm md:text-base">
                  <p>
                    <span className="mt-2">Jenis Layanan:</span>{" "}
                    {ticketData.jenisLayanan}
                  </p>
                  <p>
                    <span className="mt-2">OPD Tujuan:</span>{" "}
                    {ticketData.jenisPermohonan}
                  </p>
                </div>

                <div className="text-gray-800">
                  <p className="text-sm md:text-base">
                    Anda dapat memantau progres tiket di menu{" "}
                    <button
                      onClick={() => navigate("/pelacakanmasyarakat")}
                      className="text-blue-600 underline hover:text-blue-800 transition-colors"
                    >
                      Cek Status Layanan
                    </button>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
