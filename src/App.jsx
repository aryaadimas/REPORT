// app.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Beranda } from "./pages/beranda/Beranda";
import BerandaMasyarakat from "./pages/masyarakat/BerandaMasyarakat";

//*-- Auth --*/
import Register from "./pages/Register";
import LogIn from "./pages/Login";
import LupaPassword from "./pages/LupaPassword";
import MasukKode from "./pages/MasukKode";
import KataSandiBaru from "./pages/KataSandiBaru";

//*-- Pengguna Pegawai --*/
import Profil from "./pages/pegawai/ProfilSaya";
import Tampilan from "./pages/pegawai/Tampilan";
import KnowledgeBase from "./pages/pegawai/KnowledgeBase";
import FormLaporan from "./pages/beranda/pelaporan/FormLaporan";
import Pelacakan from "./pages/beranda/pelaporan/Pelacakan";
import Pengajuan from "./pages/beranda/pengajuan/Pengajuan";
import FormPengajuan from "./pages/beranda/pengajuan/FormPengajuan";
import SuksesPelayanan from "./pages/beranda/pengajuan/SuksesPelayanan";
import SuksesPelaporan from "./pages/beranda/pelaporan/SuksesPelaporan";
import DataDitemukan from "./pages/beranda/pelaporan/DataDitemukan";
import LayoutPegawai from "./components/Layout/LayoutPegawai";
import Riwayat from "./pages/masyarakat/riwayat";
import LihatHistory from "./pages/masyarakat/LihatHistory";
import LihatRating from "./pages/masyarakat/LihatRating";
import BeriRating from "./pages/masyarakat/BeriRating";
import ReopenPegawai from "./pages/masyarakat/ReopenPegawai";
import ReopenMasyarakat from "./pages/masyarakat/ReopenMasyarakat";
import RiwayatMasyarakat from "./pages/masyarakat/riwayatmasyarakat";

//*-- Seksi --*/
import PengajuanBidang from "./pages/beranda/Seksi/PengajuanBidang"
import MonitoringTiketSeksi from "./pages/beranda/Seksi/MonitoringTiketSeksi"
import DetailRating from "./pages/beranda/Seksi/DetailRating"
import LayananPesan from "./pages/beranda/Seksi/LayananPesan"
import LayananChat from "./pages/beranda/Seksi/LayananChat"
import BerandaSeksi from "./pages/beranda/Seksi/BerandaSeksi";
import LayoutSeksi from "./components/Layout/LayoutSeksi";
import PengajuanSeksi from "./pages/beranda/Seksi/PengajuanSeksi";
import PenugasanSeksi from "./pages/beranda/Seksi/PenugasanSeksi";
import FormPenugasanSeksi from "./pages/beranda/Seksi/FormPenugasanSeksi";
import MonitoringSeksi from "./pages/beranda/Seksi/MonitoringSeksi";
import StatistikSeksi from "./pages/beranda/Seksi/StatistikSeksi";
import ArsipSeksi from "./pages/beranda/Seksi/ArsipSeksi";
import ReopenSeksi from "./pages/beranda/Seksi/ReopenSeksi";
import RatingSeksi from "./pages/beranda/Seksi/RatingSeksi";
import KotakMasukSeksi from "./pages/beranda/Seksi/kotakmasukseksi";

//*-- Teknisi --*/
import LayoutTeknisi from "./components/Layout/LayoutTeknisi";
import BuatFormRFC from "./pages/beranda/Teknisi/BuatFormRFC";
import EditFormRFC from "./pages/beranda/Teknisi/EditFormRFC";
import LihatFormRFC from "./pages/beranda/Teknisi/LihatFormRFC"
import RFCTeknisi from "./pages/beranda/Teknisi/RFCTeknisi";
import DashboardTeknisi from "./pages/beranda/Teknisi/DashboardTeknisi";
import CekDetailTeknisi from "./pages/beranda/Teknisi/CekDetailTeknisi";
import UpdateProgressTeknisi from "./pages/beranda/Teknisi/UpdateProgresTeknisi";
import RatingTeknisi from "./pages/beranda/Teknisi/RatingTeknisi";
import KotakMasukTeknisi from "./pages/beranda/Teknisi/KotakMasukTeknisi";
import DetailRatingTeknisi from "./pages/beranda/Teknisi/DetailRatingTeknisi";

