import React, { useState, useEffect } from "react";
import { Wrench, PencilIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KnowledgeBaseKota() {
  const [activeTab, setActiveTab] = useState("Review");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch articles dari backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        console.log("📡 Fetching all articles for Admin Kota...");

        // Admin Kota harus fetch SEMUA artikel dari semua user untuk review
        // Bukan my-articles (yang hanya artikel milik user login)
        const response = await fetch("/api/articles/", {
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

        // Log untuk cek struktur data artikel pertama
        if (articlesArray.length > 0) {
          console.log("📄 Sample article structure:", articlesArray[0]);
          console.log(
            "🔍 Available properties:",
            Object.keys(articlesArray[0])
          );
          console.log("📄 All articles:", articlesArray);
        } else {
          console.warn("⚠️ No articles found in response");
        }

        setArticles(articlesArray);
      } catch (err) {
        console.error("❌ Error fetching articles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter data berdasarkan tab aktif
  // Jika backend tidak mengirim field status, tampilkan SEMUA artikel di tab Review terlebih dahulu
  const reviewData = articles.filter((article) => {
    // Jika ada status, gunakan status
    if (article.status) {
      return article.status === "pending" || article.status === "draft";
    }
    // FALLBACK: Jika tidak ada field status sama sekali, tampilkan di Review tab
    // Ini memastikan artikel tetap muncul meskipun backend belum kirim field status
    return true;
  });

  const approveData = articles.filter((article) => {
    // Jika ada status, gunakan status
    if (article.status) {
      return article.status === "published" || article.status === "rejected";
    }
    // FALLBACK: Jika tidak ada status, cek apakah artikel sudah di-approve
    // Jika tidak ada field approved_at/published_at, jangan tampilkan di Approve tab
    return article.approved_at || article.published_at || false;
  });

  const displayedData = activeTab === "Review" ? reviewData : approveData;

  console.log("🔍 Active Tab:", activeTab);
  console.log("📊 Review Data Count:", reviewData.length);
  console.log("📊 Approve Data Count:", approveData.length);
  console.log("📋 Displayed Data:", displayedData);

  const handleEdit = (articleId) => {
    navigate(`/aksikbkota/${articleId}`);
  };

  const handleWrenchClick = () => navigate("/kbeditorkota");

  // Format tanggal
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
    if (!status) return "Review"; // Default status jika tidak ada

    const statusMap = {
      draft: "Draft",
      pending: "Review",
      published: "Approve",
      rejected: "Tolak",
    };
    return statusMap[status] || status;
  };

  // Get status class for styling
  const getStatusClass = (article) => {
    const status =
      article.status ||
      (article.approved_at || article.published_at ? "published" : "pending");

    if (status === "pending" || status === "draft") {
      return "bg-yellow-200 text-yellow-700";
    } else if (status === "published") {
      return "bg-green-200 text-green-700";
    } else if (status === "rejected") {
      return "bg-red-200 text-red-700";
    }
    return "bg-gray-300 text-gray-700";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Judul */}
      <h1 className="text-3xl font-bold text-[#0F2C59]">Knowledge Base</h1>

      {/* Box icon edit */}
      <div
        onClick={handleWrenchClick}
        className="flex flex-col items-start cursor-pointer transition-all"
      >
        <div className="w-28 h-40 bg-white border border-gray-200 rounded-2xl flex justify-center items-center shadow-md hover:shadow-lg transition-all">
          <Wrench size={48} className="text-[#0F2C59]" />
        </div>
        <h2 className="mt-3 ml-10 text-lg font-semibold text-[#0F2C59]">
          Edit
        </h2>
      </div>

      {/* Wrapper utama */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-4">
          {["Review", "Approve"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition-all ${
                activeTab === tab
                  ? "text-[#0F2C59] border-b-4 border-[#0F2C59]"
                  : "text-gray-400 hover:text-[#0F2C59]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2C59] mx-auto mb-2"></div>
            <p className="text-gray-600">Memuat data artikel...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Tabel data */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-[#0F2C59] text-white">
                <tr>
                  <th className="p-3 text-left">Dokumen</th>
                  <th className="p-3 text-left">Tanggal Masuk</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      Tidak ada artikel untuk ditampilkan
                    </td>
                  </tr>
                ) : (
                  displayedData.map((item) => (
                    <tr
                      key={item.article_id}
                      className="border-b hover:bg-gray-50 transition-all text-gray-700"
                    >
                      <td className="p-3">{item.title || "Tanpa Judul"}</td>
                      <td className="p-3">
                        {formatDate(item.created_at || item.updated_at)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            item
                          )}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleEdit(item.article_id)}
                          className="text-[#0F2C59] hover:text-[#15397A]"
                        >
                          <PencilIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center text-sm text-gray-600 p-3 border-t">
              <span>
                Menampilkan data 1 sampai {displayedData.length} dari{" "}
                {displayedData.length} data
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                  &lt;
                </button>
                <button className="px-3 py-1 border rounded-lg bg-[#0F2C59] text-white">
                  1
                </button>
                <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
