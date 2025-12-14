import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, XCircle, ChevronDown } from "lucide-react";
import LayoutPegawai from "../../../components/Layout/LayoutPegawai";

export default function FormLaporan() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetList, setAssetList] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [authToken, setAuthToken] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    divisi: "",
    judulPelaporan: "",
    dataAset: "",
    nomorSeri: "",
    kategoriAset: "",
    subKategoriAset: "",
    jenisAset: "",
    lokasiKejadian: "",
    rincianMasalah: "",
    penyelesaianDiharapkan: "",
    selectedAssetId: "",
  });

  const [dropdowns, setDropdowns] = useState({
    dataAset: false,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const defaultOpd = {
    name: "Dinas Kesehatan",
    logo: "/assets/Dinas Kesehatan.png",
    id: 1,
  };

  useEffect(() => {
    console.log("Mengambil data dari localStorage...");

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("auth_token") ||
      "";

    console.log("Token ditemukan:", token ? "Ya" : "Tidak");

    if (token) {
      setAuthToken(token);
      console.log("Token disimpan di state:", token.substring(0, 50) + "...");
    } else {
      console.warn("Token tidak ditemukan di localStorage/sessionStorage");
      alert("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    const userDataStr =
      localStorage.getItem("user") ||
      localStorage.getItem("userData") ||
      localStorage.getItem("user_data") ||
      "";

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        console.log("User data ditemukan:", userData);
        setFormData((prev) => ({
          ...prev,
          nama: userData.name || userData.nama || "User",
          email: userData.email || "",
          divisi: userData.unit_kerja || userData.divisi || "",
        }));
      } catch (error) {
        console.error("Gagal parse user data:", error);
      }
    } else {
      console.warn("User data tidak ditemukan di localStorage");
    }
  }, []);

  useEffect(() => {
  const fetchAssets = async () => {
    try {
      setIsLoadingAssets(true);
      console.log("Memulai fetch asset-barang...");

      const formattedToken = authToken.startsWith("Bearer ")
        ? authToken
        : `Bearer ${authToken}`;

      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/api/asset-barang?status_filter=aktif",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: formattedToken,
          },
        }
      );

      console.log("Response status asset-barang:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Data asset-barang diterima:", data);
        setAssetList(data.data || []);
      } else {
        console.error("Gagal fetch asset-barang:", response.status);
        setAssetList([]);
      }
    } catch (error) {
      console.error("Error fetching asset-barang:", error);
      setAssetList([]);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  if (authToken) {
    fetchAssets();
  } else {
    setIsLoadingAssets(false);
    setAssetList([]);
  }
}, [authToken]);


  

  const toggleDropdown = (dropdownName) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  const isFormValid = () => {
    const judulOk = formData.judulPelaporan.trim() !== "";
    const rincianOk = formData.rincianMasalah.trim() !== "";
    const penyelesaianOk = formData.penyelesaianDiharapkan.trim() !== "";
    const assetSelected = formData.selectedAssetId.trim() !== "";
    const fileOk = uploadedFiles.length > 0;

    return (
      judulOk && rincianOk && penyelesaianOk && subKategoriSelected && fileOk
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectAsset = (asset) => {
  setSelectedAsset(asset);
  setFormData(prev => ({
    ...prev,
    dataAset: asset.nama_asset,
    nomorSeri: asset.nomor_seri,
    kategoriAset: asset.kategori,
    subKategoriAset: asset.asset_barang?.sub_kategori?.nama || "",
    jenisAset: asset.jenis,
    selectedAssetId: asset.id.toString(),
  }));
};


  const handleNomorSeriChange = (value) => {
    setFormData((prev) => ({ ...prev, nomorSeri: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    const remainingSlots = 2 - uploadedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length < files.length) {
      alert(
        `Maksimal 2 file. ${
          files.length - filesToAdd.length
        } file tidak ditambahkan.`
      );
    }

    setUploadedFiles((prev) => [
      ...prev,
      ...filesToAdd.map((file) => ({
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
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleKonfirmasiKirim = () => {
    if (!authToken) {
      alert("Anda belum login. Silakan login terlebih dahulu.");
      return;
    }

    if (isFormValid()) {
      setShowConfirmation(true);
    } else {
      alert(
        "Harap lengkapi semua field yang wajib diisi dan lampirkan minimal 1 file!"
      );
    }
  };

  const handleKirimLaporan = async () => {
    try {
      setIsSubmitting(true);

      if (!authToken) {
        throw new Error(
          "Token autentikasi tidak tersedia. Silakan login kembali."
        );
      }

      const formattedToken = authToken.startsWith("Bearer ")
        ? authToken
        : `Bearer ${authToken}`;

      if (!formData.selectedAssetId) {
        throw new Error("Silakan pilih sub-kategori terlebih dahulu.");
      }
      const formDataToSend = new FormData();

      formDataToSend.append("asset_id", formData.selectedAssetId || "");
      formDataToSend.append("title", formData.judulPelaporan || "");
      formDataToSend.append("lokasi_kejadian", formData.lokasiKejadian || "");
      formDataToSend.append("description", formData.rincianMasalah || "");
      formDataToSend.append(
        "expected_resolution",
        formData.penyelesaianDiharapkan || ""
      );

      uploadedFiles.forEach((fileObj, index) => {
        formDataToSend.append(`files[${index}]`, fileObj.file);
      });

      console.log("=== DATA YANG AKAN DIKIRIM ===");
      console.log("Asset ID:", formData.selectedAssetId);
      console.log("Judul:", formData.judulPelaporan);
      console.log("Lokasi:", formData.lokasiKejadian);
      console.log("Deskripsi:", formData.rincianMasalah);
      console.log("Expected Resolution:", formData.penyelesaianDiharapkan);
      console.log("Token:", formattedToken.substring(0, 50) + "...");
      console.log("Jumlah file:", uploadedFiles.length);

      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/api/pelaporan-online",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: formattedToken,
          },
          body: formDataToSend,
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.status === 401) {
        const errorText = await response.text();
        console.error("Error 401 detail:", errorText);
        throw new Error(
          "Sesi Anda telah berakhir atau token tidak valid. Silakan login kembali."
        );
      }

      if (response.status === 422) {
        const errorData = await response.json();
        console.error("Validation error:", errorData);
        throw new Error(
          `Validasi gagal: ${JSON.stringify(errorData.errors || errorData)}`
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(
          `Gagal mengirim laporan (HTTP ${
            response.status
          }): ${errorText.substring(0, 100)}`
        );
      }

      const result = await response.json();
      console.log("Success response:", result);

      const ticketData = {
        noTiket:
          result.ticket?.ticket_code ||
          `LYN${Math.floor(100000 + Math.random() * 900000)}`,
        ticket_id: result.ticket?.ticket_id || Date.now(),
        tanggal: new Date().toLocaleDateString("id-ID"),
        waktu: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        jenisLayanan: "Pelaporan Online",
        opdTujuan: result.ticket?.opd_nama || defaultOpd.name,
        judulPelaporan: formData.judulPelaporan,
        dataAset: formData.dataAset,
        nomorSeri: formData.nomorSeri,
        kategoriAset: formData.kategoriAset,
        subKategoriAset: formData.subKategoriAset,
        jenisAset: formData.jenisAset,
        lokasiKejadian: formData.lokasiKejadian,
        nama: formData.nama,
        nip: formData.email,
        divisi: formData.divisi,
        rincianMasalah: formData.rincianMasalah,
        penyelesaianDiharapkan: formData.penyelesaianDiharapkan,

        apiResponse: result,
      };

      setShowConfirmation(false);
      setShowSuccessPopup(true);

      localStorage.setItem("lastTicket", JSON.stringify(ticketData));
      localStorage.setItem("currentTicket", JSON.stringify(ticketData));
      sessionStorage.setItem("currentTicket", JSON.stringify(ticketData));

      setTimeout(() => {
        const successPopup = document.querySelector(".success-popup");
        if (successPopup) {
          const ticketCodeElement = successPopup.querySelector(".ticket-code");
          if (ticketCodeElement && result.ticket?.ticket_code) {
            ticketCodeElement.textContent = result.ticket.ticket_code;
          }
        }
      }, 100);
    } catch (error) {
      setShowConfirmation(false);

      let errorMessage = error.message;

      if (errorMessage.includes("401")) {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
      }

      if (errorMessage.includes("fetch") || errorMessage.includes("network")) {
        errorMessage =
          "Koneksi jaringan bermasalah. Periksa koneksi internet Anda.";
      }

      alert("Gagal mengirim laporan: " + errorMessage);
      console.error("Error mengirim laporan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessOk = () => {
    const savedTicket = localStorage.getItem("currentTicket");
    let ticketData;

    if (savedTicket) {
      try {
        ticketData = JSON.parse(savedTicket);
      } catch (error) {
        ticketData = {
          noTiket: `LYN${Math.floor(100000 + Math.random() * 900000)}`,
          tanggal: new Date().toLocaleDateString("id-ID"),
          waktu: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          jenisLayanan: "Pelaporan Online",
          opdTujuan: defaultOpd.name,
          judulPelaporan: formData.judulPelaporan,
          dataAset: formData.dataAset,
          nomorSeri: formData.nomorSeri,
          kategoriAset: formData.kategoriAset,
          subKategoriAset: formData.subKategoriAset,
          jenisAset: formData.jenisAset,
          lokasiKejadian: formData.lokasiKejadian,
          nama: formData.nama,
          nip: formData.email,
          divisi: formData.divisi,
          rincianMasalah: formData.rincianMasalah,
          penyelesaianDiharapkan: formData.penyelesaianDiharapkan,
        };
      }
    }

    navigate("/SuksesPelaporan", {
      state: {
        ticketData: ticketData,
      },
    });

    setFormData({
      nama: "",
      email: "",
      divisi: "",
      judulPelaporan: "",
      dataAset: "",
      nomorSeri: "",
      kategoriAset: "",
      subKategoriAset: "",
      jenisAset: "",
      lokasiKejadian: "",
      rincianMasalah: "",
      penyelesaianDiharapkan: "",
      selectedAssetId: "",
    });
    setUploadedFiles([]);
    setselectedAsset(null);
    setShowSuccessPopup(false);
  };

  const handleBatalkan = () => {
    setShowCancelWarning(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelWarning(false);
    navigate(-1);
  };

  const handleCancelCancel = () => {
    setShowCancelWarning(false);
  };

  return (
    <LayoutPegawai>
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="px-4 md:px-6 py-4 md:py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200 text-center">
              <h2 className="text-2xl font-bold text-[#226597]">
                Pelaporan Online
              </h2>
              {!authToken && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md">
                  <p className="text-sm text-red-700">
                    ⚠️ Anda belum login. Silakan login terlebih dahulu.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-start w-full gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Kirim laporan ke
                  </label>
                  <div className="bg-[#226597] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 justify-center sm:justify-start min-w-[200px]">
                    <img
                      src={defaultOpd.logo}
                      alt={`Logo ${defaultOpd.name}`}
                      className="w-5 h-5 object-cover rounded"
                    />
                    <span className="text-sm">{defaultOpd.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-24 text-left whitespace-nowrap">
                    Nama
                  </label>
                  <div className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-center">
                    <span className="text-gray-700 font-medium">
                      {formData.nama || "Data pengguna"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-24 text-left whitespace-nowrap">
                    Email
                  </label>
                  <div className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-center">
                    <span className="text-gray-700 font-medium">
                      {formData.email || "Email pengguna"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 sm:w-24 text-left whitespace-nowrap">
                    Divisi
                  </label>
                  <div className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-center">
                    <span className="text-gray-700 font-medium">
                      {formData.divisi || "Divisi pengguna"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Judul Pelaporan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik disini"
                    value={formData.judulPelaporan}
                    onChange={(e) =>
                      handleInputChange("judulPelaporan", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-left placeholder:text-left"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Data Aset <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown("dataAset")}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm flex items-center justify-between"
                        disabled={isLoadingAssets}
                      >
                        <span
                          className={`flex-1 text-left ${
                            formData.dataAset
                              ? "text-gray-700"
                              : "text-gray-400"
                          }`}
                        >
                          {isLoadingAssets
                            ? "Memuat data sub-kategori..."
                            : formData.dataAset || "Pilih sub-kategori"}
                        </span>
                        {!isLoadingAssets && (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </button>
                      {dropdowns.dataAset && !isLoadingAssets && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                          {assetList.length > 0 ? (
                            assetList.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleSelectAsset(item)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-left truncate"
                                title={item.nama_asset}
                              >
                                {item.nama_asset}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                              Tidak ada data sub-kategori
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Nomor Seri
                    </label>
                    <input
                      type="text"
                      value={formData.nomorSeri || ""}
                      onChange={(e) => handleNomorSeriChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Kategori Aset
                    </label>
                    <input
                      type="text"
                      value={formData.kategoriAset}
                      onChange={(e) =>
                        handleInputChange("kategoriAset", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-left"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Sub-Kategori Aset
                    </label>
                    <input
                      type="text"
                      value={formData.subKategoriAset}
                      onChange={(e) =>
                        handleInputChange("subKategoriAset", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-left"
                      readOnly={!!selectedAsset}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Jenis Aset
                    </label>
                    <input
                      type="text"
                      value={formData.jenisAset}
                      onChange={(e) =>
                        handleInputChange("jenisAset", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-left"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Lokasi Kejadian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik disini"
                    value={formData.lokasiKejadian}
                    onChange={(e) =>
                      handleInputChange("lokasiKejadian", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-left placeholder:text-left"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700 block">
                  Rincian Masalah <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Jelaskan lebih rinci terkait masalah tersebut agar kami dapat
                  lebih memahami masalah ini
                </p>
                <textarea
                  placeholder="Ketik disini..."
                  value={formData.rincianMasalah}
                  onChange={(e) =>
                    handleInputChange("rincianMasalah", e.target.value)
                  }
                  className="w-full px-3 py-2 min-h-[120px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-sm"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700 block">
                  Tambahkan file <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Lampirkan screenshot, log, atau dokumen terkait untuk membantu
                  kami memahami masalah Anda lebih cepat. (Maksimal unggah 2
                  file)
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  disabled={!authToken}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center w-full sm:w-auto gap-2 ${
                    authToken && uploadedFiles.length < 2
                      ? "bg-[#226597] hover:bg-[#1a507a] text-white cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!authToken || uploadedFiles.length >= 2}
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
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                  </svg>
                  {uploadedFiles.length >= 2
                    ? "Maksimal 2 file"
                    : "Lampirkan file"}
                </button>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
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
                            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 ml-2"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700 block">
                  Penyelesaian yang Diharapkan{" "}
                  <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Jelaskan terkait harapan Anda terkait penyelesaian masalah
                  tersebut agar kami dapat lebih menyesuaikan untuk
                  menyelesaikan masalah ini
                </p>
                <textarea
                  placeholder="Ketik disini..."
                  value={formData.penyelesaianDiharapkan}
                  onChange={(e) =>
                    handleInputChange("penyelesaianDiharapkan", e.target.value)
                  }
                  className="w-full px-3 py-2 min-h-[120px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between pt-6 gap-3 sm:gap-0 border-t border-gray-200">
                <button
                  onClick={handleBatalkan}
                  className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Batalkan
                </button>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleKonfirmasiKirim}
                    disabled={isSubmitting || !authToken}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors text-center ${
                      isFormValid() && !isSubmitting && authToken
                        ? "bg-[#226597] hover:bg-[#1a507a] text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting
                      ? "Mengirim..."
                      : !authToken
                      ? "Login Terlebih Dahulu"
                      : "Kirim"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
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
                Apakah Anda yakin ingin mengirim?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Cek kembali inputan Anda sebelum mengirim!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleKirimLaporan}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Mengirim...
                    </span>
                  ) : (
                    "Ya, saya yakin"
                  )}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelWarning && (
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
                Apakah Anda yakin ingin kembali?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Data yang Anda inputkan tidak akan tersimpan!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors"
                >
                  Ya, saya yakin!
                </button>
                <button
                  onClick={handleCancelCancel}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 success-popup">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
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

              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Laporan berhasil terkirim!
              </h3>

              <div className="mt-4 p-3 bg-green-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">ID Tiket:</span>{" "}
                  <span className="ticket-code">
                    LYN{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSuccessOk}
                  className="px-6 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors mt-6"
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutPegawai>
  );
}
