import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutOpd from "../../components/Layout/LayoutOPD";

export default function LihatArtikel() {
  const navigate = useNavigate();
  const { articleId } = useParams();

  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawApiResponse, setRawApiResponse] = useState(null);

  useEffect(() => {
    const fetchArtikelDetail = async () => {
      if (!articleId) {
        setError("Article ID tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setRawApiResponse(null);

        const token = localStorage.getItem("token");
        console.log("🔑 Token tersedia:", !!token);
        console.log("📋 Article ID:", articleId);

        // Endpoint yang benar sesuai dengan backend API
        const endpoint = `/api/articles/articles/${articleId}`;
        console.log("🔍 Mengambil data dari endpoint:", endpoint);

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📡 Status response:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Error response:", errorText);
          throw new Error(
            `HTTP ${response.status}: Gagal mengambil data artikel`
          );
        }

        const responseData = await response.json();
        console.log("📥 RAW API RESPONSE:", responseData);
        console.log("📊 Tipe response:", typeof responseData);
        console.log("🔑 Keys dalam response:", Object.keys(responseData));

        // Simpan raw response untuk debugging
        setRawApiResponse(responseData);

        // 2. Coba endpoint untuk konten lengkap (jika diperlukan)
        let fullContent = null;
        let authorData = null;
        let tagsData = [];

        // Analisis struktur response
        let articleData = null;

        // Cek berbagai kemungkinan struktur
        if (responseData.data && typeof responseData.data === "object") {
          console.log("📋 Struktur: responseData.data");
          articleData = responseData.data;
        } else if (responseData.article) {
          console.log("📋 Struktur: responseData.article");
          articleData = responseData.article;
        } else {
          console.log("📋 Struktur: responseData langsung");
          articleData = responseData;
        }

        console.log("📄 Article data setelah parsing:", articleData);
        console.log(
          "📄 Article content length:",
          articleData.content?.length || 0
        );
        console.log("📄 Article tags:", articleData.tags);
        console.log("📄 Article author:", articleData.author);

        // Format data untuk ditampilkan
        const formatDate = (dateString) => {
          if (!dateString) return "Tidak Diketahui";
          try {
            return new Date(dateString).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch (error) {
            return dateString;
          }
        };

        const formatStatus = (status) => {
          const statusMap = {
            draft: "Draft",
            pending: "Menunggu Review",
            approved: "Disetujui",
            published: "Published",
            rejected: "Ditolak",
          };
          return statusMap[status] || status || "Draft";
        };

        // Buat objek artikel dengan struktur yang sesuai dengan response backend
        const mappedArtikel = {
          id: articleData.article_id || articleId,
          judul: articleData.title || "Tanpa Judul",
          penulis: articleData.author?.name || "Penulis Tidak Diketahui",
          penulis_email: articleData.author?.email || "",
          penulis_id: articleData.author?.id || "",
          tags: articleData.tags || [],
          gambar: articleData.cover_path || "",
          isi:
            articleData.content ||
            "<div class='p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700'><p><strong>Informasi:</strong> Konten artikel tidak tersedia.</p></div>",
          created_at: formatDate(articleData.created_at),
          updated_at: formatDate(articleData.updated_at),
          status: formatStatus(articleData.status),
          rawData: articleData, // Simpan raw data untuk debugging
        };

        console.log("✅ Data artikel siap ditampilkan:", mappedArtikel);
        setArtikel(mappedArtikel);
      } catch (err) {
        console.error("❌ Error detail:", err);
        setError(err.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchArtikelDetail();
  }, [articleId]);

  // Loading state
  if (loading) {
    return (
      <LayoutOpd>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat artikel...</p>
            {articleId && (
              <p className="text-sm text-gray-500 mt-2">ID: {articleId}</p>
            )}
          </div>
        </div>
      </LayoutOpd>
    );
  }

  // Error state dengan debug info
  if (error || !artikel) {
    return (
      <LayoutOpd>
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="text-red-500 mb-4 text-5xl">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Gagal Memuat Artikel
                </h2>
                <p className="text-gray-600 mb-6">
                  {error || "Artikel tidak ditemukan"}
                </p>
              </div>

              {/* Debug Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Informasi Debug:
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Article ID:</strong> {articleId}
                  </p>
                  <p>
                    <strong>Endpoint:</strong> /api/articles/articles/
                    {articleId}
                  </p>
                  <p>
                    <strong>Token tersedia:</strong>{" "}
                    {localStorage.getItem("token") ? "Ya" : "Tidak"}
                  </p>
                </div>
              </div>

              {/* Raw API Response (jika ada) */}
              {rawApiResponse && (
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-auto">
                  <h3 className="font-semibold mb-3">Raw API Response:</h3>
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(rawApiResponse, null, 2)}
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/dashboardopd")}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  Kembali ke Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </LayoutOpd>
    );
  }

  // Main Content
  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-4 pb-8">
          <div className="px-4 md:px-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
              {/* Header */}
              <div className="border-b pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0F2C59] mb-3">
                  {artikel.judul}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">Penulis:</span>
                    <span>{artikel.penulis}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        artikel.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : artikel.status === "Menunggu Review" ||
                            artikel.status === "Dalam Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : artikel.status === "Ditolak"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {artikel.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {artikel.created_at && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Dibuat: {artikel.created_at}</span>
                    </div>
                  )}

                  {artikel.updated_at && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Diupdate: {artikel.updated_at}</span>
                    </div>
                  )}

                  {artikel.views > 0 && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>{artikel.views} kali dilihat</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {artikel.tags && artikel.tags.length > 0 ? (
                  artikel.tags.map((tag, index) => {
                    const tagName =
                      typeof tag === "object"
                        ? tag.tag_name ||
                          tag.name ||
                          tag.title ||
                          JSON.stringify(tag)
                        : tag;

                    return (
                      <span
                        key={index}
                        className="bg-[#0F2C59] text-white text-sm px-3 py-1 rounded-lg font-semibold shadow hover:bg-[#1a3b6e] transition-colors"
                      >
                        {tagName}
                      </span>
                    );
                  })
                ) : (
                  <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-lg font-medium">
                    Tidak ada kategori
                  </span>
                )}
              </div>

              {/* Cover Image */}
              {artikel.gambar && (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={artikel.gambar}
                    alt={artikel.judul}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/800x400/226597/FFFFFF?text=${encodeURIComponent(
                        artikel.judul
                      )}`;
                    }}
                  />
                </div>
              )}

              {/* Excerpt */}
              {artikel.excerpt && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 italic text-gray-700 rounded-r">
                  <p className="font-medium mb-1">Ringkasan:</p>
                  <p>"{artikel.excerpt}"</p>
                </div>
              )}

              {/* Main Content */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="prose prose-lg max-w-none min-h-[200px]">
                  {artikel.isi ? (
                    <div dangerouslySetInnerHTML={{ __html: artikel.isi }} />
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">
                        Konten Belum Tersedia
                      </h3>
                      <p className="mb-4">
                        Artikel ini sedang dalam proses penulisan atau review.
                      </p>
                      <p className="text-sm">
                        Status saat ini:{" "}
                        <span className="font-semibold">{artikel.status}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Disederhanakan */}
              <div className="flex flex-wrap gap-3 pt-6 border-t">
                <button
                  onClick={() => navigate("/dashboardopd")}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Kembali ke Dashboard
                </button>

                {artikel.status === "Draft" && (
                  <button
                    onClick={() => navigate(`/edit-artikel/${artikel.id}`)}
                    className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Artikel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutOpd>
  );
}
