import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NotifWarRoom = () => {
  const navigate = useNavigate();
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);

  // Data war room
  const warRoomData = {
    noTiket: "LYN215491", // ditambahkan untuk konsistensi
    status: "Darurat",
    judul: "Koordinasi penanganan insiden server",
    idTiket: "UP8B3B38",
    deskripsi:
      "Tiket insiden dengan ID Tiket #UP8B3B38 membutuhkan koordinasi segera antara beberapa OPD terkait untuk penanganan gangguan jaringan yang berdampak pada layanan.",
    opdTerkait: [
      "Dinas Pendidikan",
      "Dinas Komunikasi dan Informatika",
      "Dinas Perhubungan",
    ],
    linkMeet: "https://meet.google.com/xxxxx",
    tanggalWaktu: "27 Oktober 2025, 10:23",
    durasi: "2 jam",
    pesanAkhir:
      "Terima kasih atas perhatian Anda. Mohon segera melakukan tindakan sesuai peran masing-masing!",
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSubmitWarning(true);
  };

  // Handle konfirmasi
  const handleConfirmSubmit = () => {
    setShowSubmitWarning(false);
    alert("Notifikasi telah ditandai sebagai dibaca!");
    navigate(-1);
  };

  // Handle batal
  const handleCancelSubmit = () => {
    setShowSubmitWarning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Simple structure tanpa complex positioning */}
      <div className="pt-4 pb-8">
        {/* Header Section - Simple tanpa background complex */}
        <div className="px-4 mb-6">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[#113F67] hover:text-blue-800 px-4 py-2 text-sm font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 bg-white shadow-sm hover:shadow-md"
            >
              {/* Ganti ikon bawaan dengan SVG kustom */}
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

        {/* Content Section */}
        <div className="px-4">
          <div className="max-w-6xl mx-auto">
            {/* Outer Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-300 p-8">
              {/* Header War Room */}
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold text-[#000000] mb-4">
                    War Room - Aktif
                  </h1>
                  <div className="bg-[#0F2C59] text-white px-4 py-1 rounded-2xl inline-flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {warRoomData.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">1 jam yang lalu</div>
              </div>

              {/* Inner Card */}
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
                {/* Header Card */}
                <div className="p-6">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <img
                      src="/assets/Logo Report.png"
                      alt="Report Logo"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h1 className="text-2xl font-semibold text-[#000000] text-center">
                    {warRoomData.judul}
                  </h1>
                  <div className="text-gray-600 text-sm text-center mt-3">
                    <p>
                      Tiket insiden dengan ID Tilet #{warRoomData.idTiket}{" "}
                      membutuhkan koordinasi segera antara
                    </p>
                    <p>
                      beberapa OPD terkait untuk penanganan gangguan jaringan
                      yang berdampak pada layanan.
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* OPD Terlibat */}
                  <div>
                    <div className="space-y-8">
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
                              OPD Terlibat:
                            </label>
                            <div className="space-y-2">
                              {warRoomData.opdTerkait.map((opd, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                                  <span className="text-sm text-gray-800">
                                    {opd}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Link Meet dan Waktu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Link Meet */}
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
                            War Room Link:
                          </label>
                          <div className="flex items-center gap-2">
                            
                            <a
                              href={warRoomData.linkMeet}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                            >
                              {warRoomData.linkMeet}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Waktu Mulai */}
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
                              d="M36 26.4561C30.7663 26.4561 26.5 30.7224 26.5 35.9561C26.5 41.1898 30.7663 45.4561 36 45.4561C41.2337 45.4561 45.5 41.1898 45.5 35.9561C45.5 30.7224 41.2337 26.4561 36 26.4561ZM39.5 38.4561C39.5 38.6881 39.4078 38.9107 39.2437 39.0748C39.0796 39.2389 38.8571 39.3311 38.625 39.3311H34.5V33.4561C34.5 33.224 34.5922 33.0015 34.7563 32.8374C34.9204 32.6733 35.1429 32.5811 35.375 32.5811H36.625C36.8571 32.5811 37.0796 32.6733 37.2437 32.8374C37.4078 33.0015 37.5 33.224 37.5 33.4561V36.7061H38.625C38.8571 36.7061 39.0796 36.7982 39.2437 36.9623C39.4078 37.1264 39.5 37.349 39.5 37.5811V38.4561Z"
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
                            Waktu Mulai:
                          </label>
                          <div className="text-sm text-gray-800 bg-gray-50 px-4 py-3 rounded-md">
                            {warRoomData.tanggalWaktu}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Durasi */}
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
                            d="M36 26.4561C30.7663 26.4561 26.5 30.7224 26.5 35.9561C26.5 41.1898 30.7663 45.4561 36 45.4561C41.2337 45.4561 45.5 41.1898 45.5 35.9561C45.5 30.7224 41.2337 26.4561 36 26.4561ZM36 28.9561C40.1421 28.9561 43.5 32.314 43.5 36.4561C43.5 40.5982 40.1421 43.9561 36 43.9561C31.8579 43.9561 28.5 40.5982 28.5 36.4561C28.5 32.314 31.8579 28.9561 36 28.9561Z"
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
                          Estimasi Durasi:
                        </label>
                        <div className="text-sm text-gray-800 bg-gray-50 px-4 py-3 rounded-md">
                          {warRoomData.durasi}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teks tambahan di bawah card dalam tetapi tetap dalam card luar */}
              <div className="mt-12 space-y-6 text-left">
                

               

                <div className="text-gray-800">
                  <p className="text-sm font-semibold">
                    {warRoomData.pesanAkhir}
                  </p>
                </div>
              </div>

             
            </div>
          </div>
        </div>
      </div>

      {/* Popup Warning (opsional, jika ingin konfirmasi) */}
      {showSubmitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 0C77.615 0 100 22.385 100 50C100 77.615 77.615 100 50 100C22.385 100 0 77.615 0 50C0 22.385 22.385 0 50 0ZM50 10C39.3913 10 29.2172 14.2143 21.7157 21.7157C14.2143 29.2172 10 39.3913 10 50C10 60.6087 14.2143 70.7828 21.7157 78.2843C29.2172 85.7857 39.3913 90 50 90C60.6087 90 70.7828 85.7857 78.2843 78.2843C85.7857 70.7828 90 60.6087 90 50C90 39.3913 85.7857 29.2172 78.2843 21.7157C70.7828 14.2143 60.6087 10 50 10ZM50 65C51.3261 65 52.5979 65.5268 53.5355 66.4645C54.4732 67.4021 55 68.6739 55 70C55 71.3261 54.4732 72.5979 53.5355 73.5355C52.5979 74.4732 51.3261 75 50 75C48.6739 75 47.4021 74.4732 46.4645 73.5355C45.5268 72.5979 45 71.3261 45 70C45 68.6739 45.5268 67.4021 46.4645 66.4645C47.4021 65.5268 48.6739 65 50 65ZM50 20C51.3261 20 52.5979 20.5268 53.5355 21.4645C54.4732 22.4021 55 23.6739 55 25V55C55 56.3261 54.4732 57.5979 53.5355 58.5355C52.5979 59.4732 51.3261 60 50 60C48.6739 60 47.4021 59.4732 46.4645 58.5355C45.5268 57.5979 45 56.3261 45 55V25C45 23.6739 45.5268 22.4021 46.4645 21.4645C47.4021 20.5268 48.6739 20 50 20Z"
                    fill="#FF5F57"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tandai sebagai sudah dibaca?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Notifikasi akan dihapus dari daftar notifikasi Anda.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 bg-[#0F2C59] text-white rounded-md text-sm font-medium hover:bg-[#15397A] transition-colors"
                >
                  Ya, tandai sudah dibaca
                </button>
                <button
                  onClick={handleCancelSubmit}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifWarRoom;
