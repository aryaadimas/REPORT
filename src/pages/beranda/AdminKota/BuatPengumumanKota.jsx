import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function BuatPengumumanKota() {
  const [content, setContent] = useState("");
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const navigate = useNavigate();

  // === Handle Kirim ===
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSubmitWarning(true);
  };

  // === Handle Konfirmasi Kirim ===
  const handleConfirmSubmit = () => {
    setShowSubmitWarning(false);
    Swal.fire({
      icon: "success",
      title: "Pengumuman berhasil dikirim!",
      showConfirmButton: false,
      timer: 1500,
    });
    navigate("/pengumumankota");
  };

  // === Handle Batal Kirim ===
  const handleCancelSubmit = () => {
    setShowSubmitWarning(false);
  };

  return (
    <div className="p-8 space-y-6">
      {/* === JUDUL === */}
      <h1 className="text-2xl font-bold text-[#0F2C59] text-center">
        Buat Pengumuman
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* === FORM FIELD === */}
        <div className="space-y-4">
          {/* Dikirim ke */}
          <div className="flex items-center gap-6">
            <label className="w-32 text-sm font-semibold text-gray-700">
              Dikirim ke
            </label>
            <button className="bg-[#0F2C59] text-white text-sm px-4 py-2 rounded-md">
              Semua
            </button>
          </div>

          {/* Perihal */}
          <div className="flex items-center gap-6">
            <label className="w-32 text-sm font-semibold text-gray-700">
              Perihal
            </label>
            <select className="w-1/4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C59]">
              <option>Umum</option>
              <option>Maintenance</option>
              <option>Darurat</option>
            </select>
          </div>
        </div>

        {/* === EDITOR === */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Isi Pengumuman
          </label>
          <Editor
            apiKey="knmbzw25dxygplnsx7hm54m7n2d6kwo15reci9vonjkq4csm"
            value={content}
            onEditorChange={(newValue) => setContent(newValue)}
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
              placeholder: "Masukkan Judul dan Isi Pengumuman Disini...",
            }}
          />
        </div>

        {/* === TOMBOL AKSI === */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/pengumumankota")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm"
          >
            Batalkan
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#0F2C59] text-white rounded-lg hover:bg-[#15397A] text-sm"
          >
            Kirim
          </button>
        </div>
      </div>

      {/* Popup Warning Kirim */}
      {showSubmitWarning && (
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
                    fill="#FF5F57 "
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apakah Anda yakin ingin menyimpan?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Cek kembali inputan Anda sebelum mengirim!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 bg-[#0F2C59] text-white rounded-md text-sm font-medium hover:bg-[#15397A] transition-colors"
                >
                  Ya, saya yakin!
                </button>
                <button
                  onClick={handleCancelSubmit}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
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
}
