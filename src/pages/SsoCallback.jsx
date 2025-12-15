import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1];
    // base64url -> base64
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    // pad
    while (payload.length % 4) payload += "=";
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

export default function SsoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceDeskToken = params.get("service_desk_token");
    const assetToken = params.get("asset_token");

    if (serviceDeskToken) {
      localStorage.setItem("service_desk_token", serviceDeskToken);
    }
    if (assetToken) {
      localStorage.setItem("asset_token", assetToken);
    }
    // call API to get user data
    async function fetchUser() {
      // try asset_token first (for arise-app), then service_desk_token
      const tokenToUse = assetToken || serviceDeskToken;
      
      console.log("serviceDeskToken:", serviceDeskToken ? "exists" : "missing");
      console.log("assetToken:", assetToken ? "exists" : "missing");
      console.log("tokenToUse:", tokenToUse ? "exists" : "missing");

      if (!tokenToUse && !serviceDeskToken) {
        console.error("No token available");
        navigate("/login", { replace: true });
        return;
      }

      // decode JWT to get user data (role, email, sub)
      const jwtPayload = decodeJwtPayload(serviceDeskToken);
      console.log("JWT payload:", jwtPayload);

      if (!jwtPayload) {
        console.error("Invalid JWT");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // attempt to fetch from /api/me, but don't require it
        if (tokenToUse) {
          console.log("Fetching /api/me with token...");
          const res = await fetch("https://arise-app.my.id/api/me", {
            headers: {
              Authorization: `Bearer ${tokenToUse}`,
              Accept: "application/json",
            },
          });

          if (res.ok) {
            const apiData = await res.json();
            console.log("/api/me data:", apiData);
            // if API works, merge with JWT data
            if (apiData?.name || apiData?.email) {
              // use API data if available
              const userInfo = {
                id: apiData.id ?? jwtPayload.sub ?? null,
                name: apiData.name ?? jwtPayload.name ?? "User",
                email: apiData.email ?? jwtPayload.email ?? "",
                role_id: apiData.role_id ?? jwtPayload.role_id ?? "",
                role_name: apiData.role_name ?? jwtPayload.role_name ?? jwtPayload.role ?? "",
                dinas_id: apiData.dinas_id ?? jwtPayload.dinas_id ?? 1,
              };
              
              localStorage.setItem("user", JSON.stringify(userInfo));
              localStorage.setItem("userData", JSON.stringify(userInfo));
              localStorage.setItem("user_role_name", userInfo.role_name || "");
              
              console.log("Using API data:", userInfo);
              redirectByRole(userInfo);
              return;
            }
          }
        }
      } catch (err) {
        console.error("error fetching /api/me", err);
      }

      // fallback: use JWT data if /api/me fails or returns empty
      console.log("Falling back to JWT data");
      const userInfo = {
        id: jwtPayload.sub ?? null,
        name: jwtPayload.name ?? jwtPayload.full_name ?? "User",
        email: jwtPayload.email ?? "",
        role_id: jwtPayload.role_id ?? "",
        role_name: jwtPayload.role_name ?? jwtPayload.role ?? "",
        dinas_id: jwtPayload.dinas_id ?? 1,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("userData", JSON.stringify(userInfo));
      localStorage.setItem("user_role_name", userInfo.role_name || "");
      localStorage.setItem("is_authenticated", "true");
      localStorage.setItem("sso_can_login", "true");

      console.log("Final userInfo:", userInfo);
      redirectByRole(userInfo);
    }

    function redirectByRole(userInfo) {
      const roleRedirects = {
        "1": "/dashboardkota",
        "5": "/dashboardopd",
        "6": "/dashboardteknisi",
        "7": "/dashboardbidang",
        "8": "/berandaseksi",
      };

      const rid = String(userInfo.role_id ?? "").trim();
      console.log("Checking rid:", rid, "Found:", roleRedirects[rid]);
      if (roleRedirects[rid]) {
        console.log("Navigating to:", roleRedirects[rid]);
        navigate(roleRedirects[rid], { replace: true });
        return;
      }

      // fallback: check role_name
      const roleName = String(userInfo.role_name || "").toLowerCase();
      console.log("role_name:", roleName);
      
      if (roleName.includes("admin") && roleName.includes("kota")) {
        navigate("/dashboardkota", { replace: true });
        return;
      }
      if (roleName.includes("admin") && roleName.includes("opd")) {
        navigate("/dashboardopd", { replace: true });
        return;
      }
      if (roleName.includes("teknisi")) {
        navigate("/dashboardteknisi", { replace: true });
        return;
      }
      if (roleName.includes("bidang")) {
        navigate("/dashboardbidang", { replace: true });
        return;
      }
      if (roleName.includes("seksi")) {
        navigate("/berandaseksi", { replace: true });
        return;
      }

      // default fallback
      navigate("/beranda", { replace: true });
    }

    fetchUser();
  }, [navigate]);

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium">Processing SSO callback...</h2>
      <p className="text-sm text-gray-600">Menyimpan token dan mengalihkan sesuai role.</p>
    </div>
  );
}
