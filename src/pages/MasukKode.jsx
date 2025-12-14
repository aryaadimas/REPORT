import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const MasukKode = () => {
  const [codes, setCodes] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({
    code: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 1);

    const newCodes = [...codes];
    newCodes[index] = numericValue;
    setCodes(newCodes);

    if (numericValue && index < 3) {
      document.getElementById(`code-${index + 1}`).focus();
    }

    if (errors.code) {
      setErrors({ code: "" });
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setErrors({ code: "" });

    const verificationCode = codes.join("");

    if (verificationCode.length !== 4) {
      setErrors({ code: "Kode verifikasi harus 4 digit" });
      setIsLoading(false);
      return;
    }

    const correctCode = "1234";

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (verificationCode === correctCode) {
        console.log("Verifikasi berhasil!");

        navigate("/katasandibaru");
      } else {
        setErrors({ code: "Kode verifikasi salah" });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({
        code: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert("Kode verifikasi telah dikirim ulang!");
    } catch (error) {
      console.error("Error resend code:", error);
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
            Cek Emailmu
          </h1>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm">
            Kami telah mengirimkan 4 digit kode
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm mb-6 text-center"
          >
            <div className="flex justify-center space-x-3 mb-6">
              {codes.map((code, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  value={code}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className={`w-16 h-16 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] focus:border-transparent ${
                    errors.code ? "border-red-500" : "border-gray-300"
                  }`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>

            {errors.code && (
              <p className="text-red-500 text-xs mb-4">{errors.code}</p>
            )}

            <div className="h-8"></div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#226597] hover:bg-[#1a507a] disabled:bg-gray-400 text-white py-3 rounded-full font-medium transition-colors"
              >
                {isLoading ? "Memverifikasi..." : "Verifikasi"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Tidak menerima kode?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[#226597] hover:underline font-medium"
              >
                Kirim ulang
              </button>
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 w-full md:hidden"></div>
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

export default MasukKode;
