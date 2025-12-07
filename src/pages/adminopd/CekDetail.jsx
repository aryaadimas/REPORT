import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Menu, X, Bell } from "lucide-react";
import LayoutOpd from "../../components/Layout/LayoutOPD";

const CekDetail = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pengerjaanAwal, setPengerjaanAwal] = useState("");
  const [tenggatPengerjaan, setTenggatPengerjaan] = useState("");
  const [formData, setFormData] = useState({
    seksiPengirim: {
      nama: "Jeno Arifin",
      gambar: "/assets/Jeno.jpg",
    },
    pelapor: {
      nama: "Haikal Saputra",
      gambar: "/assets/Haechan.jpg",
    },
    idLaporan: "LPR78926",
    perihal: "Perangkat Keras",
    prioritas: "Rendah",
    rincianMasalah:
      "Komputer di meja front office tidak dapat menyala meskipun sudah ditekan tambol power, padahal kabel listrik sudah dicek dan tersambung dengan benar. Lampu indikator pada CPU juga tidak menyala, sehingga pengguna tidak bisa mengakses aplikasi pelayanan maupun memproses dokumen masyarakat, dan layanan front office terhenti sementara.",
    lampiranFile: false,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isFormValid = () => {
    return (
      formData.seksiPengirim.nama.trim() !== "" &&
      formData.pelapor.nama.trim() !== "" &&
      formData.idLaporan.trim() !== "" &&
      formData.perihal.trim() !== "" &&
      formData.prioritas.trim() !== "" &&
      formData.rincianMasalah.trim() !== ""
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(
          `File ${file.name} tidak didukung. Hanya file gambar, PDF, Word, dan text yang diperbolehkan.`
        );
        return false;
      }

      if (file.size > maxSize) {
        alert(
          `File ${file.name} terlalu besar. Maksimal ukuran file adalah 5MB.`
        );
        return false;
      }

      return true;
    });

    setUploadedFiles((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
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

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return "🖼️";
    } else if (fileType === "application/pdf") {
      return "📄";
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return "📝";
    } else if (fileType === "text/plain") {
      return "📃";
    } else {
      return "📎";
    }
  };

  const handleKonfirmasiKirim = () => {
    if (isFormValid()) {
      setShowConfirmation(true);
    } else {
      const missingFields = [];
      if (!formData.seksiPengirim.nama.trim())
        missingFields.push("Seksi Pengirim");
      if (!formData.pelapor.nama.trim()) missingFields.push("Pelapor");
      if (!formData.idLaporan.trim()) missingFields.push("ID Laporan");
      if (!formData.perihal.trim()) missingFields.push("Perihal");
      if (!formData.prioritas.trim()) missingFields.push("Prioritas");
      if (!formData.rincianMasalah.trim())
        missingFields.push("Rincian Masalah");

      alert(`Harap lengkapi field berikut:\n${missingFields.join("\n")}`);
    }
  };

  const handleKirimPermohonan = () => {
    const laporanData = {
      ...formData,
      pengerjaanAwal,
      tenggatPengerjaan,
      uploadedFiles: uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      tanggal: new Date().toISOString(),
      status: "dikirim",
    };

    console.log("Data laporan:", laporanData);
    alert("Laporan berhasil dikirim!");
    setShowConfirmation(false);

    // Kembali ke dashboard setelah 1 detik
    setTimeout(() => {
      navigate("/dashboardoopd");
    }, 1000);
  };

  const handleSimpanDraft = () => {
    const draftData = {
      ...formData,
      pengerjaanAwal,
      tenggatPengerjaan,
      uploadedFiles: uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      tanggal: new Date().toISOString(),
      status: "draft",
    };

    console.log("Data draft:", draftData);
    localStorage.setItem("draftLaporan", JSON.stringify(draftData));
    alert("Draft berhasil disimpan!");
  };

  const handleBatalkan = () => {
    navigate("/dashboardopd");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleKonfirmasiKirim();
  };

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-4 pb-8">
          <div className="px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleSubmit}>
                  <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    {/* Seksi Pengirim */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        Teknisi Pengerjaan
                      </label>
                      <div className="flex-1 flex items-center gap-3 text-left">
                        <img
                          src={formData.seksiPengirim.gambar}
                          alt="Profile Pengirim"
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                        />
                        <span className="text-gray-800 font-semibold text-sm md:text-base">
                          {formData.seksiPengirim.nama}
                        </span>
                      </div>
                    </div>

                    {/* Pelapor */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        Pengirim
                      </label>
                      <div className="flex-1 flex items-center gap-3 text-left">
                        <img
                          src={formData.pelapor.gambar}
                          alt="Profile Pelapor"
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                        />
                        <span className="text-gray-800 font-semibold text-sm md:text-base">
                          {formData.pelapor.nama}
                        </span>
                      </div>
                    </div>

                    {/* ID Laporan */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        ID laporan
                      </label>
                      <div className="flex-1 bg-gray-100 p-2 md:p-3 rounded border border-gray-300 text-center">
                        <span className="text-gray-800 text-sm md:text-base">
                          {formData.idLaporan}
                        </span>
                      </div>
                    </div>

                    {/* Prioritas */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        Prioritas
                      </label>
                      <div
                        className={`flex-1 p-2 md:p-3 rounded text-center font-semibold text-white text-sm md:text-base ${
                          formData.prioritas === "Tinggi"
                            ? "bg-red-500"
                            : formData.prioritas === "Sedang"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        <span>{formData.prioritas}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        Status
                      </label>
                      <div className="flex-1 p-2 md:p-3 rounded text-center font-semibold text-white text-sm md:text-base bg-yellow-500">
                        <span>Diproses</span>
                      </div>
                    </div>

                    {/* SLA */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        SLA
                      </label>
                      <div className="flex-1 p-2 md:p-3 text-left font-medium text-green-600 text-sm md:text-base">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          <span className="font-normal">Sesuai SLA</span>
                        </span>
                      </div>
                    </div>

                    {/* Judul Pelaporan */}
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-medium text-gray-700 block">
                        Judul Pelaporan
                      </label>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300">
                        <p className="text-gray-800 text-sm md:text-base font-medium">
                          Printer Sekarat
                        </p>
                      </div>
                    </div>

                    {/* Data Aset dan Nomor Seri - Sebelahan */}
                    <div className="space-y-4 text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Data Aset
                          </p>
                          <div className="bg-gray-100 p-3 rounded border border-gray-300">
                            <p className="text-gray-800 text-sm">
                              Printer HP LaserJet Pro P1102w
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Nomor Seri
                          </p>
                          <div className="bg-gray-100 p-3 rounded border border-gray-300">
                            <p className="text-gray-800 text-sm font-medium">
                              HP-LJ-P1102W-001
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Kategori, Sub-Kategori, dan Jenis Aset - Sebelahan bertiga */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Kategori Aset
                          </p>
                          <div className="bg-gray-100 p-3 rounded border border-gray-300">
                            <p className="text-gray-800 text-sm">Non TI</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Sub-Kategori Aset
                          </p>
                          <div className="bg-gray-100 p-3 rounded border border-gray-300">
                            <p className="text-gray-800 text-sm">Jaringan</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Jenis Aset
                          </p>
                          <div className="bg-gray-100 p-3 rounded border border-gray-300">
                            <p className="text-gray-800 text-sm">Barang</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lokasi Kejadian */}
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-medium text-gray-700 block">
                        Lokasi Kejadian
                      </label>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300">
                        <p className="text-gray-800 text-sm md:text-base">
                          Dinas Pendidikan Kantor Pusat
                        </p>
                      </div>
                    </div>

                    {/* Pengerjaan Awal */}
                    <div className="space-y-2 text-left">
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                        <label className="text-sm font-medium text-gray-700 text-left sm:w-32">
                          Pengerjaan awal
                        </label>
                        <div className="flex-1 flex items-center bg-gray-100 rounded p-2 md:p-3">
                          <span className="w-full text-sm text-gray-700 text-center">
                            IB-09-2025
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          Sampai
                        </span>
                        <div className="flex-1 flex items-center bg-gray-100 rounded p-2 md:p-3">
                          <span className="w-full text-sm text-gray-700 text-center">
                            IB-09-2025
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rincian Masalah */}
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-medium text-gray-700 block">
                        Rincian masalah
                      </label>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300 min-h-[100px] md:min-h-[120px]">
                        <p className="text-gray-800 text-xs md:text-sm">
                          {formData.rincianMasalah}
                        </p>
                      </div>
                    </div>

                    {/* Lampiran File */}
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-medium text-gray-700 block">
                        Lampiran file
                      </label>

                      {/* Dokumen dari Pelapor */}
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.68 7.01449C20.4579 6.55044 20.1451 6.13561 19.76 5.79449L16.76 3.07449C16.0997 2.46924 15.2613 2.09388 14.37 2.00449H8.21C7.54756 1.9764 6.88615 2.08034 6.26425 2.31027C5.64236 2.5402 5.07241 2.89152 4.58757 3.34379C4.10273 3.79606 3.71269 4.34024 3.44014 4.94467C3.16758 5.5491 3.01797 6.2017 3 6.86449V17.1645C3.03538 18.164 3.36969 19.13 3.95975 19.9375C4.54981 20.745 5.36849 21.3571 6.31 21.6945C6.92211 21.9272 7.57609 22.0293 8.23 21.9945H15.79C16.4524 22.0226 17.1139 21.9186 17.7357 21.6887C18.3576 21.4588 18.9276 21.1075 19.4124 20.6552C19.8973 20.2029 20.2873 19.6587 20.5599 19.0543C20.8324 18.4499 20.982 17.7973 21 17.1345V8.56449C21.0048 8.03094 20.8957 7.50251 20.68 7.01449ZM7.68 6.61449H10.94C11.2052 6.61449 11.4596 6.71985 11.6471 6.90738C11.8346 7.09492 11.94 7.34927 11.94 7.61449C11.94 7.87971 11.8346 8.13406 11.6471 8.3216C11.4596 8.50913 11.2052 8.61449 10.94 8.61449H7.68C7.41478 8.61449 7.16043 8.50913 6.97289 8.3216C6.78536 8.13406 6.68 7.87971 6.68 7.61449C6.68 7.34927 6.78536 7.09492 6.97289 6.90738C7.16043 6.71985 7.41478 6.61449 7.68 6.61449ZM16.38 17.3245H7.68C7.41478 17.3245 7.16043 17.2191 6.97289 17.0316C6.78536 16.8441 6.68 16.5897 6.68 16.3245C6.68 16.0593 6.78536 15.8049 6.97289 15.6174C7.16043 15.4298 7.41478 15.3245 7.68 15.3245H16.38C16.6184 15.3585 16.8365 15.4773 16.9943 15.6592C17.1521 15.841 17.2389 16.0737 17.2389 16.3145C17.2389 16.5553 17.1521 16.788 16.9943 16.9698C16.8365 17.1517 16.6184 17.2705 16.38 17.3045V17.3245ZM16.38 12.9745H7.68C7.41478 12.9745 7.16043 12.8691 6.97289 12.6816C6.78536 12.4941 6.68 12.2397 6.68 11.9745C6.68 11.7093 6.78536 11.4549 6.97289 11.2674C7.16043 11.0798 7.41478 10.9745 7.68 10.9745H16.38C16.6452 10.9745 16.8996 11.0798 17.0871 11.2674C17.2746 11.4549 17.38 11.7093 17.38 11.9745C17.38 12.2397 17.2746 12.4941 17.0871 12.6816C16.8996 12.8691 16.6452 12.9745 16.38 12.9745ZM16.06 7.40449C15.9173 7.40581 15.7758 7.37885 15.6436 7.32517C15.5114 7.27148 15.3912 7.19214 15.2899 7.09172C15.1885 6.9913 15.1081 6.8718 15.0532 6.74011C14.9983 6.60842 14.97 6.46716 14.97 6.32449V3.67449C15.63 3.83449 18.2 6.47449 18.76 6.91449C18.9256 7.05401 19.0674 7.2195 19.18 7.40449H16.06Z"
                            fill="#113F67"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            bukti_laporan.pdf
                          </p>
                          <p className="text-xs text-gray-500">2.4 MB</p>
                        </div>
                      </div>

                      {/* File Upload Section */}
                      <div className="mt-4 space-y-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          multiple
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Informasi Tambahan */}
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-medium text-gray-700 block">
                        Penyelesaian yang Diharapkan
                      </label>
                      <div className="bg-gray-100 p-3 rounded border border-gray-300 min-h-[60px] md:min-h-[80px]">
                        POKOK KELAR LAH WKWK
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between pt-4 gap-3 sm:gap-0">
                      <button
                        type="button"
                        onClick={handleBatalkan}
                        className="text-black border border-gray-300 bg-transparent px-3 py-2 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-red-50 transition-colors text-center order-2 sm:order-1"
                      >
                        Kembali
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutOpd>
  );

};

export default CekDetail;
