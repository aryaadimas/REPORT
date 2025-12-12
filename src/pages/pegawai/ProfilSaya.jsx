import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPegawai from "../../components/Layout/LayoutPegawai";

const API_BASE_URL = "https://service-desk-be-production.up.railway.app";

const ProfilSaya = () => {
  const [profileData, setProfileData] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    profile_url: "",
    role_name: "",
    nik: "",
    alamat: "",
    dinas: "",
    role: "",
    unit_kerja: "",
    name: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    alamat: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteAvatarConfirm, setShowDeleteAvatarConfirm] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Helper function untuk menampilkan avatar
  const getAvatarUrl = (url) => {
    if (!url || url === "" || url === null) {
      return ""; // Kosong, tidak ada gambar
    }
    // Jika URL sudah lengkap, return langsung
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Jika hanya nama file, tambahkan base URL
    return `${API_BASE_URL}/storage/${url}`;
  };

  // Helper function untuk menampilkan placeholder avatar
  const renderAvatarPlaceholder = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);

    return (
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center border-2 border-[#226597]">
        <span className="text-white font-semibold text-lg md:text-xl">
          {initials}
        </span>
      </div>
    );
  };

  // Fetch profile data dari API
  const fetchProfileData = async () => {
    console.log("🔍 [PROFIL] fetchProfileData dipanggil");

    try {
      setLoading(true);
      setError(null);

      // Cari token
      let token = localStorage.getItem("token");

      if (!token) {
        // Cari nama field alternatif
        const possibleKeys = [
          "access_token",
          "jwt",
          "auth_token",
          "accessToken",
          "access",
          "user_token",
        ];

        for (const key of possibleKeys) {
          const value = localStorage.getItem(key);
          if (value) {
            token = value;
            console.log(`✅ [PROFIL] Token ditemukan di key: ${key}`);
            break;
          }
        }
      }

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      console.log("🌐 [PROFIL] Mengakses API:", `${API_BASE_URL}/me`);

      // Fetch data dari API endpoint /me
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 [PROFIL] Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Sesi telah berakhir. Silakan login kembali.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 [PROFIL] API Response data:", data);

      // Parse response sesuai format API
      if (data.status === "success" && data.user) {
        const user = data.user;

        // Mapping data dari API response
        const mappedData = {
          email: user.email || "",
          full_name: user.name || "",
          phone_number: user.phone_number || "",
          profile_url: user.avatar || "",
          role_name: user.role || "",
          nik: user.nik || "",
          alamat: user.alamat || "",
          dinas: user.dinas || "",
          role: user.role || "",
          unit_kerja: user.unit_kerja || "",
          name: user.name || "",
          username: user.username || "",
        };

        console.log("✅ [PROFIL] Data yang akan ditampilkan:", mappedData);

        setProfileData(mappedData);
        setEditData({
          alamat: mappedData.alamat || "",
        });
      } else {
        console.error("❌ [PROFIL] Format data tidak sesuai:", data);
        throw new Error("Format data profil tidak sesuai");
      }
    } catch (err) {
      console.error("❌ [PROFIL] Error fetching profile:", err);
      setError(err.message);

      // Fallback untuk testing jika API error
      const fallbackData = {
        email: "opd@dinaskesehatan.go.id",
        full_name: "OPD Dinas Kesehatan",
        alamat: "Jl. OPD No. 1, Jakarta",
        dinas: "Dinas Kesehatan",
        role: "Pegawai",
      };

      setProfileData(fallbackData);
      setEditData({
        alamat: fallbackData.alamat,
      });

      setError(
        "Tidak dapat mengambil data dari server. Menampilkan data simulasi."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk upload avatar ke API
  const uploadProfileImage = async (file) => {
    try {
      setIsUploading(true);
      setSaveMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const formData = new FormData();
      formData.append("avatar", file); // Sesuaikan dengan nama field yang diharapkan API

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update profile data dengan response dari API
      if (data.status === "success" && data.user) {
        setProfileData((prev) => ({
          ...prev,
          profile_url: data.user.avatar || "",
        }));

        setSaveMessage("Foto profil berhasil diperbarui!");
      } else {
        throw new Error("Format response tidak sesuai");
      }

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error("❌ [PROFIL] Error uploading profile image:", err);
      setSaveMessage("Gagal mengupload foto profil. Silakan coba lagi.");
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Fungsi untuk menghapus avatar dari API
  const deleteAvatarFromAPI = async () => {
    try {
      setIsDeletingAvatar(true);
      setSaveMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const response = await fetch(`${API_BASE_URL}/me/avatar`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setProfileData((prev) => ({
          ...prev,
          profile_url: "",
        }));

        setSaveMessage("Foto profil berhasil dihapus!");
        setShowDeleteAvatarConfirm(false);
      } else {
        throw new Error("Gagal menghapus foto profil");
      }

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error("❌ [PROFIL] Error deleting avatar:", err);
      setSaveMessage("Gagal menghapus foto profil. Silakan coba lagi.");
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  // Fungsi untuk mengupdate alamat ke API
  const updateAddressInAPI = async (alamat) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alamat: alamat,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success" && data.user) {
        return { success: true, data: data.user };
      } else {
        throw new Error("Format response tidak sesuai");
      }
    } catch (err) {
      console.error("❌ [PROFIL] Error updating address:", err);
      throw err;
    }
  };

  useEffect(() => {
    console.log("🚀 [PROFIL] Komponen ProfilSaya dimuat");
    fetchProfileData();
  }, []);

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditData({
        alamat: profileData.alamat || "",
      });
    }
    setIsEditing(!isEditing);
    setSaveMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setSaveMessage("Format file tidak didukung. Gunakan JPG, PNG, atau GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    // Upload ke API
    await uploadProfileImage(file);
  };

  // Fungsi untuk menghapus avatar profil
  const handleDeleteAvatar = async () => {
    await deleteAvatarFromAPI();
  };

  // Fungsi untuk menyimpan perubahan alamat
  const handleSave = async () => {
    if (!editData.alamat.trim()) {
      setSaveMessage("Alamat tidak boleh kosong");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const result = await updateAddressInAPI(editData.alamat);

      if (result.success) {
        setProfileData((prev) => ({
          ...prev,
          alamat: result.data.alamat || editData.alamat,
        }));

        setSaveMessage("Alamat berhasil diperbarui!");
        setIsEditing(false);
      }

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating address:", err);
      setSaveMessage("Gagal memperbarui alamat. Coba lagi nanti.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      alamat: profileData.alamat || "",
    });
    setSaveMessage("");
  };

  // Fungsi untuk refresh data
  const handleRefresh = () => {
    console.log("[PROFIL] Manual refresh dipanggil");
    fetchProfileData();
  };

  const hasAvatar = profileData.profile_url && profileData.profile_url !== "";

  // Render loading state
  if (loading) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 pt-4">
          <div className="px-4 md:px-6 py-4 md:py-8">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mb-4"></div>
                <p className="text-gray-600">Memuat data profil...</p>
              </div>
            </div>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  // Render error state
  if (error && !profileData.email) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 pt-4">
          <div className="px-4 md:px-6 py-4 md:py-8">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
              <div className="text-center py-8">
                <div className="text-red-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gagal Memuat Data
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="bg-[#226597] hover:bg-blue-900 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  return (
    <LayoutPegawai>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="px-4 md:px-6 py-4 md:py-8">
          {/* Profile Header dengan debug button */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-semibold text-[#226597]">
                Profil Saya
              </h1>
              <button
                onClick={handleRefresh}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded flex items-center"
                title="Refresh data"
              >
                <svg
                  className="w-3 h-3 mr-1"
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
                Refresh
              </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg p-4 md:p-5 mb-4 md:mb-6 w-full">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0">
                <div className="relative group">
                  {hasAvatar ? (
                    <>
                      <img
                        src={getAvatarUrl(profileData.profile_url)}
                        alt={profileData.full_name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#226597]"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML =
                            renderAvatarPlaceholder(profileData.full_name);
                        }}
                      />
                      <div className="absolute bottom-0 right-0 flex flex-col space-y-1">
                        <button
                          onClick={handleFileSelect}
                          disabled={isUploading}
                          className="bg-[#226597] text-white p-1.5 rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50"
                          title="Ubah foto profil"
                        >
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {renderAvatarPlaceholder(profileData.full_name)}
                      <div className="absolute bottom-0 right-0">
                        <button
                          onClick={handleFileSelect}
                          disabled={isUploading}
                          className="bg-[#226597] text-white p-1.5 rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50"
                          title="Upload foto profil"
                        >
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    {profileData.full_name || "Tidak ada nama"}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-block bg-[#226597] text-white text-sm font-normal px-3 py-1 rounded-full">
                      {profileData.role === "opd"
                        ? "OPD"
                        : profileData.role || "Pengguna"}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-normal px-3 py-1 rounded-full">
                      Aktif
                    </span>
                    {profileData.unit_kerja && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-normal px-3 py-1 rounded-full">
                        {profileData.unit_kerja}
                      </span>
                    )}
                  </div>
                  {hasAvatar && (
                    <button
                      onClick={() => setShowDeleteAvatarConfirm(true)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 flex items-center space-x-1"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Hapus foto profil</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
            {/* Header + garis tipis */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-300 gap-2 sm:gap-0">
              <h3 className="text-lg font-semibold text-[#226597]">
                Informasi Dasar
              </h3>
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center space-x-1 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Simpan</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-[#226597] hover:bg-blue-900 text-white text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center space-x-1 transition-colors"
                  >
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span>Ubah</span>
                  </button>
                )}
              </div>
            </div>

            {saveMessage && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  saveMessage.includes("berhasil") ||
                  saveMessage.includes("database")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {saveMessage}
              </div>
            )}

            {/* Tabel Informasi Dasar */}
            <div className="mt-4 md:mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Nama Lengkap
                  </label>
                  <p className="text-gray-500 text-sm md:text-base">
                    {profileData.full_name || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Alamat
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        name="alamat"
                        value={editData.alamat}
                        onChange={handleInputChange}
                        placeholder="Masukkan alamat lengkap"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent bg-gray-50"
                        required
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm md:text-base">
                      {profileData.alamat || "-"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Email
                  </label>
                  <p className="text-gray-500 text-sm md:text-base">
                    {profileData.email || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Dinas
                  </label>
                  <p className="text-gray-500 text-sm md:text-base">
                    {profileData.dinas || "-"}
                  </p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-gray-200"></div>
            )}
          </div>
        </div>
      </div>

      {/* Popup Konfirmasi Hapus Avatar */}
      {showDeleteAvatarConfirm && (
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
                Apakah Anda yakin ingin menghapus foto profil?
              </h3>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleDeleteAvatar}
                  disabled={isDeletingAvatar}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isDeletingAvatar ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Ya, hapus</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteAvatarConfirm(false)}
                  disabled={isDeletingAvatar}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutPegawai>
  );
};

export default ProfilSaya;
