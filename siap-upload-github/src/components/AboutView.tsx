import React from 'react';
import { 
  Phone, 
  Instagram, 
  Facebook, 
  MapPin, 
  ExternalLink,
  Car as CarIcon,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { SiteSettings } from '../types';
import { BannerCta } from './BannerCta';
import { TikTokIcon } from './TikTokIcon';

interface AboutViewProps {
  settings: SiteSettings;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings }) => {
  const cleanMapsUrl = (embed: string) => {
    if (!embed) return '';
    const match = embed.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : embed.trim();
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. TOP HERO SECTION (Mengapa Rental-ku? - Sesuai Screenshot 1) */}
      <section className="w-full py-10 lg:py-16 bg-white border-b border-gray-100 font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative & Contact */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.08]">
                  Mengapa <br />
                  <span className="inline-block border-b-4 border-[#E11D2A] pb-1 text-slate-900">
                    Rental-ku?
                  </span>
                </h1>
              </div>

              <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-w-xl font-normal">
                <p>
                  <strong className="text-slate-900 font-semibold">Rentalku Indonesia</strong> menawarkan transportasi rental mobil yang aman dan nyaman dengan pilihan kendaraan yang lengkap. Harga terjangkau namun tetap mengedepankan pelayanan serta kualitas, Kami memiliki tahapan dalam menjaga layanan yang ramah dan jujur pada Custumer, tentunya dengan driver profesional dan berpengalaman, karena setiap perjalanan memiliki makna berbeda bagi untuk setiap orang.
                </p>
                <p className="font-medium text-slate-800">
                  Nikmati perjalanan darat kamu lebih nyaman bersama Rental-ku.
                </p>
              </div>

              {/* Call Pill Button */}
              <div>
                <a
                  id="about-call-btn"
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#E11D2A] text-slate-900 hover:bg-[#E11D2A] hover:text-white transition-all text-xs sm:text-sm font-medium tracking-tight shadow-xs hover:shadow-md cursor-pointer btn-shimmer"
                >
                  <Phone className="w-4 h-4 text-[#E11D2A]" />
                  <span>Hubungi Kami: {settings.phone}</span>
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex items-center space-x-3 pt-2">
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#E11D2A] text-slate-700 hover:text-white flex items-center justify-center transition-colors border border-gray-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#E11D2A] text-slate-700 hover:text-white flex items-center justify-center transition-colors border border-gray-200"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#E11D2A] text-slate-700 hover:text-white flex items-center justify-center transition-colors border border-gray-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Photo: Kantor / Armada Rental-ku */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-slate-900 max-w-md w-full aspect-[4/3] group">
                <img
                  src="/about-us.webp"
                  alt="Tentang Rental-ku Indonesia"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Badge Overlay Elegan di Bawah Foto */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                      <CarIcon className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs tracking-tight text-white leading-none">
                        Rental-<span className="text-[#E11D2A]">ku</span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">
                        Armada & Kantor Resmi
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-bold bg-emerald-600/90 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Resmi & Terpercaya</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRANSITION PARAGRAPH */}
      <section className="w-full py-8 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Selamat datang di <strong className="text-slate-900">Rentalku Indonesia</strong> dan tentukan berbagai pilihan kendaraan untuk mobilitas keseharianmu dengan menyewa mobil per jam, harian, mingguan, atau bahkan bulanan, semuanya menjadi mudah dengan <strong className="text-slate-900">Rentalku Indonesia</strong>. beberapa alasan menggunakan jasa Kami :
          </p>
        </div>
      </section>

      {/* 3. 6 PILARS GRID (Visi, Misi, Profesional, Legalitas, Responsif, Terjangkau - Screenshot 2) */}
      <section className="w-full py-12 lg:py-16 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            
            {/* 1. Visi */}
            <div className="text-center space-y-3 p-4 group">
              <div className="flex items-center justify-center h-16 sm:h-20">
                <img
                  src="/icons/visi.png"
                  alt="Visi"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Visi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menjadi perusahaan penyedia Transportasi terdepan yang menjadi andalan dan dipercaya di Indonesia.
              </p>
            </div>

            {/* 2. Misi */}
            <div className="text-center space-y-3 p-4 group">
              <div className="flex items-center justify-center h-16 sm:h-20">
                <img
                  src="/icons/misi.png"
                  alt="Misi"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Misi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menjadikan kepuasan & kenyamanan setiap customer sebagai prioritas utama, dengan menyediakan solusi terbaik untuk dalam bertranportasi.
              </p>
            </div>

            {/* 3. Profesional */}
            <div className="text-center space-y-3 p-4 group">
              <div className="flex items-center justify-center h-16 sm:h-20">
                <img
                  src="/icons/professional.png"
                  alt="Profesional"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Profesional</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dengan team yang ramah dan profesional, sehingga memberi kenyamanan untuk customer.
              </p>
            </div>

            {/* 4. Legalitas */}
            <div className="text-center space-y-3 p-4 group">
              <div className="flex items-center justify-center h-16 sm:h-20">
                <img
                  src="/icons/legalitas.png"
                  alt="Legalitas"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Legalitas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kami adalah perusahaan berbadan hukum resmi, yaitu {settings.companyName}.
              </p>
            </div>

            {/* 5. Responsif */}
            <div className="text-center space-y-3 p-4 group">
              <div className="flex items-center justify-center h-16 sm:h-20">
                <img
                  src="/icons/responsif.png"
                  alt="Responsif"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Responsif</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kami siap memberikan layanan terbaik setiap hari selama 24 jam.
              </p>
            </div>

            {/* 6. Terjangkau */}
            <div className="text-center space-y-3 p-4 group">
              <div className="flex items-center justify-center h-16 sm:h-20">
                <img
                  src="/icons/terjangkau.png"
                  alt="Terjangkau"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Terjangkau</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harga yang kami tawarkan sangat terjangkau untuk setiap pemesanannya.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECTION: EMBED GOOGLE MAPS LOKASI KANTOR (Real & Editable via CMS) */}
      <section className="w-full py-12 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lokasi Kantor & Pool Armada
            </h2>
            <div className="w-14 h-1 bg-[#E11D2A] mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-500 pt-1">
              Kunjungi kantor operasional kami atau dapatkan layanan antar-jemput unit langsung ke lokasi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Address Card */}
            <div className="lg:col-span-4 bg-[#141518] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-[#E11D2A] text-xs font-bold border border-red-500/30">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Pool Pusat</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {settings.companyName}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {settings.address}
                </p>

                <div className="pt-2 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#E11D2A]" />
                    <span>Jam Kerja: {settings.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#E11D2A]" />
                    <span>Hotline: {settings.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#E11D2A] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <span>Buka Petunjuk Arah di Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Google Maps Responsive Embed */}
            <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-md border border-gray-200 min-h-[350px] lg:min-h-[400px] relative bg-gray-100">
              <iframe
                title="Peta Lokasi Rentalku Indonesia"
                src={cleanMapsUrl(settings.googleMapsEmbed)}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

          </div>

        </div>
      </section>

      {/* 5. BANNER PENUTUP */}
      <BannerCta settings={settings} />

    </div>
  );
};
