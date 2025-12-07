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

    setErrors({
      email: "",
      password: "",
    });

    // === DUMMY LOGIN (TAMBAHAN) ===
    const dummyUsers = [
      {
        email: "masyarakat@gmail.com",
        password: "masyarakat123",
        role: "masyarakat",
        redirect: "/berandamasyarakat",
      },
      {
        email: "seksi@gmail.com",
        password: "seksi123",
        role: "seksi",
        redirect: "/berandaseksi",
      },
      {
        email: "bidang@gmail.com",
        password: "bidang123",
        role: "bidang",
        redirect: "/dashboardbidang",
      },
      {
        email: "adminkota@gmail.com",
        password: "adminkota123",
        role: "admin kota",
        redirect: "/dashboardkota",
      },
      {
        email: "adminopd@gmail.com",
        password: "adminopd123",
        role: "admin opd",
        redirect: "/dashboardopd",
      },
      {
        email: "teknisi@gmail.com",
        password: "teknisi123",
        role: "teknisi",
        redirect: "/dashboardteknisi",
      },
      {
        email: "pegawai@gmail.com",
        password: "pegawai123",
        role: "pegawai",
        redirect: "/beranda",
      },
    ];

    const matched = dummyUsers.find(
      (user) =>
        user.email === formData.email &&
        user.password === formData.password
    );

    if (matched) {
      localStorage.setItem("role", matched.role);
      Swal.fire({
  title: `Anda login sebagai ${matched.role}`,
  icon: "success",
  timer: 2000,
  showConfirmButton: false,
  allowOutsideClick: false,
  allowEscapeKey: false,
  didClose: () => {
    navigate(matched.redirect);
  }
});
return;

    }
    // === END DUMMY LOGIN ===

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login/masyarakat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: formData.password,
          }),
        }
      );

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          if (errorData.message?.toLowerCase().includes("email")) {
            setErrors({ email: "Email salah", password: "" });
          } else if (errorData.message?.toLowerCase().includes("password")) {
            setErrors({ email: "", password: "Kata sandi salah" });
          } else {
            setErrors({ email: "Email salah", password: "Kata sandi salah" });
          }
        } else {
          throw new Error("Login gagal!");
        }
        return;
      }

      const data = await response.json();
      console.log("Login success data:", data);

      const token =
        data.access_token ||
        data.token ||
        data.jwt_token ||
        data.auth_token ||
        data.Authorization?.replace("Bearer ", "") ||
        data.authorization?.replace("Bearer ", "");

      if (!token) {
        console.error("Token tidak ditemukan dalam response:", data);
        alert(
          "Login berhasil tetapi token tidak ditemukan. Response: " +
            JSON.stringify(data)
        );
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      console.log("Token disimpan:", token.substring(0, 20) + "...");

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      try {
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
          console.log("Profile data setelah login:", profileData);
          localStorage.setItem("user_profile", JSON.stringify(profileData));
        } else {
          console.warn("Gagal fetch profil setelah login, tapi login berhasil");
        }
      } catch (profileError) {
        console.warn("Error saat fetch profil:", profileError);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert("Login berhasil!");
      navigate("/berandamasyarakat");
    } catch (error) {
      console.error("Login network error:", error);

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("Network")
      ) {
        const confirmDevMode = window.confirm(
          "Tidak bisa terhubung ke server. Ingin masuk ke mode development dengan akun demo?"
        );

        if (confirmDevMode) {
          const dummyToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YjBjMDUyYi1iNDFlLTQ4MDAtYjQ3YS1jYWE4MGQ1Nzc2MGQiLCJlbWFpbCI6ImVyaW5kYXB1d3RyaUBnbWFpbC5jb20iLCJyb2xlX2lkIjo5LCJyb2xlX25hbWUiOiJtYXN5YXJha2F0IiwiZXhwIjoxNzY1NTkxMDM3fQ.QtWkhdA1Nvwcg-LDPC6UbBKy8Tr40XnnStXGV5HCYpM";

          localStorage.setItem("token", dummyToken);
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: email,
              full_name: "Demo User",
              nik: "3515085606040001",
              address: "Alamat demo",
            })
          );

          alert("Masuk ke mode development. Token dummy digunakan.");
          navigate("/beranda");
        }
      } else {
        alert("Tidak bisa terhubung ke server. Pastikan internet stabil.");
      }
    } finally {
      setIsLoading(false);
      console.error("Error:", error);

      setErrors({
        email: "Terjadi kesalahan",
        password: "Terjadi kesalahan",
      });
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

          <div className="mt-4 text-xs text-gray-500">
            <button
              type="button"
              onClick={() => {
                console.log("Token saat ini:", localStorage.getItem("token"));
                console.log("User data:", localStorage.getItem("user"));
              }}
              className="text-blue-500 underline"
            ></button>
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
