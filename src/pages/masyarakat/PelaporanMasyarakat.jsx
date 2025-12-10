import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const PelaporanMasyarakat = () => {
  const [selectedOpd, setSelectedOpd] = useState(null);
  const [opdList, setOpdList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpdData = async () => {
      try {
        const response = await fetch(
          "https://service-desk-be-production.up.railway.app/opd/dinas",
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          setOpdList(getStaticOpdList());
          return;
        }

        const result = await response.json();

        if (result.message === "Success" && result.data) {
          const transformedOpdList = result.data.map((opd) => {
            const staticOpd = getStaticOpdList().find(
              (staticOpd) =>
                staticOpd.id === opd.id ||
                opd.nama
                  .toLowerCase()
                  .includes(staticOpd.name.toLowerCase().substring(0, 10))
            );

            return {
              id: opd.id,
              name: opd.nama,
              logo: opd.file_path || (staticOpd ? staticOpd.logo : null),
            };
          });

          setOpdList(transformedOpdList);
        } else {
          setOpdList(getStaticOpdList());
        }
      } catch (err) {
        console.error("Error fetching OPD data:", err);

        setOpdList(getStaticOpdList());
      }
    };

    fetchOpdData();
  }, []);

  const getStaticOpdList = () => {
    return [
      { id: 1, name: "Dinas Kesehatan", logo: "/assets/Dinas Kesehatan.png" },
      {
        id: 2,
        name: "Dinas Perhubungan",
        logo: "/assets/Dinas Perhubungan.png",
      },
      { id: 3, name: "Dinas Pendidikan", logo: "/assets/Dinas Pendidikan.png" },
      {
        id: 4,
        name: "Dinas Pekerjaan Umum dan Penataan Ruang",
        logo: "/assets/Dinas Pekerjaan Umum dan Penataan Ruang.png",
      },
      {
        id: 5,
        name: "Dinas Sosial",
        logo: "/assets/Dinas Sosial.png",
      },
      {
        id: 6,
        name: "Dinas Lingkungan Hidup",
        logo: "/assets/Dinas Lingkungan Hidup.png",
      },
      {
        id: 7,
        name: "Dinas Komunikasi dan Informatika",
        logo: "/assets/Dinas Komunikasi dan Informatika.png",
      },
      {
        id: 8,
        name: "Dinas Pariwisata dan Ekonomi Kreatif",
        logo: "/assets/Dinas Pariwisata & Ekonomi Kreatif.png",
      },
      {
        id: 9,
        name: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
        logo: "/assets/Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu.png",
      },
      {
        id: 10,
        name: "Dinas Tenaga Kerja",
        logo: "/assets/Dinas Tenaga Kerja.png",
      },
      {
        id: 11,
        name: "Dinas Pertanian",
        logo: "/assets/Dinas Pertanian.png",
      },
      {
        id: 12,
        name: "Dinas Perindustrian dan Perdagangan",
        logo: "/assets/Dinas Perindustrian dan Perdagangan.png",
      },
      {
        id: 13,
        name: "Dinas Kependudukan dan Pencatatan Sipil",
        logo: "/assets/Dinas Kependudukan dan Pencatatan Sipil.png",
      },
      {
        id: 14,
        name: "Dinas Ketahanan Pangan",
        logo: "/assets/Dinas Ketahanan Pangan.png",
      },
      {
        id: 15,
        name: "Dinas Pemuda dan Olahraga",
        logo: "/assets/Dinas Pemuda dan Olahraga.png",
      },
      {
        id: 16,
        name: "Dinas Perumahan dan Kawasan Permukiman",
        logo: "/assets/Dinas Perumahan dan Kawasan Permukiman.png",
      },
      {
        id: 17,
        name: "Dinas Perpustakaan dan Kearsipan",
        logo: "/assets/Dinas Perpustakaan dan Kearsipan.png",
      },
      {
        id: 18,
        name: "Dinas Pengendalian Penduduk, Perlindungan Perempuan dan Anak",
        logo: "/assets/Dinas Pengendalian Penduduk, Perlindungan Perempuan dan Anak.png",
      },
      {
        id: 19,
        name: "Dinas Pertahanan atau Tata Ruang",
        logo: "/assets/Dinas Pertahanan atau Tata Ruang.png",
      },
      {
        id: 20,
        name: "Dinas Kepemudaan, Olahraga, dan Pariwisata",
        logo: "/assets/Dinas Kepemudaan, Olahraga, dan Pariwisata.png",
      },
    ];
  };

  const leftColumnOpd = opdList.length > 0 ? opdList.slice(0, 10) : [];
  const rightColumnOpd = opdList.length > 0 ? opdList.slice(10, 20) : [];

  const handleOpdSelect = (opd) => {
    setSelectedOpd(opd);
    console.log(`OPD selected: ${opd.name}`);

    navigate("/FormMasyarakat", {
      state: {
        selectedOpd: opd,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-4 pb-8">
        <div className="px-4 mb-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#226597] mb-2">
              Pelaporan Online
            </h1>
            <p className="text-gray-600">Pilih OPD tujuan Anda</p>
          </div>
        </div>

        <div className="px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3">
                {leftColumnOpd.map((opd) => (
                  <div
                    key={opd.id}
                    className="group cursor-pointer"
                    onClick={() => handleOpdSelect(opd)}
                  >
                    <div className="bg-gradient-to-r from-[#226597] to-[#1a507a] rounded-lg p-4 border border-blue-300 group-hover:border-blue-400 group-hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors flex-shrink-0 overflow-hidden">
                          {opd.logo ? (
                            <img
                              src={opd.logo}
                              alt={`Logo ${opd.name}`}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <FileText className="text-[#226597] w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm leading-tight">
                            {opd.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {rightColumnOpd.map((opd) => (
                  <div
                    key={opd.id}
                    className="group cursor-pointer"
                    onClick={() => handleOpdSelect(opd)}
                  >
                    <div className="bg-gradient-to-r from-[#226597] to-[#1a507a] rounded-lg p-4 border border-blue-300 group-hover:border-blue-400 group-hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors flex-shrink-0 overflow-hidden">
                          {opd.logo ? (
                            <img
                              src={opd.logo}
                              alt={`Logo ${opd.name}`}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <FileText className="text-[#226597] w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm leading-tight">
                            {opd.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PelaporanMasyarakat;
