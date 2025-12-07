import { Download } from "lucide-react";
import LayoutMasyarakat from "../../components/Layout/LayoutMasyarakat";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"; // Import useState

export default function SuksesLapor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false); // State untuk loading

  // Ambil data dari FormLaporan melalui state navigasi
  const laporanData = location.state?.laporanData || {};

  // Data tiket dengan OPD tujuan dari form
  const ticketData = {
    noTiket: "LPR318728",
    tanggal: "18-10-2025",
    waktu: "08:14 A.M.",
    jenisLayanan: "Pelaporan Online",
    jenisPermohonan: laporanData.opdTujuan || "Dinas Pendidikan", // Ambil dari form
    judulPelaporan: laporanData.judulPelaporan || "Router Terganggu",
    dataAset: laporanData.dataAset || "Printer HP LaserJet Pro P1102w",
    nomorSeri: laporanData.nomorSeri || "HP-LJ-P1102W-001",
    kategoriAset: laporanData.kategoriAset || "TI",
    subKategoriAset: laporanData.subKategoriAset || "Jaringan",
    jenisAset: laporanData.jenisAset || "Barang",
    lokasiKejadian: laporanData.lokasiKejadian || "Dispendik Pusat",
  };

  // Fungsi untuk generate dan download PDF menggunakan jsPDF
 const handleDownloadPDF = async () => {
   try {
     setIsGenerating(true);

     // Dynamic import jsPDF untuk mengurangi bundle size
     const { jsPDF } = await import("jspdf");

     // Buat PDF baru
     const doc = new jsPDF();

     // Set font
     doc.setFont("helvetica");

     // Header - persis seperti gambar
     doc.setFontSize(20);
     doc.setTextColor(0, 0, 0); // Hitam
     doc.text("Tiket Anda Berhasil Dibuat", 105, 20, { align: "center" });

     doc.setFontSize(16);
     doc.text("Laporan Anda Telah Berhasil Dikirim", 105, 30, {
       align: "center",
     });

     // Deskripsi bahasa Indonesia
     doc.setFontSize(10);
     doc.setTextColor(100, 100, 100); // Abu-abu
     const description =
       "Terima kasih atas laporan Anda. Laporan telah tercatat, kami akan menindaklanjuti sesuai prosedur dalam waktu yang ditentukan. Silakan pantau perkembangan laporan melalui menu Cek Status Layanan.";
     doc.text(description, 105, 45, { align: "center", maxWidth: 180 });

     // Garis pemisah
     doc.setDrawColor(200, 200, 200);
     doc.line(20, 60, 190, 60);

     // No. Tiket - tanpa kotak, seperti gambar
     doc.setFontSize(14);
     doc.setTextColor(100, 100, 100);
     doc.text("No. Tiket:", 20, 75);

     doc.setFontSize(24);
     doc.setTextColor(34, 101, 151); // Warna biru #226597
     doc.setFont("helvetica", "bold");
     doc.text(ticketData.noTiket, 105, 75, { align: "center" });

     // Garis pemisah kedua
     doc.setDrawColor(200, 200, 200);
     doc.line(20, 85, 190, 85);

     // Detail tiket: - Header
     doc.setFontSize(16);
     doc.setTextColor(0, 0, 0);
     doc.setFont("helvetica", "bold");
     doc.text("Detail tiket:", 20, 95);

     // Data detail - Format tabel seperti gambar (hanya 1 kolom)
     doc.setFontSize(10);
     doc.setFont("helvetica", "normal");

     let yPos = 105;
     const leftColumnX = 20;
     const valueColumnX = 80; // Posisi untuk nilai setelah ":"

     // Fungsi untuk menambahkan baris data seperti gambar
     const addDataRow = (label, value) => {
       doc.setTextColor(100, 100, 100);
       doc.text(`${label}`, leftColumnX, yPos);
       doc.setTextColor(0, 0, 0);
       // Format dengan titik dua di tengah seperti gambar
       const labelWidth = doc.getTextWidth(label);
       const colonX = leftColumnX + labelWidth + 2;
       doc.text(":", colonX, yPos);
       doc.text(value, valueColumnX, yPos);
       yPos += 7;
     };

     // Data sesuai urutan gambar (versi sederhana untuk masyarakat)
     addDataRow("Nomor Tiket", ticketData.noTiket);
     addDataRow(
       "Tanggal / waktu laporan dibuat",
       `${ticketData.tanggal} / ${ticketData.waktu}`
     );
     addDataRow("Jenis Layanan", ticketData.jenisLayanan);
     addDataRow("Ditujukan ke OPD", ticketData.jenisPermohonan);
     addDataRow("Judul Pelaporan", ticketData.judulPelaporan);

     // Garis pemisah footer
     yPos += 5;
     doc.setDrawColor(200, 200, 200);
     doc.line(20, yPos, 190, yPos);
     yPos += 10;

     // Footer - persis seperti gambar
     doc.setFontSize(9);
     doc.setTextColor(100, 100, 100);

     const footerText1 =
       "Mohon simpan nomor tiket Anda untuk melacak status penyelesaian.";
     const footerText2 = "Tim kami akan segera menindaklanjuti laporan Anda.";
     const footerText3 =
       "Anda dapat memantau progres tiket di menu Cek Status Layanan.";

     doc.text(footerText1, 20, yPos);
     yPos += 5;
     doc.text(footerText2, 20, yPos);
     yPos += 5;
     doc.text(footerText3, 20, yPos);
     yPos += 10;

     // Copyright
     doc.setFontSize(8);
     doc.text("© 2025 REPORT – Sistem Pelaporan Layanan.", 105, yPos, {
       align: "center",
     });
     yPos += 4;
     doc.text(
       "Dokumen dicetak otomatis dan sah tanpa tanda tangan.",
       105,
       yPos,
       { align: "center" }
     );

     // Simpan PDF
     doc.save(`Tiket_${ticketData.noTiket}.pdf`);
   } catch (error) {
     console.error("Error generating PDF:", error);
     alert("Gagal mengunduh PDF. Silakan coba lagi.");
   } finally {
     setIsGenerating(false);
   }
 };

  // Fallback jika jsPDF gagal diimport
  const handleDownloadFallback = () => {
    // Buat konten teks sederhana
    const content = `
TIKET LAPORAN - ${ticketData.noTiket}
=========================================

Laporan Anda Telah Berhasil Dikirim
Terima kasih atas laporan Anda. Laporan telah tercatat, kami akan menindaklanjuti sesuai prosedur dalam waktu yang ditentukan.

No. Tiket: ${ticketData.noTiket}

DETAIL TIKET:
=============
Nomor Tiket: ${ticketData.noTiket}
Tanggal / waktu laporan dibuat: ${ticketData.tanggal} / ${ticketData.waktu}
Jenis Layanan: ${ticketData.jenisLayanan}
Ditujukan ke OPD: ${ticketData.jenisPermohonan}
Judul Pelaporan: ${ticketData.judulPelaporan}

INFORMASI:
==========
Mohon simpan nomor tiket Anda untuk melacak status penyelesaian.
Tim kami akan segera menindaklanjuti laporan Anda.
Anda dapat memantau progres tiket di menu Cek Status Layanan.

© 2025 REPORT – Sistem Pelaporan Layanan.
Dokumen dicetak otomatis dan sah tanpa tanda tangan.
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tiket_${ticketData.noTiket}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <LayoutMasyarakat>
      <div className="min-h-screen bg-gray-50 pt-20">
        {" "}
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
            {/* Card Success */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
              {/* Header Card */}
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
                  Laporan Anda Telah Berhasil Dikirim
                </h1>
                <div className="text-gray-600 text-sm text-center mt-3">
                  <p>
                    Terima kasih atas laporan Anda. Laporan telah tercatat, kami
                    akan menindaklanjuti sesuai
                  </p>
                  <p>
                    prosedur dalam waktu yang ditentukan. Silakan pantau
                    perkembangan laporan melalui menu
                  </p>
                  <p>Cek Status Layanan.</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Info Tiket */}
                <div className="text-center">
                  <div className="space-y-8">
                    {/* No. Tiket - Rata Tengah */}
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

                    {/* Jenis Layanan dan OPD Tujuan - Sebelahan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {/* Jenis Layanan */}
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

                      {/* OPD Tujuan */}
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
                              OPD Tujuan:
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

                {/* Tombol Unduh Tiket */}
                <div className="text-right">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0 py-2 text-sm font-medium transition-colors underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        Membuat PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Unduh tiket
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="max-w-2xl mx-auto mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cek Status Layanan */}
                <button
                  onClick={() => navigate("/pelacakanmasyarakat")}
                  className="bg-[#226597] hover:bg-[#1a507a] text-white py-3 rounded-md text-sm font-medium transition-colors text-center"
                >
                  Cek status layanan
                </button>

                {/* Buat Laporan Baru */}
                <button
                  onClick={() => navigate("/pelaporanmasyarakat")}
                  className="bg-[#226597] hover:bg-[#1a507a] text-white py-3 rounded-md text-sm font-medium transition-colors text-center"
                >
                  Buat laporan baru
                </button>

                {/* Kembali ke Beranda */}
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
    </LayoutMasyarakat>
  );
}
