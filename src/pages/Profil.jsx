import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimpleLayout from "../components/Layout/SimpleLayout";
import Navbar from "../components/Layout/Navbar";

// Import Sidebars
import SidebarOpd from "../components/Layout/SidebarOpd";
import SidebarMasyarakat from "../components/Layout/SidebarMasyarakat";
import SidebarTeknisi from "../components/Layout/SidebarTeknisi";
import SidebarBidang from "../components/Layout/SidebarBidang";
import SidebarSeksi from "../components/Layout/SidebarSeksi";
import SidebarKota from "../components/Layout/SidebarKota";

const ProfilUniversal = () => {
  const [profileData, setProfileData] = useState({
    id: "",
    email: "",
    full_name: "",
    phone_number: "",
    profile_url: "",
    role: "",
    role_id: "",
    nik: "",
    alamat: "",
    dinas: "",
    unit_kerja: "",
    name: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token) {
          navigate("/login");
          return;
        }

        // FIX: Gunakan hanya role_id untuk menentukan endpoint
        const isMasyarakat = storedUser.role_id === "9";
        const endpoint = isMasyarakat ? `/api/me/masyarakat` : `/api/me`;

        console.log("🔍 Fetching profile from:", endpoint);
        console.log("📦 Stored user data:", storedUser);

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📥 Full API response:", data);

        // Periksa apakah data memiliki wrapper "user" atau langsung
        let userDataFromApi = data;
        if (data.status === "success" && data.user) {
          userDataFromApi = data.user;
          console.log("👤 Using wrapped user data:", userDataFromApi);
        }

        // Debug struktur data
        console.log("🔍 Data structure check:", {
          role: userDataFromApi.role,
          roleType: typeof userDataFromApi.role,
          unitKerja: userDataFromApi.unit_kerja,
          unitKerjaType: typeof userDataFromApi.unit_kerja,
          hasAlamat: !!userDataFromApi.alamat,
          hasDinas: !!userDataFromApi.dinas,
        });

        // Helper functions untuk mengekstrak data dengan aman
        const getSafeRole = (role) => {
          if (!role) return '';
          if (typeof role === 'string') return role;
          if (role && typeof role === 'object' && role.nama) return role.nama;
          return '';
        };

        const getSafeDinas = (user) => {
          if (user.dinas) return user.dinas;
          if (user.unit_kerja) {
            if (typeof user.unit_kerja === 'string') return user.unit_kerja;
            if (user.unit_kerja && typeof user.unit_kerja === 'object') {
              if (user.unit_kerja.nama) return user.unit_kerja.nama;
              if (user.unit_kerja.dinas && user.unit_kerja.dinas.nama) {
                return user.unit_kerja.dinas.nama;
              }
            }
          }
          if (user.department) return user.department;
          if (user.instansi) return user.instansi;
          return '';
        };

        const getSafeUnitKerja = (unitKerja) => {
          if (!unitKerja) return '';
          if (typeof unitKerja === 'string') return unitKerja;
          if (unitKerja && typeof unitKerja === 'object' && unitKerja.nama) {
            return unitKerja.nama;
          }
          return '';
        };

        const extractedRole = getSafeRole(userDataFromApi.role);
        const extractedDinas = getSafeDinas(userDataFromApi);
        const extractedUnitKerja = getSafeUnitKerja(userDataFromApi.unit_kerja);

        const profilePayload = {
          id: userDataFromApi.id || "",
          email: userDataFromApi.email || "",
          full_name: userDataFromApi.full_name || userDataFromApi.name || "",
          phone_number: userDataFromApi.phone_number || userDataFromApi.no_hp || "",
          profile_url: userDataFromApi.profile_url || userDataFromApi.avatar || "",
          role: extractedRole,
          role_id: userDataFromApi.role_id || storedUser.role_id || "",
          nik: userDataFromApi.nik || "",
          alamat: userDataFromApi.alamat || userDataFromApi.address || userDataFromApi.lokasi || "",
          dinas: extractedDinas,
          unit_kerja: extractedUnitKerja,
          name: userDataFromApi.name || "",
          username: userDataFromApi.username || "",
        };

        console.log("✅ Profile data to set:", profilePayload);
        setProfileData(profilePayload);
        
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError("Gagal memuat data profil. Silakan coba lagi.");
        
        // Fallback: Gunakan data dari localStorage jika API error
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser) {
          console.log("🔄 Using fallback data from localStorage");
          setProfileData(prev => ({
            ...prev,
            full_name: storedUser.name || storedUser.username || "",
            email: storedUser.email || "",
            role: storedUser.role_name || storedUser.role || "",
            role_id: storedUser.role_id || "",
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Pilih Sidebar berdasarkan role
  const getSidebar = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const roleId = profileData.role_id || userData.role_id;

    console.log("🎯 Sidebar selection - role_id:", roleId);

    switch (roleId) {
      case "1": // diskominfo = Admin Kota
        return SidebarKota;
      case "2": // opd = Pegawai OPD
      case "3": // verifikator
      case "5": // admin dinas = Admin OPD
        return SidebarOpd;
      case "6": // teknisi
        return SidebarTeknisi;
      case "7": // bidang
        return SidebarBidang;
      case "8": // seksi
        return SidebarSeksi;
      case "9": // masyarakat
        return SidebarMasyarakat;
      default:
        console.warn("⚠️ Unknown role_id, defaulting to SidebarOpd");
        return SidebarOpd;
    }
  };

  const SidebarComponent = getSidebar();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        {/* Skeleton Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow animate-pulse">
          <div className="p-4">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton Main Content */}
        <div className="flex-1 ml-64">
          <div className="fixed top-0 left-64 right-0 bg-white shadow z-10 h-20 animate-pulse">
            <div className="flex items-center justify-end p-4 space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-48 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <main className="pt-20 p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar placeholder */}
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow"></div>

        {/* Main content with error */}
        <div className="flex-1 ml-64">
          <div className="fixed top-0 left-64 right-0 bg-white shadow z-10 h-20"></div>
          <main className="pt-20 p-6">
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-500 mb-4 text-4xl">⚠️</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#226597] text-white px-4 py-2 rounded-lg hover:bg-[#1a4d75] transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <SimpleLayout
      sidebar={SidebarComponent}
      navbar={Navbar}
      profileData={profileData}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 md:px-6 py-4 md:py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-semibold text-[#226597]">
                Profil Saya
              </h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg p-4 md:p-5 mb-4 md:mb-6 w-full">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0">
                {/* Avatar */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#226597]">
                  <img
                    src={profileData.profile_url || "/assets/Lomon.png"}
                    alt={profileData.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/assets/Lomon.png";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="text-center sm:text-left">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    {profileData.full_name || "Pengguna"}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    <span className="inline-block bg-[#226597] text-white text-sm font-normal px-3 py-1 rounded-full">
                      {profileData.role === "opd" ? "OPD" : profileData.role || "User"}
                    </span>
                    {profileData.unit_kerja && (
                      <span className="inline-block bg-green-100 text-green-800 text-sm font-normal px-3 py-1 rounded-full">
                        {profileData.unit_kerja}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Pribadi */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6 w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nama Lengkap
                </label>
                <p className="text-gray-500 text-sm md:text-base">
                  {profileData.full_name || "-"}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <p className="text-gray-500 text-sm md:text-base break-all">
                  {profileData.email || "-"}
                </p>
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Alamat
                </label>
                <p className="text-gray-500 text-sm md:text-base">
                  {profileData.alamat || "-"}
                </p>
              </div>

              {/* Dinas */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Dinas
                </label>
                <p className="text-gray-500 text-sm md:text-base">
                  {profileData.dinas || profileData.unit_kerja || "-"}
                </p>
              </div>

              {/* Nomor Telepon */}
              {profileData.phone_number && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Nomor Telepon
                  </label>
                  <p className="text-gray-500 text-sm md:text-base">
                    {formatPhoneNumber(profileData.phone_number)}
                  </p>
                </div>
              )}

              {/* NIK */}
              {profileData.nik && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      NIK
                    </label>
                    <p className="text-gray-500 text-sm md:text-base">
                      {formatNIK(profileData.nik)}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default ProfilUniversal;
