import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const LogIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    try {
      /* ================= LOGIN ================= */
      const loginResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login/masyarakat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!loginResponse.ok) {
        if (loginResponse.status === 401) {
          setErrors({
            email: "Email atau kata sandi salah",
            password: "Email atau kata sandi salah",
          });
          setIsLoading(false);
          return;
        }
        throw new Error("Login gagal");
      }

      const loginData = await loginResponse.json();
      const token = loginData.access_token;

      localStorage.setItem("token", token);

      /* ================= FETCH PROFILE ================= */
      const profileResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/me/masyarakat`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        localStorage.setItem("user_profile", JSON.stringify(profileData));
      }

      /* ================= SUCCESS ================= */
      Swal.fire({
        icon: "success",
        title: "Login berhasil",
        text: "Selamat datang di layanan REPORT",
        timer: 1500,
        showConfirmButton: false,
        didClose: () => navigate("/berandamasyarakat"),
      });
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire("Error", "Tidak dapat terhubung ke server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 p-6 md:p-8 text-center">
          <img
            src="/assets/Logo Report.png"
            alt="Logo"
            className="w-14 h-14 mx-auto mb-4"
          />

          <h1 className="text-2xl font-semibold mb-2">Masuk</h1>
          <p className="text-gray-600 mb-6">
            Gunakan email dan kata sandi untuk melanjutkan
          </p>

          <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Kata sandi"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}

            <label className="flex items-center text-sm text-[#226597]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="mr-2"
              />
              Tampilkan kata sandi
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#226597] text-white py-3 rounded-full"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-4 text-sm">
            Belum punya akun?{" "}
            <Link to="/register" className="text-[#226597] font-medium">
              Daftar di sini
            </Link>
          </p>
        </div>

        <div className="w-full md:w-1/2 bg-[#226597] hidden md:flex">
          <img src="/assets/Login.png" className="object-contain w-full" />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
