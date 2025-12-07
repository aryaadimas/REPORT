import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AksiKBKota() {
  const [content, setContent] = useState("");
  const [kategori, setKategori] = useState("Akun dan SSO");
  const [progress, setProgress] = useState("Review");
  const [showUpdateWarning, setShowUpdateWarning] = useState(false);
  const navigate = useNavigate();

  // === Handle Update ===
  const handleUpdate = (e) => {
    e.preventDefault();
    setShowUpdateWarning(true);
  };

  // === Handle Konfirmasi Update ===
  const handleConfirmUpdate = () => {
    setShowUpdateWarning(false);
    Swal.fire({
      icon: "success",
      title: "Update berhasil terkirim!",
      confirmButtonColor: "#0F2C59",
    });
  };

  // === Handle Batal Update ===
  const handleCancelUpdate = () => {
    setShowUpdateWarning(false);
  };

  const handleCancel = () => {
    navigate("/knowledgebasekota");
  };

  return (
    <div className="p-8 space-y-8">
      {/* Judul */}
      <h1 className="text-3xl font-bold text-center text-[#0F2C59]">
        Draft Knowledge Base
      </h1>

      {/* Form Identitas */}
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <label className="w-28 font-semibold text-[#0F2C59]">Nama</label>
          <input
            type="text"
            value="Haikal Saputra"
            readOnly
            className="w-[400px] p-2 rounded-lg bg-gray-100 border border-gray-300"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="w-28 font-semibold text-[#0F2C59]">NIP</label>
          <input
            type="text"
            value="20030525102457"
            readOnly
            className="w-[400px] p-2 rounded-lg bg-gray-100 border border-gray-300"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="w-28 font-semibold text-[#0F2C59]">OPD</label>
          <input
            type="text"
            value="Dinas Perpustakaan dan Kearsipan"
            readOnly
            className="w-[400px] p-2 rounded-lg bg-gray-100 border border-gray-300"
          />
        </div>
      </div>

      {/* Kategori Artikel */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-[#0F2C59]">
          Kategori Artikel
        </h2>
        <p className="text-sm text-gray-500">Pilih salah satu</p>
        <div className="flex gap-3 flex-wrap">
          {[
            "Pelaporan dan Pelayanan",
            "Akun dan SSO",
            "Layanan dan Formulir",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setKategori(item)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                kategori === item
                  ? "bg-[#0F2C59] text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Perbarui Progress */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-[#0F2C59]">
          Perbarui Progress
        </h2>
        <div className="flex gap-3 flex-wrap">
          {["Draft", "Review", "Approve", "Tolak"].map((item) => {
            const style =
              item === "Review"
                ? "bg-yellow-400 text-white"
                : item === "Approve"
                ? "bg-green-500 text-white"
                : item === "Tolak"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700";

            return (
              <button
                key={item}
                onClick={() => setProgress(item)}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  progress === item ? style : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Artikel */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[#0F2C59]">
          Isi Artikel
        </label>

        <Editor
          apiKey="knmbzw25dxygplnsx7hm54m7n2d6kwo15reci9vonjkq4csm"
          value={content}
          onEditorChange={(newValue) => setContent(newValue)}
          init={{
            height: 400,
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
                reader.onload = () =>
                  callback(reader.result, { alt: file.name });
                reader.readAsDataURL(file);
              };
              input.click();
            },
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Batal
        </button>
        <button
          onClick={handleUpdate}
          className="px-5 py-2 rounded-lg bg-[#0F2C59] text-white hover:bg-[#15397A] transition"
        >
          Update
        </button>
      </div>

      {/* Popup Warning Update */}
      {showUpdateWarning && (
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
                Apakah Anda yakin ingin menyimpan?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Cek kembali inputan Anda sebelum mengirim!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleConfirmUpdate}
                  className="px-4 py-2 bg-[#0F2C59] text-white rounded-md text-sm font-medium hover:bg-[#15397A] transition-colors"
                >
                  Ya, saya yakin!
                </button>
                <button
                  onClick={handleCancelUpdate}
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
