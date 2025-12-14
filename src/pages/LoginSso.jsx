import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const LoginSso = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const getRedirectPathByRoleId = (roleId) => {
  const roleRedirects = {
    "1": "/dashboardkota",              // OPD
    "2": "/dashboardopd",
    "6": "/dashboardteknisi",
    "7": "/dashboardbidang",
    "8": "/berandaseksi",
  };

  return roleRedirects[String(roleId)] || "/beranda";
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? "Email diperlukan" : "",
        password: !formData.password ? "Password diperlukan" : "",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://service-desk-be-production.up.railway.app/login/sso",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            login: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Email atau password salah");
      }

      const data = await response.json();

      const token = data.access_token || data.token;
      if (!token) throw new Error("Token tidak ditemukan");

      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_token", token);

      const user = data.user || {};
      const userInfo = {
  id: user.id,
  name: user.name || user.full_name || "User",
  email: user.email,
  role_id: user.role_id,              // 🔥 TAMBAHKAN
  role_name: user.role?.nama || "",   // opsional
  dinas_id: user.dinas_id || 1,
};


      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("userData", JSON.stringify(userInfo));
      localStorage.setItem("user_role_name", userInfo.role_name);

     Swal.fire({
  title: "Login Berhasil!",
  text: `Selamat datang, ${userInfo.name}`,
  icon: "success",
  timer: 2000,
  showConfirmButton: false,
}).then(() => {
  const redirectPath = getRedirectPathByRoleId(userInfo.role_id);
  navigate(redirectPath);
});


    } catch (error) {
      Swal.fire("Login Gagal", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col items-center text-center relative order-2 md:order-1">
          <div className="mb-4 md:mb-6">
            <img
              src="/assets/Logo Report.png"
              alt="Logo Report"
              className="w-12 h-12 md:w-14 md:h-14 object-contain shadow-md rounded-full mx-auto"
            />
          </div>

          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Login SSO
          </h1>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm">
            Untuk akun pemerintah/OPD dengan domain .go.id
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4 mb-6 text-left"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Pemerintah
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="contoh: opd@dinaskesehatan.go.id"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "bg-gray-100" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                * Gunakan email pemerintah dengan domain .go.id
              </p>
            </div>

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
                required
                disabled={isLoading}
                placeholder="Masukkan password"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "bg-gray-100" : ""}`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 text-[#226597] border-gray-300 rounded focus:ring-[#226597]"
                />
                <label
                  htmlFor="showPassword"
                  className="ml-2 text-sm text-[#226597]"
                >
                  Tampilkan kata sandi
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#226597] hover:bg-[#1a507a] disabled:bg-gray-400 text-white py-3 rounded-full font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                "Masuk SSO"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Untuk login masyarakat umum,{" "}
              <Link
                to="/login"
                className="text-[#226597] hover:underline font-medium"
              >
                klik di sini
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Akun SSO khusus untuk pemerintah/OPD
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-[#226597] flex items-start justify-start order-1 md:order-2">
          <img
            src="/assets/Login.png"
            alt="Login Illustration"
            className="object-contain w-4/5 h-auto max-h-64 md:max-h-none opacity-90 ml-0"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginSso;
