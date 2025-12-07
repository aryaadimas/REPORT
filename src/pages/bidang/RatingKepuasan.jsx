import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutBidang from "../../components/Layout/LayoutBidang";

const RatingKepuasan = () => {
  const [activeTab, setActiveTab] = useState("pelaporan");
  const navigate = useNavigate();

  const stats = [];

  // Data tabel - diubah untuk menyesuaikan dengan gambar
  const tableData = [
    {
      name: "Doni Ridho",
      aset: "Laptop Acer",
      date: "18/09/2024",
      completionDate: "18/09/2024",
      avatar: "/assets/Haechan.jpg",
      seri: "LPT-A-021",
      rating: 4,
    },
    {
      name: "Rio Widoro",
      aset: "Laptop Lenovo",
      date: "18/09/2024",
      completionDate: "18/09/2024",
      avatar: "/assets/Rio.jpeg",
      seri: "LPT-LNV-001",
      rating: 4,
    },
    {
      name: "Lia Yustia",
      aset: "Wifi",
      date: "17/09/2024",
      completionDate: "17/09/2024",
      avatar: "/assets/Lia.jpg",
      seri: "WF-012",
      rating: 4,
    },
    {
      name: "Bagas Arif",
      aset: "Printer Epson",
      date: "20/09/2024",
      completionDate: "21/09/2024",
      avatar: "/assets/Haechan.jpg",
      seri: "PR-EP-014",
      rating: 5,
    },
    {
      name: "Sinta Wulandari",
      aset: "CCTV Hikvision",
      date: "22/09/2024",
      completionDate: "23/09/2024",
      avatar: "/assets/Rio.jpeg",
      seri: "CT-HV-022",
      rating: 3,
    },
    {
      name: "Kevin Hartanta",
      aset: "Router TP-Link",
      date: "19/09/2024",
      completionDate: "19/09/2024",
      avatar: "/assets/Lia.jpg",
      seri: "RT-TPL-003",
      rating: 5,
    },
    {
      name: "Rani Amelia",
      aset: "PC Dell Mini",
      date: "10/09/2024",
      completionDate: "11/09/2024",
      avatar: "/assets/Haechan.jpg",
      seri: "PC-DL-088",
      rating: 4,
    },
    {
      name: "Dewi Nursita",
      aset: "Scanner Canon",
      date: "08/09/2024",
      completionDate: "08/09/2024",
      avatar: "/assets/Rio.jpeg",
      seri: "SC-CN-009",
      rating: 3,
    },
    {
      name: "Farel Aditya",
      aset: "Access Point Tenda",
      date: "25/09/2024",
      completionDate: "26/09/2024",
      avatar: "/assets/Lia.jpg",
      seri: "AP-TD-101",
      rating: 4,
    },
    {
      name: "Putri Melani",
      aset: "Monitor LG",
      date: "30/09/2024",
      completionDate: "30/09/2024",
      avatar: "/assets/Haechan.jpg",
      seri: "MN-LG-223",
      rating: 5,
    },
  ];

  // Komponen bintang rating
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              star <= rating ? "text-[#226597]" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Fungsi untuk navigasi ke halaman LihatRating
  const handleLihatRating = (item) => {
    navigate("/lihatratingbidang", { state: { ratingData: item } });
  };

  return (
    <LayoutBidang>
      <div className="min-h-screen bg-gray-50">
        <main className="p-4 md:p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-[#226597] text-left">
              Rating Kepuasan
            </h1>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
            {/* Tabs and Refresh Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
              <div className="flex space-x-4 md:space-x-8 border-b border-gray-200 pb-0.5 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setActiveTab("pelaporan")}
                  className={`pb-3 px-1 font-medium text-xs md:text-sm whitespace-nowrap ${
                    activeTab === "pelaporan"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pelaporan
                </button>
                <button
                  onClick={() => setActiveTab("pelayanan")}
                  className={`pb-3 px-1 font-medium text-xs md:text-sm whitespace-nowrap ${
                    activeTab === "pelayanan"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pelayanan
                </button>
              </div>

              <button className="flex items-center space-x-2 bg-[#226597] hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto justify-center">
                <svg
                  width="14"
                  height="14"
                  className="md:w-4 md:h-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 0C4.11653 0 0.88012 2.7674 0.15332 6.43749H2.37403C3.05827 3.97008 5.31471 2.15625 8 2.15625C9.61425 2.15625 11.073 2.81219 12.1289 3.87109L9.56251 6.43749H16V0L13.6563 2.34375C12.2087 0.895747 10.2093 0 8 0ZM0 9.56251V16L2.34375 13.6563C3.79128 15.1043 5.79069 16 8 16C11.8835 16 15.1199 13.2326 15.8467 9.56251H13.626C12.9417 12.0299 10.6853 13.8437 8 13.8437C6.38575 13.8437 4.92701 13.1878 3.87109 12.1289L6.43749 9.56251H0Z"
                    fill="white"
                  />
                </svg>
                <span className="text-xs md:text-sm font-medium">Refresh</span>
              </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold text-[#226597] mb-4 text-left">
                Filter pencarian
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Data Aset Filter */}
                <div className="text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap w-20">
                      Data Aset
                    </div>
                    <div className="relative flex-1">
                      <select className="w-full text-xs md:text-sm text-gray-700 p-2 bg-white rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                        <option value="">Pilih kategori</option>
                        <option value="sistem-operasi">Sistem Operasi</option>
                        <option value="jaringan">Jaringan</option>
                        <option value="aplikasi">Aplikasi</option>
                        <option value="email">Email</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* No Seri Filter */}
                <div className="text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap w-20">
                      No seri
                    </div>
                    <div className="relative flex-1">
                      <select className="w-full text-xs md:text-sm text-gray-700 p-2 bg-white rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                        <option value="">Pilih jenis</option>
                        <option value="it">IT</option>
                        <option value="non-it">Non-IT</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap w-20">
                      Rating
                    </div>
                    <div className="relative flex-1">
                      <select className="w-full text-xs md:text-sm text-gray-700 p-2 bg-white rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                        <option value="">Pilih rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Desktop Table Header */}
              <div className="bg-[#226597] rounded-t-lg p-3 md:p-4 hidden md:grid"
                style={{
                  gridTemplateColumns: "1fr 0.8fr 0.8fr 1.2fr 0.8fr 0.6fr 0.4fr",
                  gap: "1rem"
                }}
              >
                <div>Pengirim</div>
                <div>Tgl.Awal</div>
                <div>Tgl.Selesai</div>
                <div>Data Aset</div>
                <div>No Seri</div>
                <div>Rating</div>
                <div>Aksi</div>
              </div>

              {/* Mobile Table Header */}
              <div className="bg-[#226597] p-3 md:p-4 text-xs md:text-sm font-medium text-white text-left md:hidden">
                Daftar Rating Kepuasan
              </div>

              {/* Table Body */}
              <div className="rounded-b-lg">
                {tableData.map((item, index) => (
                  <div
                    key={index}
                    className="
                      p-3 md:p-4 
                      hidden md:grid
                      gap-3 text-sm text-left items-center 
                      border-b border-gray-200
                    "
                    style={{
                      gridTemplateColumns: "1fr 0.8fr 0.8fr 1.2fr 0.8fr 0.6fr 0.4fr",
                      gap: "1rem"
                    }}
                  >
                    {/* Pengirim */}
                    <div className="font-medium text-gray-800 flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {item.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="truncate">{item.name}</span>
                    </div>

                    {/* Tanggal Awal */}
                    <div className="text-gray-600 truncate">
                      {item.date}
                    </div>

                    {/* Tanggal Selesai */}
                    <div className="text-gray-600 truncate">
                      {item.completionDate}
                    </div>

                    {/* Data Aset */}
                    <div className="text-gray-600 truncate">
                      {item.aset}
                    </div>

                    {/* No Seri */}
                    <div className="text-gray-600 truncate">
                      {item.seri}
                    </div>

                    {/* Rating */}
                    <div className="truncate">
                      <StarRating rating={item.rating} />
                    </div>

                    {/* Aksi */}
                    <div className="truncate">
                      <button
                        onClick={() => handleLihatRating(item)}
                        className="text-[#113F67] hover:text-[#226597] transition-colors duration-200"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mt-4 p-3 md:p-4 border-t border-gray-200">
                <div className="text-left order-2 sm:order-1">
                  Menampilkan data 1 sampai 10 dari 33 data
                </div>

                <div className="flex items-center space-x-3 md:space-x-4 order-1 sm:order-2 mb-3 sm:mb-0">
                  <button className="text-[#226597] hover:text-[#113F67] transition-colors duration-200">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span className="text-[#226597] font-medium">1</span>
                    <span className="text-gray-700 hover:text-[#226597] cursor-pointer transition-colors duration-200">
                      2
                    </span>
                    <span className="text-gray-700 hover:text-[#226597] cursor-pointer transition-colors duration-200">
                      3
                    </span>
                  </div>

                  <button className="text-[#226597] hover:text-[#113F67] transition-colors duration-200">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </LayoutBidang>
  );
};

export default RatingKepuasan;