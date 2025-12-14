import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DataDitemukanMasyarakat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  const ticketCode = location.state?.ticketData?.ticket_code;

  const getStatusColor = (status) => {
    const statusMap = {
      "Menunggu Diproses": "bg-yellow-500",
      Pending: "bg-yellow-500",
      "Dalam Proses": "bg-blue-500",
      Selesai: "bg-green-500",
      Ditolak: "bg-red-500",
      Ditutup: "bg-gray-500",
      Dibatalkan: "bg-gray-400",
    };
    return statusMap[status] || "bg-gray-300";
  };

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);

        if (!ticketCode) {
          console.log("No ticket code provided, using default");
          setTicketData({
            ticket_code: "SVD-PO-0052-MA",
            status_ticket_pengguna: "Menunggu Diproses",
            request_type: "pelaporan_online",
            opd_name: "Dinas Kesehatan",
          });
          return;
        }

        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/api/track-ticket/${ticketCode}`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTc4NzE3MX0.Ig-aV0ofrI7srjWX4RLTXZkB0i00PYVxEnGtyjwfsOU",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Tiket tidak ditemukan");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data = await response.json();
        setTicketData(data);
      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError(err.message);

        setTicketData({
          ticket_code: ticketCode || "SVD-PO-0052-MA",
          status_ticket_pengguna: "Menunggu Diproses",
          request_type: "pelaporan_online",
          opd_name: "Dinas Kesehatan",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data tiket...</p>
        </div>
      </div>
    );
  }

  if (error && !ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/pelacakanmasyarakat")}
            className="bg-[#226597] hover:bg-[#1a507a] text-white py-2 px-6 rounded-md text-sm font-medium transition-colors w-full"
          >
            Kembali ke Pelacakan
          </button>
        </div>
      </div>
    );
  }

  const displayData = ticketData || {
    ticket_code: "SVD-PO-0052-MA",
    status_ticket_pengguna: "Menunggu Diproses",
    request_type: "pelaporan_online",
    opd_name: "Dinas Kesehatan",
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1065 351"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="min-h-[200px] md:min-h-[350px]"
          >
            <mask
              id="mask0_135_1312"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1065"
              height="351"
            >
              <rect
                width="1065"
                height="351"
                transform="matrix(-1 0 0 1 1065 0)"
                fill="#C4C4C4"
              />
            </mask>
            <g mask="url(#mask0_135_1312)">
              <g opacity="0.1">
                <path
                  d="M-41.6782 68.2948C-41.6782 68.2948 -11.9803 97.8027 210.646 104.858C379.127 110.195 696.24 12.9597 888.09 19.2171C1085.55 25.5972 1064.34 90.1343 1064.34 46.8847V111.544C1064.34 111.544 998.397 50.7495 883.776 51.3017C715.224 52.2219 368.556 184.609 202.88 188.719C41.3033 192.707 -41.6782 111.544 -41.6782 111.544V68.2948Z"
                  fill="#226597"
                />
              </g>
              <g opacity="0.2">
                <path
                  d="M-4.97253 67.2116C376.62 306.122 638.244 -6.8645 841.318 0.115997C1050.41 7.34143 1065 129.454 1065 80.7744V153.58C1065 153.58 996.235 123.465 878.373 114.241C450.722 80.7744 425.791 380.116 227.03 348.135C28.2697 316.155 -110.155 1.35828 -4.97253 67.2116Z"
                  fill="#226597"
                />
              </g>
            </g>
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <div className="w-16 h-16 bg-[#226597] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-[#000000] text-center">
                Data Ditemukan
              </h1>
              {error && (
                <div className="">
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-600 mb-4">
                  Pengaduan Anda:
                </h3>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap w-16">
                      No. Tiket
                    </span>
                    <div className="bg-[#226597] text-white px-6 py-2 rounded-lg inline-flex min-w-[200px] justify-center">
                      <span className="text-sm font-medium">
                        {displayData.ticket_code}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap w-16">
                      Status
                    </span>
                    <div
                      className={`${getStatusColor(
                        displayData.status_ticket_pengguna
                      )} text-white px-6 py-2 rounded-lg inline-flex min-w-[200px] justify-center`}
                    >
                      <span className="text-sm font-medium">
                        {displayData.status_ticket_pengguna}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <div className="flex items-center gap-2">
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
                    <label className="text-sm font-medium text-gray-600">
                      Jenis Layanan:
                    </label>
                  </div>
                  <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-md ml-16 -mt-1">
                    {displayData.request_type === "pelaporan_online"
                      ? "Pelaporan Online"
                      : displayData.request_type || "Pelaporan Online"}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
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
                    <label className="text-sm font-medium text-gray-600">
                      OPD Tujuan:
                    </label>
                  </div>
                  <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-md ml-16 -mt-1">
                    {displayData.opd_name || "Dinas Kesehatan"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/pelacakanmasyarakat")}
                className="bg-[#226597] hover:bg-[#1a507a] text-white py-3 rounded-md text-sm font-medium transition-colors text-center"
              >
                Cek status layanan
              </button>

              <button
                onClick={() => navigate("/berandamasyarakat")}
                className="bg-[#226597] hover:bg-[#1a507a] text-white py-3 rounded-md text-sm font-medium transition-colors text-center"
              >
                Kembali ke beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
