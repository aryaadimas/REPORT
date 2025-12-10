import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KBMasyarakat() {
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showArticlePopup, setShowArticlePopup] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchRef = useRef(null);

  const API_BASE_URL = "https://service-desk-be-production.up.railway.app";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const tagsResponse = await fetch(`${API_BASE_URL}/articles/tags`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!tagsResponse.ok) {
        throw new Error(`HTTP error! status: ${tagsResponse.status}`);
      }

      const tagsData = await tagsResponse.json();
      console.log("Tags data:", tagsData);

      const filteredTags = tagsData.filter((tag) => tag.tag_name !== "alviana");
      setTags(filteredTags);

      const articlesResponse = await fetch(`${API_BASE_URL}/articles/`, {
        headers: {
          accept: "application/json",
        },
      });

      if (!articlesResponse.ok) {
        throw new Error(`HTTP error! status: ${articlesResponse.status}`);
      }

      const articlesData = await articlesResponse.json();
      console.log("Articles data from API:", articlesData);

      const transformedArticles = articlesData.map((article) => ({
        article_id: article.article_id,
        title: article.title,
        content: article.content,
        tag_name:
          article.tags && article.tags.length > 0
            ? article.tags[0].tag_name
            : "Tanpa Kategori",
        tag_id:
          article.tags && article.tags.length > 0
            ? article.tags[0].tag_id
            : null,
        cover_path: article.cover_path,
        author_name: article.author?.full_name || "Admin",
        author_email: article.author?.email,
        tags: article.tags || [],
      }));

      console.log("Transformed articles:", transformedArticles);
      setArticles(transformedArticles);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);

      setTags([
        { tag_id: "1", tag_name: "Akun dan SSO" },
        { tag_id: "2", tag_name: "Layanan dan Formulir" },
        { tag_id: "3", tag_name: "Pelaporan dan Pelayanan" },
      ]);
      setArticles(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => {
    return [
      {
        article_id: "1",
        title: "Cara Login ke Sistem Menggunakan Akun SSO",
        tag_id: "1",
        tag_name: "Akun dan SSO",
        content: "Lorem ipsum dolor sit amet...",
        author_name: "Friska Farinda",
      },
      {
        article_id: "2",
        title: "Panduan Aktivasi Akun Email Dinas Baru",
        tag_id: "1",
        tag_name: "Akun dan SSO",
        content: "Pellentesque suscipit nunc...",
        author_name: "Admin",
      },
      {
        article_id: "3",
        title: "Cara Reset Password untuk Akun SSO",
        tag_id: "1",
        tag_name: "Akun dan SSO",
        content: "Donec viverra tortor...",
        author_name: "Admin",
      },
      {
        article_id: "4",
        title: "Cara Membuat Tiket Laporan Baru di Sistem",
        tag_id: "3",
        tag_name: "Pelaporan dan Pelayanan",
        content: "Lorem ipsum dolor sit amet...",
        author_name: "Admin",
      },
      {
        article_id: "5",
        title: "Langkah-Langkah Melihat Status Tiket",
        tag_id: "3",
        tag_name: "Pelaporan dan Pelayanan",
        content: "Pellentesque suscipit nunc...",
        author_name: "Admin",
      },
      {
        article_id: "6",
        title: "Cara Melihat Riwayat Laporan Tiket Sebelumnya",
        tag_id: "3",
        tag_name: "Pelaporan dan Pelayanan",
        content: "Donec viverra tortor...",
        author_name: "Admin",
      },
      {
        article_id: "7",
        title: "Arti Warna dan Status Tiket",
        tag_id: "3",
        tag_name: "Pelaporan dan Pelayanan",
        content: "Lorem ipsum dolor sit amet...",
        author_name: "Admin",
      },
      {
        article_id: "8",
        title: "Langkah-Langkah untuk Permohonan Pelayanan",
        tag_id: "3",
        tag_name: "Pelaporan dan Pelayanan",
        content: "Pellentesque suscipit nunc...",
        author_name: "Admin",
      },
      {
        article_id: "9",
        title: "Cara Melaporkan Tiket yang Salah Kategori",
        tag_id: "3",
        tag_name: "Pelaporan dan Pelayanan",
        content: "Donec viverra tortor...",
        author_name: "Admin",
      },
      {
        article_id: "10",
        title: "Tambah Dokumen Pendukung Permintaan",
        tag_id: "2",
        tag_name: "Layanan dan Formulir",
        content: "Lorem ipsum dolor sit amet...",
        author_name: "Admin",
      },
      {
        article_id: "11",
        title: "Cara Mengisi Formulir Pelaporan",
        tag_id: "2",
        tag_name: "Layanan dan Formulir",
        content: "Pellentesque suscipit nunc...",
        author_name: "Admin",
      },
      {
        article_id: "12",
        title: "Cara Mengisi Formulir Pelayanan",
        tag_id: "2",
        tag_name: "Layanan dan Formulir",
        content: "Donec viverra tortor...",
        author_name: "Admin",
      },
    ];
  };

  const categories = ["Semua", ...tags.map((tag) => tag.tag_name)];

  const filteredSuggestions = articles.filter((article) => {
    const title = article.title || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredData =
    activeCategory === "Semua"
      ? articles
      : articles.filter((article) => article.tag_name === activeCategory);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteMode = () => {};

  const toggleSelect = (articleId) => {
    setSelected((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleArrowClick = (article) => {
    setSelectedArticle(article);
    setShowArticlePopup(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat knowledge base...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#226597] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#1a5078] transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-4 md:py-8">
        <div className="w-full px-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg py-4 md:py-6 lg:py-8 px-4 md:px-6 lg:px-8 w-full">
            <div className="text-center space-y-2 md:space-y-3 mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#226597]">
                Knowledge Base
              </h1>
              <p className="text-gray-600 text-sm md:text-lg">
                Pelajari dan cari solusi yang Anda butuhkan
              </p>
            </div>

            <div className="max-w-3xl mx-auto mb-6 md:mb-8">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Cari di sini"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  className="w-full text-left px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-300 rounded-2xl md:rounded-3xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#226597] transition-all text-sm md:text-lg pr-12 md:pr-16"
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1639_3478)">
                      <path
                        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                        stroke="#113F67"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.9999 18.9999L14.6499 14.6499"
                        stroke="#113F67"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1639_3478">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl md:rounded-2xl shadow-lg mt-2 z-50 max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((article, index) => (
                      <button
                        key={article.article_id || index}
                        onClick={() => handleSuggestionClick(article.title)}
                        className="w-full text-left px-4 md:px-6 py-2 md:py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-800 text-sm md:text-base">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {article.tag_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-2 md:px-6 md:py-3 rounded-lg transition-all font-medium text-xs md:text-sm ${
                    activeCategory === category
                      ? "bg-[#226597] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredData.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Tidak ada artikel ditemukan</p>
                </div>
              ) : (
                filteredData.map((article) => (
                  <div
                    key={article.article_id || article.title}
                    className={`relative bg-white border border-gray-200 rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 flex flex-col justify-between hover:shadow-lg transition-all min-h-[140px] md:min-h-[160px] ${
                      selected.includes(article.article_id || article.title)
                        ? "ring-2 ring-red-400"
                        : ""
                    }`}
                  >
                    {deleteMode && (
                      <input
                        type="checkbox"
                        checked={selected.includes(
                          article.article_id || article.title
                        )}
                        onChange={() =>
                          toggleSelect(article.article_id || article.title)
                        }
                        className="absolute top-3 left-3 md:top-4 md:left-4 w-4 h-4 md:w-5 md:h-5 accent-red-500 cursor-pointer"
                      />
                    )}

                    <div className={`${deleteMode ? "pl-6 md:pl-8" : ""}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      <span className="inline-block px-2 py-1 md:px-3 md:py-1 text-xs font-medium rounded-lg bg-[#226597] text-white">
                        {article.tag_name}
                      </span>
                    </div>

                    <div className="flex justify-end mt-3 md:mt-4">
                      <button
                        onClick={() => handleArrowClick(article)}
                        disabled={deleteMode}
                        className={`flex items-center text-[#226597] hover:text-[#15397A] transition-all ${
                          deleteMode ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                      >
                        <ArrowRight
                          size={18}
                          className="w-4 h-4 md:w-5 md:h-5"
                        />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showArticlePopup && selectedArticle && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-white text-[#226597] p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-2xl font-bold">
                      {selectedArticle.title}
                    </h2>
                    <div className="mt-1 md:mt-2 text-xs md:text-sm text-black opacity-90">
                      <p>Dari: {selectedArticle.author_name || "Admin"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <button
                      onClick={() => {
                        setShowArticlePopup(false);
                        setSelectedArticle(null);
                      }}
                      className="text-black hover:bg-black hover:bg-opacity-10 rounded-full p-1 md:p-2 transition-all"
                    >
                      <X size={20} className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    <span className="bg-[#226597] text-white px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-medium">
                      {selectedArticle.tag_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto">
                <div className="prose max-w-none">
                  {selectedArticle.cover_path && (
                    <img
                      src={selectedArticle.cover_path}
                      alt="Cover artikel"
                      className="w-full h-64 object-cover rounded-xl mb-4 md:mb-6"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}

                  <div className="text-sm md:text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {selectedArticle.content ||
                      "Konten artikel tidak tersedia."}
                  </div>

                  {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                    <div className="mt-6">
                      <p className="font-medium text-gray-600 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedArticle.tags.map((tag) => (
                          <span
                            key={tag.tag_id}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                          >
                            {tag.tag_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <hr className="my-4 md:my-6 border-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
