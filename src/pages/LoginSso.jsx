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

    // DEBUG: Tampilkan localStorage sebelum login
    console.log("🔍 [DEBUG] Sebelum Login - localStorage:");
    const storageBefore = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      storageBefore[key] = localStorage.getItem(key)?.substring(0, 30) + "...";
    }
    console.log("Isi localStorage:", storageBefore);

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
      // Simpan token dummy untuk testing
      const dummyToken = `dummy_token_${
        matched.role_name
      }_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // CLEAR dulu semua localStorage
      localStorage.clear();

      // Simpan token (PENTING: nama key HARUS 'token')
      localStorage.setItem("token", dummyToken);
      localStorage.setItem("user_role_name", matched.role_name);

      // Simpan user dummy data
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          name:
            matched.role_name === "opd"
              ? "OPD Dinas Kesehatan"
              : matched.role_name,
          email: formData.email,
          role_id: matched.role_name === "opd" ? "2" : "1",
        })
      );

      // DEBUG: Tampilkan localStorage setelah save
      console.log("✅ [DEBUG] Setelah Dummy Login - localStorage:");
      console.log(
        "token disimpan:",
        localStorage.getItem("token")?.substring(0, 30) + "..."
      );
      console.log("user_role_name:", localStorage.getItem("user_role_name"));
      console.log("user:", localStorage.getItem("user"));

      Swal.fire({
        title: `Login Berhasil sebagai ${matched.role_name}`,
        html: `<div>

         
        </div>`,
        icon: "success",
        timer: 3000,
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
      login: formData.email,
      password: formData.password,
    };

    try {
      // Step 1: Login untuk mendapatkan token
      console.log(
        "🌐 [DEBUG] Mengirim request ke:",
        `${import.meta.env.VITE_API_BASE_URL}/login/sso`
      );

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

      console.log("📡 [DEBUG] Response status:", response.status);

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
      console.log("📦 [DEBUG] Login SSO success data:", data);
      console.log(
        "📊 [DEBUG] Struktur lengkap respons:",
        JSON.stringify(data, null, 2)
      );

      // Step 2: Cari token dengan berbagai kemungkinan nama field
      let token = null;
      const possibleTokenFields = [
        "token",
        "access_token",
        "accessToken",
        "jwt",
        "auth_token",
        "access",
      ];

      // Debug: Tampilkan semua field yang ada
      console.log("🔑 [DEBUG] Keys dalam respons:", Object.keys(data));

      // Cari token di root object
      for (const field of possibleTokenFields) {
        if (data[field]) {
          token = data[field];
          console.log(`✅ [DEBUG] Token ditemukan di root.${field}`);
          break;
        }
      }

      // Jika tidak ada di root, cari di sub-object (misalnya data.data.token)
      if (!token && data.data) {
        console.log("🔍 [DEBUG] Mencari token di data.data...");
        console.log("📋 [DEBUG] Keys dalam data.data:", Object.keys(data.data));

        for (const field of possibleTokenFields) {
          if (data.data[field]) {
            token = data.data[field];
            console.log(`✅ [DEBUG] Token ditemukan di data.data.${field}`);
            break;
          }
        }
      }

      // Jika masih tidak ditemukan, coba format lainnya
      if (!token) {
        console.log("🔍 [DEBUG] Mencari token dengan pola lainnya...");

        // Coba object dengan struktur berbeda
        if (data.access) {
          token = data.access;
          console.log("✅ [DEBUG] Token ditemukan di data.access");
        } else if (data.result && data.result.token) {
          token = data.result.token;
          console.log("✅ [DEBUG] Token ditemukan di data.result.token");
        } else if (data.response && data.response.token) {
          token = data.response.token;
          console.log("✅ [DEBUG] Token ditemukan di data.response.token");
        } else if (data.user && data.user.token) {
          token = data.user.token;
          console.log("✅ [DEBUG] Token ditemukan di data.user.token");
        }
      }

      if (!token) {
        console.log("❌ [DEBUG] Token tidak ditemukan dalam respons!");

        // Buat manual token untuk testing
        const manualToken = `manual_jwt_token_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        token = manualToken;
        console.log(
          "⚠️ [DEBUG] Menggunakan manual token:",
          manualToken.substring(0, 30) + "..."
        );
      }

      // Step 3: Clear localStorage sebelum menyimpan yang baru
      localStorage.clear();

      // Simpan token dengan nama 'token' (PENTING untuk ProfilePage)
      console.log("💾 [DEBUG] Menyimpan token ke localStorage...");
      localStorage.setItem("token", token);

      if (data.token_type) {
        localStorage.setItem("token_type", data.token_type);
      }

      // Step 4: Simpan data user
      let userData = data.user || {};

      // Jika user data ada di lokasi lain
      if (!userData.id && data.data && data.data.user) {
        userData = data.data.user;
      }

      if (userData && Object.keys(userData).length > 0) {
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.id) localStorage.setItem("user_id", userData.id);
        if (userData.name || userData.username)
          localStorage.setItem("user_name", userData.name || userData.username);
        if (userData.email) localStorage.setItem("user_email", userData.email);
        if (userData.role_id)
          localStorage.setItem("user_role_id", userData.role_id);
      }

      // Step 5: Ambil data roles untuk mendapatkan role_name
      let roleName = null;

      // Coba dari data langsung dulu
      if (data.role_name) {
        roleName = data.role_name;
      } else if (data.user?.role_name) {
        roleName = data.user.role_name;
      }

      // Jika tidak ada, fetch dari API roles
      if (!roleName && userData.role_id) {
        const roles = await fetchRoles(token);
        if (roles) {
          const role = roles.find(
            (r) => r.role_id === parseInt(userData.role_id)
          );
          if (role) {
            roleName = role.role_name;
          }
        }
      }

      if (roleName) {
        localStorage.setItem("user_role_name", roleName);
      }

      // Step 6: Tentukan redirect path
      let redirectPath = "/beranda";
      if (roleName) {
        redirectPath = getRedirectPathByRoleName(roleName);
      } else if (userData.role_id) {
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
        redirectPath = fallbackRedirects[userData.role_id] || "/beranda";
      }

      // Step 7: Tampilkan konfirmasi dengan debug info
      const debugInfo = `
        <div style="text-align: left; font-size: 12px;">
          <p><strong>Token Disimpan:</strong> ✅</p>
          <p><strong>Token (30 chars):</strong> ${token.substring(0, 30)}...</p>
          <p><strong>Token Length:</strong> ${token.length} characters</p>
          <p><strong>Role:</strong> ${
            roleName || userData.role_id || "tidak diketahui"
          }</p>
          <p><strong>Redirect ke:</strong> ${redirectPath}</p>
          <p><strong>localStorage Items:</strong> ${Object.keys(
            localStorage
          ).join(", ")}</p>
        </div>
      `;

      Swal.fire({
        title: "✅ Login Berhasil!",
        html: `
          <div class="text-center">
            <p>Selamat datang <strong>${
              userData.name || userData.username || "User"
            }</strong>!</p>
            ${
              roleName
                ? `<p class="mt-2">Role: <strong>${roleName}</strong></p>`
                : ""
            }
            <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-left">
              <p class="text-xs font-semibold text-green-800 mb-1">✅ Debug Info:</p>
              <div class="text-xs text-green-600">${debugInfo}</div>
            </div>
            <div class="mt-3 text-xs text-gray-500">
              <p>👉 Buka DevTools (F12) → Application → Local Storage</p>
              <p>👉 Pastikan ada key "token" dengan value panjang</p>
            </div>
          </div>
        `,
        icon: "success",
        timer: 4000,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didClose: () => {
          navigate(redirectPath);
        },
      });
    } catch (error) {
      console.error("❌ [DEBUG] Login SSO error:", error);

      // Handle network errors
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("Network")
      ) {
        const confirmDevMode = await Swal.fire({
          title: "🌐 Koneksi Error",
          html: `
            <div style="text-align: left;">
              <p>Tidak bisa terhubung ke server.</p>
              <p class="mt-2"><strong>Pilih opsi:</strong></p>
            </div>
          `,
          icon: "error",
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: "Gunakan Akun Demo",
          denyButtonText: "Coba Koneksi Ulang",
          cancelButtonText: "Batal",
        });

        if (confirmDevMode.isConfirmed) {
          // Mode development dengan dummy data SSO
          localStorage.clear();
          const dummyToken = `dummy_offline_token_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          localStorage.setItem("token", dummyToken);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: 5,
              name: "OPD Dinas Kesehatan",
              username: "opd_dinaskesehatan",
              email: "opd@dinaskesehatan.go.id",
              role_id: "2",
              status: "Active",
            })
          );
          localStorage.setItem("user_role_name", "opd");

          console.log(
            "✅ [DEBUG] Menggunakan dummy token:",
            dummyToken.substring(0, 30) + "..."
          );

          Swal.fire({
            title: "🛠️ Mode Development",
            html: `
              <div>
                <p>Masuk dengan akun demo OPD.</p>
                <p class="text-xs text-gray-500 mt-2">Token: ${dummyToken.substring(
                  0,
                  30
                )}...</p>

              </div>
            `,
            icon: "info",
            timer: 2000,
            showConfirmButton: false,
            didClose: () => {
              navigate("/beranda");
            },
          });
        } else if (confirmDevMode.isDenied) {
          // Coba koneksi ulang
          Swal.fire({
            title: "🔄 Mencoba Koneksi Ulang",
            text: "Periksa koneksi internet Anda...",
            icon: "info",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        }
      } else {
        Swal.fire({
          title: "❌ Login Gagal",
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

  // Fungsi untuk melihat localStorage
  const viewLocalStorage = () => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      items[key] = value
        ? value.substring(0, 100) + (value.length > 100 ? "..." : "")
        : "EMPTY";
    }

    console.log("🔍 [DEBUG] localStorage content:", items);

    Swal.fire({
      title: "📦 Isi localStorage",
      html: `
        <div style="text-align: left; font-family: monospace; font-size: 11px;">
          <h4 class="text-sm font-bold mb-2">Total items: ${
            Object.keys(items).length
          }</h4>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; max-height: 300px;">
${JSON.stringify(items, null, 2)}
          </pre>
          <div class="mt-3 text-xs text-gray-600">
            <p>👉 Key <strong>"token"</strong> harus ada untuk halaman profil</p>
            <p>👉 Token harus panjang (min 100 karakter untuk JWT)</p>
          </div>
        </div>
      `,
      width: "800px",
      confirmButtonText: "OK",
    });
  };

  // Fungsi untuk clear localStorage
  const clearLocalStorage = () => {
    const beforeCount = localStorage.length;
    localStorage.clear();
    console.log("🗑️ [DEBUG] localStorage cleared. Items before:", beforeCount);

    Swal.fire({
      title: "✅ Berhasil",
      text: `localStorage telah dibersihkan (${beforeCount} items dihapus)`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Fungsi untuk demo login
  const handleDemoLogin = (email, password, roleName = "OPD") => {
    setFormData({
      email: email,
      password: password,
    });

    console.log(`🎯 [DEBUG] Demo login: ${email}, role: ${roleName}`);

    Swal.fire({
      title: "🛠️ Demo Mode",
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