//*-- Kota --*/
import LayoutKota from "./components/Layout/LayoutKota";
import DashboardKota from "./pages/beranda/AdminKota/DashboardKota";
import CekDetailKota from "./pages/beranda/AdminKota/CekDetailKota";
import StatistikKotaKL from "./pages/beranda/AdminKota/StatistikKotaKL";
import StatistikKotaLP from "./pages/beranda/AdminKota/StatistikKotaLP";
import StatistikKotaTT from "./pages/beranda/AdminKota/StatistikKotaTT";
import StatistikKotaTB from "./pages/beranda/AdminKota/StatistikKotaTB";
import RateKota from "./pages/beranda/AdminKota/RateKota";
import RateKotaOpd from "./pages/beranda/AdminKota/RateKotaOpd";
import KnowledgeBaseKota from "./pages/beranda/AdminKota/KnowledgeBaseKota";
import AksiKBKota from "./pages/beranda/AdminKota/AksiKBKota";
import KBEditorKota from "./pages/beranda/AdminKota/KBEditorKota";
import LihatArtikelKota from "./pages/beranda/AdminKota/LihatArtikelKota";
import PengumumanKota from "./pages/beranda/AdminKota/PengumumanKota";
import BuatPengumumanKota from "./pages/beranda/AdminKota/BuatPengumumanKota";
import LihatRatingKota from "./pages/beranda/AdminKota/LihatRatingKota";
import KotakMasukKota from "./pages/beranda/AdminKota/KotakMasukKota";
import WarRoom from "./pages/beranda/AdminKota/WarRoom";
import AksiTiketCritical from "./pages/beranda/AdminKota/AksiTiketCritical";
import NotifWarRoom from "./pages/beranda/AdminKota/NotifWarRoom";

//*-- Masyarakat --*/
import ProfilMasyarakat from "./pages/masyarakat/ProfilMasyarakat";
import LandingPage from "./pages/masyarakat/LandingPage";
import LayoutMasyarakat from "./components/Layout/LayoutMasyarakat";

//*-- Helpdesk --*/
import HelpdeskChat from "./components/beranda/Helpdesk";

//*-- Bidang --*/
import DashboardBidang from "./pages/bidang/DashboardBidang";
import AksiTiket from "./pages/bidang/AksiTiket";
import MonitoringBidang from "./pages/bidang/MonitoringBidang";
import RatingKepuasan from "./pages/bidang/RatingKepuasan";
import DetailBidang from "./pages/bidang/DetailBidang";

//*-- Admin OPD --*/
import DashboardOpd from "./pages/adminopd/DashboardOpd";
import CekDetail from "./pages/adminopd/CekDetail";
import KnowledgeBaseDraft from "./pages/adminopd/KnowledgeBaseDraft";
import KnowledgeBaseDiajukan from "./pages/adminopd/KnowledgeBaseDiajukan";
import DraftBaru from "./pages/adminopd/DraftBaru";
import RatingKepuasanOpd from "./pages/adminopd/RatingKepuasanOpd";
import StatistikKategori from "./pages/adminopd/StatistikKategori";
import StatistikPrioritas from "./pages/adminopd/StatistikPrioritas";
import StatistikTahunan from "./pages/adminopd/StatistikTahunan";
import StatistikBulanan from "./pages/adminopd/StatistikBulanan";

