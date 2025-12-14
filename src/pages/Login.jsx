import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const LogIn = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    // Integrasi login dengan API
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      console.log("Payload login:", payload);

      const response = await fetch("/api/login/sso", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Login error:", data);
        setErrors({
          email: "Email atau password salah",
          password: "",
        });
        setIsLoading(false);
        return;
      }

      // Simpan token
      const token = data.access_token;
      if (!token) {
        alert("Login berhasil tetapi token tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      console.log("Token tersimpan:", token.substring(0, 15) + "...");

      // Simpan user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        const roleId = data.user.role_id;

        // Redirect berdasarkan role
        // Backend mapping: 1=diskominfo(Kota), 2=opd(Pegawai), 3=verifikator,
        // 5=admin dinas(Admin OPD), 6=teknisi, 7=bidang, 8=seksi, 9=masyarakat
        switch (roleId) {
          case "1": // diskominfo = Admin Kota
            navigate("/dashboardkota");
            break;
          case "2": // opd = Pegawai OPD
          case "3": // verifikator = diarahkan ke OPD
          case "5": // admin dinas = Admin OPD
            navigate("/dashboardopd");
            break;
          case "6": // teknisi
            navigate("/dashboardteknisi");
            break;
          case "7": // bidang
            navigate("/dashboardbidang");
            break;
          case "8": // seksi
            navigate("/berandaseksi");
            break;
          case "9": // masyarakat (database terpisah)
            navigate("/berandamasyarakat");
            break;
          default:
            navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("ERROR LOGIN:", error);
      alert("Terjadi kesalahan pada jaringan atau server.");
      setErrors({
        email: "Terjadi kesalahan",
        password: "Terjadi kesalahan",
      });
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
            Masuk
          </h1>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm">
            Gunakan email atau lainnya untuk melanjutkan
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
                Alamat email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "bg-gray-100" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent ${
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

            <div className="text-right mb-4">
              <Link
                to="/lupapassword"
                className="text-sm text-[#226597] underline hover:no-underline"
              >
                Lupa kata sandi?
              </Link>
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
                "Masuk"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-[#226597] hover:underline font-medium"
              >
                Daftar di sini
              </Link>
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

export default LogIn;
