import LayoutBidang from "../../components/Layout/LayoutBidang";
import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const LihatRating = () => {
  const navigate = useNavigate();

  // Data untuk halaman detail rating
  const ratingData = {
    pengirim: "Widya Karim",
    idTiket: "LPR20288",
    ratingPelayanan: 5,
    komentar: "yapyapyap",
    selesai: true,
    aspek: {
      kemudahan: 5,
      kecepatan: 4,
      kualitas: 5,
    },
  };

  // Komponen bintang rating
  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < count ? "text-[#0F2C59]" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <LayoutBidang>
      {/* Dashboard Content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Main Content Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
          {/* === Judul === */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F2C59] text-center mb-6 md:mb-8">
            Rating
          </h1>

          {/* === Section Pengirim dan ID Tiket === */}
          <div className="space-y-4 mb-6 md:mb-8">
            {/* Pengirim */}
            <div className="flex items-center">
              <label className="text-gray-600 text-sm font-medium w-24 md:w-32">
                Pengirim
              </label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src="/assets/Widya.jpeg"
                    alt={ratingData.pengirim}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium text-gray-800">
                  {ratingData.pengirim}
                </span>
              </div>
            </div>

            {/* ID Tiket */}
            <div className="flex items-center">
              <label className="text-gray-600 text-sm font-medium w-24 md:w-32">
                ID Tiket
              </label>
              <div className="bg-gray-300 px-4 md:px-14 py-2 rounded-lg text-gray-700 font-medium w-fit">
                {ratingData.idTiket}
              </div>
            </div>
          </div>

          {/* === Rating Kepuasan === */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold block mb-2">
              Rating Kepuasan Pelayanan Kami
            </label>
            <div className="flex gap-1">
              {renderStars(ratingData.ratingPelayanan)}
            </div>
          </div>

          {/* === Komentar === */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold block mb-2">
              Komentar
            </label>
            <textarea
              className="w-full bg-gray-100 rounded-lg p-3 text-gray-700 text-sm resize-none h-24"
              value={ratingData.komentar}
              readOnly
            />
          </div>

          

          {/* === Tombol Batalkan === */}
          <div className="flex justify-start">
            <button
              onClick={() => navigate("/ratingkepuasan")} // atau path yang sesuai
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Kembali
            </button>
          </div>
        </div>
      </main>
    </LayoutBidang>
  );
};

export default LihatRating;
