import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    nik: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nik") {
      const numbersOnly = value.replace(/[^0-9]/g, "").slice(0, 16);
      setFormData({ ...formData, nik: numbersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak sama!");
      setIsLoading(false);
      return;
    }

    if (formData.nik.length !== 16) {
      alert("NIK harus 16 digit angka!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      alert("Password harus minimal 8 karakter!");
      setIsLoading(false);
      return;
    }

    const payloadOption1 = {
      full_name: formData.full_name.trim(),
      nik: formData.nik,
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
    };

    const payload = payloadOption1;

    console.log("📤 Payload yang dikirim:", payload);
    console.log(
      "🔗 Endpoint:",
      `${import.meta.env.VITE_API_BASE_URL}/register/masyarakat`
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/register/masyarakat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("📡 Status response:", response.status);
      const result = await response.json();
      console.log("📦 Response dari server:", result);

      if (!response.ok) {
        alert(
          `Error ${response.status}: ${
            result.message || JSON.stringify(result)
          }`
        );
        setIsLoading(false);
        return;
      }

      alert("Pendaftaran berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error("🚨 Error:", error);
      alert("Tidak bisa terhubung ke server. Pastikan internet stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 p-4 md:p-8 order-2 md:order-1">
          <div className="flex justify-start mb-4 md:mb-6">
            <img
              src="/assets/Logo Report.png"
              alt="Logo Report"
              className="w-12 h-12 md:w-16 md:h-16 object-contain shadow-md rounded-full"
            />
          </div>

          <div className="mb-6 md:mb-8 text-left">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Buat Akun
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-[#226597] hover:underline">
                Masuk
              </Link>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 md:space-y-6 text-left"
          >
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nama lengkap
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="nik"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nomor Induk Kependudukan
              </label>
              <input
                type="text"
                id="nik"
                name="nik"
                value={formData.nik}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent"
                maxLength={16}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alamat email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Kata sandi
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent"
                  minLength="8"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Konfirmasi kata sandi
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent"
                  minLength="8"
                  required
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600">
              Gunakan 8 atau lebih karakter dengan kombinasi huruf, angka dan
              simbol
            </p>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 text-[#226597] border-gray-300 rounded focus:ring-[#226597]"
              />
              <label
                htmlFor="showPassword"
                className="ml-2 text-sm text-[#226597]"
              >
                Tampilkan kata sandi
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-4 gap-4 sm:gap-0">
              <Link
                to="/login"
                className="text-[#226597] hover:underline text-sm"
              >
                Masuk
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-[#226597] hover:bg-[#1a507a] disabled:bg-gray-400 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                {isLoading ? "Membuat Akun..." : "Buat akun"}
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 md:mt-12 pt-4 md:pt-6 border-t border-gray-200 gap-4 sm:gap-0">
            <div className="flex items-center">
              <select className="text-sm text-gray-600 bg-transparent border-none focus:outline-none">
                <option>Bahasa Indonesia</option>
              </select>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
              <a href="" className="hover:underline">
                Bantuan
              </a>
              <a href="" className="hover:underline">
                Privasi
              </a>
              <a href="" className="hover:underline">
                Ketentuan
              </a>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 order-1 md:order-2 py-8 md:py-0">
          <img
            src="/assets/Register Flip.png"
            alt="Illustration"
            className="object-contain w-2/3 md:w-3/4 h-auto max-h-64 md:max-h-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
