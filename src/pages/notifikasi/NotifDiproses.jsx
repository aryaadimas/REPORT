import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";

export default function NotifDiprosesPegawai() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationData, setNotificationData] = useState(null);

  const notificationId = params.id || location.state?.notificationId;
  const stateNotificationData = location.state?.notificationData;
  const notificationType = location.state?.type;

  const getStatusColor = (status) => {
    const statusMap = {
      "Menunggu Diproses": "bg-yellow-500",
      Pending: "bg-yellow-500",
      "Dalam Proses": "bg-blue-500",
      Diproses: "bg-blue-500",
      Selesai: "bg-green-500",
      Ditolak: "bg-red-500",
      Ditutup: "bg-gray-500",
      Dibatalkan: "bg-gray-400",
    };
    return statusMap[status] || "bg-gray-300";
  };

  useEffect(() => {
    if (stateNotificationData) {
      console.log("Menggunakan data dari state:", stateNotificationData);
      setNotificationData(stateNotificationData);
      setLoading(false);
      return;
    }

    if (!notificationId) {
      navigate("/kotakmasuk");
      return;
    }

    const fetchNotificationData = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("access_token") ||
          localStorage.getItem("token") ||
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjUzOTM5MzAsImV4cCI6MTc2NTk5ODczMCwibmJmIjoxNzY1MzkzOTMwLCJqdGkiOiJGSW15YU1XZ1Zkck5aTkVPIiwic3ViIjoiNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KSswG95y_yvfNmpH5hLBNXnuVfiaycCD4YN5JMRYQy8";

        // Gunakan endpoint untuk pegawai
        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/pegawai/${notificationId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data notifikasi pegawai:", data);

        setNotificationData(data);
      } catch (err) {
        console.error("Error fetching notification data:", err);
        setError(err.message);

        // Fallback data untuk pegawai jika API error
        setNotificationData({
          ticket_id: "8b0239ae-5ac7-4891-ab91-732ea79f1c0c",
          ticket_code: "SVD-PO-0055-PG",
          title: "Printer tidak berfungsi",
          description: "Printer di ruangan kepala bagian tidak bisa mencetak",
          priority: "Low",
          status: "selesai",
          rejection_reason_seksi: null,
          created_at: "2025-12-08T05:07:51.607302",
          lokasi_kejadian: "Gedung A Lantai 3",
          expected_resolution: "Printer dapat berfungsi normal",
          pengerjaan_awal: "2025-12-08T05:09:02.779980",
          pengerjaan_akhir: "2025-12-08T05:09:09.020061",
          status_ticket_pengguna: "Selesai",
          status_ticket_seksi: "normal",
          status_ticket_teknisi: "selesai",
          creator: {
            user_id: "8a762f5a-8fb1-43af-b912-991a58a372cc",
            full_name: "Sri Wulandari",
            email: "sri.wulandari@company.com",
            profile: null,
          },
          asset: {
            asset_id: 1052,
            nama_asset: "Laptop Dell Latitude 5420",
            kode_bmd: "BRG-001",
            nomor_seri: "DL5420-001",
            kategori: "ti",
            subkategori_nama: "Server",
            jenis_asset: "barang",
            lokasi_asset: null,
            opd_id_asset: 1,
          },
          files: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationData();
  }, [notificationId, navigate, stateNotificationData]);

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "2 hari yang lalu";

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

  const handleDownloadTicket = async () => {
    if (!notificationData) return;

    const ticketData = {
      noTiket: notificationData.ticket_code || "SVD-PO-0055-PG",
      jenisLayanan: "Pelaporan Internal",
      jenisPermohonan:
        notificationData.asset?.nama_asset || "Laptop Dell Latitude 5420",
      status: notificationData.status_ticket_pengguna || "Menunggu Diproses",
      tanggalDibuat: notificationData.created_at
        ? new Date(notificationData.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : new Date().toLocaleDateString("id-ID"),
      waktuDibuat: notificationData.created_at
        ? new Date(notificationData.created_at).toLocaleTimeString("id-ID")
        : new Date().toLocaleTimeString("id-ID"),
      title: notificationData.title || "Laporan Tiket",
      description: notificationData.description || "Tidak ada deskripsi",
      lokasi: notificationData.lokasi_kejadian || "Tidak ditentukan",
    };

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(34, 101, 151);
      doc.text("TIKET LAYANAN INTERNAL", 105, 20, { align: "center" });

      doc.setDrawColor(34, 101, 151);
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("SERVICE DESK INTERNAL", 105, 35, { align: "center" });
      doc.setFontSize(12);
      doc.text("Perusahaan Internal", 105, 42, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(34, 101, 151);
      doc.text("INFORMASI TIKET", 20, 55);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      doc.setFont(undefined, "bold");
      doc.text("No. Tiket:", 20, 65);
      doc.setFont(undefined, "normal");
      doc.text(ticketData.noTiket, 60, 65);

      doc.setFont(undefined, "bold");
      doc.text("Status:", 20, 72);
      doc.setFont(undefined, "normal");
      doc.text(ticketData.status, 60, 72);

      doc.setFont(undefined, "bold");
      doc.text("Judul Laporan:", 20, 79);
      doc.setFont(undefined, "normal");
      doc.text(ticketData.title, 60, 79);

      doc.setFont(undefined, "bold");
      doc.text("Aset:", 20, 86);
      doc.setFont(undefined, "normal");
      doc.text(ticketData.jenisPermohonan, 60, 86);

      doc.setFont(undefined, "bold");
      doc.text("Tanggal:", 20, 93);
      doc.setFont(undefined, "normal");
      doc.text(ticketData.tanggalDibuat, 60, 93);

      doc.setFont(undefined, "bold");
      doc.text("Lokasi:", 20, 100);
      doc.setFont(undefined, "normal");
      doc.text(ticketData.lokasi, 60, 100);

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text("Deskripsi:", 20, 115);
      doc.text(ticketData.description, 20, 122, { maxWidth: 170 });

      doc.text(
        "Tiket ini merupakan bukti pengajuan layanan internal.",
        20,
        140
      );
      doc.text(
        "Mohon simpan nomor tiket untuk melacak status penyelesaian.",
        20,
        145
      );

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Dokumen ini dicetak secara otomatis oleh sistem", 105, 160, {
        align: "center",
      });
      doc.text(
        `Tanggal cetak: ${new Date().toLocaleDateString(
          "id-ID"
        )} ${new Date().toLocaleTimeString("id-ID")}`,
        105,
        165,
        { align: "center" }
      );

      doc.rect(10, 10, 190, 280);

      doc.save(`Tiket-${ticketData.noTiket}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mengunduh tiket. Silakan coba lagi.");
    }
  };

  if (loading) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data notifikasi...</p>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  if (error && !notificationData) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/kotakmasuk")}
              className="bg-[#226597] hover:bg-[#1a507a] text-white py-2 px-6 rounded-md text-sm font-medium transition-colors w-full"
            >
              Kembali ke Kotak Masuk
            </button>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  const ticketData = {
    noTiket: notificationData?.ticket_code || "SVD-PO-0055-PG",
    pin: "228973",
    jenisLayanan: "Pelaporan Internal",
    jenisPermohonan:
      notificationData?.asset?.nama_asset || "Laptop Dell Latitude 5420",
  };

  const displayStatus =
    notificationData?.status_ticket_pengguna ||
    notificationData?.status ||
    "Menunggu Diproses";

  const getPageTitle = () => {
    if (notificationType === "Tiket Dibuat") {
      return "Tiket Dibuat";
    } else if (notificationType === "Status Tiket Diperbarui") {
      return "Status Tiket Diperbarui";
    }

    if (displayStatus === "Menunggu Diproses") {
      return "Tiket Dibuat";
    }
    return "Status Tiket Diperbarui";
  };

  const getStatusMessage = () => {
    const status = displayStatus;
    const ticketNo = ticketData.noTiket;

    switch (status) {
      case "Menunggu Diproses":
        return `Tiket ${ticketNo} sedang menunggu untuk diproses oleh tim terkait.`;
      case "Dalam Proses":
      case "Diproses":
        return `Tiket ${ticketNo} kini sedang diproses oleh tim teknis.`;
      case "Selesai":
        return `Tiket ${ticketNo} telah selesai diproses.`;
      case "Ditolak":
        return `Tiket ${ticketNo} telah ditolak.`;
      default:
        return `Status tiket ${ticketNo} telah diperbarui.`;
    }
  };

  const getStatusHeading = () => {
    const status = displayStatus;

    switch (status) {
      case "Menunggu Diproses":
        return "⏳ Tiket Anda Sedang Menunggu Diproses";
      case "Dalam Proses":
      case "Diproses":
        return "🛠️ Laporan Anda sedang kami tangani!";
      case "Selesai":
        return "✅ Tiket Anda Telah Selesai";
      case "Ditolak":
        return "❌ Tiket Anda Ditolak";
      default:
        return "📋 Status Tiket Diperbarui";
    }
  };

  return (
    <LayoutPegawai>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-4 pb-8">
          <div className="px-4 mb-6">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => navigate("/kotakmasuk")}
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

          <div className="px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-300 p-6 md:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-[#000000] mb-4">
                      {getPageTitle()}
                    </h1>
                    <div className="bg-[#226597] text-white px-4 py-1 rounded-2xl inline-block">
                      <span className="text-sm font-medium">
                        {getPageTitle() === "Tiket Dibuat" ? "Tiket" : "Status"}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimeAgo(notificationData?.created_at)}
                  </div>
                </div>

                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
                  <div className="p-6">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <img
                        src="/assets/Logo Report.png"
                        alt="Report Logo"
                        className="w-16 h-16 object-contain"
                      />
                    </div>

                    <h1 className="text-xl md:text-2xl font-semibold text-[#000000] text-center">
                      {getPageTitle() === "Tiket Dibuat"
                        ? "Laporan Anda Telah Berhasil Terkirim"
                        : "Status Tiket Telah Diperbarui"}
                    </h1>
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
                              {ticketData.noTiket}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-sm font-medium text-gray-600 whitespace-nowrap w-16">
                            Status
                          </span>
                          <div
                            className={`${getStatusColor(
                              displayStatus
                            )} text-white px-6 py-2 rounded-lg inline-flex min-w-[200px] justify-center`}
                          >
                            <span className="text-sm font-medium">
                              {displayStatus}
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
                          {ticketData.jenisLayanan}
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
                            Aset:
                          </label>
                        </div>
                        <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-md ml-16 -mt-1">
                          {ticketData.jenisPermohonan}
                        </div>
                      </div>
                    </div>

                    <div className="text-right pt-4">
                      <button
                        onClick={handleDownloadTicket}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0 py-2 text-sm font-medium transition-colors underline"
                      >
                        <Download className="w-4 h-4" />
                        Unduh tiket
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-left">
                  <div className="text-gray-800">
                    <p className="font-semibold text-lg md:text-xl">
                      {getStatusHeading()}
                    </p>
                    <div className="mt-2 text-sm md:text-base">
                      <p>{getStatusMessage()}</p>
                      {displayStatus === "Menunggu Diproses" && (
                        <p className="mt-2">
                          Tim akan segera memproses tiket Anda dalam waktu yang
                          telah ditentukan.
                        </p>
                      )}
                      {(displayStatus === "Dalam Proses" ||
                        displayStatus === "Diproses") && (
                        <p className="mt-2">
                          Kami akan segera memberi kabar setelah ada pembaruan
                          status berikutnya.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm md:text-base">
                    <p>
                      <span>Jenis Layanan:</span> {ticketData.jenisLayanan}
                    </p>
                    <p>
                      <span>Aset:</span> {ticketData.jenisPermohonan}
                    </p>
                    {notificationData?.lokasi_kejadian && (
                      <p>
                        <span>Lokasi Kejadian:</span>{" "}
                        {notificationData.lokasi_kejadian}
                      </p>
                    )}
                  </div>

                  <div className="text-gray-800">
                    <p className="text-sm md:text-base">
                      Anda dapat memantau progres tiket di menu{" "}
                      <button
                        onClick={() => navigate("/pelacakan")}
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
    </LayoutPegawai>
  );
}
