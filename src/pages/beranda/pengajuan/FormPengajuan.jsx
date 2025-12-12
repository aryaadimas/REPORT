import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, XCircle, ChevronDown } from "lucide-react";
import LayoutPegawai from "../../../components/Layout/LayoutPegawai";

export default function FormPengajuan() {
  const [priority, setPriority] = useState("medium");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [subKategori, setSubKategori] = useState([]);
  const [loadingSubKategori, setLoadingSubKategori] = useState(false);
  const [opdData, setOpdData] = useState(null);
  const [isLoadingOpd, setIsLoadingOpd] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    divisi: "",
    judulPelaporan: "",
    dataAset: "",
    lokasiKejadian: "",
    rincianMasalah: "",
    penyelesaianDiharapkan: "",
    selectedSubKategoriId: "",
  });

  const [dropdowns, setDropdowns] = useState({
    dataAset: false,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const defaultOpd = {
    name: "Dinas Kesehatan",
    logo: "/assets/Dinas Kesehatan.png",
  };

  // Ambil token
  const getToken = () => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FyaXNlLWFwcC5teS5pZC9hcGkvbG9naW4iLCJpYXQiOjE3NjUzOTM5MzAsImV4cCI6MTc2NTk5ODczMCwibmJmIjoxNzY1MzkzOTMwLCJqdGkiOiJGSW15YU1XZ1Zkck5aTkVPIiwic3ViIjoiNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KSswG95y_yvfNmpH5hLBNXnuVfiaycCD4YN5JMRYQy8"
    );
  };

  // Fetch data user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        const token = getToken();
        const response = await fetch(
          "https://service-desk-be-production.up.railway.app/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result.status === "success" && result.user) {
          setUserData(result.user);
          setFormData((prev) => ({
            ...prev,
            nama: result.user.name || "Haikal Saputra",
            nip: result.user.email || "haikalsaputra@gmail.com",
            divisi:
              result.user.unit_kerja ||
              result.user.dinas ||
              "Divisi Sumber Daya Manusia",
          }));

          // Simpan user data ke localStorage untuk mendapatkan dinas_id nanti
          localStorage.setItem(
            "user_data",
            JSON.stringify({
              name: result.user.name,
              email: result.user.email,
              unit_kerja: result.user.unit_kerja,
              dinas: result.user.dinas,
              dinas_id: result.user.dinas_id || result.user.dinasId || 1,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setFormData((prev) => ({
          ...prev,
          nama: "Haikal Saputra",
          nip: "haikalsaputra@gmail.com",
          divisi: "Divisi Sumber Daya Manusia",
        }));

        localStorage.setItem(
          "user_data",
          JSON.stringify({
            name: "Haikal Saputra",
            email: "haikalsaputra@gmail.com",
            unit_kerja: "Divisi Sumber Daya Manusia",
            dinas_id: 1,
          })
        );
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch data OPD setelah user data berhasil diambil
  useEffect(() => {
    const fetchOpdData = async () => {
      try {
        setIsLoadingOpd(true);

        // Ambil dinas_id dari localStorage atau userData
        let dinasId = 1;
        const userDataStr = localStorage.getItem("user_data");

        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            dinasId = userData.dinas_id || 1;
          } catch (error) {
            console.warn("Error parsing user_data:", error);
          }
        } else if (userData && (userData.dinas_id || userData.dinasId)) {
          dinasId = userData.dinas_id || userData.dinasId || 1;
        }

        console.log(`📡 Fetching OPD data untuk dinas ID: ${dinasId}`);

        const response = await fetch(
          `https://service-desk-be-production.up.railway.app/opd/dinas/${dinasId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Data OPD berhasil diambil:", result);

        if (result.data) {
          const opdInfo = {
            id: result.data.id,
            name: result.data.nama,
            logo: result.data.file_path || defaultOpd.logo,
            created_at: result.data.created_at,
            updated_at: result.data.updated_at,
          };

          setOpdData(opdInfo);
          localStorage.setItem("current_opd", JSON.stringify(opdInfo));
        }
      } catch (error) {
        console.error("❌ Error fetching OPD data:", error);
        // Coba gunakan data dari localStorage atau default
        const savedOpd = localStorage.getItem("current_opd");
        if (savedOpd) {
          try {
            setOpdData(JSON.parse(savedOpd));
          } catch (e) {
            setOpdData(defaultOpd);
          }
        } else {
          setOpdData(location.state?.selectedOpd || defaultOpd);
        }
      } finally {
        setIsLoadingOpd(false);
      }
    };

    if (!loadingUser) {
      fetchOpdData();
    }
  }, [loadingUser, userData, location.state]);

  // Fetch data sub-kategori dari API
  useEffect(() => {
    const fetchSubKategori = async () => {
      try {
        setLoadingSubKategori(true);
        const response = await fetch(
          "https://service-desk-be-production.up.railway.app/api/sub-kategori",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setSubKategori(result);
          console.log(
            "Data sub-kategori berhasil diambil:",
            result.length,
            "item"
          );
        } else {
          console.error("Format response tidak sesuai:", result);
          // Fallback ke data statis jika API error
          setSubKategori([
            { id: 1, nama: "Server" },
            { id: 2, nama: "Komputer Desktop" },
            { id: 3, nama: "Laptop" },
            { id: 4, nama: "Printer" },
            { id: 5, nama: "Monitor" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching sub-kategori:", error);
        // Fallback ke data statis jika API error
        setSubKategori([
          { id: 1, nama: "Server" },
          { id: 2, nama: "Komputer Desktop" },
          { id: 3, nama: "Laptop" },
          { id: 4, nama: "Printer" },
          { id: 5, nama: "Monitor" },
          { id: 6, nama: "Keyboard" },
          { id: 7, nama: "Mouse" },
        ]);
      } finally {
        setLoadingSubKategori(false);
      }
    };

    fetchSubKategori();
  }, []);

  const toggleDropdown = (name) => {
    setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isFormValid = () => {
    return (
      formData.judulPelaporan.trim() !== "" &&
      formData.dataAset.trim() !== "" &&
      formData.selectedSubKategoriId.trim() !== "" &&
      formData.lokasiKejadian.trim() !== "" &&
      formData.rincianMasalah.trim() !== "" &&
      formData.penyelesaianDiharapkan.trim() !== "" &&
      uploadedFiles.length > 0
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectSubKategori = (subKategoriItem) => {
    setFormData((prev) => ({
      ...prev,
      dataAset: subKategoriItem.nama, // Menampilkan nama sub-kategori di dropdown
      selectedSubKategoriId: subKategoriItem.id.toString(), // Menyimpan ID sub-kategori
    }));
    toggleDropdown("dataAset");
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    ]);
    event.target.value = "";
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleKonfirmasiKirim = () => {
    if (isFormValid()) {
      setShowConfirmation(true);
    } else {
      const missing = [];
      if (!formData.judulPelaporan.trim()) missing.push("Judul Pengajuan");
      if (!formData.dataAset.trim()) missing.push("Jenis Aset");
      if (!formData.selectedSubKategoriId.trim()) missing.push("ID Jenis Aset");
      if (!formData.lokasiKejadian.trim()) missing.push("Lokasi Penempatan");
      if (!formData.rincianMasalah.trim())
        missing.push("Rincian Pengajuan Pelayanan");
      if (!formData.penyelesaianDiharapkan.trim())
        missing.push("Penyelesaian yang Diharapkan");
      if (uploadedFiles.length === 0) missing.push("File Lampiran");
      alert(`Harap lengkapi: ${missing.join(", ")}`);
    }
  };

  const handleKirimLaporan = async () => {
    setIsSubmitting(true);

    try {
      const token = getToken();
      const apiFormData = new FormData();

      // Field wajib
      apiFormData.append("title", formData.judulPelaporan);
      apiFormData.append("description", formData.rincianMasalah);
      apiFormData.append(
        "expected_resolution",
        formData.penyelesaianDiharapkan
      );

      // Kirim ID sub-kategori yang dipilih
      apiFormData.append(
        "nama_asset",
        parseInt(formData.selectedSubKategoriId) || 3
      ); // Default ke 3 (Laptop) jika tidak ada

      apiFormData.append("lokasi_penempatan", formData.lokasiKejadian);
      apiFormData.append("priority", priority);

      // File
      uploadedFiles.forEach((fileObj) => {
        apiFormData.append("files[]", fileObj.file);
      });

      console.log("Mengirim FormData:");
      console.log("Jenis Aset yang dipilih:", formData.dataAset);
      console.log("ID Jenis Aset:", formData.selectedSubKategoriId);
      console.log("OPD Tujuan:", opdData?.name || defaultOpd.name);
      for (let [key, value] of apiFormData.entries()) {
        console.log(key, value.name || value);
      }

      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/api/pengajuan-pelayanan",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: apiFormData,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        console.error("Error dari backend:", err);
        throw new Error(JSON.stringify(err));
      }

      const result = await response.json();
      console.log("Sukses:", result);
      setLastResponse(result);
      setShowConfirmation(false);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Gagal:", error);
      alert(`Gagal mengirim: ${error.message}`);
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessOk = () => {
    navigate("/SuksesPelayanan", {
      state: {
        pengajuanData: {
          ...formData,
          uploadedFiles: uploadedFiles.map((f) => ({
            name: f.name,
            size: f.size,
            type: f.type,
          })),
          tanggal: new Date().toISOString(),
          status: "dikirim",
          opdTujuan: opdData?.name || defaultOpd.name,
          ticket_id: lastResponse?.ticket_id || "",
          ticket_code: lastResponse?.ticket_code || "TICKET-" + Date.now(),
          api_response: lastResponse || {},
        },
      },
    });
  };

  const handleBatalkan = () => setShowCancelWarning(true);
  const handleConfirmCancel = () => {
    setShowCancelWarning(false);
    navigate(-1);
  };
  const handleCancelCancel = () => setShowCancelWarning(false);

  if (loadingUser) {
    return (
      <LayoutPegawai>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226597] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pengguna...</p>
          </div>
        </div>
      </LayoutPegawai>
    );
  }

  return (
    <LayoutPegawai>
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="px-4 md:px-6 py-4 md:py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200 text-center">
              <h2 className="text-2xl font-bold text-[#226597]">
                Pengajuan Pelayanan
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Kirim laporan ke */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-start w-full gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Kirim laporan ke
                  </label>
                  <div className="bg-[#226597] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 justify-center sm:justify-start min-w-[200px]">
                    {isLoadingOpd ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm">Memuat OPD...</span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={opdData?.logo || defaultOpd.logo}
                          alt={`Logo ${opdData?.name || defaultOpd.name}`}
                          className="w-5 h-5 object-cover rounded"
                          onError={(e) => {
                            e.target.src = defaultOpd.logo;
                            e.target.onerror = null;
                          }}
                        />
                        <span className="text-sm">
                          {opdData?.name || defaultOpd.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Nama */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-24 text-left whitespace-nowrap">
                    Nama
                  </label>
                  <div className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-center">
                    {formData.nama}
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-24 text-left whitespace-nowrap">
                    Email
                  </label>
                  <div className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-center">
                    {formData.nip}
                  </div>
                </div>

                {/* Divisi */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-24 text-left whitespace-nowrap">
                    Divisi
                  </label>
                  <div className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-center">
                    {formData.divisi}
                  </div>
                </div>

                {/* Judul Pelaporan */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Judul Pengajuan
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik disini"
                    value={formData.judulPelaporan}
                    onChange={(e) =>
                      handleInputChange("judulPelaporan", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Jenis Aset (Sub-Kategori) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Jenis Aset
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("dataAset")}
                      disabled={loadingSubKategori}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span
                        className={`flex-1 text-left ${
                          formData.dataAset ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {loadingSubKategori
                          ? "Memuat jenis aset..."
                          : formData.dataAset || "Pilih jenis aset"}
                      </span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>
                    {dropdowns.dataAset && !loadingSubKategori && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                        {subKategori.length > 0 ? (
                          subKategori.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleSelectSubKategori(item)}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-left truncate"
                              title={item.nama}
                            >
                              {item.nama}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500 text-center">
                            Tidak ada data jenis aset
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {formData.selectedSubKategoriId && (
                    <p className="text-xs text-gray-500 mt-1">
                      ID Jenis Aset: {formData.selectedSubKategoriId}
                    </p>
                  )}
                </div>

                {/* Lokasi Penempatan */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Lokasi Penempatan
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik disini"
                    value={formData.lokasiKejadian}
                    onChange={(e) =>
                      handleInputChange("lokasiKejadian", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Rincian Pengajuan Pelayanan */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Rincian Pengajuan Pelayanan
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Jelaskan lebih rinci terkait alasan pengajuan tersebut agar
                  kami dapat lebih memahami pengajuan ini!
                </p>
                <textarea
                  placeholder="Ketik disini..."
                  value={formData.rincianMasalah}
                  onChange={(e) =>
                    handleInputChange("rincianMasalah", e.target.value)
                  }
                  className="w-full px-3 py-2 min-h-[120px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Upload File */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Tambahkan file
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Lampirkan screenshot, log, atau dokumen terkait (maksimal 2
                  file, format PDF/JPG/PNG)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#226597] hover:bg-[#1a507a] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <svg
                    width="7"
                    height="13"
                    viewBox="0 0 7 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.2375 4.04576V8.54107C2.24269 8.86979 2.37692 9.18328 2.61121 9.41391C2.84551 9.64453 3.16109 9.77379 3.48984 9.77379C3.8186 9.77379 4.13418 9.64453 4.36847 9.41391C4.60277 9.18328 4.73699 8.86979 4.74219 8.54107L4.74625 2.64888C4.74966 2.36792 4.69726 2.08908 4.5921 1.82852C4.48694 1.56796 4.33111 1.33087 4.13364 1.13098C3.93616 0.931099 3.70098 0.7724 3.44171 0.664087C3.18245 0.555773 2.90426 0.5 2.62328 0.5C2.3423 0.5 2.06412 0.555773 1.80485 0.664087C1.54559 0.7724 1.3104 0.931099 1.11293 1.13098C0.915452 1.33087 0.759618 1.56796 0.654458 1.82852C0.549298 2.08908 0.496904 2.36792 0.500313 2.64888V8.58076C0.494588 8.9763 0.567552 9.36904 0.714962 9.73614C0.862372 10.1032 1.08129 10.4374 1.35898 10.7191C1.63667 11.0009 1.9676 11.2246 2.33253 11.3773C2.69746 11.53 3.0891 11.6086 3.48469 11.6086C3.88028 11.6086 4.27192 11.53 4.63685 11.3773C5.00177 11.2246 5.3327 11.0009 5.61039 10.7191C5.88809 10.4374 6.107 10.1032 6.25441 9.73614C6.40182 9.36904 6.47479 8.9763 6.46906 8.58076V3.03763"
                      stroke="white"
                      strokeWidth="1"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                  </svg>
                  Lampirkan file
                </button>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <FileText
                            size={16}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Penyelesaian yang Diharapkan */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Penyelesaian yang Diharapkan
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Jelaskan harapan Anda terkait penyelesaian pengajuan ini
                </p>
                <textarea
                  placeholder="Ketik disini..."
                  value={formData.penyelesaianDiharapkan}
                  onChange={(e) =>
                    handleInputChange("penyelesaianDiharapkan", e.target.value)
                  }
                  className="w-full px-3 py-2 min-h-[120px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between pt-6 gap-3 border-t border-gray-200">
                <button
                  onClick={handleBatalkan}
                  className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleKonfirmasiKirim}
                  disabled={
                    !isFormValid() || isSubmitting || loadingSubKategori
                  }
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    isFormValid() && !isSubmitting && !loadingSubKategori
                      ? "bg-[#226597] hover:bg-[#1a507a] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Konfirmasi */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
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
                <h3 className="text-lg font-semibold mb-2">
                  Apakah Anda yakin ingin mengirim?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Cek kembali inputan Anda sebelum mengirim!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={handleKirimLaporan}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md font-medium ${
                      isSubmitting
                        ? "bg-gray-400"
                        : "bg-[#226597] hover:bg-[#1a507a] text-white"
                    }`}
                  >
                    {isSubmitting ? "Mengirim..." : "Ya, saya yakin"}
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup Cancel Warning */}
        {showCancelWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
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
                <h3 className="text-lg font-semibold mb-2">
                  Apakah Anda yakin ingin kembali?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Data yang Anda inputkan tidak akan tersimpan!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={handleConfirmCancel}
                    className="px-4 py-2 bg-[#226597] text-white rounded-md font-medium hover:bg-[#1a507a]"
                  >
                    Ya, saya yakin!
                  </button>
                  <button
                    onClick={handleCancelCancel}
                    className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup Sukses */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 90 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M44.6667 86.3333C56.1725 86.3333 66.5892 81.6696 74.1294 74.1294C81.6696 66.5892 86.3333 56.1725 86.3333 44.6667C86.3333 33.1608 81.6696 22.7442 74.1294 15.2039C66.5892 7.66371 56.1725 3 44.6667 3C33.1608 3 22.7442 7.66371 15.2039 15.2039C7.66371 22.7442 3 33.1608 3 44.6667C3 56.1725 7.66371 66.5892 15.2039 74.1294C22.7442 81.6696 33.1608 86.3333 44.6667 86.3333Z"
                      fill="white"
                      stroke="#27C840"
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28 46.3333L39.6667 58L62 35.6667"
                      stroke="#27C840"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  Pengajuan berhasil terkirim!
                </h3>
                {lastResponse && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">ID Tiket:</span>{" "}
                      {lastResponse.ticket_code}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Status:</span>{" "}
                      {lastResponse.message || "Berhasil"}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Dikirim ke:</span>{" "}
                      {opdData?.name || defaultOpd.name}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleSuccessOk}
                  className="mt-6 px-6 py-2 bg-[#226597] text-white rounded-md font-medium hover:bg-[#1a507a]"
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutPegawai>
  );
}
