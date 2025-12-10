import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    profile_url: "",
    role_name: "",
    nik: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone_number: "",
    birth_date: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteAvatarConfirm, setShowDeleteAvatarConfirm] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const formatDateFromNIK = (nik) => {
    if (!nik || nik.length !== 16) return "N/A";

    try {
      const day = nik.substring(6, 8);
      const month = nik.substring(8, 10);
      const year = nik.substring(10, 12);

      const fullYear = parseInt(year) < 30 ? `20${year}` : `19${year}`;

      return `${fullYear}-${month}-${day}`;
    } catch (error) {
      return "N/A";
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 11 || cleaned.length === 12) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(
        4,
        8
      )}-${cleaned.substring(8)}`;
    } else if (cleaned.length === 10) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(
        4,
        7
      )}-${cleaned.substring(7)}`;
    }

    return phone;
  };

  const formatNIK = (nik) => {
    if (!nik) return "-";
    return nik.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const getAvatarUrl = (url) => {
    if (!url || url === "" || url === null) {
      return "";
    }
    return url;
  };

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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/me/masyarakat`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data fetched:", data);

        setProfileData({
          email: data.email || "",
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          profile_url: data.profile_url || "",
          role_name: data.role_name || "masyarakat",
          nik: data.nik || "",
        });

        setEditData({
          phone_number: data.phone_number || "",
          birth_date: formatDateFromNIK(data.nik),
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Gagal memuat data profil. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditData({
        phone_number: profileData.phone_number || "",
        birth_date: formatDateFromNIK(profileData.nik),
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

    await uploadProfileImage(file);
  };

  const uploadProfileImage = async (file) => {
    try {
      setIsUploading(true);
      setSaveMessage("");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/me/masyarakat`,
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setProfileData((prev) => ({
        ...prev,
        profile_url: data.profile_url || "",
        full_name: data.full_name || prev.full_name,
        phone_number: data.phone_number || prev.phone_number,
      }));

      setSaveMessage("Foto profil berhasil diperbarui!");

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error uploading profile image:", err);
      setSaveMessage("Gagal mengupload foto profil. Silakan coba lagi.");
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setIsDeletingAvatar(true);
      setSaveMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/me/masyarakat/avatar`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProfileData((prev) => ({
        ...prev,
        profile_url: "",
      }));

      setSaveMessage("Foto profil berhasil dihapus!");
      setShowDeleteAvatarConfirm(false);

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting avatar:", err);
      setSaveMessage("Gagal menghapus foto profil. Silakan coba lagi.");
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  const updateProfileInAPI = async (phoneNumber) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/me/masyarakat`,
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: phoneNumber,
          }),
        }
      );

      console.log("Update response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Update successful:", data);
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.error("Update failed:", errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        };
      }
    } catch (err) {
      console.error("Error updating profile in API:", err);
      return { success: false, error: err.message };
    }
  };

  const handleSave = async () => {
    if (!editData.phone_number.trim()) {
      setSaveMessage("Nomor telepon tidak boleh kosong");
      return;
    }
    const cleanedPhone = editData.phone_number.replace(/\D/g, "");
    if (cleanedPhone.length < 10 || cleanedPhone.length > 13) {
      setSaveMessage("Nomor telepon harus 10-13 digit angka");
      return;
    }

    try {
      setIsSaving(true);

      const result = await updateProfileInAPI(editData.phone_number);

      if (result.success) {
        setProfileData((prev) => ({
          ...prev,
          phone_number: result.data?.phone_number || editData.phone_number,
          full_name: result.data?.full_name || prev.full_name,
        }));

        setSaveMessage("Nomor telepon berhasil diperbarui!");
        setIsEditing(false);
      } else {
        console.log("Trying alternative method with FormData...");

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("phone_number", editData.phone_number);

        const response2 = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/me/masyarakat`,
          {
            method: "PUT",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response2.ok) {
          const data2 = await response2.json();

          setProfileData((prev) => ({
            ...prev,
            phone_number: data2.phone_number || editData.phone_number,
          }));

          setSaveMessage("Nomor telepon berhasil diperbarui!");
          setIsEditing(false);
        } else {
          throw new Error(`Gagal update: ${result.error}`);
        }
      }

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error saving profile:", err);

      setSaveMessage("Gagal memperbarui nomor telepon. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      phone_number: profileData.phone_number || "",
      birth_date: formatDateFromNIK(profileData.nik),
    });
    setSaveMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#226597] text-white px-4 py-2 rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const hasAvatar = profileData.profile_url && profileData.profile_url !== "";

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="px-4 md:px-6 py-4 md:py-8 w-full">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-[#226597]">
              Profil Saya
            </h1>
          </div>

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
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-block bg-[#226597] text-white text-sm font-normal px-3 py-1 rounded-full">
                    {profileData.role_name === "masyarakat"
                      ? "Publik"
                      : profileData.role_name}
                  </span>
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

        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-300 gap-2 sm:gap-0">
            <h3 className="text-lg font-semibold text-[#226597]">
              Info Pribadi
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
                  <span>Ubah Profil</span>
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

          <div className="grid grid-cols-2 gap-6 text-left mt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nama Lengkap
                </label>
                <p className="text-gray-500">{profileData.full_name || "-"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nomor Induk Kependudukan
                </label>
                <p className="text-gray-500 break-all font-mono">
                  {formatNIK(profileData.nik)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <p className="text-gray-500 break-all">
                  {profileData.email || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nomor Telepon
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      name="phone_number"
                      value={editData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      10-13 digit angka
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    {formatPhoneNumber(profileData.phone_number)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 pt-4 border-t border-gray-200"></div>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default ProfilePage;
