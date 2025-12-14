import React, { useState } from "react";

export default function Tampilan() {
  const [selectedTheme, setSelectedTheme] = useState("terang");
  const [selectedFontSize, setSelectedFontSize] = useState("medium");

  const themeOptions = [
    {
      id: "sistem",
      name: "Sistem",
      preview: (
        <div className="w-12 h-10 md:w-16 md:h-12 bg-gradient-to-br from-gray-200 to-gray-400 rounded border-2 border-gray-300 relative overflow-hidden">
          <div className="absolute top-1 left-1 w-1 h-4 md:h-6 bg-orange-400 rounded-full"></div>
          <div className="absolute top-1.5 md:top-2 right-1 space-y-0.5 md:space-y-1">
            <div className="w-6 md:w-8 h-0.5 md:h-1 bg-blue-500 rounded"></div>
            <div className="w-4 md:w-6 h-0.5 md:h-1 bg-gray-600 rounded"></div>
            <div className="w-5 md:w-7 h-0.5 md:h-1 bg-gray-600 rounded"></div>
          </div>
          <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
            <div className="w-full h-0.5 md:h-1 bg-gray-600 rounded"></div>
            <div className="w-3/4 h-0.5 md:h-1 bg-gray-600 rounded"></div>
            <div className="w-1/2 h-0.5 md:h-1 bg-gray-600 rounded"></div>
          </div>
        </div>
      ),
    },
    {
      id: "terang",
      name: "Terang",
      preview: (
        <div className="w-12 h-10 md:w-16 md:h-12 bg-white rounded border-2 border-gray-300 relative overflow-hidden">
          <div className="absolute top-1 left-1 w-1 h-4 md:h-6 bg-orange-400 rounded-full"></div>
          <div className="absolute top-1.5 md:top-2 right-1 space-y-0.5 md:space-y-1">
            <div className="w-6 md:w-8 h-0.5 md:h-1 bg-blue-500 rounded"></div>
            <div className="w-4 md:w-6 h-0.5 md:h-1 bg-gray-400 rounded"></div>
            <div className="w-5 md:w-7 h-0.5 md:h-1 bg-gray-400 rounded"></div>
          </div>
          <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
            <div className="w-full h-0.5 md:h-1 bg-gray-400 rounded"></div>
            <div className="w-3/4 h-0.5 md:h-1 bg-gray-400 rounded"></div>
            <div className="w-1/2 h-0.5 md:h-1 bg-gray-400 rounded"></div>
          </div>
          <div className="absolute bottom-1 left-2 w-1.5 md:w-2 h-1.5 md:h-2 bg-blue-500 rounded-full"></div>
        </div>
      ),
    },
    {
      id: "gelap",
      name: "Gelap",
      preview: (
        <div className="w-12 h-10 md:w-16 md:h-12 bg-gray-800 rounded border-2 border-gray-600 relative overflow-hidden">
          <div className="absolute top-1 left-1 w-1 h-4 md:h-6 bg-orange-400 rounded-full"></div>
          <div className="absolute top-1.5 md:top-2 right-1 space-y-0.5 md:space-y-1">
            <div className="w-6 md:w-8 h-0.5 md:h-1 bg-blue-400 rounded"></div>
            <div className="w-4 md:w-6 h-0.5 md:h-1 bg-gray-400 rounded"></div>
            <div className="w-5 md:w-7 h-0.5 md:h-1 bg-gray-400 rounded"></div>
          </div>
          <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
            <div className="w-full h-0.5 md:h-1 bg-gray-400 rounded"></div>
            <div className="w-3/4 h-0.5 md:h-1 bg-gray-400 rounded"></div>
            <div className="w-1/2 h-0.5 md:h-1 bg-gray-400 rounded"></div>
          </div>
        </div>
      ),
    },
  ];

  const fontSizes = [
    { id: "kecil", label: "Aa", size: "text-xs md:text-sm" },
    { id: "sedang", label: "Aa", size: "text-base md:text-lg" },
    { id: "besar", label: "Aa", size: "text-xl md:text-2xl" },
  ];

  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#226597] mb-8">
          Tampilan
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Preferensi
            </h2>
            <p className="text-gray-600 text-sm">
              Pilih preferensi tampilan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themeOptions.map((theme) => (
              <div key={theme.id}>
                <button
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`w-full mb-3 p-6 rounded-lg border-2 transition-all duration-200 ${
                    selectedTheme === theme.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {theme.preview}
                </button>
                <p className="text-sm font-medium text-gray-700">
                  {theme.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Ukuran Font
            </h2>
            <p className="text-gray-600 text-sm">
              Pilih ukuran font yang Anda inginkan
            </p>
          </div>

          <div className="flex gap-8">
            {fontSizes.map((font, index) => (
              <div key={font.id}>
                <button
                  onClick={() => setSelectedFontSize(font.id)}
                  className={`w-16 h-16 mb-3 flex items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                    selectedFontSize === font.id
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <span
                    className={`font-medium ${font.size} ${
                      index === 0
                        ? "text-gray-400"
                        : index === 1
                        ? "text-gray-600"
                        : "text-gray-800"
                    }`}
                  >
                    {font.label}
                  </span>
                </button>
                <p className="text-sm text-gray-600 capitalize">{font.id}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:text-gray-800 hover:border-gray-300 font-medium transition-all duration-200">
            Batalkan
          </button>
          <button className="px-6 py-3 bg-[#226597] text-white rounded-lg shadow-md hover:bg-[#1e5a87] font-medium transition-all duration-200">
            Simpan perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
