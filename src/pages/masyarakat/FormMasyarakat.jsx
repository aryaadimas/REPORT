import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, XCircle } from "lucide-react";
import LayoutMasyarakat from "../../components/Layout/LayoutMasyarakat";

export default function FormMasyarakat() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false); // Tambahkan state untuk warning
  const [formData, setFormData] = useState({
    nama: "Lomon Kahiel",
    nik: "3578651360230002",
    email: "lomonkahiel@gmail.com",
    judulPelaporan: "",
    rincianMasalah: "",
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedOpd = location.state?.selectedOpd || {
    name: "Dinas Pendidikan",
    logo: "/assets/Dinas Pendidikan.png",
  };

  const isFormValid = () => {
    return (
      formData.nama.trim() !== "" &&
      formData.nik.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.judulPelaporan.trim() !== "" &&
      formData.rincianMasalah.trim() !== "" &&
      uploadedFiles.length > 0
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    if (isFormValid()) {
      setShowConfirmation(true);
    } else {
      alert("Harap lengkapi semua field yang wajib diisi!");
    }
  };

  const handleKirimLaporan = () => {
    const laporanData = {
      ...formData,
      uploadedFiles: uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      tanggal: new Date().toISOString(),
      status: "dikirim",
      opdTujuan: selectedOpd.name,
    };

    console.log("Data laporan:", laporanData);
    setShowConfirmation(false);
    setShowSuccessPopup(true);
  };

  const handleSuccessOk = () => {
    navigate("/SuksesLapor", {
      state: {
        laporanData: {
          ...formData,
          uploadedFiles: uploadedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
          tanggal: new Date().toISOString(),
          status: "dikirim",
          opdTujuan: selectedOpd.name,
        },
      },
    });
  };

  const handleBatalkan = () => {
    // Tampilkan popup warning ketika tombol batalkan diklik
    setShowCancelWarning(true);
  };

  const handleConfirmCancel = () => {
    // Konfirmasi batalkan dan navigasi
    setShowCancelWarning(false);
    navigate(-1);
  };

  const handleCancelCancel = () => {
    // Batal konfirmasi, tutup popup
    setShowCancelWarning(false);
  };

  return (
    <LayoutMasyarakat>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content - Simple structure tanpa complex positioning */}
        <div className="pt-4 pb-8">
          {/* Header Section - Simple tanpa background complex */}
          <div className="px-4 mb-8"></div>

          {/* Form Section */}
          <div className="px-4">
            <div className="max-w-2xl mx-auto">
              {/* Form Pelaporan dalam Card */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                {/* Header Form */}
                <div className="p-6 border-b border-gray-200 text-center">
                  <h2 className="text-2xl font-bold text-[#226597]">
                    Pelaporan Online
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Kirim laporan ke */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-start w-full gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Kirim laporan ke
                      </label>
                      <div className="bg-[#226597] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 justify-center sm:justify-start">
                        {selectedOpd.logo && (
                          <img
                            src={selectedOpd.logo}
                            alt={`Logo ${selectedOpd.name}`}
                            className="w-5 h-5 object-cover rounded"
                          />
                        )}
                        <span className="text-sm">{selectedOpd.name}</span>
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

                    {/* NIK */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-24 text-left whitespace-nowrap">
                        NIK
                      </label>
                      <div className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-center">
                        {formData.nik}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-24 text-left whitespace-nowrap">
                        Email
                      </label>
                      <div className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-center">
                        {formData.email}
                      </div>
                    </div>
                  </div>

                  {/* Judul Pelaporan */}
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-gray-700 block">
                      Judul Pelaporan
                    </label>
                    <input
                      type="text"
                      placeholder="Ketik disini"
                      value={formData.judulPelaporan}
                      onChange={(e) =>
                        handleInputChange("judulPelaporan", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-sm"
                    />
                  </div>

                  {/* Rincian Masalah */}
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-gray-700 block">
                      Apa yang ingin Anda laporkan?
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Jelaskan rinci terkait masalah Anda agar kami dapat
                      memahami masalah tersebut!
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

                  {/* Upload File */}
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-gray-700 block">
                      Tambahkan file
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Lampirkan screenshot, log, atau dokumen terkait untuk
                      membantu kami memahami masalah Anda lebih cepat!
                    </p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#226597] hover:bg-[#1a507a] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center w-full sm:w-auto gap-2"
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

                  {/* Action Buttons */}
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
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors text-center ${
                          isFormValid()
                            ? "bg-[#226597] hover:bg-[#1a507a] text-white cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!isFormValid()}
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Konfirmasi */}
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
                    className="px-4 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors"
                  >
                    Ya, saya yakin
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div> 
        )}

        {/* Popup Warning Batalkan */}
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

        {/* Popup Berhasil Dikirim */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
      </div>
    </LayoutMasyarakat>
  );
}
