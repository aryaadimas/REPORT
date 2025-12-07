import React, { useState, useEffect } from "react";
import LayoutMasyarakat from "../../components/Layout/LayoutMasyarakat";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    id: "",
    email: "",
    full_name: "",
    phone_number: "",
    profile_url: "",
    role_name: "",
    nik: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDateFromNIK = (nik) => {
    if (!nik || nik.length !== 16) return "N/A";

    try {
      const day = nik.substring(6, 8);
      const month = nik.substring(8, 10);
      const year = nik.substring(10, 12);

      const fullYear = parseInt(year) < 30 ? `20${year}` : `19${year}`;

      return `${day}-${month}-${fullYear}`;
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
          id: data.id || "",
          email: data.email || "",
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          profile_url: data.profile_url || "/assets/Lomon.png",
          role_name: data.role_name || "masyarakat",
          nik: data.nik || "",
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading) {
    return (
      <LayoutMasyarakat>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data profil...</p>
          </div>
        </div>
      </LayoutMasyarakat>
    );
  }

  if (error) {
    return (
      <LayoutMasyarakat>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      </LayoutMasyarakat>
    );
  }

  return (
    <LayoutMasyarakat>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="px-4 md:px-6 py-4 md:py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-semibold text-[#226597]">
                Profil Saya
              </h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg p-4 md:p-5 mb-4 md:mb-6 w-full">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0">
                <img
                  src={profileData.profile_url || "/assets/Lomon.png"}
                  alt={profileData.full_name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#226597]"
                  onError={(e) => {
                    e.target.src = "/assets/Lomon.png";
                  }}
                />
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
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-300 gap-2 sm:gap-0">
              <h3 className="text-lg font-semibold text-[#226597]">
                Info Pribadi
              </h3>
              <button
                onClick={handleEditProfile}
                className="bg-[#226597] hover:bg-blue-900 text-white text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center space-x-1 self-end sm:self-auto transition-colors"
              >
                <span>Ubah</span>
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
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-left mt-4 md:mt-6">
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
                  Tanggal Lahir
                </label>
                <p className="text-gray-500 text-sm md:text-base">
                  {formatDateFromNIK(profileData.nik)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nomor Induk Kependudukan
                </label>
                <p className="text-gray-500 text-sm md:text-base break-all font-mono">
                  {formatNIK(profileData.nik)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nomor Telepon
                </label>
                <p className="text-gray-500 text-sm md:text-base">
                  {formatPhoneNumber(profileData.phone_number)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <p className="text-gray-500 text-sm md:text-base break-all">
                  {profileData.email || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutMasyarakat>
  );
};

export default ProfilePage;