//*-- Notifikasi --*/
import NotifDibuat from "./pages/notifikasi/NotifDibuat";
import NotifDiproses from "./pages/notifikasi/NotifDiproses";
import NotifMaintenance from "./pages/notifikasi/NotifMaintenance";
import NotifDarurat from "./pages/notifikasi/NotifDarurat";
import NotifUmum from "./pages/notifikasi/NotifUmum";
import LihatRatingBidang from "./pages/bidang/LihatRatingBidang";
import LihatRatingOpd from "./pages/adminopd/LihatRatingOpd";
import KBMasyarakat from "./pages/masyarakat/KBMasyarakat";
import TampilanMasyarakat from "./pages/masyarakat/TampilanMasyarakat";
import PelaporanMasyarakat from "./pages/masyarakat/PelaporanMasyarakat";
import SuksesLapor from "./pages/masyarakat/SuksesLapor";
import DataDitemukanMasyarakat from "./pages/masyarakat/DataDitemukanMasyarakat";
import PelacakanMasyarakat from "./pages/masyarakat/PelacakanMasyarakat";
import LihatArtikel from "./pages/adminopd/LihatArtikel";
import NotifDaruratMasyarakat from "./pages/masyarakat/NDaruratMasyarakat";
import NotifDibuatMasyarakat from "./pages/masyarakat/NDibuatMasyarakat";
import NotifDiprosesMasyarakat from "./pages/masyarakat/NDiprosesMasyarakat";
import NotifMaintenanceMasyarakat from "./pages/masyarakat/NMaintenanceMasyarakat";
import NotifUmumMasyarakat from "./pages/masyarakat/NUmumMasyarakat";
import KotakMasuk from "./pages/kotakmasuk/KotakMasuk";
import KotakMasukMasyarakat from "./pages/masyarakat/KotakMasukMasyarakat";
import KotakMasukBidang from "./pages/bidang/KotakMasukBidang";
import KotakMasukOpd from "./pages/adminopd/KotakMasukOpd";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Halaman dengan Layout */}
        <Route path="/" element={<LayoutSeksi />}>
          <Route path="berandaseksi" element={<BerandaSeksi />} />
          <Route path="pengajuanseksi" element={<PengajuanSeksi />} />
          <Route path="penugasanseksi" element={<PenugasanSeksi />} />
          <Route path="formpenugasanseksi" element={<FormPenugasanSeksi />} />
          <Route path="monitoringseksi" element={<MonitoringSeksi />} />
          <Route path="statistikseksi" element={<StatistikSeksi />} />
          <Route path="arsipseksi" element={<ArsipSeksi />} />
          <Route path="reopenseksi" element={<ReopenSeksi />} />
          <Route path="ratingseksi" element={<RatingSeksi />} />
          <Route path="pengajuanbidang" element={<PengajuanBidang />} />
          <Route path="kotakmasukseksi" element={<KotakMasukSeksi />} />
          <Route path="monitoringtiketseksi" element={<MonitoringTiketSeksi />} />
          <Route path="/monitoring-tiket/:id" element={<MonitoringTiketSeksi />}/>
          <Route path="detailrating" element={<DetailRating />} />
          <Route path="layananchat" element={<LayananChat />} />
          <Route path="layananpesan" element={<LayananPesan />} />
        </Route>

        {/* Layout TEKNISI */}
        <Route path="/" element={<LayoutTeknisi />}>
          <Route path="dashboardteknisi" element={<DashboardTeknisi />} />
          <Route path="cekdetailteknisi" element={<CekDetailTeknisi />} />
          <Route
            path="updateprogresteknisi"
            element={<UpdateProgressTeknisi />}
          />
          <Route path="ratingteknisi" element={<RatingTeknisi />} />
          <Route path="rfcteknisi" element={<RFCTeknisi />} />
          <Route path="buatformrfc" element={<BuatFormRFC />} />
          <Route path="editformrfc" element={<EditFormRFC />} />
          <Route path="lihatformrfc" element={<LihatFormRFC />} />
          <Route path="kotakmasukteknisi" element={<KotakMasukTeknisi />} />
          <Route path="detailratingteknisi" element={<DetailRatingTeknisi />} />
        </Route>

        {/* Layout KOTA */}
        <Route path="/" element={<LayoutKota />}>
          <Route path="dashboardkota" element={<DashboardKota />} />
          <Route path="cekdetailkota" element={<CekDetailKota />} />
          <Route path="statistikkotakl" element={<StatistikKotaKL />} />
          <Route path="statistikkotalp" element={<StatistikKotaLP />} />
          <Route path="statistikkotatt" element={<StatistikKotaTT />} />
          <Route path="statistikkotatb" element={<StatistikKotaTB />} />
          <Route path="ratekota" element={<RateKota />} />
          <Route path="ratekotaopd/:opdName" element={<RateKotaOpd />} />
          <Route path="ratekotaopd" element={<RateKotaOpd />} />
          <Route path="knowledgebasekota" element={<KnowledgeBaseKota />} />
          <Route path="aksikbkota" element={<AksiKBKota />} />
          <Route path="kbeditorkota" element={<KBEditorKota />} />
          <Route path="lihatartikelkota" element={<LihatArtikelKota />} />
          <Route path="pengumumankota" element={<PengumumanKota />} />
          <Route path="buatpengumumankota" element={<BuatPengumumanKota />} />
          <Route path="lihatratingkota" element={<LihatRatingKota />} />
          <Route path="kotakmasukkota" element={<KotakMasukKota />} />
          <Route path="warroom" element={<WarRoom />} />
          <Route path="aksitiketcritical" element={<AksiTiketCritical />} />
          <Route path="notifwarroom" element={<NotifWarRoom />} />
        </Route>

        {/* Layout PEGAWAI */}
        <Route path="/" element={<LayoutPegawai />}>
          <Route path="knowledgebase" element={<KnowledgeBase />} />
        </Route>

        {/* Layout MASYARAKAT */}
        <Route path="/" element={<LayoutMasyarakat />}>
          <Route path="berandamasyarakat" element={<BerandaMasyarakat />} />
          <Route path="profilmasyarakat" element={<ProfilMasyarakat />} />
          <Route path="tampilanmasyarakat" element={<TampilanMasyarakat />} />
          <Route path="kbmasyarakat" element={<KBMasyarakat />} />
          <Route path="pelaporanmasyarakat" element={<PelaporanMasyarakat />} />
          <Route path="sukseslapor" element={<SuksesLapor />} />
          <Route
            path="dataditemukanmasyarakat"
            element={<DataDitemukanMasyarakat />}
          />
          <Route path="pelacakanmasyarakat" element={<PelacakanMasyarakat />} />
          <Route path="riwayatmasyarakat" element={<RiwayatMasyarakat />} />
          <Route path="lihatlaporanmasyarakat" element={<LihatHistory />} />
          <Route path="lihatrating" element={<LihatRating />} />
          <Route path="berirating" element={<BeriRating />} />
          <Route path="reopenmasyarakat" element={<ReopenMasyarakat />} />
          <Route
            path="ndaruratmasyarakat"
            element={<NotifDaruratMasyarakat />}
          />
          <Route path="ndibuatmasyarakat" element={<NotifDibuatMasyarakat />} />
          <Route
            path="ndiprosesmasyarakat"
            element={<NotifDiprosesMasyarakat />}
          />
          <Route
            path="nmaintenancemasyarakat"
            element={<NotifMaintenanceMasyarakat />}
          />
          <Route path="numummasyarakat" element={<NotifUmumMasyarakat />} />
          <Route
            path="kotakmasukmasyarakat"
            element={<KotakMasukMasyarakat />}
          />
        </Route>

        {/* Halaman tanpa Layout (Auth) */}
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/lupapassword" element={<LupaPassword />} />
        <Route path="/masukkode" element={<MasukKode />} />
        <Route path="/katasandibaru" element={<KataSandiBaru />} />
        <Route path="/landingpage" element={<LandingPage />} />

        {/* Halaman lainnya */}
        <Route path="/formlaporan" element={<FormLaporan />} />
        <Route path="/pelacakan" element={<Pelacakan />} />
        <Route path="/pengajuan" element={<Pengajuan />} />
        <Route path="/formpengajuan" element={<FormPengajuan />} />
        <Route path="/suksespelayanan" element={<SuksesPelayanan />} />
        <Route path="/suksespelaporan" element={<SuksesPelaporan />} />
        <Route path="/dashboardbidang" element={<DashboardBidang />} />
        <Route path="/detailbidang/:id" element={<DetailBidang />} />
        <Route path="/aksitiket" element={<AksiTiket />} />
        <Route path="/lihatrating" element={<LihatRating />} />
        <Route path="/aksibidang" element={<AksiTiket />} />
        <Route path="/monitoringbidang" element={<MonitoringBidang />} />
        <Route path="/ratingkepuasan" element={<RatingKepuasan />} />
        <Route path="/dashboardopd" element={<DashboardOpd />} />
        <Route path="/cekdetail" element={<CekDetail />} />
        <Route path="/knowledgebasedraft" element={<KnowledgeBaseDraft />} />
        <Route
          path="/knowledgebasediajukan"
          element={<KnowledgeBaseDiajukan />}
        />
        <Route path="/draftbaru" element={<DraftBaru />} />
        <Route path="/ratingkepuasanopd" element={<RatingKepuasanOpd />} />
        <Route path="/dataditemukan" element={<DataDitemukan />} />
        <Route path="/helpdesk" element={<HelpdeskChat />} />
        <Route path="/statistikkategori" element={<StatistikKategori />} />
        <Route path="/statistikprioritas" element={<StatistikPrioritas />} />
        <Route path="/statistiktahunan" element={<StatistikTahunan />} />
        <Route path="/notifdibuat" element={<NotifDibuat />} />
        <Route path="/notifdiproses" element={<NotifDiproses />} />
        <Route path="/notifmaintenance" element={<NotifMaintenance />} />
        <Route path="/notifdarurat" element={<NotifDarurat />} />
        <Route path="/notifumum" element={<NotifUmum />} />
       
        <Route path="/detailbidang" element={<DetailBidang />} />
        <Route path="/lihatratingopd" element={<LihatRatingOpd />} />
        <Route path="/profilsaya" element={<Profil />} />
        <Route path="/tampilan" element={<Tampilan />} />
        <Route path="/statistikbulanan" element={<StatistikBulanan />} />
        <Route path="/lihatartikel" element={<LihatArtikel />} />
        <Route path="/kotakmasuk" element={<KotakMasuk />} />
        <Route path="/kotakmasukbidang" element={<KotakMasukBidang />} />
        <Route path="/kotakmasukopd" element={<KotakMasukOpd />} />
        <Route path="riwayat" element={<Riwayat />} />
        <Route path="lihathistory" element={<LihatHistory />} />
        <Route path="lihatratingbidang" element={<LihatRatingBidang />} />
        <Route path="berirating" element={<BeriRating />} />
        <Route path="reopenpegawai" element={<ReopenPegawai />} />
        <Route path="reopenmasyarakat" element={<ReopenMasyarakat />} />
      </Routes>
    </Router>
  );
}

export default App;
