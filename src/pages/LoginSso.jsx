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

  // Fungsi untuk mendapatkan data roles
  const fetchRoles = async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/roles`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Gagal mengambil data roles:", response.status);
        return null;
      }

      const rolesData = await response.json();
      console.log("Data roles dari API:", rolesData);
      return rolesData;
    } catch (error) {
      console.error("Error fetching roles:", error);
      return null;
    }
  };

  // Fungsi untuk mendapatkan redirect path berdasarkan role_name
  const getRedirectPathByRoleName = (roleName) => {
    const roleRedirects = {
      diskominfo: "/dashboard-diskominfo",
      opd: "/beranda",
      verifikator: "/dashboard-verifikator",
      auditor: "/dashboard-auditor",
      "admin dinas": "/dashboard-admin-dinas",
      teknisi: "/dashboardteknisi",
      bidang: "/dashboardbidang",
      seksi: "/dashboardseksi",
      masyarakat: "/berandamasyarakat",
    };

    return roleRedirects[roleName] || "/beranda";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    // Validasi dasar
    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? "Email diperlukan" : "",
        password: !formData.password ? "Password diperlukan" : "",
      });
      setIsLoading(false);
      return;
    }

    // === DUMMY LOGIN (untuk testing) ===
    const dummyUsers = [
      {
        email: "opd@dinaskesehatan.go.id",
        password: "password",
        role_name: "opd",
        redirect: "/beranda",
      },
      {
        email: "diskominfo@example.com",
        password: "demo123",
        role_name: "diskominfo",
        redirect: "/dashboard-diskominfo",
      },
      {
        email: "teknisi@example.com",
        password: "demo123",
        role_name: "teknisi",
        redirect: "/dashboardteknisi",
      },
      {
        email: "verifikator@example.com",
        password: "demo123",
        role_name: "verifikator",
        redirect: "/dashboard-verifikator",
      },
    ];

    const matched = dummyUsers.find(
      (user) =>
        user.email === formData.email && user.password === formData.password
    );

    if (matched) {
      localStorage.setItem("role_name", matched.role_name);
      Swal.fire({
        title: `Login Berhasil sebagai ${matched.role_name}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didClose: () => {
          navigate(matched.redirect);
        },
      });
      setIsLoading(false);
      return;
    }
    // === END DUMMY LOGIN ===

    // Login SSO menggunakan endpoint '/login/sso'
    const payload = {
      login: formData.email, // SSO menggunakan 'login' bukan 'email'
      password: formData.password,
    };

    try {
      // Step 1: Login untuk mendapatkan token
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login/sso`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Login SSO response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401 || response.status === 422) {
          setErrors({
            email: "Email/username atau password salah",
            password: "Email/username atau password salah",
          });
        } else {
          throw new Error(errorData.message || "Login gagal!");
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Login SSO success data:", data);

      const token = data.access_token;

      if (!token) {
        Swal.fire({
          title: "Error",
          text: "Login berhasil tetapi token tidak ditemukan.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsLoading(false);
        return;
      }

      // Simpan data user ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("token_type", data.token_type || "bearer");

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("user_name", data.user.name);
        localStorage.setItem("user_email", data.user.email);
        localStorage.setItem("user_role_id", data.user.role_id);
      }

      // Step 2: Ambil data roles menggunakan token
      const roles = await fetchRoles(token);
      let roleName = null;

      if (roles && data.user?.role_id) {
        // Cari role_name berdasarkan role_id dari response login
        const role = roles.find(
          (r) => r.role_id === parseInt(data.user.role_id)
        );
        if (role) {
          roleName = role.role_name;
          localStorage.setItem("user_role_name", roleName);
        }
      }

      // Step 3: Tentukan redirect path berdasarkan role_name
      let redirectPath = "/beranda";
      if (roleName) {
        redirectPath = getRedirectPathByRoleName(roleName);
      } else if (data.user?.role_id) {
        // Fallback jika tidak dapat role_name
        const fallbackRedirects = {
          1: "/dashboard-diskominfo",
          2: "/beranda",
          3: "/dashboard-verifikator",
          4: "/dashboard-auditor",
          5: "/dashboard-admin-dinas",
          6: "/dashboardteknisi",
          7: "/dashboardbidang",
          8: "/dashboardseksi",
          9: "/berandamasyarakat",
        };
        redirectPath = fallbackRedirects[data.user.role_id] || "/beranda";
      }

      // Step 4: Tampilkan success message
      Swal.fire({
        title: "Login Berhasil!",
        html: `
          <div class="text-center">
            <p>Selamat datang <strong>${data.user?.name || "User"}</strong>!</p>
            ${
              roleName
                ? `<p class="mt-2 text-sm text-gray-600">Role: ${roleName}</p>`
                : ""
            }
          </div>
        `,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didClose: () => {
          navigate(redirectPath);
        },
      });
    } catch (error) {
      console.error("Login SSO error:", error);

      // Handle network errors
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("Network")
      ) {
        const confirmDevMode = window.confirm(
          "Tidak bisa terhubung ke server. Ingin masuk ke mode development dengan akun demo?"
        );

        if (confirmDevMode) {
          // Mode development dengan dummy data SSO
          const dummyData = {
            access_token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwiZW1haWwiOiJvcGRAZGluYXNrZXNlaGF0YW4uZ28uaWQiLCJyb2xlX2lkIjoyLCJuYW1lIjoiT1BEIERpbmFzIEtlc2VoYXRhbiIsImV4cCI6MTc2NTg1NDQ4NH0.dummy_token_for_dev_mode",
            token_type: "bearer",
            user: {
              id: 5,
              name: "OPD Dinas Kesehatan",
              username: "opd_dinaskesehatan",
              email: "opd@dinaskesehatan.go.id",
              role_id: "2",
              status: "Active",
            },
          };

          localStorage.setItem("token", dummyData.access_token);
          localStorage.setItem("user", JSON.stringify(dummyData.user));
          localStorage.setItem("user_role_name", "opd");

          Swal.fire({
            title: "Mode Development",
            text: "Masuk dengan akun demo OPD. Redirecting...",
            icon: "info",
            timer: 1500,
            showConfirmButton: false,
            didClose: () => {
              navigate("/beranda");
            },
          });
        } else {
          Swal.fire({
            title: "Koneksi Error",
            text: "Tidak bisa terhubung ke server. Periksa koneksi internet Anda.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          title: "Login Gagal",
          text: error.message || "Terjadi kesalahan saat login",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      setErrors({
        email: "Terjadi kesalahan",
        password: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk demo login
  const handleDemoLogin = (email, password, roleName = "OPD") => {
    setFormData({
      email: email,
      password: password,
    });

    Swal.fire({
      title: "Demo Mode",
      text: `Mengisi form dengan akun ${roleName}`,
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
    });
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent ${
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
