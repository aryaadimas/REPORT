import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    total_opd: 0,
    total_pelaporan: 0,
    presentase_rating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "https://service-desk-be-production.up.railway.app/api/public/landing-page"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "success") {
          setStatistics(data.data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const handleDaftarSekarang = () => {
    navigate("/Register");
  };

  const handleLayananClick = () => {
    navigate("");
  };

  const handleOpdClick = () => {
    navigate("");
  };

  const handleLoginClick = () => {
    navigate("/Login");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/assets/Logo Report.png"
                alt="Logo REPORT"
                className="h-8 md:h-10"
              />
              <img
                src="/assets/REPORT.png"
                alt="REPORT"
                className="w-16 md:w-20 object-contain"
              />
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLayananClick}
                className="text-[#226597] hover:text-[#1a507a] font-medium transition-colors flex items-center space-x-1"
              >
                <span>Layanan</span>
              </button>
              <button
                onClick={handleOpdClick}
                className="text-[#226597] hover:text-[#1a507a] font-medium transition-colors flex items-center space-x-1"
              >
                <span>OPD</span>
              </button>
              <button
                onClick={handleLoginClick}
                className="bg-[#226597] hover:bg-[#1a507a] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            <div className="flex-1 max-w-2xl text-left ml-8 lg:ml-16 xl:ml-24">
              <div className="mb-16 md:mb-24">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#226597] mb-6 leading-snug">
                  Laporkan Kendala dan
                  <br />
                  Dapatkan Solusinya
                  <br />
                  dengan Mudah
                </h1>
                <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                  Sampaikan laporan dan keluhan Anda secara langsung ke instansi
                  terkait melalui satu portal terintegrasi.
                </p>
                <button
                  onClick={handleDaftarSekarang}
                  className="bg-[#226597] hover:bg-[#1a507a] text-white px-8 py-3 rounded-md text-base font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  Daftar Sekarang
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
                      d="M7.07059 8.485L-0.000411034 15.556L1.41359 16.97L9.19159 9.192C9.37906 9.00447 9.48438 8.75016 9.48438 8.485C9.48438 8.21984 9.37906 7.96553 9.19159 7.778L1.41359 0L-0.000411034 1.414L7.07059 8.485Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end items-start">
              <img
                src="/assets/Register Flip.png"
                alt="Register Illustration"
                className="max-w-[80%] lg:max-w-[450px] h-auto object-contain -mt-8 lg:-mt-12"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16 mt-16 md:mt-24">
            <div className="flex-1 flex justify-center lg:justify-start items-start">
              <img
                src="/assets/Tentang Report.png"
                alt="Tentang Report Illustration"
                className="max-w-[90%] lg:max-w-[450px] xl:max-w-[500px] h-auto object-contain ml-4 lg:ml-8 xl:ml-12"
              />
            </div>
            <div className="flex-1 w-full max-w-full text-left mt-16 md:mt-24">
              <div className="mb-6">
                <div className="mb-4">
                  <img
                    src="/assets/TeksTentang.png"
                    alt="Tentang REPORT"
                    className="w-56 max-w-xs"
                  />
                </div>
              </div>
              <div className="text-left">
                <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
                  Portal ini adalah layanan digital terpadu untuk masyarakat
                  dalam
                  <br />
                  menyampaikan laporan ataupun keluhan. Semua laporan akan
                  diteruskan ke
                  <br />
                  instansi terkait dan dipantau hingga selesai.
                </p>
                <button
                  onClick={handleDaftarSekarang}
                  className="bg-[#226597] hover:bg-[#1a507a] text-white px-8 py-3 rounded-md text-base font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2 mt-8 md:mt-10"
                >
                  Daftar Sekarang
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
                      d="M7.07059 8.485L-0.000411034 15.556L1.41359 16.97L9.19159 9.192C9.37906 9.00447 9.48438 8.75016 9.48438 8.485C9.48438 8.21984 9.37906 7.96553 9.19159 7.778L1.41359 0L-0.000411034 1.414L7.07059 8.485Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 md:mt-24 mb-16 md:mb-24 py-12 bg-gradient-to-br from-[#226597] to-[#1a507a]">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/assets/City.png"
                      alt="OPD Terintegrasi"
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                    {loading ? "..." : statistics.total_opd}
                  </div>
                  <div className="text-sm md:text-base text-gray-700 font-medium">
                    OPD telah terintegrasi
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/assets/Documents.png"
                      alt="Laporan Diselesaikan"
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                    {loading ? "..." : statistics.total_pelaporan}
                  </div>
                  <div className="text-sm md:text-base text-gray-700 font-medium">
                    Laporan telah diselesaikan
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/assets/Satisfied.png"
                      alt="Kepuasan Pengguna"
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                    {loading
                      ? "..."
                      : `${statistics.presentase_rating.toFixed(0)}%`}
                  </div>
                  <div className="text-sm md:text-base text-gray-700 font-medium whitespace-nowrap">
                    Pengguna puas menggunakan layanan
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 md:mt-32 mb-20 md:mb-32 bg-white">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                Testimoni Pengguna
              </h2>
            </div>
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
                <div className="bg-gradient-to-br from-[#226597] to-[#1a507a] rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src="/assets/Lomon.png"
                          alt="Budi Santoso"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-base leading-relaxed mb-8">
                    "Dulu kalau warga ingin melapor jalan rusak atau lampu mati,
                    kami harus datang ke kelurahan dan sering lama
                    ditindaklanjuti. Sekarang lewat portal ini, cukup isi
                    laporan dan unggah foto. Dalam tiga hari, jalan di depan
                    gang kami langsung diperbaiki! Warga jadi merasa suaranya
                    didengar, dan koordinasi dengan dinas lebih cepat. Portal
                    ini benar-benar membantu kami di tingkat RW."
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-semibold text-white text-lg">
                        Budi Santoso
                      </div>
                      <div className="text-gray-200 text-sm">
                        Ketua RW 02 Kelurahan Wonokromo
                      </div>
                    </div>
                    <div className="text-yellow-400 text-xl">★★★★★</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#226597] to-[#1a507a] rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src="/assets/Ryujin.jpg"
                          alt="Hana Riana"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-base leading-relaxed mb-8">
                    "Sekolah kami sempat kesulitan karena jaringan internet
                    sering bermasalah. Saya lapor lewat portal ini dan hanya dua
                    hari kemudian tim teknis datang memperbaiki. Semua prosesnya
                    bisa saya pantau dari dashboard. Sekarang kegiatan belajar
                    daring berjalan lancar lagi. Portal ini membuat kami merasa
                    benar-benar didukung dalam meningkatkan pendidikan di
                    sekolah ini."
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-semibold text-white text-lg">
                        Hana Riana
                      </div>
                      <div className="text-gray-200 text-sm">
                        Guru SMP Negeri 88 Kenjeran
                      </div>
                    </div>
                    <div className="text-yellow-400 text-xl">★★★★★</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#226597] to-[#1a507a] rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src="/assets/Haechan.jpg"
                          alt="Widodo Sumarno"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-base leading-relaxed mb-8">
                    "Saluran air di depan warung saya sempat tersumbat parah.
                    Setelah saya lapor lewat portal ini, besoknya petugas
                    langsung datang memperbaiki. Saya bisa pantau progresnya
                    tanpa harus bolak-balik menghubungi OPD terkait. Sekarang
                    lingkungan jadi lebih bersih dan pelanggan pun nyaman. Bagi
                    pelaku usaha kecil seperti saya, layanan ini sangat
                    membantu."
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-semibold text-white text-lg">
                        Widodo Sumarno
                      </div>
                      <div className="text-gray-200 text-sm">
                        Pemilik Warung
                      </div>
                    </div>
                    <div className="text-yellow-400 text-xl">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#226597] to-[#1a507a] py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Bantu kami wujudkan layanan publik
                <br />
                yang lebih cepat dan transparan
              </h2>
              <button
                onClick={handleDaftarSekarang}
                className="bg-white hover:bg-gray-100 text-[#226597] px-6 py-2 rounded-md text-base font-bold transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto mt-12"
              >
                Daftar Sekarang
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
                    d="M7.07059 8.485L-0.000411034 15.556L1.41359 16.97L9.19159 9.192C9.37906 9.00447 9.48438 8.75016 9.48438 8.485C9.48438 8.21984 9.37906 7.96553 9.19159 7.778L1.41359 0L-0.000411034 1.414L7.07059 8.485Z"
                    fill="#226597"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src="/assets/Logo Report.png"
                  alt="Logo REPORT"
                  className="h-6 md:h-10"
                />
                <img
                  src="/assets/REPORT.png"
                  alt="REPORT"
                  className="h-6 md:h-3"
                />
              </div>
              <div className="max-w-md mr-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-[#226597] mb-4">
                  Lapor Sekarang
                </h3>
                <p className="text-[#226597] text-base leading-relaxed mb-6 whitespace-nowrap">
                  Sampaikan laporan dan keluhan Anda secara langsung ke instansi
                  terkait melalui satu portal terintegrasi.
                </p>
                <button
                  onClick={handleDaftarSekarang}
                  className="bg-[#226597] hover:bg-[#1a507a] text-white px-6 py-3 rounded-md text-base font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  Daftar Sekarang
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
                      d="M7.07059 8.485L-0.000411034 15.556L1.41359 16.97L9.19159 9.192C9.37906 9.00447 9.48438 8.75016 9.48438 8.485C9.48438 8.21984 9.37906 7.96553 9.19159 7.778L1.41359 0L-0.000411034 1.414L7.07059 8.485Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="w-full h-px bg-gray-300 my-8"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#226597]">
                    Bahasa Indonesia
                  </span>
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#226597]"
                  >
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <a
                  href=""
                  className="text-[#226597] hover:text-[#226597] transition-colors"
                >
                  Bontuon
                </a>
                <a
                  href=""
                  className="text-[#226597] hover:text-[#226597] transition-colors"
                >
                  Privasi
                </a>
                <a
                  href=""
                  className="text-[#226597] hover:text-[#226597] transition-colors"
                >
                  Ketentuan
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
