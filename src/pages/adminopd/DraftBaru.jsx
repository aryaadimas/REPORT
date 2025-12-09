import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import LayoutOpd from "../../components/Layout/LayoutOPD";

const DraftBaru = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    penerimaDraft: {
      nama: "Admin Kota",
      gambar: "/assets/Jeno.jpg",
    },
    nama: "Friska Farinda",
    nip: "20002514213962047",
    opd: "Dinas Perpustakaan dan Kearsipan",
    layanan: "",
    judul: "",
    isiArtikel: "",
    lampiranFile: false,
    coverImage: null,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fungsi validasi form
  const isFormValid = () => {
    const requiredFields = [
      formData.layanan.trim(),
      formData.judul.trim(),
      formData.isiArtikel.trim(),
    ];

    const allFieldsFilled = requiredFields.every((field) => field !== "");
    const hasContent =
      formData.coverImage ||
      uploadedFiles.length > 0 ||
      formData.isiArtikel.trim().length > 50;

    return allFieldsFilled && hasContent;
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

  const handleKonfirmasiKirim = () => {
    if (isFormValid()) {
      setShowConfirmation(true);
    } else {
      const missingFields = [];

      if (!formData.layanan.trim()) missingFields.push("Kategori Artikel");
      if (!formData.judul.trim()) missingFields.push("Judul Artikel");
      if (!formData.isiArtikel.trim() || formData.isiArtikel.trim().length < 50)
        missingFields.push("Isi Artikel (minimal 50 karakter)");

      if (!formData.coverImage && uploadedFiles.length === 0)
        missingFields.push("Cover Image atau File Lampiran");

      alert(`Harap lengkapi field berikut:\n${missingFields.join("\n")}`);
    }
  };

  const handleKirimDraft = async () => {
    const draftData = {
      title: formData.judul,
      category: formData.layanan,
      content: formData.isiArtikel,
      status: "dikirim",
      // Tambahkan field lain sesuai kebutuhan API
    };

    try {
      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draftData),
        }
      );
      if (!response.ok) throw new Error("Gagal mengirim draft");
      setShowConfirmation(false);
      setShowSuccessPopup(true);
    } catch (err) {
      alert("Gagal mengirim draft: " + err.message);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessPopup(false);
    navigate("/dashboardopd");
  };

  const handleSimpanDraft = async () => {
    const draftData = {
      title: formData.judul,
      category: formData.layanan,
      content: formData.isiArtikel,
      status: "draft",
      // Tambahkan field lain sesuai kebutuhan API
    };

    try {
      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draftData),
        }
      );
      if (!response.ok) throw new Error("Gagal menyimpan draft");
      alert("Draft berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan draft: " + err.message);
    }
  };

  const handleBatalkan = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmBatalkan = () => {
    setShowCancelConfirmation(false);
    navigate("/lihatartikel");
  };

  const handleCancelBatalkan = () => {
    setShowCancelConfirmation(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleKonfirmasiKirim();
  };

  return (
    <LayoutOpd>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content - Simple structure */}
        <div className="pt-4 pb-8">
          {/* Content Container */}
          <div className="px-4">
            <div className="max-w-3xl mx-auto">
              {/* Judul Draft Knowledge Base */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-[#226597] mb-3 md:mb-4 text-center">
                  Draft Knowledge Base
                </h1>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleSubmit}>
                  <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    {/* Penerima Draft */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-start w-full gap-2 sm:gap-4">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          Kirim draft ke
                        </label>
                        <div className="bg-[#226597] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 justify-center sm:justify-start">
                          <img
                            src={formData.penerimaDraft.gambar}
                            alt="Profile Penerima"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-sm">
                            {formData.penerimaDraft.nama}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nama */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        Nama
                      </label>
                      <div className="flex-1 bg-gray-100 p-2 md:p-3 rounded border border-gray-300 text-center">
                        <span className="text-gray-800 text-sm md:text-base">
                          {formData.nama}
                        </span>
                      </div>
                    </div>

                    {/* NIP */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        NIP
                      </label>
                      <div className="flex-1 bg-gray-100 p-2 md:p-3 rounded border border-gray-300 text-center">
                        <span className="text-gray-800 text-sm md:text-base">
                          {formData.nip}
                        </span>
                      </div>
                    </div>

                    {/* OPD */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 sm:w-32 text-left whitespace-nowrap">
                        OPD
                      </label>
                      <div className="flex-1 bg-gray-100 p-2 md:p-3 rounded border border-gray-300 text-center">
                        <span className="text-gray-800 text-sm md:text-base">
                          {formData.opd}
                        </span>
                      </div>
                    </div>

                    {/* Kategori Artikel */}
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 text-left block">
                          Kategori Artikel
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Pilih salah satu
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          "Pelaporan dan Pelayanan",
                          "Akun dan SSO",
                          "Layanan dan Formulir",
                        ].map((kategori) => (
                          <div
                            key={kategori}
                            className={`border rounded-lg p-2 cursor-pointer transition-all text-center flex items-center justify-center shadow-sm ${
                              formData.layanan === kategori
                                ? "border-blue-500 bg-[#226597] text-white shadow-md"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-[#226597] hover:text-white"
                            }`}
                            onClick={() =>
                              handleInputChange("layanan", kategori)
                            }
                          >
                            <span className="text-xs font-semibold px-2 py-1">
                              {kategori}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 text-left">
                      {/* Card Upload Cover & Judul */}
                      <div className="border border-gray-300 rounded-lg p-4">
                        {/* Bagian Judul */}
                        <div className="mb-4">
                          <label className="text-sm font-semibold text-gray-700 block mb-2">
                            Judul Artikel
                          </label>
                          <input
                            type="text"
                            value={formData.judul || ""}
                            onChange={(e) =>
                              handleInputChange("judul", e.target.value)
                            }
                            placeholder="Masukkan Judul Disini..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Bagian Upload Cover */}
                        <div className="mb-6">
                          <label className="text-sm font-semibold text-gray-700 block mb-3">
                            Upload Cover
                          </label>

                          {!formData.coverImage ? (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                      alert(
                                        "Ukuran file terlalu besar. Maksimal 5MB."
                                      );
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      handleInputChange(
                                        "coverImage",
                                        e.target.result
                                      );
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <svg
                                width="47"
                                height="47"
                                viewBox="0 0 47 47"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M25.6667 12.8333C25.6667 19.9208 19.9208 25.6667 12.8333 25.6667C5.74583 25.6667 0 19.9208 0 12.8333C0 5.74583 5.74583 0 12.8333 0C19.9208 0 25.6667 5.74583 25.6667 12.8333ZM14 4.66667C14 4.35725 13.8771 4.0605 13.6583 3.84171C13.4395 3.62292 13.1428 3.5 12.8333 3.5C12.5239 3.5 12.2272 3.62292 12.0084 3.84171C11.7896 4.0605 11.6667 4.35725 11.6667 4.66667V11.6667H4.66667C4.35725 11.6667 4.0605 11.7896 3.84171 12.0084C3.62292 12.2272 3.5 12.5239 3.5 12.8333C3.5 13.1428 3.62292 13.4395 3.84171 13.6583C4.0605 13.8771 4.35725 14 4.66667 14H11.6667V21C11.6667 21.3094 11.7896 21.6062 12.0084 21.825C12.2272 22.0438 12.5239 22.1667 12.8333 22.1667C13.1428 22.1667 13.4395 22.0438 13.6583 21.825C13.8771 21.6062 14 21.3094 14 21V14H21C21.3094 14 21.6062 13.8771 21.825 13.6583C22.0438 13.4395 22.1667 13.1428 22.1667 12.8333C22.1667 12.5239 22.0438 12.2272 21.825 12.0084C21.6062 11.7896 21.3094 11.6667 21 11.6667H14V4.66667ZM12.8333 28C21.21 28 28 21.21 28 12.8333C28 9.82683 27.125 7.02333 25.6153 4.66667H39.375C41.3089 4.66667 43.1635 5.43489 44.531 6.80235C45.8984 8.1698 46.6667 10.0245 46.6667 11.9583V39.375C46.6667 40.957 46.1627 42.42 45.3075 43.6158L28.5542 26.8625C28.175 26.4833 27.7248 26.1825 27.2294 25.9772C26.7339 25.772 26.2029 25.6664 25.6667 25.6664C25.1304 25.6664 24.5994 25.772 24.1039 25.9772C23.6085 26.1825 23.1583 26.4833 22.7792 26.8625L6.02583 43.6158C5.1395 42.3796 4.66405 40.8961 4.66667 39.375V25.6153C7.10399 27.1767 9.93879 28.0045 12.8333 28ZM37.9167 18.0833C37.9167 16.8457 37.425 15.6587 36.5498 14.7835C35.6747 13.9083 34.4877 13.4167 33.25 13.4167C32.0123 13.4167 30.8253 13.9083 29.9502 14.7835C29.075 15.6587 28.5833 16.8457 28.5833 18.0833C28.5833 19.321 29.075 20.508 29.9502 21.3832C30.8253 22.2583 32.0123 22.75 33.25 22.75C34.4877 22.75 35.6747 22.2583 36.5498 21.3832C37.425 20.508 37.9167 19.321 37.9167 18.0833ZM43.169 45.6027L26.4915 28.9252C26.2727 28.7064 25.976 28.5836 25.6667 28.5836C25.3573 28.5836 25.0606 28.7064 24.8418 28.9252L8.16433 45.6027C9.30617 46.3016 10.6196 46.6699 11.9583 46.6667H39.375C40.7138 46.6699 42.0272 46.3016 43.169 45.6027Z"
                                  fill="#113F67"
                                />
                              </svg>
                              <p className="text-sm text-gray-500 mb-2 mt-1">
                                Upload Cover
                              </p>
                            </label>
                          ) : (
                            <div className="relative border border-gray-300 rounded-lg p-4 bg-white">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-700">
                                  Cover Preview
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleInputChange("coverImage", null)
                                  }
                                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                  Hapus
                                </button>
                              </div>
                              <div className="flex items-center gap-4">
                                <img
                                  src={formData.coverImage}
                                  alt="Cover Preview"
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-600 mb-1">
                                    Gambar cover berhasil diupload
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Klik hapus untuk mengganti gambar
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bagian Konten Artikel dengan TinyMCE */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Isi Artikel
                          </label>
                          <Editor
                            apiKey="knmbzw25dxygplnsx7hm54m7n2d6kwo15reci9vonjkq4csm"
                            value={formData.isiArtikel || ""}
                            onEditorChange={(newValue) =>
                              handleInputChange("isiArtikel", newValue)
                            }
                            init={{
                              height: 450,
                              menubar: true,
                              plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "help",
                                "wordcount",
                              ],
                              toolbar:
                                "undo redo | blocks | bold italic underline forecolor | " +
                                "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                                "image media link | removeformat | fullscreen preview | help",
                              file_picker_types: "image",
                              file_picker_callback: (callback) => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*";
                                input.onchange = (e) => {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    const base64 = reader.result;
                                    callback(base64, { alt: file.name });
                                  };
                                  reader.readAsDataURL(file);
                                };
                                input.click();
                              },
                              content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                              placeholder: "Ketik deskripsi disini...",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between pt-4 gap-3">
                      <button
                        type="button"
                        onClick={handleBatalkan}
                        className="text-black border border-gray-300 bg-transparent px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors text-center order-2 sm:order-1"
                      >
                        Batalkan
                      </button>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 order-1 sm:order-2">
                        <button
                          type="button"
                          onClick={handleSimpanDraft}
                          className="text-black bg-transparent px-0 py-0 text-sm font-medium hover:text-black underline transition-colors text-center sm:text-left"
                        >
                          Simpan draft
                        </button>
                        <button
                          type="submit"
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors text-center ${
                            isFormValid()
                              ? "bg-[#226597] hover:bg-[#1a507a] text-white cursor-pointer"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={!isFormValid()}
                        >
                          Ajukan Draft
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Konfirmasi Batalkan */}
      {showCancelConfirmation && (
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
                  onClick={handleConfirmBatalkan}
                  className="px-4 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#226597] transition-colors"
                >
                  Ya, saya yakin!
                </button>
                <button
                  onClick={handleCancelBatalkan}
                  className="px-4 py-2 bg-red-400 text-white rounded-md text-sm font-medium hover:bg-red-500 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Konfirmasi Kirim */}
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
                  onClick={handleKirimDraft}
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

      {/* Popup Berhasil Dikirim */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg
                  width="90"
                  height="90"
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
                Draft berhasil terkirim!
              </h3>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigate("/lihatartikel")}
                  className="px-6 py-2 bg-[#226597] text-white rounded-md text-sm font-medium hover:bg-[#1a5078] transition-colors mt-4"
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutOpd>
  );
};

export default DraftBaru;
