import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOPD";

const KnowledgeBaseDiajukan = () => {
  const [activeTab, setActiveTab] = useState("Review");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        console.log("📡 Fetching submitted articles...");

        const response = await fetch("/api/articles/my-articles", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data artikel");
        }

        const data = await response.json();
        console.log("📥 Articles response:", data);

        // Extract articles array
        const articlesArray = Array.isArray(data)
          ? data
          : data.data
          ? data.data
          : [];

        console.log("📋 Total articles:", articlesArray.length);
        console.log("📄 Sample article:", articlesArray[0]);

        setArticles(articlesArray);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching articles:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles based on active tab
  const reviewData = articles.filter((article) => {
    // Review tab: pending or draft status
    if (article.status) {
      return article.status === "pending" || article.status === "draft";
    }
    return true; // Show articles without status in Review tab
  });

  const approveData = articles.filter((article) => {
    // Approve tab: approved, published, or rejected status
    if (article.status) {
      return (
        article.status === "approved" ||
        article.status === "published" ||
        article.status === "rejected"
      );
    }
    return false;
  });

  const displayedData = activeTab === "Review" ? reviewData : approveData;

  console.log("🔍 Active Tab:", activeTab);
  console.log("📊 Review Data Count:", reviewData.length);
  console.log("📊 Approve Data Count:", approveData.length);
  console.log("📋 Displayed Data:", displayedData);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Status mapping
  const getStatusLabel = (status) => {
    if (!status) return "Review";

    const statusMap = {
      draft: "Draft",
      pending: "Review",
      approved: "Approve",
      published: "Approve",
      rejected: "Tolak",
    };
    return statusMap[status] || status;
  };

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    if (!status || status === "pending" || status === "draft") {
      return "bg-yellow-500 text-white";
    } else if (status === "approved" || status === "published") {
      return "bg-green-500 text-white";
    } else if (status === "rejected") {
      return "bg-red-500 text-white";
    }
    return "bg-gray-500 text-white";
  };

  // Handle article action
  const handleArticleAction = (articleId) => {
    navigate(`/lihatartikel/${articleId}`);
  };

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="pt-4 pb-8">
          {/* Content Container */}
          <div className="px-4 md:px-6">
            <div className="space-y-6">
              {/* Dashboard Header Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
                <div
                  onClick={() => navigate("/draftbaru")}
                  className="flex flex-col items-center justify-center text-center py-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                >
                  {/* Logo di tengah card */}
                  <div className="w-12 h-12 flex items-center justify-center mb-3">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M40.625 6.25H9.375C8.5462 6.25 7.75134 6.57924 7.16529 7.16529C6.57924 7.75134 6.25 8.5462 6.25 9.375V40.625C6.25 41.4538 6.57924 42.2487 7.16529 42.8347C7.75134 43.4208 8.5462 43.75 9.375 43.75H40.625C41.4538 43.75 42.2487 43.4208 42.8347 42.8347C43.4208 42.2487 43.75 41.4538 43.75 40.625V9.375C43.75 8.5462 43.4208 7.75134 42.8347 7.16529C42.2487 6.57924 41.4538 6.25 40.625 6.25ZM35.9375 26.5625H26.5625V35.9375C26.5625 36.3519 26.3979 36.7493 26.1049 37.0424C25.8118 37.3354 25.4144 37.5 25 37.5C24.5856 37.5 24.1882 37.3354 23.8951 37.0424C23.6021 36.7493 23.4375 36.3519 23.4375 35.9375V26.5625H14.0625C13.6481 26.5625 13.2507 26.3979 12.9576 26.1049C12.6646 25.8118 12.5 25.4144 12.5 25C12.5 24.5856 12.6646 24.1882 12.9576 23.8951C13.2507 23.6021 13.6481 23.4375 14.0625 23.4375H23.4375V14.0625C23.4375 13.6481 23.6021 13.2507 23.8951 12.9576C24.1882 12.6646 24.5856 12.5 25 12.5C25.4144 12.5 25.8118 12.6646 26.1049 12.9576C26.3979 13.2507 26.5625 13.6481 26.5625 14.0625V23.4375H35.9375C36.3519 23.4375 36.7493 23.6021 37.0424 23.8951C37.3354 24.1882 37.5 24.5856 37.5 25C37.5 25.4144 37.3354 25.8118 37.0424 26.1049C36.7493 26.3979 36.3519 26.5625 35.9375 26.5625Z"
                        fill="#113F67"
                      />
                    </svg>
                  </div>

                  {/* Teks di bawah logo */}
                  <p className="text-sm font-medium text-gray-700">
                    Draft baru
                  </p>
                </div>
              </div>

              {/* Card untuk Pelaporan dan Filter Pencarian */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
                {/* Tab Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  {/* Tab Navigation - Review & Approve */}
                  <div className="flex space-x-4 sm:space-x-8 border-b border-gray-200 pb-0.5 w-full sm:w-auto overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("Review")}
                      className={`pb-3 px-1 font-medium text-sm whitespace-nowrap ${
                        activeTab === "Review"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Review
                    </button>
                    <button
                      onClick={() => setActiveTab("Approve")}
                      className={`pb-3 px-1 font-medium text-sm whitespace-nowrap ${
                        activeTab === "Approve"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#226597] mx-auto mb-2"></div>
                    <p className="text-gray-600">Memuat data artikel...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center py-8">
                    <p className="text-red-600">Error: {error}</p>
                  </div>
                )}

                {/* Table Section */}
                {!loading && !error && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-[#226597] p-3 md:p-4 grid grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm font-medium text-white text-left">
                      <div className="min-w-[200px]">Dokumen</div>
                      <div className="min-w-[120px]">Tanggal masuk</div>
                      <div className="min-w-[120px]">Status</div>
                      <div className="min-w-[60px]">Aksi</div>
                    </div>

                    {/* Table Data */}
                    <div className="rounded-b-lg">
                      {displayedData.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          Tidak ada artikel untuk ditampilkan
                        </div>
                      ) : (
                        displayedData.map((item, index) => (
                          <div
                            key={item.article_id}
                            className={`p-3 md:p-4 grid grid-cols-4 gap-2 md:gap-4 text-sm text-left items-center ${
                              index !== displayedData.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            {/* Dokumen dengan logo */}
                            <div className="flex items-center space-x-3 min-w-[200px]">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.68 7.01449C20.4579 6.55044 20.1451 6.13561 19.76 5.79449L16.76 3.07449C16.0997 2.46924 15.2613 2.09388 14.37 2.00449H8.21C7.54756 1.9764 6.88615 2.08034 6.26425 2.31027C5.64236 2.5402 5.07241 2.89152 4.58757 3.34379C4.10273 3.79606 3.71269 4.34024 3.44014 4.94467C3.16758 5.5491 3.01797 6.2017 3 6.86449V17.1645C3.03538 18.164 3.36969 19.13 3.95975 19.9375C4.54981 20.745 5.36849 21.3571 6.31 21.6945C6.92211 21.9272 7.57609 22.0293 8.23 21.9945H15.79C16.4524 22.0226 17.1139 21.9186 17.7357 21.6887C18.3576 21.4588 18.9276 21.1075 19.4124 20.6552C19.8973 20.2029 20.2873 19.6587 20.5599 19.0543C20.8324 18.4499 20.982 17.7973 21 17.1345V8.56449C21.0048 8.03094 20.8957 7.50251 20.68 7.01449ZM7.68 6.61449H10.94C11.2052 6.61449 11.4596 6.71985 11.6471 6.90738C11.8346 7.09492 11.94 7.34927 11.94 7.61449C11.94 7.87971 11.8346 8.13406 11.6471 8.3216C11.4596 8.50913 11.2052 8.61449 10.94 8.61449H7.68C7.41478 8.61449 7.16043 8.50913 6.97289 8.3216C6.78536 8.13406 6.68 7.87971 6.68 7.61449C6.68 7.34927 6.78536 7.09492 6.97289 6.90738C7.16043 6.71985 7.41478 6.61449 7.68 6.61449ZM16.38 17.3245H7.68C7.41478 17.3245 7.16043 17.2191 6.97289 17.0316C6.78536 16.8441 6.68 16.5897 6.68 16.3245C6.68 16.0593 6.78536 15.8049 6.97289 15.6174C7.16043 15.4298 7.41478 15.3245 7.68 15.3245H16.38C16.6184 15.3585 16.8365 15.4773 16.9943 15.6592C17.1521 15.841 17.2389 16.0737 17.2389 16.3145C17.2389 16.5553 17.1521 16.788 16.9943 16.9698C16.8365 17.1517 16.6184 17.2705 16.38 17.3045V17.3245ZM16.38 12.9745H7.68C7.41478 12.9745 7.16043 12.8691 6.97289 12.6816C6.78536 12.4941 6.68 12.2397 6.68 11.9745C6.68 11.7093 6.78536 11.4549 6.97289 11.2674C7.16043 11.0798 7.41478 10.9745 7.68 10.9745H16.38C16.6452 10.9745 16.8996 11.0798 17.0871 11.2674C17.2746 11.4549 17.38 11.7093 17.38 11.9745C17.38 12.2397 17.2746 12.4941 17.0871 12.6816C16.8996 12.8691 16.6452 12.9745 16.38 12.9745ZM16.06 7.40449C15.9173 7.40581 15.7758 7.37885 15.6436 7.32517C15.5114 7.27148 15.3912 7.19214 15.2899 7.09172C15.1885 6.9913 15.1081 6.8718 15.0532 6.74011C14.9983 6.60842 14.97 6.46716 14.97 6.32449V3.67449C15.63 3.83449 18.2 6.47449 18.76 6.91449C18.9256 7.05401 19.0674 7.2195 19.18 7.40449H16.06Z"
                                    fill="#113F67"
                                  />
                                </svg>
                              </div>
                              <span className="text-gray-800 font-medium truncate">
                                {item.title || "Tanpa Judul"}
                              </span>
                            </div>

                            {/* Tanggal masuk */}
                            <div className="text-gray-600 min-w-[120px]">
                              {formatDate(item.created_at || item.updated_at)}
                            </div>

                            {/* Status */}
                            <div className="min-w-[120px]">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  item.status
                                )}`}
                              >
                                {getStatusLabel(item.status)}
                              </span>
                            </div>

                            {/* Aksi */}
                            <div className="min-w-[60px] flex justify-start">
                              <button
                                onClick={() =>
                                  handleArticleAction(item.article_id)
                                }
                                className="text-[#226597] hover:text-[#113F67] transition-colors duration-200"
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mt-4 p-3 md:p-4 border-t border-gray-200">
                      <div className="text-left order-2 sm:order-1">
                        Menampilkan data 1 sampai {displayedData.length} dari{" "}
                        {displayedData.length} data
                      </div>

                      {/* Pagination Navigation */}
                      <div className="flex items-center space-x-3 md:space-x-4 order-1 sm:order-2 mb-3 sm:mb-0">
                        {/* Tombol Previous */}
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

                        {/* Nomor Halaman */}
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <span className="text-[#226597] font-medium">1</span>
                        </div>

                        {/* Tombol Next */}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutOpd>
  );
};

export default KnowledgeBaseDiajukan;
