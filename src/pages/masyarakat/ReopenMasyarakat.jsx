import React, { useState, useEffect } from "react";
import { Upload, Building2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function ReopenMasyarakat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [nik, setNik] = useState("367585326230002");
  const [alasan, setAlasan] = useState("");
  const [penyelesaian, setPenyelesaian] = useState("");
  const [lampiran, setLampiran] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const ticketId =
    state?.item?.ticket_id ||
    state?.ticketId ||
    "09635cce-db14-43e9-a1bd-cd3a3fc901cc";

  const getToken = () => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDYyZGVkMy1kOWM0LTQxMWEtODc2OS0wMWZkMjU5MzE0MDIiLCJlbWFpbCI6Im1hc3NAZ21haWwuY29tIiwicm9sZV9pZCI6OSwicm9sZV9uYW1lIjoibWFzeWFyYWthdCIsImV4cCI6MTc2NTk1NDYwMH0.j76PzwY6VlFwsSaAHymQeIkpjkZWB_ujrhsXR8B_so4"
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();

        const ticketResponse = await fetch(
          `https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/${ticketId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!ticketResponse.ok) {
          throw new Error(`HTTP error! status: ${ticketResponse.status}`);
        }

        const ticketData = await ticketResponse.json();
        setTicketData(ticketData);

        const finishedResponse = await fetch(
          "https://service-desk-be-production.up.railway.app/api/tickets/masyarakat/finished",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (finishedResponse.ok) {
          const finishedData = await finishedResponse.json();

          const matchingTicket = finishedData.data?.find(
            (ticket) => ticket.ticket_id === ticketId
          );

          if (matchingTicket?.nik) {
            setNik(matchingTicket.nik);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File terlalu besar",
          text: "Ukuran file maksimal 5MB",
          confirmButtonColor: "#0F2C59",
        });
        e.target.value = "";
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Format file tidak didukung",
          text: "Hanya mendukung JPG, PNG, dan PDF",
          confirmButtonColor: "#0F2C59",
        });
        e.target.value = "";
        return;
      }
      setLampiran(file);
    }
  };

  const handleSubmit = async () => {
    if (!alasan.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Alasan diperlukan",
        text: "Harap isi alasan pengajuan kembali",
        confirmButtonColor: "#0F2C59",
      });
      return;
    }

    if (!penyelesaian.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Penyelesaian diperlukan",
        text: "Harap isi penyelesaian yang diharapkan",
        confirmButtonColor: "#0F2C59",
      });
      return;
    }

    Swal.fire({
      title: "Yakin Kirim Pengajuan?",
      text: "Pastikan data yang kamu isi sudah benar",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim",
      cancelButtonText: "Batal",
      confirmButtonColor: "#0F2C59",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setSubmitting(true);
          const token = getToken();

          const formData = new FormData();
          formData.append("alasan_reopen", alasan);
          formData.append("expected_resolution", penyelesaian);

          if (lampiran) {
            formData.append("file", lampiran);
          }

          console.log("Mengirim request reopen untuk ticket:", ticketId);

          const response = await fetch(
            `https://service-desk-be-production.up.railway.app/api/tickets/reopen/${ticketId}`,
            {
              method: "PATCH",
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          console.log("Response status:", response.status);

          if (response.ok) {
            const resultData = await response.json();
            console.log("Success response:", resultData);

            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: resultData.message || "Pengajuan kembali berhasil dikirim.",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              navigate("/riwayatmasyarakat");
            });
          } else {
            const errorText = await response.text();
            console.error("API Error:", errorText);

            let errorMessage = "Terjadi kesalahan saat mengirim pengajuan";
            if (response.status === 400) {
              errorMessage = "Data yang dikirim tidak valid";
            } else if (response.status === 401) {
              errorMessage = "Sesi Anda telah habis, silakan login ulang";
            } else if (response.status === 404) {
              errorMessage = "Tiket tidak ditemukan";
            } else if (response.status === 422) {
              errorMessage = "Data tidak lengkap atau format salah";
            }

            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: errorMessage,
              confirmButtonColor: "#0F2C59",
            });
          }
        } catch (error) {
          console.error("Network error:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Terjadi kesalahan jaringan. Silakan coba lagi.",
            confirmButtonColor: "#0F2C59",
          });
        } finally {
          setSubmitting(false);
        }
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Batalkan Pengajuan?",
      text: "Perubahan yang kamu buat tidak akan disimpan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Kembali",
      confirmButtonColor: "#0F2C59",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/riwayatmasyarakat");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2C59] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Data tidak ditemukan</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F9FAFB] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden">
   
          <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/assets/wave.svg')] bg-cover opacity-10 pointer-events-none"></div>


          <h2 className="text-2xl font-bold text-[#0F2C59] text-center mb-8 border-b pb-4">
            Formulir Pengajuan Kembali
          </h2>

     
          <div className="flex items-center mb-8">
            <p className="font-semibold text-gray-600 w-40">Kirim laporan ke</p>
            <div className="flex items-center gap-2 bg-[#0F2C59] text-white px-3 py-2 rounded-lg w-fit">
              <Building2 size={16} />
              <span>Dinas Perhubungan</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">Nama</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium w-64">
                {ticketData.creator?.full_name || "Yono Winarno"}
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">NIK</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium w-64">
                {nik}
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">Email</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium w-64">
                {ticketData.creator?.email || "yonowinarno64@gmail.com"}
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-600 w-40">ID Tiket</p>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium w-64">
                {ticketData.ticket_code || "LPR321326"}
              </div>
            </div>
          </div>

      
          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Judul Pelaporan</p>
            <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
              {ticketData.title || "Parkir nguawooorrr"}
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Rincian Masalah</p>
            <textarea
              readOnly
              value={
                ticketData.description ||
                "Banyak kendaraan yang parkir sembarangan di sepanjang jalan kalanak"
              }
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed"
            />
          </div>

          
          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">
              Alasan Pengajuan Kembali
            </p>
            <textarea
              placeholder="Ketik di sini..."
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-24 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
              disabled={submitting}
            />
          </div>

  
          <div className="mb-6">
            <p className="font-semibold text-gray-600 mb-1">Lampiran File</p>
            <label
              className={`flex items-center gap-2 bg-[#0F2C59] text-white px-3 py-2 w-fit rounded-lg cursor-pointer hover:bg-[#15397A] transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Upload size={16} />
              <span>Lampirkan File</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                disabled={submitting}
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              />
            </label>
            {lampiran && (
              <p className="text-sm text-gray-700 mt-2">
                {lampiran.name} ({(lampiran.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

  
          <div className="mb-8">
            <p className="font-semibold text-gray-600 mb-1">
              Penyelesaian yang Diharapkan
            </p>
            <textarea
              placeholder="Ketik di sini..."
              value={penyelesaian}
              onChange={(e) => setPenyelesaian(e.target.value)}
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-800 text-sm resize-none h-20 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
              disabled={submitting}
            />
          </div>

          <div className="flex justify-start gap-3">
            <button
              onClick={handleCancel}
              className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              Batalkan
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#0F2C59] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#15397A] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
