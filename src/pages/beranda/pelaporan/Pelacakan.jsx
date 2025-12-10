import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import LayoutPegawai from "../../../components/Layout/LayoutPegawai";
import { useNavigate } from "react-router-dom";

const Pelacakan = () => {
  const navigate = useNavigate();
  const [reportId, setReportId] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errors, setErrors] = useState({ reportId: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    // Reset errors
    const newErrors = { reportId: "" };
    let hasError = false;

    // Validasi
    if (!reportId.trim()) {
      newErrors.reportId = "Harap isi ID Laporan dengan benar";
      hasError = true;
    }

    setErrors(newErrors);

    // Jika ada error, stop execution
    if (hasError) {
      return;
    }

    console.log("Searching for report:", { reportId });

    try {
      setIsLoading(true);
      setShowErrorPopup(false);
      setErrorMessage("");

      // Fetch data dari API
      const response = await fetch(
        `https://service-desk-be-production.up.railway.app/api/track-ticket/${reportId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTc4NzE3MX0.Ig-aV0ofrI7srjWX4RLTXZkB0i00PYVxEnGtyjwfsOU",
          },
        }
      );

      console.log("API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);

        // Navigasi ke halaman data ditemukan dengan data dari API
        navigate("/dataditemukan", {
          state: {
            ticketData: data,
          },
        });
      } else {
        // Handle error responses
        if (response.status === 404) {
          setErrorMessage(
            "Tiket tidak ditemukan. Periksa kembali ID Tiket Anda."
          );
        } else if (response.status === 401) {
          setErrorMessage("Sesi Anda telah berakhir. Silakan login kembali.");
        } else if (response.status === 500) {
          setErrorMessage("Terjadi kesalahan server. Silakan coba lagi nanti.");
        } else {
          setErrorMessage("Gagal melacak tiket. Silakan coba lagi.");
        }
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      setErrorMessage(
        "Gagal terhubung ke server. Periksa koneksi internet Anda."
      );
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorMessage("");
  };

  // Clear error ketika user mulai mengetik
  const handleReportIdChange = (e) => {
    setReportId(e.target.value.toUpperCase()); // Convert to uppercase for consistency
    if (errors.reportId) {
      setErrors((prev) => ({ ...prev, reportId: "" }));
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <LayoutPegawai>
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Custom SVG Background */}
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
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#226597] mb-3 md:py-4">
              Pelacakan Laporan
            </h1>
            <p className="text-gray-500 text-sm md:text-lg">
              Lacak status laporan Anda
            </p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-xl mx-auto">
            {/* ID Laporan Section - Responsive Layout */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap sm:min-w-[120px] text-left">
                  ID Laporan
                </label>
                <div className="flex-1">
                  <div
                    className={`bg-white rounded-2xl shadow-xl p-4 border ${
                      errors.reportId ? "border-red-300" : "border-blue-100"
                    }`}
                  >
                    <input
                      type="text"
                      value={reportId}
                      onChange={handleReportIdChange}
                      onKeyPress={handleKeyPress}
                      className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none bg-transparent text-sm md:text-base placeholder-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              {errors.reportId && (
                <div className="text-left sm:ml-[136px]">
                  <p className="text-red-500 text-sm mt-1">{errors.reportId}</p>
                </div>
              )}
              <div className="text-left sm:ml-[136px] mt-2">
                <p className="text-gray-500 text-xs">
                  Masukkan ID Tiket yang Anda terima
                </p>
              </div>
            </div>

            {/* Search Button - Responsive Positioning */}
            <div className="flex justify-center sm:justify-start mt-6 sm:ml-36">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-[#226597] hover:bg-[#1a507a] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Cari
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Popup - Responsive */}
      {showErrorPopup && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            {/* Popup Content */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-sm w-full mx-auto">
              <div className="text-center">
                {/* Warning Icon - Center aligned */}
                <div className="flex justify-center mb-4">
                  <svg
                    width="60"
                    height="60"
                    className="w-12 h-12 md:w-16 md:h-16"
                    viewBox="0 0 100 110"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50 9.34961C77.615 9.34961 100 31.7346 100 59.3496C100 86.9646 77.615 109.35 50 109.35C22.385 109.35 0 86.9646 0 59.3496C0 31.7346 22.385 9.34961 50 9.34961ZM50 19.3496C39.3913 19.3496 29.2172 23.5639 21.7157 31.0653C14.2143 38.5668 10 48.7409 10 59.3496C10 69.9583 14.2143 80.1324 21.7157 87.6339C29.2172 95.1353 39.3913 99.3496 50 99.3496C60.6087 99.3496 70.7828 95.1353 78.2843 87.6339C85.7857 80.1324 90 69.9583 90 59.3496C90 48.7409 85.7857 38.5668 78.2843 31.0653C70.7828 23.5639 60.6087 19.3496 50 19.3496ZM50 74.3496C51.3261 74.3496 52.5979 74.8764 53.5355 75.8141C54.4732 76.7518 55 78.0235 55 79.3496C55 80.6757 54.4732 81.9475 53.5355 82.8851C52.5979 83.8228 51.3261 84.3496 50 84.3496C48.6739 84.3496 47.4021 83.8228 46.4645 82.8851C45.5268 81.9475 45 80.6757 45 79.3496C45 78.0235 45.5268 76.7518 46.4645 75.8141C47.4021 74.8764 48.6739 74.3496 50 74.3496ZM50 29.3496C51.3261 29.3496 52.5979 29.8764 53.5355 30.8141C54.4732 31.7518 55 33.0235 55 34.3496V64.3496C55 65.6757 54.4732 66.9475 53.5355 67.8851C52.5979 68.8228 51.3261 69.3496 50 69.3496C48.6739 69.3496 47.4021 68.8228 46.4645 67.8851C45.5268 66.9475 45 65.6757 45 64.3496V34.3496C45 33.0235 45.5268 31.7518 46.4645 30.8141C47.4021 29.8764 48.6739 29.3496 50 29.3496Z"
                      fill="#FF5F57"
                    />
                  </svg>
                </div>

                {/* Error Message */}
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                  Data tidak ditemukan!
                </h3>
                <p className="text-gray-600 text-sm md:text-base mb-6">
                  {errorMessage || "Cek kembali inputan Anda"}
                </p>

                {/* OK Button - Responsive */}
                <div className="flex justify-center">
                  <button
                    onClick={closeErrorPopup}
                    className="bg-[#226597] hover:bg-[#1a507a] text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm md:text-base w-full sm:w-auto"
                  >
                    Oke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </LayoutPegawai>
  );
};

export default Pelacakan;
